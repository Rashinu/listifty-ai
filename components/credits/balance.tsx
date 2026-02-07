'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CreditBalance() {
    const [credits, setCredits] = useState<number | null>(null)

    useEffect(() => {
        const fetchCredits = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('credits')
                .select('balance')
                .eq('user_id', user.id)
                .single()

            if (data) {
                setCredits(data.balance)
            }
        }

        fetchCredits()
    }, [])

    if (credits === null) return <div className="text-sm">Loading...</div>

    return (
        <div className="flex items-center gap-4">
            <div className="text-sm font-medium">
                Credits: <span className="font-bold text-primary">{credits}</span>
            </div>
            <Link href="/dashboard/credits">
                <Button size="sm" variant="outline" className="h-8">Buy Credits</Button>
            </Link>
        </div>
    )
}
