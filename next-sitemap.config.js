/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://share-and-care-client.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin/*', '/private/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/private'],
      },
    ],
  },
  additionalPaths: async () => {
    const result = [];
    const response = await fetch(
      'https://shareandcareshop.onrender.com/api/v1/products/public?page=1&size=1000'
    );
    const products = await response.json();

    products.metadata.items.forEach((product) => {
      result.push({
        loc: `/product/${product.code}`,
        changefreq: 'daily',
        priority: 0.8,
      });
    });
    return result;
  },
};
export default config;
