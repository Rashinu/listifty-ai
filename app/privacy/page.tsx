export default function PrivacyPage() {
    return (
        <div className="container mx-auto py-8 max-w-2xl prose">
            <h1>Privacy Policy</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Introduction</h2>
            <p>Listify AI respects your privacy. This policy explains how we handle your data.</p>

            <h2>2. Data Collection</h2>
            <p>We collect:</p>
            <ul>
                <li>Email address (for authentication and receipts)</li>
                <li>Uploaded images (processed by OpenAI, stored in Supabase)</li>
                <li>Payment information (processed securely by Stripe)</li>
            </ul>

            <h2>3. Data Usage</h2>
            <p>We use your data to:</p>
            <ul>
                <li>Generate Etsy listings</li>
                <li>Process payments</li>
                <li>Send service notifications</li>
            </ul>

            <h2>4. Third-Party Services</h2>
            <p>We share data with:</p>
            <ul>
                <li>OpenAI (for generation)</li>
                <li>Stripe (for payments)</li>
                <li>Supabase (for hosting/database)</li>
                <li>Apify (for market data)</li>
            </ul>

            <h2>5. Contact</h2>
            <p>For questions, contact support@listify-ai.com</p>
        </div>
    )
}
