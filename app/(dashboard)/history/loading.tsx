import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </div>
    )
}
