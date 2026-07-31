create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null,
  customer text not null,
  email text not null,
  subject text not null,
  preview text not null,
  channel text not null default 'Email',
  status text not null default 'Open' check (status in ('Open', 'Pending', 'Resolved')),
  mood text not null default 'Neutral' check (mood in ('Frustrated', 'Neutral', 'Positive')),
  priority text not null default 'Normal' check (priority in ('Urgent', 'High', 'Normal')),
  confidence integer not null default 0 check (confidence between 0 and 100),
  intent text,
  risk text,
  recommended_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, reference)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  sender text not null check (sender in ('customer', 'agent', 'ai')),
  body text not null,
  is_draft boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tickets_user_priority_idx on public.tickets (user_id, priority, created_at desc);
create index if not exists messages_ticket_created_idx on public.messages (ticket_id, created_at);
create index if not exists knowledge_articles_user_idx on public.knowledge_articles (user_id, updated_at desc);

alter table public.tickets enable row level security;
alter table public.messages enable row level security;
alter table public.knowledge_articles enable row level security;

create policy "Users manage their tickets" on public.tickets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their messages" on public.messages
  for all using (auth.uid() = user_id) with check (
    auth.uid() = user_id and exists (
      select 1 from public.tickets
      where tickets.id = messages.ticket_id and tickets.user_id = auth.uid()
    )
  );

create policy "Users manage their knowledge articles" on public.knowledge_articles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
