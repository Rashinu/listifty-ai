import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center font-bold text-xl" href="/">
          Listify AI
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link href="/login">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Create Perfect Etsy Listings in Under 2 Minutes
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  AI-powered listing generator for solo sellers. Stop wasting time on listings and focus on creating products.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button size="lg" className="h-12 px-8">Start Creating</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  The Problem
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Stop wasting 20-30 minutes per listing
                </h2>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <ul className="grid gap-2 py-4">
                    <li className="flex items-center gap-2">
                      <span className="text-red-500">❌</span> Struggling with SEO keywords
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-500">❌</span> Writing repetitive descriptions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-500">❌</span> Inconsistent formatting
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-500">❌</span> Running out of title ideas
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm dark:bg-green-900 text-green-800 dark:text-green-100">
                  The Solution
                </div>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Listify AI analyzes your product image and generates optimized titles, tags, and descriptions instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Three simple steps to a perfect listing.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>1. Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Upload your product image. Our AI analyzes the visual details instantly.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>2. Describe</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Add a short description or key selling points you want to highlight.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>3. Generate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Get a complete listing package with titles, tags, and description in seconds.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple Pricing</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Pay as you go. No monthly subscription required.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>Perfect for trying it out</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">$9</div>
                  <div className="text-sm text-gray-500 mt-2">20 Credits</div>
                  <div className="text-xs text-gray-400">($0.45 / listing)</div>
                  <Link href="/login" className="w-full mt-4 block">
                    <Button className="w-full" variant="outline">Choose Starter</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="border-primary data-[state=active]:border-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl">Popular</div>
                <CardHeader>
                  <CardTitle>Standard</CardTitle>
                  <CardDescription>Best value for growing shops</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">$19</div>
                  <div className="text-sm text-gray-500 mt-2">60 Credits</div>
                  <div className="text-xs text-gray-400">($0.32 / listing)</div>
                  <Link href="/login" className="w-full mt-4 block">
                    <Button className="w-full">Choose Standard</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For power sellers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">$49</div>
                  <div className="text-sm text-gray-500 mt-2">200 Credits</div>
                  <div className="text-xs text-gray-400">($0.25 / listing)</div>
                  <Link href="/login" className="w-full mt-4 block">
                    <Button className="w-full" variant="outline">Choose Pro</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/login">
                <Button size="lg" variant="secondary">Create Your First Listing Free</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Listify AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
