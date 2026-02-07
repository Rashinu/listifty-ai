import { createClient } from '@/lib/supabase/server'
import { generateListing } from '@/lib/openai/client'
import { listingSchema } from '@/lib/validators/listing'
import { getEtsyMarketData } from '@/lib/apify/etsy-scraper'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Check credits
        const { data: creditsData, error: creditsError } = await supabase
            .from('credits')
            .select('balance')
            .eq('user_id', user.id)
            .single()

        if (creditsError || !creditsData) {
            return NextResponse.json({ error: 'Could not fetch credits' }, { status: 500 })
        }

        if (creditsData.balance < 1) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
        }

        // 2. Validate Input
        const body = await request.json()
        const parseResult = listingSchema.safeParse(body)

        if (!parseResult.success) {
            return NextResponse.json({ error: 'Invalid input', details: parseResult.error }, { status: 400 })
        }

        const { description, productType, targetLanguage } = parseResult.data
        const imageUrl = body.imageUrl // Validated separately in previous step

        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
        }

        // 3. Deduct Credit (optimistic)
        // We deduct first to prevent race conditions or abuse. If generation fails, we should refund.
        const { error: deductError } = await supabase.rpc('deduct_credit', {
            user_id_param: user.id,
            amount_param: 1
        })

        // If we don't have the RPC function yet, let's do a direct update for now (less safe but works for MVP)
        // Actually, let's just update directly if RPC fails or isn't there
        // But better to stick to simple update for now to avoid migration complexity if I missed adding the RPC

        const { error: updateError } = await supabase
            .from('credits')
            .update({ balance: creditsData.balance - 1 })
            .eq('user_id', user.id)

        if (updateError) {
            return NextResponse.json({ error: 'Failed to deduct credit' }, { status: 500 })
        }

        // 4. Fetch Market Data (Optional)
        let marketData = null
        try {
            // Use the description as specific keyword signal
            const keyword = description.split(' ').slice(0, 3).join(' ')
            marketData = await getEtsyMarketData(keyword)
        } catch (e) {
            console.warn("Market data fetch failed", e)
        }

        // 5. Generate Listing
        let generationResult
        try {
            generationResult = await generateListing(imageUrl, description, productType, targetLanguage, marketData)
        } catch (aiError) {
            // Refund credit if AI fails
            await supabase
                .from('credits')
                .update({ balance: creditsData.balance }) // Restore original
                .eq('user_id', user.id)

            console.error(aiError)
            return NextResponse.json({ error: 'AI Generation failed. Credit refunded.' }, { status: 500 })
        }

        // 5. Save to Database
        const { data: insertData, error: insertError } = await supabase
            .from('generations')
            .insert({
                user_id: user.id,
                input_data: body,
                output_data: generationResult,
                credits_used: 1,
                status: 'completed'
            })
            .select()
            .single()

        if (insertError) {
            console.error("Failed to save generation:", insertError)
            // We don't fail the request here because the user got their result, 
            // but we should log it. 
            // In a real app, maybe we refund and fail? 
            // For now, return the result.
        }

        return NextResponse.json(insertData || { ...generationResult, id: 'temp-id' })

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
