
export interface ContactDetail {
  label: string;
  value: string;
  isLink?: boolean;
  isMap?: boolean;
}

export interface ContactMethod {
  type: string;
  title: string;
  details: ContactDetail[];
}

export interface Mechanism {
  title: string;
  description: string;
}

export interface PageContent {
  mainTitle: string;
  introduction: string;
  contactMethods: ContactMethod[];
  mechanismsTitle: string;
  mechanisms: Mechanism[];
}
