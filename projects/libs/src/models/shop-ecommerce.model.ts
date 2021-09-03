export interface ShopEcommerceModel {
  logo: string;
  cover: string;
  about: string;
  social: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
  };
  payment?: {
    verifiy: string;
    reference: string;
    instructions: string;
  };
}
