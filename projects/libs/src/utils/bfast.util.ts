import {ShopModel} from '../models/shop.model';

export function getDaasAddress(shop: ShopModel): string {
  return `https://smartstock-faas.bfast.fahamutech.com/shop/${shop.projectId}/${shop.applicationId}`;
}

export function getFaasAddress(shop: ShopModel): string {
  return `https://smartstock-faas.bfast.fahamutech.com`;
}
