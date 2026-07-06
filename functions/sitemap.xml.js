/**
 * Cloudflare Pages Function: /sitemap.xml
 * Dynamically generates an SEO sitemap for Riders Gear Nairobi
 * by querying the Firestore REST API for all products.
 */
export async function onRequest(context) {
  const BASE_URL = 'https://riders-gear-nairobi.pages.dev';
  const FIRESTORE_PROJECT_ID = 'riders-gear';

  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/products`;
    const response = await fetch(firestoreUrl);

    if (!response.ok) {
      throw new Error(`Firestore fetch failed: ${response.status}`);
    }

    const data = await response.json();
    const today = new Date().toISOString().split('T')[0];

    const products = (data.documents || []).map(doc => {
      const id = doc.name.split('/').pop();
      const fields = doc.fields || {};
      const category = fields.category?.stringValue || null;
      return { id, category };
    });

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Business Page -->
  <url>
    <loc>${BASE_URL}/business</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

    // Append dynamic category URLs
    categories.forEach(cat => {
      const encodedCat = encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'));
      xml += `  <!-- Category: ${cat} -->
  <url>
    <loc>${BASE_URL}/?category=${encodedCat}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Append dynamic product URLs
    products.forEach(({ id }) => {
      xml += `  <url>
    <loc>${BASE_URL}/product/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    });

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Sitemap generation error:', err);

    // Fallback minimal sitemap on error
    const today = new Date().toISOString().split('T')[0];
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://riders-gear-nairobi.pages.dev/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://riders-gear-nairobi.pages.dev/business</loc>
    <lastmod>${today}</lastmod>
    <priority>0.7</priority>
  </url>
</urlset>`;

    return new Response(fallback, {
      headers: { 'Content-Type': 'application/xml; charset=UTF-8' },
    });
  }
}
