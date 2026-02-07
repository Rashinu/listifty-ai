import { createClient } from './client'
import { createClient as createServerClient } from './server'

// Client-side auth helpers
export async function signInWithEmail(email: string) {
    const supabase = createClient()
    const result = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
    })
    return result
}

export async function signOut() {
    const supabase = createClient()
    return await supabase.auth.signOut()
}

// Server-side auth helpers
export async function getUser() {
    const supabase = createServerClient()
    try {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    } catch (error) {
        return null
    }
}
