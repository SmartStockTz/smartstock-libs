import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {ShopModel} from '../models/shop.model';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {NavigationService} from '../services/navigation.service';

// @dynamic

@Component({
  selector: 'app-menu-sheet',
  template: `
    <div style="min-width: 200px">
      <div
        style="padding-bottom: 8px; display: flex; flex-direction: column; justify-content: center;align-items: center">
        <div style="padding: 16px; justify-content: center; align-items: center">
          <mat-icon *ngIf="!data?.shop?.ecommerce?.logo" class="logo" color="primary">store</mat-icon>
          <img *ngIf="data?.shop?.ecommerce?.logo" alt="logo" class="logo" src="{{data?.shop?.ecommerce?.logo}}">
        </div>
        <span style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;"
              *ngIf="data?.shop">{{data?.shop.businessName}}</span>
        <span style="width: 4px; height: 4px"></span>
        <button style="width: 80%"
                color="primary"
                class="btn-block"
                (click)="goTo('/account/shop')" mat-button>
          Change Shop
        </button>
      </div>
      <button mat-menu-item (click)="logout()">
        <mat-icon color="primary">exit_to_app</mat-icon>
        Logout
      </button>
      <div *ngFor="let mm of data?.menus">
        <button mat-menu-item (click)="goTo(mm.link)">
          <mat-icon color="primary">{{mm.icon}}</mat-icon>
          {{mm.name}}
        </button>
      </div>
      <div class="version">
        <p>Version: {{version}}</p>
      </div>
    </div>
  `,
  styleUrls: ['../styles/menu-sheet.component.scss']
})
export class MenuSheetComponent implements OnInit {
  version = '';
  constructor(private readonly sheetRef: MatBottomSheetRef<MenuSheetComponent>,
              private readonly userService: UserService,
              private readonly navService: NavigationService,
              private readonly router: Router,
              @Inject(MAT_BOTTOM_SHEET_DATA) public readonly data: {
                shop: ShopModel,
                menus: any[]
              }) {
  }

  logout(): void {
    this.userService.logout(null).finally(() => {
      this.goTo('/');
    }).catch(console.log);
  }

  goTo(link: string): void {
    this.sheetRef.dismiss();
    this.router.navigateByUrl(link).catch(console.log);
  }

  async ngOnInit(): Promise<void> {
    this.version = this.navService.versionName;
  }
}
