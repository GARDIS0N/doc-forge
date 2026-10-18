import { TemplateSchema } from '@/lib/types';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'dispatch_info',
      title: 'Dispatch & Delivery Data',
      fields: [
        { name: 'docNumber', label: 'Delivery Note #', type: 'text', required: true, default: 'DN-2026-0544' },
        { name: 'date', label: 'Delivery Date', type: 'date', required: true, default: '2026-10-18' },
        { name: 'orderRef', label: 'Order / LPO Reference #', type: 'text', default: 'PO-2026-0312' },
        { name: 'vehicleReg', label: 'Vehicle Reg / Driver Details', type: 'text', default: 'KBZ 892M (Driver: James Kiprono)' },
      ],
    },
    {
      id: 'parties',
      title: 'Dispatcher & Consignee (Recipient)',
      fields: [
        { name: 'sender.businessName', label: 'Dispatching Company', type: 'text', required: true, default: 'Apex Digital Solutions & Logistics Ltd' },
        { name: 'sender.address', label: 'Origin Address', type: 'textarea', default: 'Enterprise Rd, Industrial Area, Nairobi' },
        { name: 'recipient.name', label: 'Consignee / Received By Company', type: 'text', required: true, default: 'Savannah Port Operations Center' },
        { name: 'recipient.address', label: 'Destination Address', type: 'textarea', default: 'Moi Avenue, Dockside Warehouse 4, Mombasa, Kenya' },
      ],
    },
    {
      id: 'items_section',
      title: 'Dispatched Goods & Quantities',
      fields: [
        {
          name: 'items',
          label: 'Packages & Goods',
          type: 'repeater',
          addLabel: '+ Add Dispatched Item',
          fields: [
            { name: 'description', label: 'Item Description & Serial / Batch #', type: 'text', required: true },
            { name: 'orderedQty', label: 'Ordered Qty', type: 'number', default: 1 },
            { name: 'deliveredQty', label: 'Delivered Qty', type: 'number', default: 1 },
            { name: 'remarks', label: 'Condition / Packaging', type: 'text', default: 'Sealed Carton / Good Condition' },
          ],
        },
      ],
    },
    {
      id: 'acknowledgement',
      title: 'Recipient Endorsement',
      fields: [
        { name: 'declaration', label: 'Delivery Declaration', type: 'textarea', default: 'Received the above goods in sound condition, undamaged, and complete according to the specifications.' },
        { name: 'receivedByPerson', label: 'Receiver Full Name & ID #', type: 'text', default: 'George Otieno (Stores Officer — ID: 28491024)' },
      ],
    },
  ],
};

export default schema;
