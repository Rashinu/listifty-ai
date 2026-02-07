import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia', // Use latest or your specific version
})

const PACKAGES = {
    starter: { credits: 20, price: 900, name: 'Starter Package (20 Credits)' },
    popular: { credits: 60, price: 1900, name: 'Standard Package (60 Credits)' },
    pro: { credits: 200, price: 4900, name: 'Pro Package (200 Credits)' },
}

export async function POST(request: Request) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const packageId = formData.get('package') as keyof typeof PACKAGES

        if (!packageId || !PACKAGES[packageId]) {
            return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
        }

        const selectedPackage = PACKAGES[packageId]
        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: selectedPackage.name,
                            metadata: {
                                credits: selectedPackage.credits
                            }
                        },
                        unit_amount: selectedPackage.price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/dashboard/credits/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/credits/cancel`,
            metadata: {
                userId: user.id,
                credits: selectedPackage.credits,
                packageId: packageId
            },
            client_reference_id: user.id,
        })

        if (!session.url) {
            throw new Error("Stripe session creation failed")
        }

        return NextResponse.redirect(session.url, 303)

    } catch (error: any) {
        console.error('Stripe Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
