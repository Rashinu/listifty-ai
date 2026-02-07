'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ListingGenerationResult } from '@/lib/openai/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ResultPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState<ListingGenerationResult | null>(null)

    useEffect(() => {
        async function fetchResult() {
            if (!id) return;

            const supabase = createClient()
            const { data, error } = await supabase
                .from('generations')
                .select('*')
                .eq('id', id)
                .single()

            if (error || !data) {
                toast.error("Could not find generation result")
                router.push('/dashboard/create')
                return
            }

            setResult(data.output_data as ListingGenerationResult)
            setLoading(false)
        }

        fetchResult()
    }, [id, router])

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied!`)
    }

    const downloadAsText = () => {
        if (!result) return
        const content = `
TITLE OPTIONS:
${result.titles.map(t => `- ${t}`).join('\n')}

TAGS:
${result.tags.join(', ')}

DESCRIPTION:
${result.description.hook}

Features:
${result.description.features.map(f => `- ${f}`).join('\n')}

Usage:
${result.description.usage.map(u => `- ${u}`).join('\n')}

Included:
${result.description.included}

Disclaimer:
${result.description.disclaimer}

CTA:
${result.description.cta}

MOCKUP PROMPTS:
Wall Art: ${result.mockup_prompts.wall_art_mockup_prompt}
Video: ${result.mockup_prompts.video_mockup_prompt}
        `.trim()

        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `listing-${id}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    if (loading || !result) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Your Listing is Ready! 🎉</h1>
                    <p className="text-gray-500">Review and verify before posting to Etsy.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/create">
                        <Button variant="outline">Create Another</Button>
                    </Link>
                    <Link href="/dashboard/history">
                        <Button variant="secondary">View History</Button>
                    </Link>
                    <Button variant="outline" onClick={downloadAsText}>Download Text</Button>
                </div>
            </div>

            <Tabs defaultValue="titles" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="titles">Titles</TabsTrigger>
                    <TabsTrigger value="tags">Tags</TabsTrigger>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="mockups">Mockups</TabsTrigger>
                </TabsList>

                {/* TITLES */}
                <TabsContent value="titles" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Optimized Titles</CardTitle>
                            <CardDescription>Choose the best title for your product.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {result.titles.map((title, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <p className="text-sm font-medium pr-4">{title}</p>
                                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(title, "Title")}>
                                        Copy
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAGS */}
                <TabsContent value="tags" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Tags</CardTitle>
                            <CardDescription>13 optimized tags for Etsy search.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {result.tags.map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <Button onClick={() => copyToClipboard(result.tags.join(", "), "All tags")}>
                                Copy All Tags
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* DESCRIPTION */}
                <TabsContent value="description" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Description</CardTitle>
                            <CardDescription>Formatted for readability and conversion.</CardDescription>
                        </CardHeader>
                        <CardContent className="prose max-w-none space-y-4">

                            <div>
                                <h3 className="font-bold text-lg">Hook</h3>
                                <div className="flex justify-between items-start">
                                    <p className="text-gray-700">{result.description.hook}</p>
                                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(result.description.hook, "Hook")}>Copy</Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg">Features</h3>
                                <ul className="list-disc pl-5">
                                    {result.description.features.map((f, i) => (
                                        <li key={i}>{f}</li>
                                    ))}
                                </ul>
                                <Button size="sm" variant="ghost" className="mt-1" onClick={() => copyToClipboard(result.description.features.map(f => `• ${f}`).join('\n'), "Features")}>Copy List</Button>
                            </div>

                            {/* Add other sections similarly if needed */}

                            <div className="pt-4 border-t">
                                <Button className="w-full" onClick={() => {
                                    const fullDesc = `
${result.description.hook}

FEATURES:
${result.description.features.map(f => `• ${f}`).join('\n')}

USAGE:
${result.description.usage.map(u => `• ${u}`).join('\n')}

INCLUDED:
${result.description.included}

${result.description.disclaimer}

${result.description.cta}
                  `.trim()
                                    copyToClipboard(fullDesc, "Full Description")
                                }}>
                                    Copy Full Description
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>

                {/* MOCKUPS */}
                <TabsContent value="mockups" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Mockup Prompts</CardTitle>
                            <CardDescription>Use these prompts in MidJourney or DALL-E to generate lifestyle images.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="mb-2 block">Wall Art / Lifestyle Prompt</Label>
                                <div className="p-3 bg-gray-100 rounded-md text-sm font-mono relative group">
                                    {result.mockup_prompts.wall_art_mockup_prompt}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white"
                                        onClick={() => copyToClipboard(result.mockup_prompts.wall_art_mockup_prompt, "Prompt")}
                                    >
                                        Copy
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2 block">Video / Reels Prompt</Label>
                                <div className="p-3 bg-gray-100 rounded-md text-sm font-mono relative group">
                                    {result.mockup_prompts.video_mockup_prompt}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white"
                                        onClick={() => copyToClipboard(result.mockup_prompts.video_mockup_prompt, "Prompt")}
                                    >
                                        Copy
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}

function Label({ className, children }: { className?: string, children: React.ReactNode }) {
    return <div className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>{children}</div>
}
