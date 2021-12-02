export interface LibUserModel {
  applicationId?: string;
  projectUrlId?: string;
  projectId?: string;
  username?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  mobile?: string;
  email?: string;
  category?: string; // default shop category
  role?: string | 'admin' | 'manager' | 'user' | 'online';
  acl?: Array<string>;
  businessName?: string;
  country?: string;
  region?: string;
  street?: string;
  id?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  sessionToken?: string;
  token?: string;
  rsa?: string;
  settings?: {
    saleWithoutPrinter?: boolean,
    printerFooter?: string,
    printerHeader?: string,
    allowRetail?: boolean,
    allowWholesale?: boolean,
    currency?: string
  };
  ecommerce?: any;
  shops?: {
    ecommerce: any;
    settings: {
      saleWithoutPrinter?: boolean;
      printerFooter?: string;
      printerHeader?: string;
      allowRetail?: boolean;
      allowWholesale?: boolean;
      currency?: string
    };
    projectId?: string,
    applicationId?: string;
    projectUrlId?: string;
    businessName?: string;
    category?: string;
    rsa?: string;
    currency?: string
  }[];
}
