import type { MetadataRoute } from 'next'

const baseUrl = 'https://www.josiahhawkins.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: baseUrl,
      lastModified: now,
    },
    {
      url: `${baseUrl}/spa-switch`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/spa-switch/how-much-dichlor-to-add-to-hot-tub`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/spa-switch/liquid-chlorine-hot-tub-dose-calculator`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/spa-switch/hot-tub-cya-switch-point`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/spa-switch/hot-tub-ph-alkalinity-tracker`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/spa-switch/support`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/spa-switch/privacy`,
      lastModified: now,
    },
  ]
}
