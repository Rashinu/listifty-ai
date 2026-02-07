-- Create users table (extends auth.users)
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create credits table
create table public.credits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  balance integer default 0 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create generations table
create table public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  input_data jsonb not null,
  output_data jsonb,
  credits_used integer default 1 not null,
  status text check (status in ('pending', 'completed', 'failed')) default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create transactions table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  stripe_payment_intent_id text unique,
  credits_purchased integer not null,
  amount_paid integer not null, -- in cents
  status text check (status in ('pending', 'completed', 'failed')) default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.credits enable row level security;
alter table public.generations enable row level security;
alter table public.transactions enable row level security;

-- Create policies

-- Users table policies
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- Credits table policies
create policy "Users can view their own credits" on public.credits
  for select using (auth.uid() = user_id);

-- Generations table policies
create policy "Users can view their own generations" on public.generations
  for select using (auth.uid() = user_id);

create policy "Users can insert their own generations" on public.generations
  for insert using (auth.uid() = user_id);

-- Transactions table policies
create policy "Users can view their own transactions" on public.transactions
  for select using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  
  insert into public.credits (user_id, balance)
  values (new.id, 1); -- Give 1 free credit on signup due to "Create Your First Listing Free" requirement
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
