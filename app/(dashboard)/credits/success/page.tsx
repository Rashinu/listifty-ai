import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SuccessPage() {
    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-md mx-auto text-center">
                <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">✅</span>
                    </div>
                    <CardTitle>Payment Successful!</CardTitle>
                    <CardDescription>
                        Your credits have been added to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard/create">
                        <Button className="w-full">Start Creating</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
