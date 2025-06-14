import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

// URL list
const links = [
  { url: '/', changefreq: 'monthly', priority: 1.0 },
  { url: '/shop', changefreq: 'monthly', priority: 0.8 },
  { url: '/product', changefreq: 'monthly', priority: 0.8 },
  { url: '/blog', changefreq: 'monthly', priority: 1 },
];

// Create a stream to write to
const stream = new SitemapStream({
  hostname: 'https://share-and-care-client.vercel.app/',
});

// Pipe your entries or directly write them
streamToPromise(Readable.from(links).pipe(stream)).then((data) => {
  createWriteStream('public/sitemap.xml').write(data.toString());
});