import http from 'http';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

async function waitForServer(retries = 20) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/export/docx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'invoice', data: {}, docNumber: 'TEST' })
      });
      if (res.status === 200 || res.status === 400 || res.status === 500) {
        console.log('Dev server is responsive!');
        return true;
      }
    } catch (e) {
      // wait
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('Server did not become responsive');
}

async function testDocxExport(slug, sampleData, docNumber) {
  const res = await fetch(`${BASE_URL}/api/export/docx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug,
      data: sampleData,
      docNumber: docNumber || `${slug.toUpperCase()}-001`,
      styles: {
        colorTheme: 'classic-slate',
        fontPair: 'modern-sans',
        paperSize: 'A4'
      }
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DOCX Export failed for ${slug} with status ${res.status}: ${text}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // Check docx signature (PK zip archive: 50 4B 03 04)
  if (buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
    throw new Error(`Invalid DOCX binary header for ${slug}`);
  }
  console.log(`[PASS] DOCX Export for '${slug}': size = ${buffer.length} bytes`);
  return buffer.length;
}

async function testPdfExport() {
  const res = await fetch(`${BASE_URL}/api/export/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'invoice',
      html: '<div style="padding:40px;"><h1>INVOICE #INV-2026-TEST</h1><p>Client: Acme Ltd</p><p>Total: KES 150,000</p></div>',
      paperSize: 'A4',
      docNumber: 'INV-2026-TEST'
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PDF Export failed with status ${res.status}: ${text}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // Check PDF signature: %PDF (25 50 44 46)
  const header = buffer.slice(0, 4).toString('utf-8');
  if (header !== '%PDF') {
    throw new Error(`Invalid PDF header: ${header}`);
  }
  console.log(`[PASS] PDF Export: size = ${buffer.length} bytes (Valid PDF)`);
}

async function testAllTemplatesIntegrity() {
  const templatesDir = path.resolve('templates');
  const slugs = fs.readdirSync(templatesDir).filter((f) => {
    return fs.statSync(path.join(templatesDir, f)).isDirectory();
  });

  console.log(`Verifying ${slugs.length} templates on disk...`);
  for (const slug of slugs) {
    const dir = path.join(templatesDir, slug);
    const requiredFiles = ['meta.ts', 'schema.ts', 'Template.tsx', 'styles.css', 'sample-data.json'];
    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(dir, file))) {
        throw new Error(`Template ${slug} is missing required file: ${file}`);
      }
    }
    const sampleRaw = fs.readFileSync(path.join(dir, 'sample-data.json'), 'utf-8');
    const sample = JSON.parse(sampleRaw);
    if (!sample || typeof sample !== 'object') {
      throw new Error(`Template ${slug} sample-data.json is not valid JSON object`);
    }
  }
  console.log(`[PASS] All ${slugs.length} templates have complete schemas, meta, styles, sample data!`);
  return slugs;
}

async function run() {
  try {
    const slugs = await testAllTemplatesIntegrity();
    await waitForServer();

    console.log('\n--- Testing DOCX Export across representative templates ---');
    for (const testSlug of ['invoice', 'cv-modern', 'quotation', 'tenancy-agreement', 'certificate']) {
      const sample = JSON.parse(fs.readFileSync(path.resolve('templates', testSlug, 'sample-data.json'), 'utf-8'));
      await testDocxExport(testSlug, sample, `${testSlug.toUpperCase()}-VERIFY`);
    }

    console.log('\n--- Testing PDF Export via headless Chrome/Edge ---');
    await testPdfExport();

    console.log('\n==========================================');
    console.log('PHASE 4 VERIFICATION COMPLETE & PASSED!');
    console.log('==========================================\n');
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  }
}

run();
