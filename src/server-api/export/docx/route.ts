import { NextRequest, NextResponse } from 'next/server';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
} from 'docx';
import { formatCurrency, formatDate } from '@/lib/format';
import { calculateInvoice } from '@/lib/calc';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, data = {}, styles = {} } = body;

    const docNumber = data.docNumber || slug || 'document';
    const currency = data.currency || styles.currency || 'KES';

    const children: any[] = [];

    // 1. Document Header
    const sender = data.sender || {};
    const businessName = sender.businessName || data.fullName || 'DocForge Document';

    children.push(
      new Paragraph({
        text: businessName,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 120 },
      })
    );

    if (sender.tagline || data.title) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: sender.tagline || data.title,
              italics: true,
              color: '64748B',
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }

    // 2. Document Number & Date Info
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Document Number: `, bold: true }),
          new TextRun({ text: docNumber }),
          new TextRun({ text: `   |   Date: `, bold: true }),
          new TextRun({ text: formatDate(data.issueDate || data.date || new Date()) }),
        ],
        spacing: { after: 300 },
      })
    );

    // 3. Client / Recipient Details
    if (data.client?.name || data.recipient?.name) {
      const recipientName = data.client?.name || data.recipient?.name;
      children.push(
        new Paragraph({
          text: 'RECIPIENT / BILLED TO:',
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: recipientName, bold: true }),
            data.client?.email ? new TextRun({ text: `\n${data.client.email}` }) : new TextRun({ text: '' }),
            data.client?.address ? new TextRun({ text: `\n${data.client.address}` }) : new TextRun({ text: '' }),
          ],
          spacing: { after: 300 },
        })
      );
    }

    // 4. Line Items Table (if invoice or tabular template)
    if (Array.isArray(data.items) && data.items.length > 0) {
      const calc = calculateInvoice({
        items: data.items,
        applyVat: data.applyVat,
        vatRate: data.vatRate,
        amountPaid: data.amountPaid,
        currency,
      });

      const tableRows: TableRow[] = [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true })] })],
            }),
            new TableCell({
              width: { size: 15, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Qty', bold: true })] })],
            }),
            new TableCell({
              width: { size: 15, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Unit Price', bold: true })] })],
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Amount', bold: true })] })],
            }),
          ],
        }),
      ];

      calc.itemsWithTotals.forEach((item) => {
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph(item.description || '')],
              }),
              new TableCell({
                children: [new Paragraph({ alignment: AlignmentType.CENTER, text: String(item.qty || 1) })],
              }),
              new TableCell({
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, text: formatCurrency(item.unitPrice, currency) })],
              }),
              new TableCell({
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, text: formatCurrency(item.amount, currency) })],
              }),
            ],
          })
        );
      });

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows,
        }),
        new Paragraph({ spacing: { after: 200 } }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: `Subtotal: ${formatCurrency(calc.subtotal, currency)}\n` }),
            calc.vatAmount > 0 ? new TextRun({ text: `VAT (${calc.vatRate}%): ${formatCurrency(calc.vatAmount, currency)}\n` }) : new TextRun({ text: '' }),
            new TextRun({ text: `Grand Total: ${formatCurrency(calc.grandTotal, currency)}\n`, bold: true }),
            calc.amountPaid > 0 ? new TextRun({ text: `Balance Due: ${formatCurrency(calc.balanceDue, currency)}`, bold: true, color: '1D4ED8' }) : new TextRun({ text: '' }),
          ],
          spacing: { after: 300 },
        })
      );
    }

    // 5. Executive Profile / Notes
    if (data.summary) {
      children.push(
        new Paragraph({
          text: 'EXECUTIVE PROFILE',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: data.summary,
          spacing: { after: 250 },
        })
      );
    }

    // 6. Terms & Footer Note
    if (data.terms || data.footerNote) {
      children.push(
        new Paragraph({
          children: [
            data.terms ? new TextRun({ text: `Terms & Conditions: ${data.terms}\n`, italics: true }) : new TextRun({ text: '' }),
            data.footerNote ? new TextRun({ text: data.footerNote, italics: true, color: '64748B' }) : new TextRun({ text: '' }),
          ],
          spacing: { before: 300 },
        })
      );
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${docNumber}.docx"`,
      },
    });
  } catch (error: any) {
    console.error('DOCX Generation Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to export DOCX' },
      { status: 500 }
    );
  }
}
