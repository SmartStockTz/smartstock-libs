import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {FilesService, IpfsService, MessageService} from '../../../../libs/src/public-api';
import * as bfast from 'bfast';

@Component({
  template: `
    <app-layout-sidenav [heading]="'Core Libs'"
                        [leftDrawer]="drawer"
                        [leftDrawerMode]="'side'"
                        [leftDrawerOpened]="true"
                        [hasBackRoute]="true"
                        [backLink]="'/'"
                        [showSearch]="true"
                        [visibleMenu]="vM"
                        [hiddenMenu]="iVM"
                        [searchPlaceholder]="'search...'"
                        [version]="mock" [body]="body">
      <ng-template #vM>
        <button mat-icon-button>
          <mat-icon>add</mat-icon>
        </button>
      </ng-template>
      <ng-template #iVM>
        <button mat-menu-item>
          <span>More buttons</span>
          <mat-icon>favorite</mat-icon>
        </button>
      </ng-template>
      <ng-template #drawer>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div style="min-height: 120vh; padding: 24px">
          <h1>File Browser</h1>
          <button style="margin-bottom: 16px" color="primary" (click)="showFileBrowser()" mat-flat-button>
            Choose
          </button>
          <mat-divider></mat-divider>
          <h1>RBAC</h1>
          <app-libs-rbac *ngFor="let i of [1,2]" [groups]="['*']">
            <ng-template>
              <h1>Access To All {{i}}</h1>
            </ng-template>
          </app-libs-rbac>
          <mat-divider></mat-divider>
          <h1>Protected path by using RbacGuard</h1>
          <button routerLink="/profile" mat-flat-button color="primary">Go to</button>
          <mat-divider></mat-divider>
          <h1>Ipfs</h1>
          <button (click)="check()" mat-flat-button color="primary">check</button>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `
})
export class LandPageComponent implements OnInit, OnDestroy {
  mock: Observable<string> = of('mock_11');
  // private syncs;

  constructor(private readonly dialog: MatDialog,
              private readonly messageService: MessageService,
              private readonly filesService: FilesService) {
  }

  async showFileBrowser(): Promise<void> {
    this.filesService.browse().then(value => {
      console.log(value);
    });
  }

  check(): void {
    IpfsService.getDataFromCid('bafkreid6gb3zs5ov3lwg6pqv3ncufe6ch3i27s6srywla6d6thr4je74pq')
      .then(console.log)
      .catch(console.log);
  }

  ngOnDestroy(): void {
    // if (this.syncs && this.syncs.close) {
    //   this.syncs.close();
    // }
  }

  ngOnInit(): void {
    // this.syncs = bfast.database().syncs('categories');
    // this.syncs.upload().then(_ => {
    //   // console.log(value);
    //   setTimeout(() => this.syncs.changes().delete('test'), 5000);
    //   setTimeout(() => console.log(this.syncs.changes().toJSON()), 1000);
    // }).catch(console.log);
  }

}
