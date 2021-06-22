import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConfigsService} from '../services/configs.service';
import {MenuModel} from '../models/menu.model';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {RbacService} from '../services/rbac.service';

@Component({
  selector: 'app-bottom-nav',
  template: `
    <ngx-bottom-nav style="position: sticky; bottom: 0; box-shadow: #0b2e13 0 0 4px; background: white">

      <button *ngFor="let m of first4" ngx-bottom-nav routerLink="{{m.link}}" exact="true">
        <mat-icon [color]="" ngxBottomNavIcon>{{m.icon}}</mat-icon>
        <span>{{m.name}}</span>
      </button>

      <button ngx-bottom-nav [matMenuTriggerFor]="menu">
        <mat-icon ngxBottomNavIcon>dehaze</mat-icon>
      </button>

    </ngx-bottom-nav>

    <mat-menu #menu>
      <div style="min-width: 200px">
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
        <button mat-menu-item (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          Logout
        </button>
        <div *ngFor="let mm of menus">
          <button mat-menu-item routerLink="{{mm.link}}">
            <mat-icon>{{mm.icon}}</mat-icon>
            {{mm.name}}
          </button>
        </div>
      </div>
    </mat-menu>
  `,
  styleUrls: []
})

export class BottomNavComponent implements OnInit, OnDestroy {
  first4: MenuModel[] = [];
  shop;
  menus = [];

  constructor(public readonly configs: ConfigsService,
              public readonly userService: UserService,
              public readonly rbacServices: RbacService,
              private readonly router: Router) {
  }

  ngOnDestroy(): void {
  }

  async ngOnInit(): Promise<void> {
    this.userService.getCurrentShop().then(shop => {
      this.shop = shop;
    }).catch(reason => {
      console.log(reason);
      this.shop = undefined;
    });
    let c = 0;
    for (const menu of this.configs.getMenu()) {
      if (await this.rbacServices.hasAccess(menu.roles, null)) {
        this.menus.push(menu);
      }
    }
    for (const menu of this.configs.getMenu()) {
      if (c === 3) {
        return;
      }
      if (await this.rbacServices.hasAccess(menu.roles, null)) {
        this.first4.push(menu);
        c++;
      }
    }
  }

  logout(): void {
    this.userService.logout(null).finally(() => {
      return this.router.navigateByUrl('/account/login');
    }).catch(console.log);
  }

}
