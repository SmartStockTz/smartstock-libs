export interface UserModel {
  applicationId?: string;
  projectUrlId?: string;
  projectId?: string;
  username: string;
  password?: string;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  category: string; // default shop category
  role?: string | 'admin' | 'manager' | 'user';
  businessName: string;
  country: string;
  region: string;
  street: string;
  rbac: {
    pages: string
  };
  id?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  sessionToken?: string;
  settings?: {
    saleWithoutPrinter: boolean,
    printerFooter: string,
    printerHeader: string,
    allowRetail: boolean,
    allowWholesale: boolean,
  };
  ecommerce?: any;
  shops?: {
    projectId: string,
    applicationId: string;
    projectUrlId: string;
    businessName: string;
  }[];
}
