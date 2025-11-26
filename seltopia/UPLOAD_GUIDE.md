# 背景图片上传指南

## 1️⃣ 启动 Sanity Studio

首先启动 Sanity Studio 来查看和管理你的内容：

```bash
cd seltopia
pnpm dev
```

Studio 将在 http://localhost:3333 启动

## 2️⃣ 获取 Sanity Write Token

1. 访问: https://www.sanity.io/manage/project/gkqg8l0c/api
2. 点击 "Add API Token"
3. 输入 Token 名称（例如：Upload Script）
4. 权限选择：**Editor**
5. 复制生成的 token

## 3️⃣ 配置环境变量

在 `seltopia` 目录下创建 `.env.local` 文件：

```bash
cd seltopia
touch .env.local
```

在文件中添加：

```env
SANITY_WRITE_TOKEN=你刚才复制的token
```

⚠️ **重要**: 不要将 `.env.local` 提交到 git！

## 4️⃣ 运行上传脚本

```bash
cd seltopia
pnpm upload-images
```

脚本会：
- 遍历 `/public/images/背景图片/` 下的所有主题文件夹
- 上传每张图片到 Sanity
- 创建对应的 backgroundImage 文档
- 显示上传进度和统计信息

## 5️⃣ 预期输出

```
🚀 开始批量上传背景图片到 Sanity...

📁 处理主题: 禅宗 (共 20 张图片)
──────────────────────────────────────────────────
📤 正在上传: 禅宗-1
✅ 图片资源上传成功: image-abc123...
✅ 文档创建成功: def456...

📤 正在上传: 禅宗-2
...

==================================================
📊 上传完成统计:
✅ 成功: 231 张
❌ 失败: 0 张
📈 总计: 231 张
==================================================
```

## 6️⃣ 验证上传结果

1. 打开 Sanity Studio (http://localhost:3333)
2. 左侧菜单会显示 "Background Image"
3. 点击查看所有上传的文档
4. 可以按主题筛选查看

## 📝 主题和数量

- 禅宗: 20 张
- 智慧: 50 张
- 儒家: 28 张
- 箴言: 80 张
- 赋能: 53 张
- **总计: 231 张**

## 🔍 常见问题

### Q: 上传速度很慢？
A: 脚本添加了 500ms 延迟避免 API 限流，这是正常的。231 张图片大约需要 2-3 分钟。

### Q: 部分图片上传失败？
A: 检查：
1. Token 权限是否正确（需要 Editor 权限）
2. 图片文件是否存在
3. 网络连接是否稳定

### Q: 如何重新上传？
A: 如果需要重新上传，先在 Studio 中删除已有文档，然后重新运行脚本。

### Q: 可以只上传某个主题吗？
A: 可以修改 `scripts/upload-images.ts` 中的 `THEMES_MAP`，只保留需要上传的主题。

## 🎯 下一步

上传完成后：
1. 确保前端项目已安装 `@sanity/client` 和 `@sanity/image-url`
2. 使用 `UnifiedScreenSanity` 组件替代原来的 `UnifiedScreen`
3. 图片将从 Sanity CDN 加载，无需重新部署即可更新图片



