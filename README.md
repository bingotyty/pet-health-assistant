# 🐾 宠物粪便识别 MVP

基于 Next.js + Supabase + AI 的宠物健康识别应用

## 功能特性

- 📸 拍照上传宠物粪便图片
- 🤖 AI 智能分析健康状况
- 📊 生成专业健康报告
- 📋 历史记录与趋势分析
- 📱 移动端友好界面

## 技术栈

- **前端**: Next.js, React, Tailwind CSS
- **后端**: Supabase (数据库 + 存储 + 认证)
- **AI服务**: Qwen-VL (图像识别) + OpenAI GPT (报告生成)
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制 `.env.local.example` 为 `.env.local` 并填入配置：

```bash
cp .env.local.example .env.local
```

配置以下环境变量：
- Supabase 项目 URL 和 API 密钥
- OpenAI API 密钥  
- Qwen API 配置

### 3. 数据库设置

在 Supabase 项目中执行 `supabase-setup.sql` 脚本

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
src/
├── components/          # 组件
│   ├── UploadComponent.jsx    # 图片上传
│   └── ResultCard.jsx         # 结果展示
├── pages/              # 页面
│   ├── index.js             # 首页
│   ├── history.js           # 历史记录
│   └── api/                 # API路由
│       └── analyze-poop.js  # 分析接口
├── lib/                # 工具库
│   ├── supabase.js         # Supabase配置
│   ├── ai-service.js       # AI服务
│   └── utils.js            # 工具函数
└── styles/             # 样式文件
    └── globals.css
```

## 核心功能

### 图片上传与分析
- 支持拖拽上传和选择文件
- 自动图片压缩优化
- 实时分析进度反馈

### AI 智能识别
- Qwen-VL 多模态识别粪便特征
- OpenAI GPT 生成健康建议
- 风险等级评估

### 数据管理
- Supabase 数据库存储
- 行级安全策略保护
- 历史记录趋势分析

## 部署

### Vercel 部署

```bash
npm run build
```

推送到 Git 仓库，连接 Vercel 自动部署

### 环境变量设置

在 Vercel 项目设置中配置：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `OPENAI_API_KEY`
- `QWEN_API_ENDPOINT`
- `QWEN_API_KEY`

## 开发计划

- [ ] 用户认证系统
- [ ] 宠物档案管理
- [ ] 详细报告页面
- [ ] 推送通知提醒
- [ ] 数据导出功能

## 许可证

MIT License