'use client'

import { signOut } from '@/lib/supabase/auth'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.refresh()
        router.push('/')
    }

    return (
        <Button variant="outline" onClick={handleSignOut}>
            Sign Out
        </Button>
    )
}
