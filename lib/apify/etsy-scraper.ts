import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: process.env.APIFY_API_KEY,
});

export interface MarketData {
    topKeywords?: string[];
    averagePrice?: number;
    popularTags?: string[];
}

export async function getEtsyMarketData(keyword: string): Promise<MarketData | null> {
    if (!process.env.APIFY_API_KEY) {
        console.warn("No Apify API Key provided. Skipping market data.");
        return null;
    }

    try {
        // Run the Actor and wait for it to finish
        const run = await client.actor("drobnikj/etsy-scraper").call({
            search: keyword,
            maxItems: 20,
            proxy: {
                useApifyProxy: true
            }
        });

        // Fetch results from the run's dataset (if any)
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        if (!items || items.length === 0) return null;

        // Process items to extract signals
        // This is a simplified extraction based on typical Apify output
        const titles = items.map((item: any) => item.title).filter(Boolean);
        const tags = items.flatMap((item: any) => item.tags || []).filter(Boolean);
        const prices = items.map((item: any) => parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0')).filter((p) => p > 0);

        const topKeywords = extractTopKeywords(titles);
        const popularTags = extractTopKeywords(tags).slice(0, 10);
        const averagePrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

        return {
            topKeywords,
            popularTags,
            averagePrice
        };

    } catch (error) {
        console.error("Apify Error:", error);
        return null;
    }
}

function extractTopKeywords(texts: string[]): string[] {
    const wordMap: Record<string, number> = {};
    texts.forEach(text => {
        const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
        words.forEach(w => {
            if (w.length > 3) {
                wordMap[w] = (wordMap[w] || 0) + 1;
            }
        });
    });

    return Object.entries(wordMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(e => e[0]);
}
