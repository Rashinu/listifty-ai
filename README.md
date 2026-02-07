# Listify AI

AI-powered Etsy listing generator for solo marketplace sellers.

## Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **AI:** OpenAI GPT-4 Vision
- **Payments:** Stripe

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and add your API keys.
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `app/`: Next.js App Router pages and API routes
- `components/`: React components (UI, forms, etc.)
- `lib/`: Utilities (Supabase client, OpenAI client, helpers)
- `public/`: Static assets
