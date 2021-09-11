import {Injectable} from '@angular/core';
import {ShopSettingsModel} from '../models/shop-settings.model';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private readonly userService: UserService) {
  }

  async getSettings(): Promise<ShopSettingsModel> {
    try {
      const activeShop = await this.userService.getCurrentShop();
      if (!activeShop || !activeShop.settings) {
        return {
          currency: 'Tsh',
          module: {},
          printerUrl: 'https://localhost:8080',
          printerFooter: 'Thank you',
          printerHeader: '',
          saleWithoutPrinter: true,
          allowRetail: true,
          allowWholesale: true
        };
      }
      return activeShop.settings;
    } catch (e) {
      throw {message: 'Fails to get settings', reason: e.toString()};
    }
  }
}
