-- Cole este código no "SQL Editor" do seu painel do Supabase e clique em "RUN" para criar as tabelas.

CREATE TABLE public."Institution" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "colorCode" TEXT NOT NULL
);

CREATE TABLE public."Transaction" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "type" TEXT NOT NULL,
  "date" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT,
  "installments" INTEGER,
  "amount" DOUBLE PRECISION NOT NULL,
  "institutionId" UUID REFERENCES public."Institution"(id) ON DELETE SET NULL
);

CREATE TABLE public."Goal" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "category" TEXT NOT NULL,
  "currentAmount" DOUBLE PRECISION DEFAULT 0 NOT NULL,
  "targetAmount" DOUBLE PRECISION NOT NULL,
  "deadline" TEXT,
  "yield" DOUBLE PRECISION,
  "progress" DOUBLE PRECISION DEFAULT 0 NOT NULL
);

-- Ativar as políticas de RLS para simplificar o uso no Next.js Server Actions (caso não vá usar Auth do Supabase ainda):
ALTER TABLE "Institution" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Goal" DISABLE ROW LEVEL SECURITY;
