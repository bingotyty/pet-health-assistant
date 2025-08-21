-- 删除旧的策略
DROP POLICY IF EXISTS "Users can only access their own data" ON users;
DROP POLICY IF EXISTS "Users can only access their own pets" ON pets;  
DROP POLICY IF EXISTS "Users can only access their own records" ON feces_records;

-- 更新用户表策略
CREATE POLICY "Users can manage their own data" ON users
  FOR ALL USING (auth.uid() = id);

-- 允许插入新用户记录（注册时）
CREATE POLICY "Allow user registration" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 更新宠物表策略
CREATE POLICY "Users can manage their own pets" ON pets  
  FOR ALL USING (auth.uid() = user_id);

-- 更新粪便记录表策略
CREATE POLICY "Users can manage their own records" ON feces_records
  FOR ALL USING (auth.uid() = user_id);

-- 允许匿名用户插入记录（用于API调用）
CREATE POLICY "Allow authenticated users to insert records" ON feces_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 为认证用户自动创建用户记录的函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 触发器：用户注册时自动创建用户记录
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();