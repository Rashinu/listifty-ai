import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PricingPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Buy Credits</h1>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Starter */}
                <Card>
                    <CardHeader>
                        <CardTitle>Starter</CardTitle>
                        <CardDescription>20 Credits</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-4">$9</div>
                        <ul className="mb-6 space-y-2 text-sm text-gray-500">
                            <li>✓ 20 Listing Generations</li>
                            <li>✓ $0.45 per listing</li>
                            <li>✓ Never expires</li>
                        </ul>
                        <form action="/api/stripe/checkout" method="POST">
                            <input type="hidden" name="package" value="starter" />
                            <Button className="w-full" variant="outline" type="submit">Buy Starter</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Popular */}
                <Card className="border-primary shadow-lg relative">
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl">Best Value</div>
                    <CardHeader>
                        <CardTitle>Popular</CardTitle>
                        <CardDescription>60 Credits</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-4">$19</div>
                        <ul className="mb-6 space-y-2 text-sm text-gray-500">
                            <li>✓ 60 Listing Generations</li>
                            <li>✓ $0.32 per listing</li>
                            <li>✓ Never expires</li>
                        </ul>
                        <form action="/api/stripe/checkout" method="POST">
                            <input type="hidden" name="package" value="popular" />
                            <Button className="w-full" type="submit">Buy Popular</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Pro */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pro</CardTitle>
                        <CardDescription>200 Credits</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-4">$49</div>
                        <ul className="mb-6 space-y-2 text-sm text-gray-500">
                            <li>✓ 200 Listing Generations</li>
                            <li>✓ $0.25 per listing</li>
                            <li>✓ Never expires</li>
                        </ul>
                        <form action="/api/stripe/checkout" method="POST">
                            <input type="hidden" name="package" value="pro" />
                            <Button className="w-full" variant="outline" type="submit">Buy Pro</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-12 max-w-2xl mx-auto text-center">
                <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="text-left space-y-4">
                    <div>
                        <h3 className="font-semibold">Do credits expire?</h3>
                        <p className="text-gray-500">No, your credits never expire.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">What if the generation fails?</h3>
                        <p className="text-gray-500">If the AI fails to generate a listing, your credit is automatically refunded.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
