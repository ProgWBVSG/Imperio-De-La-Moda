import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/carrito'],
      },
    ],
    sitemap: 'https://imperiolamoda.com.ar/sitemap.xml',
  };
}
