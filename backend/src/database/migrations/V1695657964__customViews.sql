create type "customViewVisibility" as enum ('member', 'tenant');

create table "customViews" (
  id uuid not null primary key,
  name varchar(255) not null check (name <> ''),
  visibility "customViewVisibility" not null,
  config jsonb default '{}',
  placement text[] check (placement <@ ARRAY['members', 'organizations', 'activities', 'conversations']),
  "tenantId" uuid references "tenants"(id) on delete cascade,
  "createdById" uuid references "users"(id),
  "updatedById" uuid references "users"(id),
  "deletedById" uuid references "users"(id),
  "createdAt" timestamp with time zone not null default now(),
  "updatedAt" timestamp with time zone,
  "deletedAt" timestamp with time zone
);

create table "customViewOrders" (
  id uuid not null primary key,
  "order" integer not null default 0,
  "customViewId" uuid not null references "customViews"(id) on delete cascade,
  "memberId" uuid not null references "users"(id) on delete cascade,
  "createdAt" timestamp with time zone not null default now(),
  "deletedAt" timestamp with time zone
);