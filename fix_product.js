const fs = require('fs');
const file = 'src/app/producto/[slug]/page.tsx';
let txt = fs.readFileSync(file, 'utf8');

const replacement = `const SUPABASE_URL = "https://guppnkrbifvmgrvzejyp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1cHBua3JiaWZ2bWdydnplanlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODMzMjMsImV4cCI6MjA4OTk1OTMyM30.fXiAwfAyS1thLYHEZr_t2sd6iqrdN42ksk7Vq5u3B3I";

// API para buscar Data del producto directo de Supabase REST
async function getProduct(slug: string) {
  const res = await fetch(\`\${SUPABASE_URL}/rest/v1/Producto?or=(id.eq.\${slug},slug.eq.\${slug})\`, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": \`Bearer \${SUPABASE_ANON_KEY}\`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    cache: 'no-store'
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || !data.length) return null;
  const p = data[0];
  if (p.oculto) return null;
  return {...p, talles: JSON.parse(p.talles||"[]"), colores: JSON.parse(p.colores||"[]"), fotos: JSON.parse(p.fotos||"[]"), stock_por_talle: JSON.parse(p.stock_por_talle||"{}")};
}`;

txt = txt.replace(/\/\/ API para buscar Data del producto[\s\S]*?return res\.json\(\);\n\}/, replacement);
fs.writeFileSync(file, txt);
