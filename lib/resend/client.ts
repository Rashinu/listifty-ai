import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReceiptEmail(
    email: string,
    credits: number,
    amount: number,
    transactionId: string
) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("Resend API Key missing. Skipping email.");
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Listify AI <onboarding@resend.dev>', // Update this when you have a custom domain
            to: [email],
            subject: `Receipt: ${credits} Credits Purchase`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Thanks for your purchase!</h1>
            <p>We've successfully added <strong>${credits} credits</strong> to your account.</p>
            <p>Transaction ID: ${transactionId}</p>
            <p>Total Paid: $${(amount / 100).toFixed(2)}</p>
            <br/>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/create" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Creating</a>
        </div>
      `,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { error };
        }

        return { data };
    } catch (error) {
        console.error('Resend Error:', error);
        return { error };
    }
}
