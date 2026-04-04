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
    'ai-travel-planning-guide',
    'digital-nomads-2026',
    'istanbul-local-tips',
    'mykonos-experience',
    'thailand-travel-guide-2026',
    'bali-complete-guide',
    'morocco-7-day-itinerary',
    'budget-travel-europe-2026',
    'hidden-gems-japan',
    'solo-female-travel-tips',
    'southeast-asia-budget-guide',
    'dubai-travel-guide',
    'greece-island-hopping',
  ]

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}
