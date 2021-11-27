export function getDaasAddress(shop: any, baseUrl = 'https://smartstock-faas.bfast.fahamutech.com'): string {
  return `${baseUrl}/shop/${shop.projectId}/${shop.applicationId}`;
}

export function getFaasAddress(shop: any, baseUrl = 'https://smartstock-faas.bfast.fahamutech.com'): string {
  return baseUrl;
}
