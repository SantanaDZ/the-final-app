-- 1. Adicionar a coluna user_id nas tabelas existentes e relacionar com o Supabase Auth
ALTER TABLE public."Institution" ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE public."Transaction" ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE public."Goal" ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- 2. Habilitar a Segurança de Nível de Linha (RLS - Row Level Security) em todas as tabelas
ALTER TABLE public."Institution" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Goal" ENABLE ROW LEVEL SECURITY;

-- 3. Criar a Política de Inserção Restrita (Somente pode inserir dados associados ao seu próprio id)
CREATE POLICY "Users can insert their own Institutions" ON public."Institution" FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert their own Transactions" ON public."Transaction" FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert their own Goals" ON public."Goal" FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 4. Criar Política de Visualização, Atualização e Deleção (Pode ler e alterar apenas o que possui o seu id)
CREATE POLICY "Users can view and edit their own Institutions" ON public."Institution" FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view and edit their own Transactions" ON public."Transaction" FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view and edit their own Goals" ON public."Goal" FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own Institutions" ON public."Institution" FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own Transactions" ON public."Transaction" FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own Goals" ON public."Goal" FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own Institutions" ON public."Institution" FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own Transactions" ON public."Transaction" FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own Goals" ON public."Goal" FOR DELETE TO authenticated USING (auth.uid() = user_id);
