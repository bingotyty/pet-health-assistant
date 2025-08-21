# 🚀 宠物健康小助手部署指南

## 📋 所需环境变量

根据代码分析，你需要准备以下环境变量：

### Supabase 配置 (必需)
```
NEXT_PUBLIC_SUPABASE_URL=你的supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase匿名密钥
```

### AI服务配置 (必需)
```
OPENAI_API_KEY=你的OpenAI API密钥
QWEN_API_ENDPOINT=你的Qwen API端点
QWEN_API_KEY=你的Qwen API密钥
```

## 🎯 推荐部署方案：Vercel

**为什么选择Vercel？**
- ✅ Next.js官方推荐平台
- ✅ 自动HTTPS，PWA友好
- ✅ 全球CDN加速
- ✅ 简单易用，免费额度充足
- ✅ 支持环境变量管理
- ✅ 自动部署（Git集成）

## 📖 详细部署步骤

### 第一步：准备Git仓库

1. **初始化Git仓库**
```bash
git init
git add .
git commit -m "feat: initial commit - 宠物健康小助手 🐾

🎨 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

2. **创建GitHub仓库**
   - 访问 https://github.com/new
   - 创建新仓库（建议名称：`pet-health-assistant`）
   - 推送代码：
```bash
git remote add origin https://github.com/你的用户名/pet-health-assistant.git
git branch -M main
git push -u origin main
```

### 第二步：Vercel部署

1. **注册Vercel**
   - 访问 https://vercel.com
   - 使用GitHub账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的GitHub仓库
   - Framework Preset: Next.js (自动检测)

3. **配置环境变量**
   在Vercel项目设置中添加环境变量：
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名密钥
   OPENAI_API_KEY=sk-...你的OpenAI密钥
   QWEN_API_ENDPOINT=你的Qwen端点
   QWEN_API_KEY=你的Qwen密钥
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成

### 第三步：Supabase配置

1. **RLS策略设置**
   ```sql
   -- 在Supabase SQL编辑器中运行
   -- 参考项目中的supabase-setup.sql文件
   ```

2. **存储桶配置**
   ```sql
   -- 创建存储桶
   INSERT INTO storage.buckets (id, name, public) 
   VALUES ('pet-images', 'pet-images', true);
   
   -- 设置存储策略
   CREATE POLICY "用户可以上传图片" ON storage.objects 
   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
   ```

3. **URL配置**
   - 在Supabase项目设置中
   - 添加你的Vercel域名到允许的域名列表

### 第四步：域名配置（可选）

1. **自定义域名**
   - 在Vercel项目设置中添加域名
   - 配置DNS记录指向Vercel

2. **SSL证书**
   - Vercel自动提供Let's Encrypt证书
   - 支持自定义SSL证书

## 🧪 部署后测试

### 必测功能清单

1. **基础功能**
   - [ ] 用户注册/登录
   - [ ] 拍照上传
   - [ ] 相册选择
   - [ ] AI分析
   - [ ] 结果显示
   - [ ] 历史记录

2. **PWA功能**
   - [ ] PWA安装提示
   - [ ] 离线缓存
   - [ ] 图标显示正确
   - [ ] 启动画面

3. **移动端测试**
   - [ ] iOS Safari拍照
   - [ ] Android Chrome拍照
   - [ ] PWA模式拍照
   - [ ] 响应式布局

4. **性能测试**
   - [ ] 页面加载速度
   - [ ] 图片压缩上传
   - [ ] API响应时间

## 🔧 环境变量获取指南

### Supabase环境变量
1. 登录 https://supabase.com
2. 进入你的项目
3. Settings → API
4. 复制Project URL和anon public key

### OpenAI API密钥
1. 登录 https://platform.openai.com
2. 进入API Keys页面
3. 创建新的API密钥

### Qwen API配置
1. 根据AI-API-SETUP.md配置
2. 使用OpenRouter或阿里云服务

## 📱 PWA部署验证

### PWA Checklist
- [ ] manifest.json可访问
- [ ] Service Worker注册成功
- [ ] HTTPS访问
- [ ] 图标齐全
- [ ] 离线功能

### 测试工具
- Chrome DevTools → Application → Manifest
- Lighthouse PWA审计
- PWA Builder验证工具

## 🚨 常见问题解决

### 1. 构建失败
```bash
# 本地测试构建
npm run build
npm run start
```

### 2. 环境变量未生效
- 确保变量名正确
- NEXT_PUBLIC_开头的变量才能在客户端使用
- 重新部署让变量生效

### 3. PWA功能异常
- 检查HTTPS是否配置正确
- 验证manifest.json和SW文件

### 4. 拍照功能问题
- 确保HTTPS环境
- 检查移动端浏览器兼容性
- 验证文件上传大小限制

## 🎉 部署成功标志

当以下功能都正常工作时，部署就成功了：

1. ✅ 网站可以正常访问
2. ✅ 用户可以注册和登录
3. ✅ 拍照和上传功能正常
4. ✅ AI分析返回结果
5. ✅ PWA可以安装到主屏幕
6. ✅ 移动端拍照功能完整
7. ✅ 历史记录可以查看

## 🔄 持续部署

设置好GitHub集成后，每次推送代码都会自动部署：

```bash
git add .
git commit -m "feat: 更新功能"
git push
```

Vercel会自动构建和部署新版本。

---

🌟 **部署完成后，你就有了一个专业的宠物健康PWA应用！**