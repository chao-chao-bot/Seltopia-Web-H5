import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'gkqg8l0c',
  dataset: 'production',
  apiVersion: '2025-11-25',
  useCdn: false,
})
