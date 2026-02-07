'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md border-red-200">
                <CardHeader>
                    <CardTitle className="text-red-600">Something went wrong!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">
                        {error.message || "An unexpected error occurred."}
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => reset()} className="w-full">
                        Try again
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
