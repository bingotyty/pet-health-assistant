-- 用户表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 宠物档案表
CREATE TABLE pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('cat', 'dog')),
  breed TEXT,
  age INTEGER,
  weight DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 粪便识别记录表
CREATE TABLE feces_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  qwen_analysis JSONB,
  gpt_report TEXT,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  user_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全性
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE feces_records ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的记录
CREATE POLICY "Users can only access their own data" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can only access their own pets" ON pets  
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own records" ON feces_records
  FOR ALL USING (auth.uid() = user_id);

-- 创建存储桶用于图片存储
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-images', 'pet-images', true);

-- 存储策略
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pet-images');

CREATE POLICY "Allow public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'pet-images');

CREATE POLICY "Allow users to delete their own images" ON storage.objects
  FOR DELETE USING (bucket_id = 'pet-images' AND auth.uid()::text = (storage.foldername(name))[1]);