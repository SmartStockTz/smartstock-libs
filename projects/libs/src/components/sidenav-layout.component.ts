import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {UntypedFormControl} from '@angular/forms';
import {DeviceState} from '../states/device.state';
import {takeUntil} from 'rxjs/operators';
import {CartDrawerState} from '../states/cart-drawer-state';
import {MenuModel} from '../models/menu.model';

@Component({
  selector: 'app-layout-sidenav',
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav [mode]="leftDrawerMode" [opened]="leftDrawerOpened" position="start">
        <ng-container *ngTemplateOutlet="leftDrawer"></ng-container>
      </mat-sidenav>
      <mat-sidenav #cartDrawer [mode]="rightDrawerMode" [opened]="rightDrawerOpened" position="end">
        <ng-container *ngTemplateOutlet="rightDrawer"></ng-container>
      </mat-sidenav>
      <mat-sidenav-content class="sidenav-container">
        <app-toolbar [sidenav]="leftDrawer?sidenav:undefined"
                     [showProgress]="showProgress"
                     [hasBackRoute]="hasBackRoute"
                     [backLink]="backLink"
                     [cartDrawer]="rightDrawer?cartDrawer:undefined"
                     [showSearch]="showSearch"
                     [color]="color"
                     [showModuleMenu]="showModuleMenu"
                     (searchCallback)="searchCallback.emit($event)"
                     [searchInputControl]="searchInputControl"
                     [searchPlaceholder]="searchPlaceholder"
                     [searchProgressFlag]="searchProgressFlag"
                     [visibleMenu]="visibleMenu"
                     [hiddenMenu]="hiddenMenu"
                     [cartIcon]="cartIcon"
                     [cartBadge]="cartBadge"
                     [heading]="heading">
        </app-toolbar>
        <div class="sidenav-body">
          <ng-container *ngTemplateOutlet="body"></ng-container>
        </div>
<!--        <app-bottom-nav [first4]="first4" *ngIf="isSmallScreen && showBottomBar"></app-bottom-nav>-->
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/index.style.scss']
})
export class SidenavLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() first4: MenuModel[];
  @Input() showModuleMenu;
  @Input() showBottomBar = true;
  @Input() visibleMenu: TemplateRef<any>;
  @Input() hiddenMenu: TemplateRef<any>;
  @Input() body: TemplateRef<any>;
  @Input() version: Observable<string>;
  @Input() isMobile = false;
  @Input() heading: string;
  @Input() showProgress = false;
  @Input() sidenav: MatSidenav;
  @Input() hasBackRoute = false;
  @Input() backLink: string;
  @Input() rightDrawer: TemplateRef<any>;
  @Input() showSearch = false;
  @Output() searchCallback = new EventEmitter<string>();
  @Input() searchInputControl = new UntypedFormControl('');
  @Input() searchPlaceholder: string | 'Type to search';
  @Input() searchProgressFlag = false;
  @Input() leftDrawer: TemplateRef<any>;
  @Input() leftDrawerMode: 'over' | 'side' | 'push' = 'over';
  @Input() rightDrawerMode: 'over' | 'side' | 'push' = 'side';
  @Input() leftDrawerOpened = false;
  @Input() rightDrawerOpened = false;
  @Input() color = 'primary';
  @ViewChild('cartDrawer') cartDrawer: MatSidenav;
  @Input() cartIcon = 'shopping_cart';
  @Input() cartBadge = 0;
  destroy = new Subject();
  isSmallScreen = false;

  constructor(private readonly deviceState: DeviceState,
              private readonly cartDrawerState: CartDrawerState) {
  }

  ngOnDestroy(): void {
    this.destroy.next('done');
    this.cartDrawerState.drawer.next(null);
  }

  ngOnInit(): void {
    this.deviceState.isSmallScreen
      .pipe(takeUntil(this.destroy))
      .subscribe(value => {
        this.isSmallScreen = value;
      });
  }

  ngAfterViewInit(): void {
    this.cartDrawerState.drawer.next(this.cartDrawer);
  }
}
