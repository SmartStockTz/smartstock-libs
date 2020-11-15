import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {BFast} from 'bfastjs';
import {LogService} from './log.service';
import {StorageService} from './storage.service';
import {ShopModel} from '../models/shop.model';
import {UserModel} from '../models/user.model';
import {SettingsService} from './settings.service';
import {VerifyEMailDialogComponent} from '../components/verify-email-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private readonly httpClient: HttpClient,
              private readonly settingsService: SettingsService,
              private readonly dialog: MatDialog,
              private readonly logger: LogService,
              private readonly storageService: StorageService) {
  }

  async currentUser(): Promise<any> {
    try {
      const user = await BFast.auth().currentUser();
      if (user && user.role !== 'admin') {
        return user;
      } else if (user && user.verified === true) {
        return user;
      } else {
        return await BFast.auth().setCurrentUser(undefined);
      }
    } catch (reason) {
      return await BFast.auth().setCurrentUser(undefined);
    }
  }

  async deleteUser(user: any): Promise<any> {
    return BFast.functions()
      .request('/functions/users/' + user.id)
      .delete({
        headers: {'smartstock-context': {user: (await BFast.auth().currentUser()).id}}
      });
  }

  async getAllUser(pagination: { size: number, skip: number }): Promise<UserModel[]> {
    const projectId = await this.settingsService.getCustomerProjectId();
    return BFast.database().collection('_User')
      .query()
      .equalTo('projectId', projectId)
      .includesIn('role', ['user', 'manager'])
      .size(pagination.size)
      .skip(pagination.skip)
      .find<UserModel[]>({
        useMasterKey: true
      });
  }

  getUser(user: UserModel, callback?: (user: UserModel) => void): void {

  }

  async login(user: { username: string, password: string }): Promise<UserModel> {
    const authUser = await BFast.auth().logIn<UserModel>(user.username, user.password);
    await this.storageService.removeActiveShop();
    if (authUser && authUser.role !== 'admin') {
      await this.storageService.saveActiveUser(authUser);
      return authUser;
    } else if (authUser && authUser.verified === true) {
      await this.storageService.saveActiveUser(authUser);
      return authUser;
    } else {
      await BFast.functions().request('/functions/users/reVerifyAccount/' + user.username).post();
      this.dialog.open(VerifyEMailDialogComponent, {
        closeOnNavigation: true,
        disableClose: true
      });
      throw {code: 403, err: 'account not verified'};
    }
  }

  async logout(user: UserModel): Promise<void> {
    await BFast.auth().logOut();
    await this.storageService.removeActiveUser();
    await this.storageService.removeActiveShop();
    return;
  }

  async register(user: UserModel): Promise<UserModel> {
    user.settings = {
      printerFooter: 'Thank you',
      printerHeader: '',
      saleWithoutPrinter: true,
      allowRetail: true,
      allowWholesale: true
    };
    user.ecommerce = {};
    user.shops = [];
    await this.storageService.removeActiveShop();
    return await BFast.functions().request('/functions/users/create').post(user, {
      headers: this.settingsService.ssmFunctionsHeader
    });
  }

  resetPassword(username: string): Promise<any> {
    return BFast.functions().request('/functions/users/resetPassword/' + encodeURIComponent(username)).get();
  }

  async refreshToken(): Promise<any> {
    try {
      return BFast.auth().currentUser();
    } catch (e) {
      return BFast.auth().setCurrentUser(undefined);
    }
  }

  /**
   * @deprecate will be removed in next minor release
   * @param user - {UserModel} model to save
   */
  async addUser(user: UserModel): Promise<UserModel> {
    const shop = await this.storageService.getActiveShop();
    const shops = user.shops ? user.shops : [];
    const shops1 = shops.filter(value => value.applicationId !== shop.applicationId);
    user.applicationId = shop.applicationId;
    user.projectUrlId = shop.projectUrlId;
    user.projectId = shop.projectId;
    user.businessName = shop.businessName;
    user.settings = shop.settings;
    user.ecommerce = shop.ecommerce;
    user.shops = shops1;
    return BFast.functions().request('/functions/users/seller').post(user, {
      headers: this.settingsService.ssmFunctionsHeader
    });
  }

  async getShops(user: UserModel): Promise<ShopModel[]> {
    try {
      const shops = [];
      user.shops.forEach(element => {
        shops.push(element);
      });
      shops.push({
        businessName: user.businessName,
        projectId: user.projectId,
        applicationId: user.applicationId,
        projectUrlId: user.projectUrlId,
        settings: user.settings,
        ecommerce: user.ecommerce,
        street: user.street,
        country: user.country,
        region: user.region
      });
      return shops;
    } catch (e) {
      throw e;
    }
  }

  async updateShops(shops: ShopModel[], user: UserModel): Promise<boolean> {
    const topLevelShop = shops.filter(x => x.projectId === user.projectId);
    const otherShops = shops.filter(x => x.projectId !== user.projectId);
    if (topLevelShop && Array.isArray(topLevelShop) && topLevelShop[0]) {
      user.businessName = topLevelShop[0].businessName;
      user.projectId = topLevelShop[0].projectId;
      user.applicationId = topLevelShop[0].applicationId;
      user.projectUrlId = topLevelShop[0].projectUrlId;
      user.settings = topLevelShop[0].settings;
      user.ecommerce = topLevelShop[0].ecommerce;
      user.street = topLevelShop[0].street;
      user.country = topLevelShop[0].country;
      user.region = topLevelShop[0].region;
    }
    user.shops = otherShops as any;
    await this.storageService.saveActiveUser(user);
    return true;
  }

  async getCurrentShop(): Promise<ShopModel> {
    const activeShop = await this.storageService.getActiveShop();
    if (activeShop && activeShop.projectId && activeShop.applicationId && activeShop.projectUrlId) {
      return activeShop;
    } else {
      throw new Error('No active shop in records');
    }
  }

  async saveCurrentShop(shop: ShopModel): Promise<ShopModel> {
    await this.storageService.saveCurrentProjectId(shop.projectId);
    return this.storageService.saveActiveShop(shop);
  }

  createShop(data: { admin: UserModel, shop: ShopModel }): Promise<ShopModel> {
    return undefined;
    // return new Promise<ShopModel>(async (resolve, reject) => {
    //   this.httpClient.post<ShopModel>(this.settings.ssmFunctionsURL + '/functions/shop', data, {
    //     headers: this.settings.ssmFunctionsHeader
    //   }).subscribe(value => {
    //     resolve(value);
    //   }, error => {
    //     reject(error);
    //   });
    // });
  }

  deleteShop(shop: ShopModel): Promise<ShopModel> {
    return undefined;
    // return new Promise<ShopModel>((resolve, reject) => {
    //   this.httpClient.delete(this.settings.ssmFunctionsURL + '/functions/shop', {
    //   })
    // });
  }

  updatePassword(user: UserModel, password: string): Promise<any> {
    return BFast.functions().request('/functions/users/password/' + user.id).put({
      password
    }, {
      headers: this.settingsService.ssmFunctionsHeader
    });
  }

  updateUser(user: UserModel, data: { [p: string]: any }): Promise<UserModel> {
    return BFast.functions().request('/functions/users/' + user.id).put(data, {
      headers: this.settingsService.ssmFunctionsHeader
    });
  }

  async updateCurrentUser(user: UserModel): Promise<UserModel> {
    return await this.storageService.saveActiveUser(user);
  }

  changePasswordFromOld(data: { lastPassword: string; password: string; user: UserModel }): Promise<any> {
    return BFast.functions().request('/functions/users/password/change/' + data.user.id).put({
      lastPassword: data.lastPassword,
      username: data.user.username,
      password: data.password
    }, {
      headers: this.settingsService.ssmFunctionsHeader
    });
  }
}
