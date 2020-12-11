import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MessageService} from '../../../../libs/src/services/message.service';
import {UserService} from '../../../../libs/src/services/user.service';
import {FileBrowserDialogComponent} from '../../../../libs/src/components/file-browser-dialog.component';

@Component({
  template: `
    <smartstock-layout-sidenav [heading]="'Core Libs'"
                               [leftDrawer]="drawer"
                               [leftDrawerMode]="'side'"
                               [leftDrawerOpened]="true"
                               [version]="mock" [body]="body">
      <ng-template #drawer>
        <smartstock-drawer></smartstock-drawer>
      </ng-template>
      <ng-template #body>
        <div style="height: 200vh">
          <h1>body Contents</h1>
          <button color="primary" (click)="showFileBrowser()" mat-flat-button>
            Show File Browser
          </button>
        </div>
      </ng-template>
    </smartstock-layout-sidenav>
  `
})
export class LandPageComponent {
  title = 'libs-mock';
  mock: Observable<string> = of('mock_11');

  constructor(private readonly dialog: MatDialog,
              private readonly messageService: MessageService,
              private readonly userService: UserService) {
  }

  async showFileBrowser(): Promise<void> {
    this.dialog.open(FileBrowserDialogComponent, {
      closeOnNavigation: false,
      disableClose: true,
      data: {
        shop: await this.userService.getCurrentShop()
      }
    }).afterClosed().subscribe(value => {
      if (value && value.url) {
        console.log(value.url);
      } else {
        this.messageService.showMobileInfoMessage(value && value.message ?
          value.message : 'Fails to select file', 2000, 'bottom');
      }
    });
  }
}
