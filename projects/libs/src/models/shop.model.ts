import { ShopEcommerceModel } from './shop-ecommerce.model';
import { ShopRsaModel } from './shop-rsa.model';
import { ShopSettingsModel } from './shop-settings.model';
export interface ShopModel {
  businessName: string;
  applicationId: string;
  projectId: string;
  masterKey: string;
  category: string;
  settings: ShopSettingsModel;
  ecommerce: ShopEcommerceModel;
  country: string;
  region: string;
  street: string;
  rsa?: ShopRsaModel;
}
