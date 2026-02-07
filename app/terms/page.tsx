export default function TermsPage() {
    return (
        <div className="container mx-auto py-8 max-w-2xl prose">
            <h1>Terms of Service</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Acceptance of Terms</h2>
            <p>By using Listify AI, you agree to these terms.</p>

            <h2>2. Service Description</h2>
            <p>Listify AI provides AI-generated content for Etsy listings. We do not guarantee sales or rankings.</p>

            <h2>3. Credits & Refunds</h2>
            <ul>
                <li>Credits are purchased in packages.</li>
                <li>Refunds are available within 7 days if credits are unused.</li>
                <li>Failed generations are automatically refunded to your balance.</li>
            </ul>

            <h2>4. User Content</h2>
            <p>You retain ownership of your uploaded images. You grant us license to process them for generation.</p>

            <h2>5. Limitation of Liability</h2>
            <p>Listify AI is provided "as is". We are not liable for marketplace suspensions or lost revenue.</p>
        </div>
    )
}
