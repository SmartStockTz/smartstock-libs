import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import * as bfast from 'bfast';
import {LogService} from './log.service';
import {StorageService} from './storage.service';
import {ShopModel} from '../models/shop.model';
import {LibUserModel} from '../models/lib-user.model';
import {SettingsService} from './settings.service';
import {VerifyEMailDialogComponent} from '../components/verify-email-dialog.component';
import {IpfsService} from './ipfs.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private smartStockCache = bfast.cache({database: 'smartstock', collection: 'config'});

  constructor(private readonly httpClient: HttpClient,
              private readonly settingsService: SettingsService,
              private readonly dialog: MatDialog,
              private readonly logger: LogService,
              private readonly ipfsService: IpfsService,
              private readonly storageService: StorageService) {
  }

  async currentUser(): Promise<any> {
    try {
      const user = await bfast.auth().currentUser();
      if (user && user.role !== 'admin') {
        return user;
      } else if (user && user.verified === true) {
        return user;
      } else {
        return await bfast.auth().setCurrentUser(undefined);
      }
    } catch (reason) {
      return await bfast.auth().setCurrentUser(undefined);
    }
  }

  async deleteUser(user: any): Promise<any> {
    return bfast.functions()
      .request('/functions/users/' + user.id)
      .delete({
        headers: {'smartstock-context': {user: (await bfast.auth().currentUser()).id}}
      });
  }

  async getAllUser(pagination: { size: number, skip: number }): Promise<LibUserModel[]> {
    const shop = await this.getCurrentShop();
    const cids = await bfast.database().collection('_User')
      .query()
      .cids(true)
      .equalTo('projectId', shop.projectId)
      .includesIn('role', ['user', 'manager'])
      .size(pagination.size)
      .skip(pagination.skip)
      .find<any[]>({
        useMasterKey: true
      });
    return await Promise.all(cids.map(x => {
      return this.ipfsService.getDataFromCid(x);
    })) as any;
  }

  async login(user: { username: string, password: string }): Promise<LibUserModel> {
    const authUser = await bfast.auth().logIn(user.username, user.password);
    await this.storageService.removeActiveShop();
    if (authUser && authUser.role !== 'admin') {
      await this.updateCurrentUser(authUser);
      return authUser;
    } else if (authUser && authUser.verified === true) {
      await this.updateCurrentUser(authUser);
      return authUser;
    } else {
      await bfast.functions().request('/functions/users/reVerifyAccount/' + user.username).post();
      this.dialog.open(VerifyEMailDialogComponent, {
        closeOnNavigation: true,
        disableClose: true
      });
      throw {code: 403, err: 'account not verified'};
    }
  }

  async logout(user: LibUserModel): Promise<void> {
    await bfast.auth().logOut();
    await this.storageService.removeActiveUser();
    await this.storageService.removeActiveShop();
    return;
  }

  async register(user: LibUserModel): Promise<LibUserModel> {
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
    return await bfast.functions().request('/functions/users/create').post(user);
  }

  resetPassword(username: string): Promise<any> {
    return bfast.functions().request('/functions/users/resetPassword/' + encodeURIComponent(username)).get();
  }

  async refreshToken(): Promise<any> {
    try {
      return bfast.auth().currentUser();
    } catch (e) {
      return bfast.auth().setCurrentUser(undefined);
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
    return bfast.functions().request('/functions/users/seller').post(user);
  }

  async getShops(user: LibUserModel): Promise<ShopModel[]> {
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
      const activeShop = await this.smartStockCache.get<ShopModel>('activeShop');
      if (activeShop && activeShop.projectId && activeShop.applicationId) {
        return activeShop;
      } else {
        throw {message: 'No Active Shop'};
      }
  }

  async saveCurrentShop(shop: ShopModel): Promise<ShopModel> {
    return this.smartStockCache.set('activeShop', shop);
  }

  updatePassword(user: LibUserModel, password: string): Promise<any> {
    return bfast.functions().request('/functions/users/password/' + user.id).put({
      password
    });
  }

  updateUser(user: LibUserModel, data: { [p: string]: any }): Promise<LibUserModel> {
    return bfast.functions().request('/functions/users/' + user.id).put(data);
  }

  async updateCurrentUser(user: LibUserModel): Promise<LibUserModel> {
    return bfast.auth().setCurrentUser(user);
  }

  changePasswordFromOld(data: { lastPassword: string; password: string; user: LibUserModel }): Promise<any> {
    return bfast.functions().request('/functions/users/password/change/' + data.user.id).put({
      lastPassword: data.lastPassword,
      username: data.user.username,
      password: data.password
    });
  }
}
