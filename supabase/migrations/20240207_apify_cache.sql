-- Create apify_cache table
create table public.apify_cache (
  keyword text not null primary key,
  data jsonb not null,
  fetched_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.apify_cache enable row level security;

-- Allow read access to authenticated users
create policy "Users can read apify cache"
  on public.apify_cache for select
  to authenticated
  using (true);

-- Allow service role to insert/update
create policy "Service role can manage apify cache"
  on public.apify_cache for all
  to service_role
  using (true);
