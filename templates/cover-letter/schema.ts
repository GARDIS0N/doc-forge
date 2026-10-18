import { TemplateSchema } from '@/lib/types';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'personal_info',
      title: 'Applicant Information',
      fields: [
        { name: 'fullName', label: 'Full Legal Name', type: 'text', required: true, default: 'David Kimani Mwangi' },
        { name: 'title', label: 'Professional Title', type: 'text', default: 'Lead Full-Stack & Cloud Solutions Architect' },
        { name: 'email', label: 'Email Address', type: 'email', required: true, default: 'david.mwangi@techkenya.io' },
        { name: 'phone', label: 'Phone Number', type: 'phone', default: '+254 722 890 123' },
        { name: 'location', label: 'City & Country', type: 'text', default: 'Nairobi, Kenya' },
        { name: 'date', label: 'Date', type: 'date', default: '2026-10-18' },
      ],
    },
    {
      id: 'recipient_info',
      title: 'Hiring Organization & Manager',
      fields: [
        { name: 'hiringManager', label: 'Hiring Manager Name / Title', type: 'text', default: 'Head of Engineering Talent' },
        { name: 'companyName', label: 'Company / Organization Name', type: 'text', required: true, default: 'Safaricom PLC Digital Innovation Labs' },
        { name: 'companyAddress', label: 'Company Address', type: 'textarea', default: 'Safaricom HQ, HQ2 Building, Waiyaki Way, Nairobi' },
      ],
    },
    {
      id: 'letter_content',
      title: 'Letter Body',
      fields: [
        { name: 'jobTitle', label: 'Target Job Position', type: 'text', required: true, default: 'Principal Cloud & Fintech Architect (Requisition #ENG-904)' },
        { name: 'salutation', label: 'Salutation', type: 'text', default: 'Dear Hiring Committee,' },
        { name: 'body', label: 'Cover Letter Body Text', type: 'textarea', required: true, default: 'I am writing to express my enthusiastic interest in the Principal Cloud & Fintech Architect role at Safaricom PLC.\n\nWith over 8 years architecting high-throughput distributed architectures, microservices, and automated payment gateways across East Africa, I have consistently aligned technical infrastructure with high-growth business objectives. Most recently at Kopo Kopo, I led the core payment gateway redesign that reduced STK push API latencies from 450ms to 95ms during peak holiday transaction volumes.\n\nSafaricom’s ongoing expansion into regional digital banking and AI-powered customer interfaces demands scalable, secure, and resilient cloud architectures. My extensive background with AWS ECS Fargate, Next.js web applications, and direct M-Pesa Daraja payment rails positions me to deliver immediate value to your engineering pods from day one.\n\nThank you for your consideration. I look forward to discussing how my engineering leadership can accelerate your digital roadmap.' },
      ],
    },
  ],
};

export default schema;
