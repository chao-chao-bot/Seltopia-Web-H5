import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// 背景图片数据类型
export interface BackgroundImage {
  _id: string
  title: string
  theme: string
  imageNumber: number
  image: {
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
}

// 按主题分组的图片数据
export interface ThemeImages {
  [theme: string]: BackgroundImage[]
}

/**
 * 获取所有背景图片，按主题分组
 */
export async function getAllBackgroundImages(): Promise<ThemeImages> {
  const query = `*[_type == "backgroundImage"] | order(theme asc, imageNumber asc) {
    _id,
    title,
    theme,
    imageNumber,
    image
  }`

  const images = await sanityClient.fetch<BackgroundImage[]>(query)

  // 按主题分组
  const grouped: ThemeImages = {}
  images.forEach(img => {
    if (!grouped[img.theme]) {
      grouped[img.theme] = []
    }
    grouped[img.theme].push(img)
  })

  return grouped
}

/**
 * 获取指定主题的所有图片
 */
export async function getImagesByTheme(theme: string): Promise<BackgroundImage[]> {
  const query = `*[_type == "backgroundImage" && theme == $theme] | order(imageNumber asc) {
    _id,
    title,
    theme,
    imageNumber,
    image
  }`

  return await sanityClient.fetch<BackgroundImage[]>(query, { theme })
}

export async function getRandomImageByThemeAndTitle(
  theme: string,
  title: string
): Promise<BackgroundImage | null> {
  const query = `*[
    _type == "backgroundImage" &&
    theme == $theme &&
    title == $title
  ]{
    _id,
    title,
    theme,
    imageNumber,
    image
  }`

  const images = await sanityClient.fetch<BackgroundImage[]>(query, { theme, title })

  if (images.length === 0) return null

  const randomIndex = Math.floor(Math.random() * images.length)
  return images[randomIndex]
}

/**
 * 获取随机背景图片（指定主题）
 */
export async function getRandomImageByTheme(theme: string): Promise<BackgroundImage | null> {
  const images = await getImagesByTheme(theme)
  if (images.length === 0) return null

  const randomIndex = Math.floor(Math.random() * images.length)
  return images[randomIndex]
}
