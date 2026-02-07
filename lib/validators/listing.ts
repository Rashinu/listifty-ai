import { z } from 'zod'

export const listingSchema = z.object({
    description: z.string().min(20, {
        message: "Description must be at least 20 characters.",
    }),
    productType: z.enum([
        "Wall Art / Poster",
        "Digital Download",
        "Clipart / Graphics",
        "Mockup Template",
        "Other Digital Product"
    ], {
        required_error: "Please select a product type.",
    }),
    targetLanguage: z.enum(["English", "Turkish"], {
        required_error: "Please select a target language.",
    }),
    // Image validation will be handled separately since it's a file
})

export type ListingFormValues = z.infer<typeof listingSchema>
