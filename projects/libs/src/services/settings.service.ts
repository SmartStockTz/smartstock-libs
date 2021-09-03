import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './storage.service';
import * as bfast from 'bfast';
import {ShopSettingsModel} from '../models/shop-settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ssmServerURL = 'https://smartstock-daas.bfast.fahamutech.com'; // environment.smartstock.databaseURL;
  ssmFunctionsURL = 'https://smartstock-faas.bfast.fahamutech.com'; // environment.smartstock.functionsURL;
  ssmHeader = {
    'X-Parse-Application-Id': 'smartstock'
  };
  ssmFunctionsHeader = {
    'bfast-application-id': 'smartstock',
    'content-type': 'application/json'
  };

  constructor(private readonly httpClient: HttpClient,
              private readonly storageService: StorageService,
              private readonly indexDb: StorageService) {
  }

  async getSSMUserHeader(): Promise<any> {
    try {
      const user = await this.storageService.getActiveUser();
      const activeShop = await this.storageService.getActiveShop();
      if (!user) {
        // console.log('no user records found');
        throw new Error('no user records found');
      }
      if (user && user.sessionToken && activeShop && activeShop.applicationId) {
        return {
          'X-Parse-Application-Id': 'smartstock',
          'X-Parse-Session-Token': user.sessionToken,
          'Content-Type': 'application/json'
        };
      } else {
        throw new Error('token not found');
      }
    } catch (e) {
      throw {message: 'Fails to get user, so to retrieve token'};
    }
  }

  async getCustomerApplicationId(): Promise<string> {
    try {
      const activeShop = await this.storageService.getActiveShop();
      if (!activeShop) {
        throw new Error('No user record');
      }
      return activeShop.applicationId;
    } catch (e) {
      throw {message: 'Fails to get application id', reason: e.toString()};
    }
  }

  async getCustomerHeader(): Promise<any> {
    try {
      return {
        'X-Parse-Application-Id': await this.getCustomerApplicationId()
      };
    } catch (e) {
      console.warn(e);
      return {};
    }
  }

  async getCustomerPostHeader(contentType?: string): Promise<any> {
    try {
      return {
        'X-Parse-Application-Id': await this.getCustomerApplicationId(),
        'content-type': contentType ? contentType : 'application/json'
      };
    } catch (e) {
      throw {message: 'Fails to get customer post header', reason: e.toString()};
    }
  }

  async getCustomerProjectId(): Promise<string> {
    try {
      const activeShop = await this.indexDb.getActiveShop();
      if (!activeShop) {
        throw new Error('No user in local storage');
      }
      return activeShop.projectId;
    } catch (e) {
      throw {message: 'Fails to get project id', reason: e.toString()};
    }
  }

  /**
   * @deprecated
   */
  public getPrinterAddress(callback: (value: { ip: string, name: string }) => void): void {
    // this.indexDb.getItem<{ ip: string, name: string }>('printerAddress').then(value => {
    //   callback(null);
    // }).catch(reason => {
    //   console.log(reason);
    //   callback(null);
    // });
    callback(null);
  }

  async saveSettings(settings: any): Promise<any> {
    const activeShop = await this.storageService.getActiveShop();
    const _: any = await bfast.functions().request(this.ssmFunctionsURL + '/settings/' + activeShop.projectId).put(settings, {
      headers: this.ssmFunctionsHeader
    });
    activeShop.settings = _.settings;
    await this.storageService.saveActiveShop(activeShop);
    let user = await this.storageService.getActiveUser();
    if (user.projectId === activeShop.projectId) {
      user = Object.assign(user, activeShop);
    } else {
      user.shops.map(x => {
        if (x.projectId === activeShop.projectId) {
          x = Object.assign(x, activeShop);
        }
        return x;
      });
    }
    await this.storageService.saveActiveUser(user);
    return activeShop;
  }

  async getSettings(): Promise<ShopSettingsModel> {
    try {
      const activeShop = await this.storageService.getActiveShop();
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
