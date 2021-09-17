import {Injectable} from '@angular/core';
import {FileModel} from '../models/file.model';
import {FileBrowserSheetComponent} from '../components/file-browser-sheet.component';
import {FileBrowserDialogComponent} from '../components/file-browser-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {DeviceState} from '../states/device.state';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MessageService} from './message.service';
import {UserService} from './user.service';

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
    const isMobile = this.deviceState.isSmallScreen.value;
    if (isMobile) {
      const value = await this.bottomSheet.open(FileBrowserSheetComponent, {
        closeOnNavigation: false,
        disableClose: true,
        data: {
          shop: await this.userService.getCurrentShop()
        }
      }).afterDismissed().toPromise();
      if (value && value.url) {
        return value;
      } else {
        this.messageService.showMobileInfoMessage(value && value.message ?
          value.message : 'Fails to select file', 2000, 'bottom');
        return null;
      }
    } else {
      const value = await this.matDialog.open(FileBrowserDialogComponent, {
        closeOnNavigation: false,
        disableClose: true,
        data: {
          shop: await this.userService.getCurrentShop()
        }
      }).afterClosed().toPromise();
      if (value && value.url) {
        return value;
      } else {
        this.messageService.showMobileInfoMessage(value && value.message ?
          value.message : 'Fails to select file', 2000, 'bottom');
        return null;
      }
    }
  }

}
