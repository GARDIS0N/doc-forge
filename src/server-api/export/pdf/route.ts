import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import fs from 'fs';

function findChromeExecutable(): string | null {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(/* turbopackIgnore: true */ p)) {
        return p;
      }
    } catch {
      // Continue to next path
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { html, paperSize = 'A4', docNumber = 'document', styles = {} } = body;

    if (!html) {
      return NextResponse.json({ error: 'Missing HTML content' }, { status: 400 });
    }

    const executablePath = findChromeExecutable();
    if (!executablePath) {
      return NextResponse.json(
        { error: 'Chrome / Edge executable not found for server-side PDF export' },
        { status: 500 }
      );
    }

    const isA4 = paperSize === 'A4';

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${docNumber}</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    @page {
      size: ${isA4 ? 'A4 portrait' : 'letter portrait'};
      margin: 0;
    }

    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      color: #0f172a;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    .doc-paper-sheet {
      border: none !important;
      box-shadow: none !important;
      margin: 0 !important;
    }
  </style>
</head>
<body data-variant="${styles?.variant || 'modern'}">
  ${html}
</body>
</html>`;

    // Launch headless Chromium / Edge
    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'load' });

    const pdfBuffer = await page.pdf({
      format: isA4 ? 'A4' : 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${docNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Server PDF Generation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
