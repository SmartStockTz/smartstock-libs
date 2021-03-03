import {Injectable} from '@angular/core';
import {FileResponseModel} from '../models/file-response.model';
import {BFast} from 'bfastjs';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private readonly storageService: StorageService) {
  }

  async getFiles(): Promise<FileResponseModel[]> {
    const shop = await this.storageService.getActiveShop();
    BFast.init({
      applicationId: shop.applicationId,
      projectId: shop.projectId
    }, shop.projectId);
    return BFast.storage(shop.projectId).list({
      // need some improvement from server
      size: 1000000000000000000,
      skip: 0
    });
  }

  async uploadFile(file: File, callback: (progress: any) => void): Promise<string> {
    const shop = await this.storageService.getActiveShop();
    return BFast.storage(shop.projectId).save({
      filename: file.name,
      data: file,
      pn: false
    }, progress => {
      callback(((progress.loaded / progress.total) * 100).toFixed(2));
    });
  }
}
