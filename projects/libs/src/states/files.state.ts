import {Injectable} from '@angular/core';
import {FilesService} from '../services/files.service';
import {BehaviorSubject} from 'rxjs';
import {FileModel} from '../models/file.model';
import {MessageService} from '../services/message.service';
import {StorageService} from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class FilesState {

  constructor(private readonly fileService: FilesService,
              private readonly storageService: StorageService,
              private readonly messageService: MessageService) {
  }

  isFetchFiles: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isUploading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  uploadingPercentage: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  files: BehaviorSubject<FileModel[]> = new BehaviorSubject<FileModel[]>([]);

  private static getFileCategory(name: string): string {
    // .jpg,.png,.pdf,.docx,.txt,.gif,.jpeg,.mp4,.mkv,.mp3,.aac,.epub
    const fileTypes = name.split('.');
    const type = fileTypes[fileTypes.length - 1];
    if (type === 'png' || type === 'jpg' || type === 'jpeg' || type === 'gif') {
      return 'image';
    } else if (type === 'mp4' || type === 'mkv') {
      return 'video';
    } else if (type === 'mp3' || type === 'aac' || type === 'aac4') {
      return 'audio';
    } else if (type === 'pdf' || type === 'epub') {
      return 'book';
    } else {
      return 'other';
    }
  }

  fetchFiles(): void {
    this.isFetchFiles.next(true);
    this.storageService.getActiveShop().then(async shop => {
      return {
        files: await this.fileService.getFiles(),
        shop
      };
    }).then(value => {
      this.files.next(
        value.files.map(x => {
          const nameContents = x.name.split('.');
          const suffixs = x.name.split('-');
          return {
            url: `https://${value.shop.projectId}-daas.bfast.fahamutech.com/storage/${value.shop.applicationId}/file/${x.name}`,
            size: (Number(x.size) / (1024 * 1024)).toPrecision(3) + ' MB',
            suffix: suffixs[suffixs.length - 1],
            category: FilesState.getFileCategory(x.name),
            name: x.name,
            type: nameContents[nameContents.length - 1].toUpperCase()
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

  appendFile(url: string): void {
    const nameContents = url.split('.');
    const suffixs = url.split('-');
    this.files.value.unshift({
      url,
      size: ' MB',
      suffix: suffixs[suffixs.length - 1],
      name: url,
      category: FilesState.getFileCategory(url),
      type: nameContents[nameContents.length - 1].toUpperCase()
    });
    this.files.next(this.files.value);
  }

  uploadFile(file: File, done: () => void): void {
    this.isUploading.next(true);
    this.uploadingPercentage.next(0);
    this.fileService.uploadFile(file, progress => {
      this.uploadingPercentage.next(progress);
    }).then(value => {
      this.appendFile(value);
      done();
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message ? reason.message : reason.toString(), 2000, 'bottom');
    }).finally(() => {
      this.isUploading.next(false);
    });
  }
}
