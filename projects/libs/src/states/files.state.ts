import {Injectable} from '@angular/core';
import {FilesService} from '../services/files.service';
import {BehaviorSubject} from 'rxjs';
import {ShopModel} from '../models/shop.model';
import {FileModel} from '../models/file.model';
import {MessageService} from '../services/message.service';

@Injectable({
  providedIn: 'root'
})
export class FilesState {

  constructor(private readonly fileService: FilesService,
              private readonly messageService: MessageService) {
  }

  isFetchFiles: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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

  fetchFiles(shop: ShopModel): void {
    this.isFetchFiles.next(true);
    this.fileService.getFiles(shop).then(value => {
      this.files.next(
        value.sort((a, b) => a.lastModified > b.lastModified ? -1 : 1).map(x => {
          const nameContents = x.name.split('.');
          const suffixs = x.name.split('-');
          return {
            url: `https://${shop.projectId}-daas.bfast.fahamutech.com/storage/${shop.applicationId}/file/${x.name}`,
            size: (Number(x.size) / (1024 * 1024)).toPrecision(3) + ' MB',
            suffix: suffixs[suffixs.length - 1],
            category: FilesState.getFileCategory(x.name),
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

  appendFile(url: string, shop: ShopModel): void {
    const nameContents = url.split('.');
    const suffixs = url.split('-');
    this.files.value.unshift({
      url: `https://${shop.projectId}-daas.bfast.fahamutech.com${url}`,
      size: ' MB',
      suffix: suffixs[suffixs.length - 1],
      category: FilesState.getFileCategory(url),
      type: nameContents[nameContents.length - 1].toUpperCase()
    });
    this.files.next(this.files.value);
  }
}
