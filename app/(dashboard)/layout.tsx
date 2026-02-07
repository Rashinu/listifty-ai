import { CreditBalance } from '@/components/credits/balance'
import { SignOutButton } from '@/components/auth/sign-out-button'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b h-16 flex items-center px-6">
                <div className="font-bold text-xl">Listify AI</div>
                <div className="ml-auto flex items-center gap-4">
                    <CreditBalance />
                    <SignOutButton />
                </div>
            </header>
            <main className="p-6">
                {children}
            </main>
        </div>
    )
}
