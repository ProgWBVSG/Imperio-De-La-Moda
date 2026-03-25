const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function testConnection(url) {
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    await prisma.producto.findFirst();
    fs.appendFileSync('results.txt', `[SUCCESS] ${url}\n`);
    console.log(`SUCCESS for: ${url}`);
  } catch (err) {
    fs.appendFileSync('results.txt', `[ERROR] ${url}: ${err.message.split('\\n')[0]}\n`);
    console.error(`ERROR for ${url}: ${err.message.split('\\n')[0]}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  fs.writeFileSync('results.txt', ''); // clear
  const urls = [
    // Trying the db domain without .[ref] suffix
    'postgresql://postgres:ElGranTumi123456789@db.guppnkrbifvmgrvzejyp.supabase.co:6543/postgres?pgbouncer=true',
    // Trying the AWS pooler with different regions just in case it's deployed in another pooler
    'postgresql://postgres.guppnkrbifvmgrvzejyp:ElGranTumi123456789@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
    'postgresql://postgres:ElGranTumi123456789@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
    // What if the user is default?
    'postgresql://postgres.guppnkrbifvmgrvzejyp:ElGranTumi123456789@aws-0-sa-east-1.pooler.supabase.com:6543/postgres',
    // Try without pgbouncer (Direct but through 6543)
    'postgresql://postgres:ElGranTumi123456789@aws-0-sa-east-1.pooler.supabase.com:5432/postgres'
  ];

  for (const [index, url] of urls.entries()) {
    console.log(`Testing URL ${index + 1}/${urls.length}...`);
    await testConnection(url);
  }
}

run();
