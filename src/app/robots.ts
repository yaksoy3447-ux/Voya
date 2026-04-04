import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/plan', '/profile', '/settings'],
    },
    sitemap: 'https://rovago.app/sitemap.xml',
  }
}
