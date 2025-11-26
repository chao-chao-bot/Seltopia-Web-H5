# 🚀 Sanity 背景图片迁移 - 快速开始

## ⚡ 5 步完成迁移

### 1️⃣ 进入 Studio 目录

```bash
cd seltopia
```

### 2️⃣ 获取 API Token

访问: https://www.sanity.io/manage/project/gkqg8l0c/api

1. 点击 "Add API Token"
2. 名称: `Upload Script`
3. 权限: **Editor**
4. 复制生成的 token

### 3️⃣ 配置环境变量

```bash
# 创建 .env.local 文件
echo "SANITY_WRITE_TOKEN=你复制的token" > .env.local
```

### 4️⃣ 测试连接

```bash
pnpm test-connection
```

期望输出：
```
🔍 测试 Sanity 连接...
✅ 成功！当前已有 0 个 backgroundImage 文档
✅ 所有测试通过！
```

### 5️⃣ 上传所有图片

```bash
pnpm upload-images
```

⏱️ 预计耗时: 2-3 分钟（231 张图片）

## 🎉 完成！

上传完成后：

1. **查看 Studio**: 访问 http://localhost:3333
2. **启动前端**: 在主项目目录运行 `pnpm dev`
3. **使用新组件**: 将 `UnifiedScreen` 替换为 `UnifiedScreenSanity`

## 📚 详细文档

- [完整集成指南](./SANITY_INTEGRATION.md)
- [上传详细说明](./seltopia/UPLOAD_GUIDE.md)

## 🆘 遇到问题？

### Token 权限错误
确保创建的是 **Editor** 权限的 token

### 文件路径错误
确认图片位于: `/Users/xiachao/github/Seltopia-Web-H5/public/images/背景图片/`

### 网络问题
如果上传失败，脚本会自动跳过并继续，可以重新运行上传失败的部分


