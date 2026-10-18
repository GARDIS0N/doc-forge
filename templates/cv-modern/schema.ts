import { TemplateSchema } from '@/lib/types';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'personal_info',
      title: 'Personal Information',
      description: 'Your contact details and executive title',
      fields: [
        {
          name: 'fullName',
          label: 'Full Name',
          type: 'text',
          required: true,
          default: 'David Kimani Mwangi',
        },
        {
          name: 'title',
          label: 'Professional Headline',
          type: 'text',
          required: true,
          default: 'Lead Full-Stack & Cloud Solutions Architect',
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          default: 'david.mwangi@techkenya.io',
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'phone',
          default: '+254 722 890 123',
        },
        {
          name: 'location',
          label: 'Location',
          type: 'text',
          default: 'Nairobi, Kenya',
        },
        {
          name: 'website',
          label: 'Portfolio / GitHub / LinkedIn',
          type: 'text',
          default: 'github.com/davidmwangi • linkedin.com/in/david-mwangi',
        },
        {
          name: 'summary',
          label: 'Executive Summary',
          type: 'textarea',
          default: 'Versatile Full-Stack Systems Architect with 8+ years leading cross-functional engineering teams across East Africa. Specializing in high-throughput distributed systems, Next.js web applications, and fintech payment rails (M-Pesa Daraja & Pesalink). Proven record scaling cloud infrastructure to 1.5M+ active users.',
        },
      ],
    },
    {
      id: 'skills_section',
      title: 'Skills & Competencies',
      description: 'Technical proficiencies, frameworks, and tools',
      fields: [
        {
          name: 'skills.languages',
          label: 'Core Languages & Frameworks',
          type: 'text',
          default: 'TypeScript, Next.js, React, Node.js, Python, Go, PostgreSQL',
        },
        {
          name: 'skills.cloud',
          label: 'Cloud & Infrastructure',
          type: 'text',
          default: 'AWS (ECS, Lambda, RDS), Docker, Kubernetes, Terraform, Supabase',
        },
        {
          name: 'skills.fintech',
          label: 'Domain & Integrations',
          type: 'text',
          default: 'M-Pesa Daraja API, KRA eTIMS, Stripe, REST & GraphQL APIs, CI/CD',
        },
      ],
    },
    {
      id: 'experience_section',
      title: 'Work Experience',
      description: 'Career history and tangible accomplishments',
      fields: [
        {
          name: 'experience',
          label: 'Work Experience',
          type: 'repeater',
          addLabel: '+ Add Role',
          fields: [
            {
              name: 'role',
              label: 'Job Title / Role',
              type: 'text',
              required: true,
            },
            {
              name: 'company',
              label: 'Company & Location',
              type: 'text',
              required: true,
            },
            {
              name: 'period',
              label: 'Duration / Period',
              type: 'text',
              placeholder: 'e.g. 2023 - Present',
            },
            {
              name: 'highlights',
              label: 'Key Achievements (One per line or paragraph)',
              type: 'textarea',
            },
          ],
        },
      ],
    },
    {
      id: 'education_section',
      title: 'Education & Certifications',
      description: 'Degrees, diplomas, and industry certifications',
      fields: [
        {
          name: 'education',
          label: 'Education',
          type: 'repeater',
          addLabel: '+ Add Education',
          fields: [
            {
              name: 'degree',
              label: 'Degree / Certificate',
              type: 'text',
              required: true,
            },
            {
              name: 'institution',
              label: 'Institution',
              type: 'text',
              required: true,
            },
            {
              name: 'year',
              label: 'Graduation Year / Period',
              type: 'text',
            },
            {
              name: 'details',
              label: 'Grade / Honors / Key Focus',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
};

export default schema;
