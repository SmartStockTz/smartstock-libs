export interface ShopSettingsModel {
  saleWithoutPrinter: boolean;
  printerFooter: string;
  printerHeader: string;
  printerUrl: string;
  allowRetail?: boolean;
  allowWholesale?: boolean;
  currency: string;
  module: {
    stock?: string;
    sale?: string;
    purchase?: string;
    account?: string;
    expense?: string;
    report?: string;
    dashboard?: string;
    store?: string;
    book?: string;
  };
}
