import {Injectable} from '@angular/core';
import {FileResponseModel} from '../models/file-response.model';
import {BFast} from 'bfastjs';
import {ShopModel} from '../models/shop.model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  async getFiles(shop: ShopModel): Promise<FileResponseModel[]> {
    BFast.init({
      applicationId: shop.applicationId,
      projectId: shop.projectId
    }, shop.projectId);
    return BFast.storage(shop.projectId).list({
      size: 1000000000000000000,
      skip: 0
    });
  }
}
