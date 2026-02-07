import OpenAI from 'openai'

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export type ListingGenerationResult = {
    titles: string[]
    tags: string[]
    description: {
        hook: string
        features: string[]
        usage: string[]
        included: string
        disclaimer: string
        cta: string
    }
    mockup_prompts: {
        wall_art_mockup_prompt: string
        video_mockup_prompt: string
    }
}

export async function generateListing(
    imageUrl: string,
    description: string,
    productType: string,
    targetLanguage: string,
    marketData?: any
): Promise<ListingGenerationResult> {

    const systemPrompt = `
You are an expert Etsy listing optimizer. Generate a complete listing package for this product.

Product Image: [Provided by user]
Description: ${description}
Product Type: ${productType}
Target Language: ${targetLanguage}
Market Signals: ${marketData ? JSON.stringify(marketData) : 'None'}

Return ONLY valid JSON matching this structure:
{
  "titles": ["title1", "title2", "title3", "title4", "title5"],
  "tags": ["tag1", ..., "tag13"],
  "description": {
    "hook": "...",
    "features": ["..."],
    "usage": ["..."],
    "included": "...",
    "disclaimer": "...",
    "cta": "..."
  },
  "mockup_prompts": {
    "wall_art_mockup_prompt": "...",
    "video_mockup_prompt": "..."
  }
}

Rules:
- Never hallucinate product details
- Use SEO-friendly language
- Keep titles under 140 characters
- Tags must be lowercase, no special characters, max 20 chars each
- Description must be scannable with bullet points
- Mockup prompts should be detailed for MidJourney/DALL-E
`

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview", // or gpt-4o if available and cheaper/faster
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Generate the listing for this image." },
                        {
                            type: "image_url",
                            image_url: {
                                "url": imageUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1500,
            response_format: { type: "json_object" }
        })

        const result = response.choices[0].message.content
        if (!result) throw new Error("No response from AI")

        return JSON.parse(result) as ListingGenerationResult

    } catch (error) {
        console.error("OpenAI Error:", error)
        throw error
    }
}
