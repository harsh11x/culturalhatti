import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/** Core routes for discovery; add product URLs via ISR or a dynamic sitemap later */
const staticPaths: MetadataRoute.Sitemap = [
  '',
  '/contact',
  '/track-order',
  '/collections',
  '/category/sarees',
  '/category/suits',
  '/category/bags',
  '/category/accessories',
  '/category/kids',
  '/policies/privacy',
  '/policies/terms',
  '/policies/shipping',
  '/policies/returns',
].map((path) => ({
  url: `${SITE_URL}${path}`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: path === '' ? 1 : path.startsWith('/category') ? 0.9 : 0.7,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return staticPaths;
}
