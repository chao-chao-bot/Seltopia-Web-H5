import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置 Sanity 客户端（需要写入权限）
const client = createClient({
  projectId: 'gkqg8l0c',
  dataset: 'production',
  apiVersion: '2025-11-25',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // 需要从环境变量获取
})

// 主题映射
const THEMES_MAP = {
  禅宗: 20,
  赋能: 53,
  儒家: 28,
  箴言: 80,
  智慧: 50,
}

// 图片所在的根目录
const IMAGES_ROOT = path.join(__dirname, '../../public/images/背景图片')

/**
 * 上传单张图片到 Sanity
 */
async function uploadImage(theme: string, imageNumber: number, imagePath: string): Promise<void> {
  try {
    console.log(`📤 正在上传: ${theme}-${imageNumber}`)

    // 1. 读取图片文件
    const imageBuffer = fs.readFileSync(imagePath)

    // 2. 上传图片到 Sanity Assets
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: `${theme}-${imageNumber}.png`,
    })

    console.log(`✅ 图片资源上传成功: ${asset._id}`)

    // 3. 创建 backgroundImage 文档
    const document = {
      _type: 'backgroundImage',
      title: `${theme}-${imageNumber}`,
      theme: theme,
      imageNumber: imageNumber,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
      slug: {
        _type: 'slug',
        current: `${theme}-${imageNumber}`,
      },
    }

    const result = await client.create(document)
    console.log(`✅ 文档创建成功: ${result._id}\n`)
  } catch (error) {
    console.error(`❌ 上传失败 ${theme}-${imageNumber}:`, error)
    throw error
  }
}

/**
 * 批量上传所有图片
 */
async function uploadAllImages() {
  console.log('🚀 开始批量上传背景图片到 Sanity...\n')

  // 检查 token
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ 错误: 未找到 SANITY_WRITE_TOKEN 环境变量')
    console.error('请先创建 .env.local 文件并添加你的 Sanity token')
    console.error('获取 token: https://www.sanity.io/manage/project/gkqg8l0c/api')
    process.exit(1)
  }

  let totalUploaded = 0
  let totalFailed = 0

  // 遍历每个主题
  for (const [theme, count] of Object.entries(THEMES_MAP)) {
    console.log(`\n📁 处理主题: ${theme} (共 ${count} 张图片)`)
    console.log('─'.repeat(50))

    const themePath = path.join(IMAGES_ROOT, theme, '高清有字')

    // 检查目录是否存在
    if (!fs.existsSync(themePath)) {
      console.error(`❌ 目录不存在: ${themePath}`)
      continue
    }

    // 遍历该主题下的所有图片
    for (let i = 1; i <= count; i++) {
      const imagePath = path.join(themePath, `${i}.png`)

      // 检查文件是否存在
      if (!fs.existsSync(imagePath)) {
        console.warn(`⚠️  文件不存在: ${imagePath}`)
        totalFailed++
        continue
      }

      try {
        await uploadImage(theme, i, imagePath)
        totalUploaded++

        // 添加延迟避免 API 限流
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        totalFailed++
        console.error(`继续处理下一张图片...\n`)
      }
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 上传完成统计:')
  console.log(`✅ 成功: ${totalUploaded} 张`)
  console.log(`❌ 失败: ${totalFailed} 张`)
  console.log(`📈 总计: ${totalUploaded + totalFailed} 张`)
  console.log('='.repeat(50))
}

// 运行上传
uploadAllImages().catch((error) => {
  console.error('❌ 上传过程发生错误:', error)
  process.exit(1)
})

