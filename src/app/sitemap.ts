import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rovago.app'

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/blog',
    '/pricing',
    '/contact',
    '/terms',
    '/privacy',
    '/cookies',
    '/create',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Blog posts (Hardcoded since we use a static Record in blog page)
  const blogSlugs = [
    'the-hidden-cafes-of-balat',
    'surviving-tokyo-rush-hour',
    'ultimate-guide-to-bali-digital-nomads',
    'secret-beaches-of-thailand',
  ]

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}
