'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

type Generation = {
    id: string
    created_at: string
    input_data: {
        imageUrl: string
        productType: string
        description: string
    }
    status: 'pending' | 'completed' | 'failed'
}

export default function HistoryPage() {
    const [generations, setGenerations] = useState<Generation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) return

            const { data, error } = await supabase
                .from('generations')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (data) {
                setGenerations(data as Generation[])
            }
            setLoading(false)
        }

        fetchHistory()
    }, [])

    if (loading) {
        return <div className="p-8 text-center">Loading history...</div>
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Generation History</h1>
                <Link href="/dashboard/create">
                    <Button>New Listing</Button>
                </Link>
            </div>

            {generations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">You haven't generated any listings yet.</p>
                    <Link href="/dashboard/create">
                        <Button>Create Your First Listing</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {generations.map((gen) => (
                        <Card key={gen.id} className="overflow-hidden">
                            <div className="relative h-48 w-full bg-gray-100">
                                {gen.input_data.imageUrl ? (
                                    <Image
                                        src={gen.input_data.imageUrl}
                                        alt="Product"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Badge variant={gen.status === 'completed' ? 'default' : 'destructive'}>
                                        {gen.status}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-lg truncate">
                                    {gen.input_data.productType}
                                </CardTitle>
                                <div className="text-xs text-gray-500">
                                    {new Date(gen.created_at).toLocaleDateString()}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                    {gen.input_data.description}
                                </p>
                                <Link href={`/dashboard/create/result?id=${gen.id}`}>
                                    <Button variant="outline" className="w-full">View Details</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
