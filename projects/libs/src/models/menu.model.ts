export interface MenuModel {
  name?: string;
  icon?: string;
  link?: string;
  roles?: string[];
  pages?: SubMenuModel[];
}


export interface SubMenuModel {
  name?: string;
  link?: string;
  roles?: string[];
}
