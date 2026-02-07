import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
                    <CardDescription className="text-center">
                        We've sent you a magic link to sign in. <br />
                        Click the link in your email to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <div className="text-4xl">✉️</div>
                </CardContent>
            </Card>
        </div>
    )
}
