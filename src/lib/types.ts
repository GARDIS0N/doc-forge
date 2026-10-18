export type PaperSize = 'A4' | 'Letter';
export type Density = 'compact' | 'comfortable';
export type CurrencyCode = 'KES' | 'USD' | 'EUR' | 'GBP';

export interface TemplateMeta {
  slug: string;
  name: string;
  category: 'Business' | 'Property / Legal' | 'Career / Education' | 'Other';
  description: string;
  tags: string[];
  badges?: ('Popular' | 'New')[];
  variants: {
    id: string;
    name: string;
    description?: string;
  }[];
  docNumberPrefix?: string;
  paper?: PaperSize;
  thumbnail?: string;
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'currency'
  | 'date'
  | 'email'
  | 'phone'
  | 'switch'
  | 'select'
  | 'repeater';

export interface FieldCondition {
  field: string;
  equals: any;
}

export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  default?: any;
  min?: number;
  max?: number;
  options?: { label: string; value: string }[];
  showIf?: FieldCondition;
  fields?: FieldDefinition[]; // For repeater
  addLabel?: string;
}

export interface SectionDefinition {
  id: string;
  title: string;
  description?: string;
  fields: FieldDefinition[];
}

export interface TemplateSchema {
  sections: SectionDefinition[];
  computed?: (data: Record<string, any>) => Record<string, any>;
}

export interface StyleSettings {
  variant: string;
  colorTheme?: string;
  fontPair?: string;
  density: Density;
  paperSize: PaperSize;
  marginSize: 'compact' | 'normal' | 'spacious';
  currency: CurrencyCode;
}

export interface BrandKit {
  businessName: string;
  tagline?: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  kraPin?: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch?: string;
    swiftCode?: string;
  };
  mpesaDetails?: {
    type: 'Paybill' | 'Buy Goods' | 'Send Money';
    businessNumber: string;
    accountNumber?: string;
  };
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
}

export type DocumentStatus = 'Draft' | 'Sent' | 'Paid' | 'Signed';

export interface SavedDocument {
  id: string;
  userId?: string;
  templateSlug: string;
  title: string;
  docNumber?: string;
  status: DocumentStatus;
  data: Record<string, any>;
  styles: StyleSettings;
  grandTotal?: number;
  currency?: CurrencyCode;
  createdAt: string;
  updatedAt: string;
}
