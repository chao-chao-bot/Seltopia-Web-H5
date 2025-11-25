import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './client'
import type { SanityDocument } from '@sanity/client'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}

const POSTS_QUERY = `*[_type == "post"]{ "imageRef": image }`

export async function loader() {
  const data = await sanityClient.fetch<SanityDocument[]>(POSTS_QUERY)
  return data
}
