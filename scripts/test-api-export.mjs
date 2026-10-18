import fs from 'fs';

async function testExportEndpoint() {
  console.log('Sending POST to http://localhost:3000/api/export/pdf ...');

  const response = await fetch('http://localhost:3000/api/export/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'invoice',
      html: '<div style="padding: 40px;"><h1>DocForge Live Invoice Export</h1><p>Kenyan Tax Invoice Test</p></div>',
      paperSize: 'A4',
      docNumber: 'INV-2026-0042',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Export failed with HTTP ${response.status}:`, errorText);
    process.exit(1);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log(`✓ Received PDF response! Size: ${buffer.length} bytes`);
  console.log(`✓ PDF Header: ${buffer.subarray(0, 4).toString('ascii')}`);

  fs.writeFileSync('test-api-export.pdf', buffer);
  console.log('✓ Successfully saved test-api-export.pdf to disk');
}

testExportEndpoint().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
