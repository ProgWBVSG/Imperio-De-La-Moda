const fs = require('fs');
const path = require('path');

const base = 'c:/Users/benja/Propuesta Imperio de la moda';

// Pattern to match hardcoded supabase block
const hardcodedPattern = /const SUPABASE_URL = "[^"]+";\s*\nconst SUPABASE_ANON_KEY = "[^"]+";\s*\n\s*\nconst getHeaders = \(\) => \(\{[\s\S]*?\}\);\s*\n/;

// Admin files - need auth + centralized supabase
const adminFiles = [
  'src/app/api/admin/productos/[id]/route.ts',
  'src/app/api/admin/promos/route.ts',
  'src/app/api/admin/promos/[id]/route.ts',
  'src/app/api/admin/testimonios/route.ts',
  'src/app/api/admin/testimonios/[id]/route.ts',
  'src/app/api/admin/stats/route.ts',
];

// Public files - only centralized supabase
const publicFiles = [
  'src/app/api/productos/route.ts',
  'src/app/api/productos/[id]/route.ts',
  'src/app/api/promos/route.ts',
  'src/app/api/testimonios/route.ts',
];

let count = 0;

adminFiles.forEach(f => {
  const fp = path.join(base, f);
  if (!fs.existsSync(fp)) { console.log('SKIP: ' + f); return; }
  let content = fs.readFileSync(fp, 'utf-8');
  
  // Remove hardcoded block
  content = content.replace(hardcodedPattern, '');
  
  // Add imports if missing
  if (!content.includes('@/lib/supabase')) {
    content = 'import { SUPABASE_URL, getSupabaseHeaders } from "@/lib/supabase";\n' + content;
  }
  if (!content.includes('@/lib/auth')) {
    content = 'import { requireAdmin } from "@/lib/auth";\n' + content;
  }
  
  // Replace getHeaders() with getSupabaseHeaders()
  content = content.replace(/getHeaders\(\)/g, 'getSupabaseHeaders()');
  
  // Add auth check to each handler
  ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach(method => {
    const re = new RegExp('(export async function ' + method + '\\([^)]*\\)\\s*\\{)\\n(?!\\s*const authError)');
    if (re.test(content)) {
      content = content.replace(re, '$1\n  const authError = await requireAdmin();\n  if (authError) return authError;\n');
    }
  });
  
  fs.writeFileSync(fp, content, 'utf-8');
  count++;
  console.log('ADMIN OK: ' + f);
});

publicFiles.forEach(f => {
  const fp = path.join(base, f);
  if (!fs.existsSync(fp)) { console.log('SKIP: ' + f); return; }
  let content = fs.readFileSync(fp, 'utf-8');
  
  // Remove hardcoded block
  content = content.replace(hardcodedPattern, '');
  
  // Add import if missing
  if (!content.includes('@/lib/supabase')) {
    content = 'import { SUPABASE_URL, getSupabaseHeaders } from "@/lib/supabase";\n' + content;
  }
  
  // Replace getHeaders() with getSupabaseHeaders()
  content = content.replace(/getHeaders\(\)/g, 'getSupabaseHeaders()');
  
  fs.writeFileSync(fp, content, 'utf-8');
  count++;
  console.log('PUBLIC OK: ' + f);
});

// Fix sitemap.ts
const sitemapPath = path.join(base, 'src/app/sitemap.ts');
if (fs.existsSync(sitemapPath)) {
  let content = fs.readFileSync(sitemapPath, 'utf-8');
  const sitemapHardcoded = /const SUPABASE_URL = "[^"]+";\s*\nconst SUPABASE_ANON_KEY = "[^"]+";\s*\n/;
  content = content.replace(sitemapHardcoded, '');
  if (!content.includes('@/lib/supabase')) {
    content = 'import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";\n' + content;
  }
  fs.writeFileSync(sitemapPath, content, 'utf-8');
  count++;
  console.log('SITEMAP OK');
}

// Fix producto/[slug]/page.tsx
const productPath = path.join(base, 'src/app/producto/[slug]/page.tsx');
if (fs.existsSync(productPath)) {
  let content = fs.readFileSync(productPath, 'utf-8');
  const productHardcoded = /const SUPABASE_URL = "[^"]+";\s*\nconst SUPABASE_ANON_KEY = "[^"]+";\s*\n/;
  content = content.replace(productHardcoded, '');
  if (!content.includes('@/lib/supabase')) {
    content = 'import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";\n' + content;
  }
  fs.writeFileSync(productPath, content, 'utf-8');
  count++;
  console.log('PRODUCT OK');
}

// Also fix admin/productos/route.ts (already partially done, just fix getHeaders)
const adminProdPath = path.join(base, 'src/app/api/admin/productos/route.ts');
if (fs.existsSync(adminProdPath)) {
  let content = fs.readFileSync(adminProdPath, 'utf-8');
  content = content.replace(/getHeaders\(\)/g, 'getSupabaseHeaders()');
  fs.writeFileSync(adminProdPath, content, 'utf-8');
  console.log('ADMIN PRODUCTOS FIX OK');
}

console.log('\nTotal files updated: ' + count);
