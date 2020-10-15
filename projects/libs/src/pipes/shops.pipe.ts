import {Pipe, PipeTransform} from '@angular/core';
import {UserService} from '../services/user.service';
import {ShopModel} from '../models/shop.model';

@Pipe({
  name: 'shopsPipe'
})
export class ShopsPipe implements PipeTransform {

  constructor(private readonly userApi: UserService) {
  }

  async transform(shops: ShopModel[], ...args: unknown[]): Promise<string[]> {
    try {
      const shop = await this.userApi.getCurrentShop();
      shops.push(shop);
      return shops.map(value => value.businessName);
    } catch (e) {
      return [];
    }
  }

}
