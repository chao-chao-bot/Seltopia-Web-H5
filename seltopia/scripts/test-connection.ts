import {createClient} from '@sanity/client'

// 配置 Sanity 客户端
const client = createClient({
  projectId: 'gkqg8l0c',
  dataset: 'production',
  apiVersion: '2025-11-25',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

/**
 * 测试 Sanity 连接和权限
 */
async function testConnection() {
  console.log('🔍 测试 Sanity 连接...\n', process.env.SANITY_WRITE_TOKEN)

  try {
    // 1. 测试读取权限
    console.log('1️⃣ 测试读取权限...')
    const count = await client.fetch(`count(*[_type == "backgroundImage"])`)
    console.log(`✅ 成功！当前已有 ${count} 个 backgroundImage 文档\n`)

    // 2. 测试写入权限（如果提供了 token）
    if (process.env.SANITY_WRITE_TOKEN) {
      console.log('2️⃣ 测试写入权限...')

      // 创建一个测试文档
      const testDoc = await client.create({
        _type: 'backgroundImage',
        title: '测试-0',
        theme: '禅宗',
        imageNumber: 0,
        slug: {
          _type: 'slug',
          current: 'test-0',
        },
      })
      console.log(`✅ 创建测试文档成功: ${testDoc._id}`)

      // 删除测试文档
      await client.delete(testDoc._id)
      console.log(`✅ 删除测试文档成功\n`)
    } else {
      console.log('2️⃣ 跳过写入测试（未提供 SANITY_WRITE_TOKEN）\n')
    }

    // 3. 列出所有主题及其图片数量
    console.log('3️⃣ 按主题统计:')
    const themes = ['禅宗', '智慧', '儒家', '箴言', '赋能']
    for (const theme of themes) {
      const themeCount = await client.fetch(
        `count(*[_type == "backgroundImage" && theme == $theme])`,
        {theme},
      )
      console.log(`   ${theme}: ${themeCount} 张`)
    }

    console.log('\n✅ 所有测试通过！')
  } catch (error) {
    console.error('\n❌ 测试失败:', error)
    process.exit(1)
  }
}

// 运行测试
testConnection()

