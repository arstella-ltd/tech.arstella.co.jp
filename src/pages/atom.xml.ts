import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => {
    return !data.draft && data.pubDate <= new Date();
  });

  const site = context.site!;
  const feedUrl = new URL('atom.xml', site);
  const siteUrl = new URL('', site);

  // Sort posts by date
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  // Create Atom feed XML
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${SITE_TITLE}</title>
  <subtitle>${SITE_DESCRIPTION}</subtitle>
  <link href="${feedUrl.href}" rel="self" type="application/atom+xml"/>
  <link href="${siteUrl.href}" rel="alternate" type="text/html"/>
  <id>${siteUrl.href}</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>Arstella Ltd.</name>
    <uri>${siteUrl.href}</uri>
  </author>
  ${sortedPosts.map(post => {
    const postUrl = new URL(`blog/${post.slug}/`, site);
    return `
  <entry>
    <title>${escapeXml(post.data.title)}</title>
    <link href="${postUrl.href}" rel="alternate" type="text/html"/>
    <id>${postUrl.href}</id>
    <published>${post.data.pubDate.toISOString()}</published>
    <updated>${post.data.pubDate.toISOString()}</updated>
    <summary>${escapeXml(post.data.description)}</summary>
    <author>
      <name>${post.data.author || 'Arstella Team'}</name>
    </author>
    ${post.data.category ? `<category term="${escapeXml(post.data.category)}"/>` : ''}
    ${post.data.tags.map(tag => `<category term="${escapeXml(tag)}"/>`).join('')}
  </entry>`;
  }).join('')}
</feed>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}