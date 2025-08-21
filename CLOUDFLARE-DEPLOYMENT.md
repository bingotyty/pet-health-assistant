# 🚀 Cloudflare Pages 部署指南

## 🌟 为什么选择Cloudflare Pages？

- ⚡ **全球最快CDN** - 300+ 节点
- 🆓 **免费额度超大** - 无限带宽，500次构建/月
- 🔒 **自动HTTPS** - SSL证书自动配置
- 📱 **PWA优化** - 专门针对PWA应用优化
- 🇨🇳 **中国访问友好** - 比Vercel更快

## 📋 部署步骤

### 第一步：登录Cloudflare

1. 访问 https://dash.cloudflare.com/
2. 注册/登录账号
3. 进入 **Pages** 选项卡

### 第二步：连接GitHub仓库

1. 点击 **"Create a project"**
2. 选择 **"Connect to Git"**
3. 授权GitHub访问
4. 选择仓库：`bingotyty/pet-health-assistant`

### 第三步：配置构建设置

```
Project Name: pet-health-assistant
Production Branch: main
Build Command: npm run build
Build Output Directory: out
Root Directory: (留空)
```

**重要：需要修改Next.js配置以支持静态导出**

### 第四步：环境变量配置

在Cloudflare Pages项目设置中添加：

```
NEXT_PUBLIC_SUPABASE_URL=你的supabase地址
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase key
OPENAI_API_KEY=你的openai key  
QWEN_API_ENDPOINT=你的qwen端点
QWEN_API_KEY=你的qwen key
NODE_VERSION=18
```

### 第五步：部署并测试

1. 点击 **"Save and Deploy"**
2. 等待构建完成（通常2-3分钟）
3. 获得URL：`https://pet-health-assistant.pages.dev`

## 🔧 项目配置调整

需要对Next.js进行一些调整以适配Cloudflare Pages的静态部署。

---

## ✅ 优势对比

| 特性 | Cloudflare Pages | Vercel |
|------|------------------|---------|
| 全球CDN | 300+ 节点 | 100+ 节点 |
| 免费带宽 | 无限 | 100GB |
| 构建时间 | 通常更快 | 有时卡住 |
| 中国访问 | 更快 | 较慢 |
| PWA支持 | 优秀 | 良好 |
| 部署稳定性 | 极高 | 有时问题 |

## 🚀 开始部署

现在就可以开始了！需要我指导具体操作步骤吗？