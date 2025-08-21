-- 检查当前RLS策略状态
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'pets', 'feces_records');

-- 如果RLS未启用，启用它
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feces_records ENABLE ROW LEVEL SECURITY;

-- 删除所有现有策略重新创建
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('users', 'pets', 'feces_records'))
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- 创建用户表策略
CREATE POLICY "users_policy" ON public.users
    USING (auth.uid() = id);

-- 创建粪便记录表策略 - 允许用户管理自己的记录
CREATE POLICY "feces_records_select_policy" ON public.feces_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "feces_records_insert_policy" ON public.feces_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "feces_records_update_policy" ON public.feces_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "feces_records_delete_policy" ON public.feces_records
    FOR DELETE USING (auth.uid() = user_id);

-- 创建宠物表策略
CREATE POLICY "pets_policy" ON public.pets
    USING (auth.uid() = user_id);

-- 创建用户注册触发器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 删除旧触发器并创建新的
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 验证策略创建
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;