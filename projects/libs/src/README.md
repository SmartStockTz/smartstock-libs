# SmartStock Ngx Core Libs

This is angular core library for SmartStock. It includes **layouts**, **components**, 
**services**, and **utils**

## Get Started

Change npm registry to use github npm package. Then include this lib to your dependencies `npm install @smartstocktz/core-libs`

## Models

Data model which used in this lib includes

* BatchModel
 ```typescript
  export interface BatchModel {
    method?: string;
    path?: string;
    body?: SalesModel;
  }
  ```

* SalesModel
```typescript
import {StockModel} from './stock.model';

export interface SalesModel {
  soldBy?: { username: string };
  id?: string;
  idTra?: string;
  date?: any;
  product?: string;
  category?: string;
  unit?: string;
  quantity?: number;
  amount?: number;
  customer?: string;
  cartId?: string; // orderId track
  discount?: number;
  user?: string;
  channel?: string;
  stock?: StockModel;
  batch?: string; // for offline sync
  stockId: string;
}

```
  

## Services

Following is the services exposed by this library

### StorageService

Store and retrive contents from local storage ( e.g indexDB )


* Public Methods

    * 1
    ```typescript 
  async getActiveUser(): Promise<any>
    ```
    return current logged in user saved in local storage
    
    * 2
    ```typescript
  async saveSales(batchs: BatchModel[]): Promise<any>
    ```
     |Parameter|Type     | Details|
     |----------|----------------|-----|
     |batchs| Array of BatchModel | sales to save offline and will be sync later by sales-sync worker |
     
    * 3
    ```typescript
  async getActiveShop(): Promise<ShopModel>
    ```
    
