import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ShopModel} from '../models/shop.model';
import {LibUserModel} from '../models/lib-user.model';
import {VerifyEMailDialogComponent} from '../components/verify-email-dialog.component';
import {ShopSettingsModel} from '../models/shop-settings.model';
import {auth, cache, functions} from 'bfast';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly dialog: MatDialog) {
  }

  async currentUser(): Promise<any> {
    try {
      const user = await auth().currentUser();
      if (user && user.role !== 'admin') {
        return user;
      } else if (user && user.verified === true) {
        return user;
      } else {
        return await auth().setCurrentUser(undefined);
      }
    } catch (reason) {
      return await auth().setCurrentUser(undefined);
    }
  }

  async isPersonalAccount(): Promise<boolean> {
    const user = await this.currentUser();
    return user && user.role === 'online';
  }

  async deleteUser(user: any): Promise<any> {
    return functions().request('/functions/users/' + user.id).delete({
        headers: {'smartstock-context': {user: (await auth().currentUser()).id}}
      });
  }

  async removeActiveShop(): Promise<any> {
    const smartStockCache = cache({database: 'smartstock', collection: 'config'});
    return smartStockCache.remove('activeShop');
  }

  async login(user: { username: string, password: string }): Promise<LibUserModel> {
    const authUser: any = await functions().request('/users/login').post({
      username: user.username,
      password: user.password
    });
    await this.removeActiveShop();
    if (authUser && authUser.role !== 'admin') {
      await this.updateCurrentUser(authUser);
      return authUser;
    } else if (authUser && authUser.verified === true) {
      await this.updateCurrentUser(authUser);
      return authUser;
    } else {
      await functions().request('/functions/users/reVerifyAccount/' + user.username).post();
      this.dialog.open(VerifyEMailDialogComponent, {
        closeOnNavigation: true,
        disableClose: true
      });
      throw {code: 403, err: 'account not verified'};
    }
  }

  async removeActiveUser(): Promise<any> {
    return await auth().setCurrentUser(undefined, 0);
  }

  async logout(user: LibUserModel): Promise<void> {
    await auth().logOut();
    await this.removeActiveUser();
    await this.removeActiveShop();
    return;
  }

  async register(user: LibUserModel): Promise<LibUserModel> {
    user.settings = {
      printerFooter: 'Thank you',
      printerHeader: '',
      saleWithoutPrinter: true,
      allowRetail: true,
      allowWholesale: true,
      currency: user && user.settings && user.settings.currency ? user.settings.currency : 'Tsh'
    };
    user.ecommerce = {};
    user.shops = [];
    await this.removeActiveShop();
    return await functions().request('/functions/users/create').post(user);
  }

  resetPassword(username: string): Promise<any> {
    return functions().request('/functions/users/resetPassword/' + encodeURIComponent(username)).get();
  }

  async refreshToken(): Promise<any> {
    try {
      return auth().currentUser();
    } catch (e) {
      return auth().setCurrentUser(undefined);
    }
  }

  /**
   * @deprecate will be removed in next minor release
   * @param user - {UserModel} model to save
   */
  async addUser(user: LibUserModel): Promise<LibUserModel> {
    const shop = await this.getCurrentShop();
    const shops = user.shops ? user.shops : [];
    const shops1 = shops.filter(value => value.applicationId !== shop.applicationId);
    user.applicationId = shop.applicationId;
    user.projectId = shop.projectId;
    user.businessName = shop.businessName;
    user.settings = shop.settings;
    user.ecommerce = shop.ecommerce;
    user.shops = shops1;
    return functions().request('/functions/users/seller').post(user);
  }

  async getShops(user: LibUserModel): Promise<ShopModel[]> {
    const shops = [];
    user.shops.forEach(element => {
      shops.push(element);
    });
    shops.push({
      businessName: user.businessName,
      projectId: user.projectId,
      applicationId: user.applicationId,
      projectUrlId: user.projectUrlId,
      settings: user.settings ? user.settings : {},
      ecommerce: user.ecommerce ? user.ecommerce : {},
      street: user.street,
      country: user.country,
      region: user.region
    });
    return shops;
  }

  async updateShops(shops: ShopModel[], user: LibUserModel): Promise<boolean> {
    const topLevelShop = shops.filter(x => x.projectId === user.projectId);
    const otherShops = shops.filter(x => x.projectId !== user.projectId);
    if (topLevelShop && Array.isArray(topLevelShop) && topLevelShop[0]) {
      user.businessName = topLevelShop[0].businessName;
      user.projectId = topLevelShop[0].projectId;
      user.applicationId = topLevelShop[0].applicationId;
      user.settings = topLevelShop[0].settings;
      user.ecommerce = topLevelShop[0].ecommerce;
      user.street = topLevelShop[0].street;
      user.country = topLevelShop[0].country;
      user.region = topLevelShop[0].region;
    }
    user.shops = otherShops as any;
    await this.updateCurrentUser(user);
    return true;
  }

  async getCurrentShop(): Promise<ShopModel> {
    const smartStockCache = cache({database: 'smartstock', collection: 'config'});
    const activeShop = await smartStockCache.get<ShopModel>('activeShop');
    if (activeShop && activeShop.projectId && activeShop.applicationId) {
      return activeShop;
    } else {
      throw {message: 'No Active Shop'};
    }
  }

  async saveCurrentShop(shop: ShopModel): Promise<ShopModel> {
    const smartStockCache = cache({database: 'smartstock', collection: 'config'});
    return smartStockCache.set('activeShop', shop);
  }

  updatePassword(user: LibUserModel, password: string): Promise<any> {
    return functions().request('/functions/users/password/' + user.id).put({
      password
    });
  }

  updateUser(user: LibUserModel, data: { [p: string]: any }): Promise<LibUserModel> {
    return functions().request('/functions/users/' + user.id).put(data);
  }

  async updateCurrentUser(user: LibUserModel): Promise<LibUserModel> {
    return auth().setCurrentUser(user);
  }

  changePasswordFromOld(data: { lastPassword: string; password: string; user: LibUserModel }): Promise<any> {
    return functions().request('/functions/users/password/change/' + data.user.id).put({
      lastPassword: data.lastPassword,
      username: data.user.username,
      password: data.password
    });
  }

  async getSettings(): Promise<ShopSettingsModel> {
    try {
      const activeShop = await this.getCurrentShop();
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
