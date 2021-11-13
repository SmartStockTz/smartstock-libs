import {Injectable} from '@angular/core';
import {FileModel} from '../models/file.model';
import {FileBrowserSheetComponent} from '../components/file-browser-sheet.component';
import {MatDialog} from '@angular/material/dialog';
import {DeviceState} from '../states/device.state';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MessageService} from './message.service';
import {UserService} from './user.service';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FilesService {
  constructor(private readonly userService: UserService,
              private readonly matDialog: MatDialog,
              private readonly deviceState: DeviceState,
              private readonly bottomSheet: MatBottomSheet,
              private readonly messageService: MessageService) {
  }

  async browse(): Promise<FileModel> {
    const bs = this.bottomSheet.open(FileBrowserSheetComponent, {
      closeOnNavigation: false,
      disableClose: true,
      panelClass: 'bottom-sheet',
      data: {
        shop: await this.userService.getCurrentShop()
      }
    });
    const value = await firstValueFrom(bs.afterDismissed());
    if (value && value.url) {
      return value;
    } else {
      this.messageService.showMobileInfoMessage(value && value.message ?
        value.message : 'Fails to select file', 2000, 'bottom');
      return null;
    }
  }

}
