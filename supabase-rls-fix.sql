-- 删除所有可能存在的策略
DROP POLICY IF EXISTS "Users can only access their own data" ON users;
DROP POLICY IF EXISTS "Users can manage their own data" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;

DROP POLICY IF EXISTS "Users can only access their own pets" ON pets;  
DROP POLICY IF EXISTS "Users can manage their own pets" ON pets;

DROP POLICY IF EXISTS "Users can only access their own records" ON feces_records;
DROP POLICY IF EXISTS "Users can manage their own records" ON feces_records;
DROP POLICY IF EXISTS "Allow authenticated users to insert records" ON feces_records;

-- 删除可能存在的触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 重新创建用户表策略
CREATE POLICY "Users can manage their own data" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Allow user registration" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 重新创建宠物表策略
CREATE POLICY "Users can manage their own pets" ON pets  
  FOR ALL USING (auth.uid() = user_id);

-- 重新创建粪便记录表策略
CREATE POLICY "Users can manage their own records" ON feces_records
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert records" ON feces_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 重新创建触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;  -- 避免重复插入
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 重新创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();