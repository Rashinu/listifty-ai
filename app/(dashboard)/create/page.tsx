'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { listingSchema, type ListingFormValues } from '@/lib/validators/listing'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CreateListingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploadError, setUploadError] = useState<string | null>(null)

    const defaultValues: Partial<ListingFormValues> = {
        targetLanguage: "English",
    }

    const form = useForm<ListingFormValues>({
        resolver: zodResolver(listingSchema),
        defaultValues,
    })

    const { register, handleSubmit, setValue, watch, formState: { errors } } = form
    const descriptionValue = watch("description", "")

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setUploadError(null)

        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setUploadError("File size must be less than 10MB")
                return
            }
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setUploadError("Only JPG and PNG files are allowed")
                return
            }

            setImageFile(file)
            const objectUrl = URL.createObjectURL(file)
            setImagePreview(objectUrl)
        }
    }

    const onSubmit = async (data: ListingFormValues) => {
        if (!imageFile) {
            setUploadError("Please upload an image")
            return
        }

        setLoading(true)

        try {
            // 1. Upload Image
            const supabase = createClient()
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('listing-images')
                .upload(filePath, imageFile)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('listing-images')
                .getPublicUrl(filePath)

            // 2. Call Generation API (To be implemented in Stage 6)
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    imageUrl: publicUrl,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate listing')
            }

            // 3. Redirect to Results
            router.push(`/dashboard/create/result?id=${result.id}`)

        } catch (error: any) {
            console.error(error)
            setUploadError(error.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-8 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Listing</CardTitle>
                    <CardDescription>
                        Upload your product image and let AI do the rest.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                        {/* Image Upload */}
                        <div className="space-y-4">
                            <Label>Product Image</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                                <Input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/png, image/jpeg"
                                    onChange={handleImageChange}
                                />

                                {imagePreview ? (
                                    <div className="relative w-full h-64">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-500">
                                        <span className="text-4xl mb-2">📷</span>
                                        <span className="font-medium">Click or drag image to upload</span>
                                        <span className="text-xs mt-1">JPG or PNG, max 10MB</span>
                                    </div>
                                )}
                            </div>
                            {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
                        </div>

                        {/* Product Type */}
                        <div className="space-y-2">
                            <Label>Product Type</Label>
                            <Select onValueChange={(val) => setValue("productType", val as any)} defaultValue={defaultValues.productType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Wall Art / Poster">Wall Art / Poster</SelectItem>
                                    <SelectItem value="Digital Download">Digital Download</SelectItem>
                                    <SelectItem value="Clipart / Graphics">Clipart / Graphics</SelectItem>
                                    <SelectItem value="Mockup Template">Mockup Template</SelectItem>
                                    <SelectItem value="Other Digital Product">Other Digital Product</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.productType && <p className="text-red-500 text-sm">{errors.productType.message}</p>}
                        </div>

                        {/* Target Language */}
                        <div className="space-y-2">
                            <Label>Target Language</Label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="English"
                                        {...register("targetLanguage")}
                                        defaultChecked
                                    />
                                    English
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="Turkish"
                                        {...register("targetLanguage")}
                                    />
                                    Turkish
                                </label>
                            </div>
                            {errors.targetLanguage && <p className="text-red-500 text-sm">{errors.targetLanguage.message}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label>Short Description</Label>
                            <Textarea
                                placeholder="Describe your product in 2-3 sentences... e.g. Minimalist boho wall art connected lines beige background"
                                className="h-32"
                                {...register("description")}
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Min 20 characters</span>
                                <span className={descriptionValue.length < 20 ? "text-red-500" : "text-green-500"}>
                                    {descriptionValue.length} chars
                                </span>
                            </div>
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                            {loading ? 'Generating...' : 'Generate Listing (1 Credit)'}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
