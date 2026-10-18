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

export async function generateDocxBlob(slug: string, data: any = {}, styles: any = {}): Promise<Blob> {
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
      ],
      spacing: { after: 60 },
    })
  );

  if (data.issueDate || data.date) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Date: `, bold: true }),
          new TextRun({ text: formatDate(data.issueDate || data.date, 'long') }),
        ],
        spacing: { after: 120 },
      })
    );
  }

  // 3. Parties (Client / Recipient)
  const client = data.client || data.recipient || data.tenant || data.vendor || {};
  if (client.businessName || client.name) {
    children.push(
      new Paragraph({
        text: 'Prepared For:',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 60 },
      })
    );
    children.push(
      new Paragraph({
        text: client.businessName || client.name,
        spacing: { after: 40 },
      })
    );
    if (client.address) {
      children.push(
        new Paragraph({
          text: client.address,
          spacing: { after: 40 },
        })
      );
    }
  }

  // 4. Line Items Table (if applicable)
  const items = data.items || data.deliverables || [];
  if (Array.isArray(items) && items.length > 0) {
    children.push(
      new Paragraph({
        text: 'Items / Services Breakdown',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
      })
    );

    const tableRows: TableRow[] = [];

    // Header row
    tableRows.push(
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true })] })],
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: 'Qty', bold: true })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: 'Unit Price', bold: true })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: 'Amount', bold: true })],
              }),
            ],
          }),
        ],
      })
    );

    // Data rows
    items.forEach((item: any) => {
      const qty = Number(item.qty) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      const amount = item.amount !== undefined ? Number(item.amount) : qty * unitPrice;

      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: item.description || '' })],
            }),
            new TableCell({
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, text: String(qty) })],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  text: formatCurrency(unitPrice, currency),
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  text: formatCurrency(amount, currency),
                }),
              ],
            }),
          ],
        })
      );
    });

    children.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );

    // Financial Totals
    const calcs = calculateInvoice(data);
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Subtotal: `, bold: true }),
          new TextRun({ text: formatCurrency(calcs.subtotal, currency) }),
        ],
        alignment: AlignmentType.RIGHT,
        spacing: { before: 160, after: 40 },
      })
    );

    if (calcs.vatAmount > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `VAT (${calcs.vatRate}%): `, bold: true }),
            new TextRun({ text: formatCurrency(calcs.vatAmount, currency) }),
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 40 },
        })
      );
    }

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Total: `, bold: true, size: 28 }),
          new TextRun({ text: formatCurrency(calcs.grandTotal, currency), bold: true, size: 28 }),
        ],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 120 },
      })
    );

    if (calcs.totalInWords) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Amount in words: `, italics: true }),
            new TextRun({ text: calcs.totalInWords, bold: true }),
          ],
          spacing: { after: 120 },
        })
      );
    }
  }

  // 5. Notes / Terms
  if (data.notes || data.paymentTerms || data.bankDetails) {
    children.push(
      new Paragraph({
        text: 'Notes & Payment Information',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 240, after: 60 },
      })
    );

    if (data.notes) {
      children.push(new Paragraph({ text: data.notes, spacing: { after: 60 } }));
    }
    if (data.paymentTerms) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Terms: ', bold: true }),
            new TextRun({ text: data.paymentTerms }),
          ],
          spacing: { after: 60 },
        })
      );
    }
    if (data.bankDetails) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Bank Details: ', bold: true }),
            new TextRun({ text: data.bankDetails }),
          ],
          spacing: { after: 60 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
