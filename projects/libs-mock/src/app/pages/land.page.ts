import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MessageService} from '../../../../libs/src/services/message.service';
import {FilesService} from '../../../../libs/src/public-api';

@Component({
  template: `
    <app-layout-sidenav [heading]="'Core Libs'"
                        [leftDrawer]="drawer"
                        [leftDrawerMode]="'side'"
                        [leftDrawerOpened]="true"
                        [hasBackRoute]="true"
                        [backLink]="'/'"
                        [showSearch]="true"
                        [searchPlaceholder]="'search...'"
                        [version]="mock" [body]="body">
      <ng-template #drawer>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div style="height: 200vh">
          <h1>body Contents</h1>
          <button color="primary" (click)="showFileBrowser()" mat-flat-button>
            Show File Browser
          </button>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `
})
export class LandPageComponent {
  title = 'libs-mock';
  mock: Observable<string> = of('mock_11');

  constructor(private readonly dialog: MatDialog,
              private readonly messageService: MessageService,
              private readonly filesService: FilesService) {
  }

  async showFileBrowser(): Promise<void> {
    this.filesService.browse().then(value => {
      console.log(value);
    });
  }
}
