import {Component, Input, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {EventService} from '../services/event.service';
import {UserService} from '../services/user.service';
import {LogService} from '../services/log.service';
import {SsmEvents} from '../utils/eventsNames.util';
import {ShopModel} from '../models/shop.model';
import {ConfigsService} from '../services/configs.service';

@Component({
  selector: 'smartstock-drawer',
  template: `
    <div class="my-side-nav">
      <div>
        <div style="padding-bottom: 8px; display: flex; flex-direction: column; justify-content: center;align-items: center">
          <div style="padding: 16px; justify-content: center; align-items: center">
            <mat-icon style="width: 70px; height: 70px; font-size: 70px" color="primary">store</mat-icon>
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

          <smartstock-libs-rbac [groups]="['admin']" [component]="dashboard">
            <ng-template #dashboard>
              <mat-list-item [ngStyle]="shouldExpand('dashboard')?selectedMenu:{}" routerLink="/dashboard">
                <mat-icon matListIcon matPrefix>dashboard</mat-icon>
                <span matLine style="margin-left: 8px">Dashboard</span>
              </mat-list-item>
              <mat-divider></mat-divider>
            </ng-template>
          </smartstock-libs-rbac>

          <smartstock-libs-rbac [groups]="['admin']" [component]="report">
            <ng-template #report>
              <mat-list-item [ngStyle]="shouldExpand('report')?selectedMenu:{}" routerLink="/report">
                <mat-icon matListIcon matPrefix>table_chart</mat-icon>
                <span matLine style="margin-left: 8px">Report</span>
              </mat-list-item>
              <mat-divider></mat-divider>
            </ng-template>
          </smartstock-libs-rbac>

          <!--          <smartstock-libs-rbac [groups]="['admin', 'manager', 'user']" [component]="sale">-->
          <!--            <ng-template #sale>-->
          <mat-list-item [ngStyle]="shouldExpand('sale')?selectedMenu:{}" routerLink="/sale">
            <mat-icon matListIcon matPrefix>shop_front</mat-icon>
            <span matLine style="margin-left: 8px">Sale</span>
          </mat-list-item>
          <mat-divider></mat-divider>
          <!--            </ng-template>-->
          <!--          </smartstock-libs-rbac>-->

          <smartstock-libs-rbac [groups]="['admin', 'manager']" [component]="purchase">
            <ng-template #purchase>
              <mat-list-item [ngStyle]="shouldExpand('purchase')?selectedMenu:{}" routerLink="/purchase">
                <mat-icon matListIcon matPrefix>receipts</mat-icon>
                <span matLine style="margin-left: 8px">Purchase</span>
              </mat-list-item>
              <mat-divider></mat-divider>
            </ng-template>
          </smartstock-libs-rbac>

          <smartstock-libs-rbac [groups]="['admin', 'manager']" [component]="stock">
            <ng-template #stock>
              <mat-list-item [ngStyle]="shouldExpand('stock')?selectedMenu:{}" routerLink="/stock">
                <mat-icon matListIcon matPrefix>store</mat-icon>
                <span matLine style="margin-left: 8px">Stock</span>
              </mat-list-item>
              <mat-divider></mat-divider>
            </ng-template>
          </smartstock-libs-rbac>

          <!--          <smartstock-libs-rbac [groups]="['admin', 'manager', 'user']" [component]="account">-->
          <!--            <ng-template #account>-->
          <mat-list-item [ngStyle]="shouldExpand('account')?selectedMenu:{}" routerLink="/account">
            <mat-icon matListIcon matPrefix>supervisor_account</mat-icon>
            <span matLine style="margin-left: 8px">Profile</span>
          </mat-list-item>
          <!--            </ng-template>-->
          <!--          </smartstock-libs-rbac>-->

        </mat-nav-list>

      </div>
      <span style="flex-grow: 1"></span>
      <div style="display: flex; justify-content: center; align-items: center">
        <span>Version: {{versionNumber | async}}</span>
      </div>
    </div>
  `,
  styleUrls: ['../styles/admin-drawer.style.scss']
})
export class DrawerComponent implements OnInit {

  constructor(private readonly userService: UserService,
              private readonly logger: LogService,
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
    this.versionNumber = of(ConfigsService.versionName);
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

  shouldExpand(route: string): boolean {
    const url = new URL(location.href);
    return url.pathname.startsWith('/' + route);
  }

  isManager(): boolean {
    return this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'manager');
  }

  isAdmin(): boolean {
    return this.currentUser && (this.currentUser.role === 'admin');
  }
}
