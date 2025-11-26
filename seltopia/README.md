# Seltopia Background Images - Sanity Studio

这是 Seltopia 项目的 [Sanity Studio](https://www.sanity.io/studio) v4，用于管理背景图片。

## 🚀 快速开始

### 启动 Studio

```bash
pnpm dev
```

访问 http://localhost:3333

### 测试连接

```bash
# 1. 创建 .env.local 文件
cp .env.local.example .env.local

# 2. 编辑 .env.local，添加你的 Sanity token
# 获取 token: https://www.sanity.io/manage/project/gkqg8l0c/api

# 3. 测试连接
pnpm test-connection
```

### 上传背景图片

```bash
pnpm upload-images
```

## 📚 文档

- [详细的上传指南](./UPLOAD_GUIDE.md)
- [项目集成文档](../SANITY_INTEGRATION.md)
- [Sanity 官方文档](https://www.sanity.io/docs)

## 🎯 Schema

### backgroundImage

背景图片文档类型，包含：
- `title`: 图片标题
- `theme`: 主题分类（禅宗、智慧、儒家、箴言、赋能）
- `imageNumber`: 图片编号
- `image`: 图片资源
- `slug`: 唯一标识

## 📊 统计

- 禅宗: 20 张
- 智慧: 50 张
- 儒家: 28 张
- 箴言: 80 张
- 赋能: 53 张
- **总计: 231 张**

## 🔧 可用命令

```bash
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm deploy           # 部署到 Sanity
pnpm test-connection  # 测试 Sanity 连接
pnpm upload-images    # 批量上传背景图片
```

## 📞 帮助

- [Join the Sanity community](https://www.sanity.io/community/join)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending)
