import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FileModel} from '../models/file.model';
import {MessageService} from '../services/message.service';
import {FileResponseModel} from '../models/file-response.model';
import * as bfast from 'bfast';
import {MatDialog} from '@angular/material/dialog';
import {DeviceState} from './device.state';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {UserService} from '../services/user.service';
import {getDaasAddress, getFaasAddress} from '../utils/bfast.util';

@Injectable({
  providedIn: 'root'
})
export class FilesState {

  constructor(private readonly userService: UserService,
              private readonly matDialog: MatDialog,
              private readonly deviceState: DeviceState,
              private readonly bottomSheet: MatBottomSheet,
              private readonly messageService: MessageService) {
  }

  isFetchFiles: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isUploading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  uploadingPercentage: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  files: BehaviorSubject<FileModel[]> = new BehaviorSubject<FileModel[]>([]);

  private static getFileCategory(type1: string): string {
    // .jpg,.png,.pdf,.docx,.txt,.gif,.jpeg,.mp4,.mkv,.mp3,.aac,.epub
    const fileTypes = type1.split('/');
    const type = fileTypes[0];
    return  type;
    // if (type === 'png' || type === 'jpg' || type === 'jpeg' || type === 'gif') {
    //   return 'image';
    // } else if (type === 'mp4' || type === 'mkv') {
    //   return 'video';
    // } else if (type === 'mp3' || type === 'aac' || type === 'aac4') {
    //   return 'audio';
    //   // }
    //   // else if (type === 'pdf' || type === 'epub') {
    //   //   return 'book';
    // } else {
    //   return 'other';
    // }
  }

  fetchFiles(): void {
    this.isFetchFiles.next(true);
    this.userService.getCurrentShop().then(async shop => {
      return {
        files: await this._getFiles(),
        shop
      };
    }).then(value => {
      this.files.next(
        value.files.map(x => {
          // const nameContents = x.name.split('.');
          const suffixs = x.name.split('-');
          return {
            url: `${getDaasAddress(value.shop)}/storage/${value.shop.applicationId}/file/${x.id}`,
            size: (Number(x.size) / (1024 * 1024)).toPrecision(3) + ' MB',
            suffix: suffixs[suffixs.length - 1],
            category: FilesState.getFileCategory(x.type),
            name: x.name,
            extension: x.extension,
            type: x.type
          };
        })
      );
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(reason && reason.message ?
        reason.message : reason.toString(), 2000, 'bottom');
    }).finally(() => {
      this.isFetchFiles.next(false);
    });
  }

  appendFile(url: string, type: string): void {
    const nameContents = url.split('.');
    const suffixs = url.split('-');
    this.files.value.unshift({
      url,
      size: ' MB',
      suffix: suffixs[suffixs.length - 1],
      name: url,
      category: FilesState.getFileCategory(type),
      type
    });
    this.files.next(this.files.value);
  }

  uploadFile(file: File, done: () => void): void {
    this.isUploading.next(true);
    this.uploadingPercentage.next(0);
    this._uploadFile(file, progress => {
      this.uploadingPercentage.next(progress);
    }).then(value => {
      this.appendFile(value, file.type);
      done();
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message ? reason.message : reason.toString(), 2000, 'bottom');
    }).finally(() => {
      this.isUploading.next(false);
    });
  }

  async _getFiles(): Promise<FileResponseModel[]> {
    const shop = await this.userService.getCurrentShop();
    bfast.init({
      applicationId: shop.applicationId,
      projectId: shop.projectId,
      databaseURL: getDaasAddress(shop),
      functionsURL: getFaasAddress(shop),
    }, shop.projectId);
    return bfast.storage(shop.projectId).list({
      // need some improvement from server
      size: 1000000000000000000,
      skip: 0
    });
  }

  async _uploadFile(file: File, callback: (progress: any) => void): Promise<string> {
    const shop = await this.userService.getCurrentShop();
    return bfast.storage(shop.projectId).save({
      filename: file.name,
      data: file,
      pn: false
    }, progress => {
      callback(((progress.loaded / progress.total) * 100).toFixed(2));
    });
  }

}
