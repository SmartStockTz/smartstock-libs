import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MenuSheetComponent} from './menu-sheet.component';
import {ShopModel} from '../models/shop.model';
import {MenuModel} from '../models/menu.model';
import {UserService} from '../services/user.service';
import {NavigationService} from '../services/navigation.service';
import {RbacService} from '../services/rbac.service';

@Component({
  selector: 'app-bottom-nav',
  template: `
    <div class="n-container">

      <div matRipple class="nav-item" *ngFor="let m of first4?first4: []" routerLink="{{m.link}}">
        <mat-icon [color]="">{{m.icon}}</mat-icon>
        <span>{{m.name}}</span>
      </div>

      <div (click)="openMenu()" matRipple class="nav-item">
        <mat-icon>dehaze</mat-icon>
        <span>Menu</span>
      </div>

    </div>
  `,
  styleUrls: ['../styles/bottom-nav.style.scss']
})

export class BottomNavComponent implements OnInit, OnDestroy {
  shop: ShopModel;
  @Input() first4: MenuModel[];
  menus = [];

  constructor(private readonly matBottomSheet: MatBottomSheet,
              private readonly userService: UserService,
              public readonly configs: NavigationService,
              public readonly rbacServices: RbacService) {
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
    if (Array.isArray(this.first4)) {
      return;
    }
    let c = 0;
    for (const menu of this.configs.getMenu()) {
      if (await this.rbacServices.hasAccess(menu.roles, null)) {
        this.menus.push(menu);
      }
    }
    this.first4 = [];
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

  openMenu(): void {
    this.matBottomSheet.open(MenuSheetComponent, {
      closeOnNavigation: true,
      data: {
        shop: this.shop,
        menus: this.menus
      }
    });
  }
}
