const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function testConnection(url) {
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    await prisma.producto.findFirst();
    fs.appendFileSync('results_pooler.txt', `[SUCCESS] ${url}\n`);
    console.log(`SUCCESS for: ${url}`);
  } catch (err) {
    fs.appendFileSync('results_pooler.txt', `[ERROR] ${url}: ${err.message.split('\\n')[0]}\n`);
    console.log(`ERROR for ${url}: ${err.message.split('\\n')[0]}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  fs.writeFileSync('results_pooler.txt', ''); // clear
  
  const regions = [
    'aws-0-sa-east-1',
    'aws-1-sa-east-1',
    'aws-2-sa-east-1',
    'gcp-0-sa-east-1'
  ];

  for (const host of regions) {
    const url = `postgresql://postgres.guppnkrbifvmgrvzejyp:ElGranTumi123456789@${host}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
    console.log(`Testing ${host}...`);
    await testConnection(url);
  }
}

run();
