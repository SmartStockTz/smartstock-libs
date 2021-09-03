import {Component, Input, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {EventService} from '../services/event.service';
import {UserService} from '../services/user.service';
import {LogService} from '../services/log.service';
import {SsmEvents} from '../utils/eventsNames.util';
import {ShopModel} from '../models/shop.model';
import {ConfigsService} from '../services/configs.service';

@Component({
  selector: 'app-drawer',
  template: `
    <div class="my-side-nav">
      <div>
        <div style="padding-bottom: 8px; display: flex; flex-direction: column; justify-content: center;align-items: center">
          <div style="padding: 16px; justify-content: center; align-items: center">
            <mat-icon *ngIf="!shop?.ecommerce?.logo" class="logo" color="primary">store</mat-icon>
            <img *ngIf="shop?.ecommerce?.logo" alt="logo" class="logo" src="{{shop?.ecommerce?.logo}}">
          </div>
          <span style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;"
                *ngIf="shop">{{shop.businessName}}</span>
          <span style="width: 4px; height: 4px"></span>
          <button style="width: 80%"
                  color="primary"
                  class="btn-block"
                  routerLink="/account/shop" mat-button>
            Change Shop
          </button>
        </div>

        <div class="d-flex justify-content-center align-items-center">
          <mat-divider></mat-divider>
        </div>

        <mat-nav-list>
          <app-libs-rbac *ngFor="let modules of configs.getMenu()" [groups]="modules.roles" [pagePath]="modules.link">
            <ng-template>
              <mat-list-item style="height: 38px"
                             (click)="shouldExpand(this.modules.name.toLowerCase().trim())"
                             [ngStyle]="this.configs.selectedModuleName.toLowerCase().trim() === modules.name.toLowerCase().trim()?selectedMenu:{}"
                             routerLink="{{modules.link}}">
                <mat-icon matListIcon matPrefix>{{modules.icon}}</mat-icon>
                <span matLine style="margin-left: 8px">{{modules.name}}</span>
              </mat-list-item>
              <div
                *ngIf="modules.pages && modules.pages.length>0 && this.configs.selectedModuleName.toLowerCase().trim() === this.modules.name.toLowerCase().trim()">
                <app-drawer-sub-menu *ngFor="let page of modules.pages" [page]="page"></app-drawer-sub-menu>
              </div>
              <mat-divider></mat-divider>
            </ng-template>
          </app-libs-rbac>
        </mat-nav-list>

      </div>
      <span style="flex-grow: 1"></span>
      <div style="display: flex; justify-content: center; align-items: center">
        <span>Version: {{versionNumber | async}}</span>
      </div>
    </div>
  `,
  styleUrls: ['../styles/admin-drawer.style.scss', '../styles/menu-sheet.component.scss']
})
export class DrawerComponent implements OnInit {

  constructor(private readonly userService: UserService,
              private readonly logger: LogService,
              public readonly configs: ConfigsService,
              private readonly eventApi: EventService) {
  }

  shop: ShopModel;
  currentUser: any;
  @Input() versionNumber: Observable<string> = of();
  selectedMenu = {
    background: '#1b5e20',
    borderTopRightRadius: '50px',
    borderBottomRightRadius: '50px',
    color: 'white'
  };

  ngOnInit(): void {
    this.versionNumber = of(this.configs.versionName);
    this.userService.getCurrentShop().then(shop => {
      this.shop = shop;
    }).catch(reason => {
      this.logger.i(reason);
      this.shop = undefined;
    });
    this.userService.currentUser().then(user => {
      this.currentUser = user;
    });
    this.eventApi.listen(SsmEvents.SETTINGS_UPDATED, data => {
      this.userService.getCurrentShop().then(shop => {
        this.shop = shop;
      }).catch(reason => {
        this.logger.e(reason, 'AdminDrawerComponent:37');
        this.shop = undefined;
      });
    });
  }

  shouldExpand(menuName: string): void {
    this.configs.selectedModuleName = menuName.toLowerCase().trim();
  }
}
