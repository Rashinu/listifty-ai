import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { sendReceiptEmail } from '@/lib/resend/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get('stripe-signature')

    let event: Stripe.Event

    try {
        if (!signature || !webhookSecret) return new NextResponse("Webhook Secret Missing", { status: 400 })
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    const supabase = createClient()

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const credits = parseInt(session.metadata?.credits || '0')
        const amountPaid = session.amount_total || 0

        if (userId && credits > 0) {
            console.log(`Adding ${credits} credits to user ${userId}`)

            // 1. Get current balance
            const { data: currentCredit } = await supabase
                .from('credits')
                .select('balance')
                .eq('user_id', userId)
                .single()

            const currentBalance = currentCredit?.balance || 0

            // 2. Add credits
            const { error: updateError } = await supabase
                .from('credits')
                .update({
                    balance: currentBalance + credits,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId)

            // If no row exists (should handle this case if we don't have perfect triggers)
            if (updateError && !currentCredit) {
                await supabase.from('credits').insert({
                    user_id: userId,
                    balance: credits
                })
            }

            // 3. Send Receipt Email (async, don't block response)
            // Retrieve user email to send receipt
            const { data: userData } = await supabase.auth.admin.getUserById(userId)
            const userEmail = userData?.user?.email

            if (userEmail) {
                await sendReceiptEmail(
                    userEmail,
                    credits,
                    amountPaid,
                    session.payment_intent as string
                )
            }

            // 3. Record transaction
            await supabase.from('transactions').insert({
                user_id: userId,
                stripe_payment_intent_id: session.payment_intent as string,
                credits_purchased: credits,
                amount_paid: amountPaid,
                status: 'completed'
            })
        }
    }

    return NextResponse.json({ received: true })
}
