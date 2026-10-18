import { TemplateSchema } from '@/lib/types';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'meeting_info',
      title: 'Meeting Identification',
      fields: [
        { name: 'docNumber', label: 'Minutes Ref #', type: 'text', default: 'MIN-2026-Q4-01' },
        { name: 'meetingTitle', label: 'Meeting Title / Subject', type: 'text', required: true, default: 'Q4 Strategy & Executive Engineering Board Meeting' },
        { name: 'date', label: 'Date of Meeting', type: 'date', required: true, default: '2026-10-18' },
        { name: 'timeLocation', label: 'Time & Venue', type: 'text', default: '10:00 AM – 1:00 PM • Boardroom 1, Nairobi HQ & Zoom Hybrid' },
        { name: 'chairperson', label: 'Meeting Chairperson', type: 'text', default: 'Ambassador James Karanja (Board Chair)' },
        { name: 'secretary', label: 'Minutes Secretary / Recorder', type: 'text', default: 'Faith Wangari (Corporate Secretary)' },
      ],
    },
    {
      id: 'attendance',
      title: 'Attendance & Apologies',
      fields: [
        { name: 'attendees', label: 'Members Present (Comma-separated)', type: 'textarea', default: 'James Karanja (Chair), David Mwangi (Tech Lead), Mercy Achieng (Finance), Erick Mutua (Procurement), Kevin Omondi (Sales)' },
        { name: 'apologies', label: 'Apologies with Leave', type: 'text', default: 'Dr. Samuel Kiptoo (Operations) — Traveling on official assignment' },
      ],
    },
    {
      id: 'agenda_discussions',
      title: 'Agenda & Deliberations',
      fields: [
        { name: 'agendaSummary', label: 'Agenda Overview', type: 'textarea', default: '1. Adoption of Previous Minutes\n2. Q4 Infrastructure Cloud Migration & Budget Review\n3. M-Pesa Payment Rail Redundancy Setup\n4. A.O.B and Next Meeting Date' },
        { name: 'deliberations', label: 'Summary of Discussions & Resolutions', type: 'textarea', default: 'MIN 01/Q4: The minutes of the previous meeting were adopted as a true record, proposed by Mercy Achieng and seconded by Kevin Omondi.\n\nMIN 02/Q4: David Mwangi presented the cloud infrastructure migration plan. The Board unanimously approved the capital allocation of KES 2.5M for the AWS & Supabase distributed environment.\n\nMIN 03/Q4: Approved the second-tier failover gateway with Safaricom Daraja C2B to maintain 99.99% uptime.' },
      ],
    },
    {
      id: 'action_items',
      title: 'Action Items Tracker',
      fields: [
        {
          name: 'actions',
          label: 'Action Tracker Matrix',
          type: 'repeater',
          addLabel: '+ Add Action Item',
          fields: [
            { name: 'action', label: 'Action Item / Task', type: 'text', required: true },
            { name: 'owner', label: 'Person Responsible (Owner)', type: 'text', required: true },
            { name: 'deadline', label: 'Deadline', type: 'text', default: '31 Oct 2026' },
            { name: 'status', label: 'Status', type: 'text', default: 'In Progress' },
          ],
        },
      ],
    },
  ],
};

export default schema;
