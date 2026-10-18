import { TemplateSchema } from '@/lib/types';
import { calculateInvoice } from '@/lib/calc';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'po_details',
      title: 'Order Identification',
      fields: [
        { name: 'docNumber', label: 'PO / LPO Number', type: 'text', required: true, default: 'PO-2026-0312' },
        { name: 'date', label: 'Order Date', type: 'date', required: true, default: '2026-10-18' },
        { name: 'deliveryDate', label: 'Required Delivery Date', type: 'date', required: true, default: '2026-10-28' },
        { name: 'shippingMethod', label: 'Shipping / Dispatch Method', type: 'text', default: 'Direct Courier Delivery to Site' },
      ],
    },
    {
      id: 'parties',
      title: 'Buyer & Vendor',
      fields: [
        { name: 'sender.businessName', label: 'Buyer (Ordering Company)', type: 'text', required: true, default: 'Apex Digital Solutions Ltd' },
        { name: 'sender.address', label: 'Delivery Address (Ship To)', type: 'textarea', default: 'Apex Warehouse & Labs, Enterprise Rd, Industrial Area, Nairobi, Kenya' },
        { name: 'vendor.name', label: 'Vendor / Supplier Name', type: 'text', required: true, default: 'Silicon Savannah Hardware Distributors Ltd' },
        { name: 'vendor.email', label: 'Vendor Email', type: 'email', default: 'orders@siliconsavannah.co.ke' },
        { name: 'vendor.phone', label: 'Vendor Phone', type: 'phone', default: '+254 720 111 222' },
      ],
    },
    {
      id: 'items_section',
      title: 'Ordered Products & Parts',
      fields: [
        {
          name: 'items',
          label: 'Order Line Items',
          type: 'repeater',
          addLabel: '+ Add Ordered Item',
          fields: [
            { name: 'description', label: 'Item & Model Code', type: 'text', required: true },
            { name: 'qty', label: 'Quantity', type: 'number', default: 1 },
            { name: 'unitPrice', label: 'Unit Cost', type: 'currency', default: 0 },
          ],
        },
      ],
    },
    {
      id: 'payment_terms',
      title: 'Payment & Authorization',
      fields: [
        { name: 'applyVat', label: 'Include 16% VAT', type: 'switch', default: true },
        { name: 'terms', label: 'Purchase Terms', type: 'textarea', default: 'Invoice must quote PO-2026-0312. Payment terms 30 days from delivery and inspection receipt.' },
        { name: 'authorizedBy', label: 'Authorized Officer Name', type: 'text', default: 'Erick Mutua (Procurement Lead)' },
      ],
    },
  ],
  computed: (data) => calculateInvoice({
    items: data.items,
    applyVat: data.applyVat,
    vatRate: 16,
    currency: data.currency,
  }),
};

export default schema;
