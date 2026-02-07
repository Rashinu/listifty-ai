import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CancelPage() {
    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-md mx-auto text-center">
                <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">❌</span>
                    </div>
                    <CardTitle>Payment Cancelled</CardTitle>
                    <CardDescription>
                        No charges were made to your card.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard/credits">
                        <Button className="w-full">Try Again</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
