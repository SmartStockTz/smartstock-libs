import {Injectable} from '@angular/core';
import * as bfast from 'bfast';
import {SecurityUtil} from '../utils/security.util';
import {StockModel} from '../models/stock.model';
import {BatchModel} from '../models/batch.model';
import {UserService} from './user.service';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  smartStockCache: any;

  constructor(private readonly userService: UserService) {
    this.smartStockCache = bfast.cache({database: 'smartstock', collection: 'config'});
  }

  async saveSales(batchs: BatchModel[]): Promise<any> {
    const activeShop = await this.userService.getCurrentShop();
    await bfast.cache({database: 'sales', collection: activeShop.projectId})
      .set<BatchModel[]>(SecurityUtil.randomString(12), batchs, {
        dtl: 720
      });
  }

  async getCurrentProjectId(): Promise<string> {
    return await this.smartStockCache.get('cPID');
  }

  async saveCurrentProjectId(projectId: string): Promise<any> {
    return await this.smartStockCache.set('cPID', projectId, {
      dtl: 7
    });
  }

  async clearSmartStockCache(): Promise<any> {
    return await this.smartStockCache.clearAll();
  }

  async removeStocks(): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return await bfast.cache({database: 'stocks', collection: shop.projectId}).clearAll();
  }

  async getStocks(): Promise<StockModel[]> {
    const shop = await this.userService.getCurrentShop();
    const stocksCache = bfast.cache({database: 'stocks', collection: shop.projectId});
    return await stocksCache.get<StockModel[]>('all');
  }

  async saveStocks(stocks: StockModel[]): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    const stocksCache = bfast.cache({database: 'stocks', collection: shop.projectId});
    return await stocksCache.set('all', stocks, {
      dtl: 360
    });
  }

}
