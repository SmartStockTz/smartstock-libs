import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {StorageService} from '../services/storage.service';
import {UserService} from '../services/user.service';
import {LibUserModel} from '../models/lib-user.model';
import {Subject} from 'rxjs';
import {DeviceState} from '../states/device.state';

@Component({
  selector: 'app-toolbar',
  template: `
    <mat-toolbar [ngStyle]="(deviceState.isSmallScreen | async)===true?{}:{position: 'sticky', top: 0, 'z-index': 3000000000}"
                 color="{{(deviceState.isSmallScreen | async)===true?'':'primary'}}"
                 [ngClass]="(deviceState.isSmallScreen | async)===true?'mat-elevation-z0':'mat-elevation-z2'">
      <mat-toolbar-row [class]="(deviceState.isSmallScreen | async)===true?'toolbar-position-mobile nav-mobile':''">
        <button routerLink="{{backLink}}" *ngIf="hasBackRoute && backLink && (deviceState.isSmallScreen | async)===true" mat-icon-button>
          <mat-icon>chevron_left</mat-icon>
        </button>
        <button mat-icon-button *ngIf="sidenav && (deviceState.isSmallScreen | async)===false" (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="text-truncate">{{heading}}</span>
        <span *ngIf="(deviceState.isSmallScreen | async)===true" style="flex: 1 1 auto"></span>
        <span *ngIf=" (deviceState.isSmallScreen | async)===false && showSearch" style="width: 16px"></span>
        <span *ngIf="(deviceState.isSmallScreen | async)===false && !showSearch" style="flex: 1 1 auto"></span>
        <app-search-input [searchProgressFlag]="searchProgressFlag"
                          *ngIf="(deviceState.isSmallScreen | async)===false && showSearch" style="flex: 1 1 auto"
                          [showSearch]="showSearch"
                          [searchInputControl]="searchInputControl"
                          [searchPlaceholder]="searchPlaceholder">
        </app-search-input>
        <span *ngIf="(deviceState.isSmallScreen | async)===false && showSearch" style="width: 16px"></span>
        <button *ngIf="cartDrawer" mat-icon-button (click)="cartDrawer.toggle()">
          <mat-icon>shopping_cart</mat-icon>
        </button>

        <ng-container *ngTemplateOutlet="visibleMenu"></ng-container>
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>

        <mat-menu #menu>
          <ng-container *ngTemplateOutlet="hiddenMenu"></ng-container>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            Logout
          </button>
          <button mat-menu-item routerLink="/account/profile">
            <mat-icon>person</mat-icon>
            <span *ngIf="currentUser">{{"  " + currentUser.firstname}}</span>
          </button>
        </mat-menu>
      </mat-toolbar-row>
    </mat-toolbar>
    <mat-toolbar-row *ngIf="(deviceState.isSmallScreen | async)===true && showSearch">
      <app-search-input [searchProgressFlag]="searchProgressFlag"
                        style="flex: 1 1 auto"
                        [showSearch]="showSearch"
                        [searchInputControl]="searchInputControl"
                        [searchPlaceholder]="searchPlaceholder">
      </app-search-input>
    </mat-toolbar-row>
  `,
  styleUrls: ['../styles/toolbar.style.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Input() visibleMenu: TemplateRef<any>;
  @Input() hiddenMenu: TemplateRef<any>;
  @Input() color = 'primary';
  @Input() heading: string;
  @Input() showProgress = false;
  @Input() sidenav: MatSidenav;
  @Input() hasBackRoute = false;
  @Input() backLink: string;
  @Input() cartDrawer: MatSidenav;
  @Input() showSearch = false;
  @Output() searchCallback = new EventEmitter<string>();
  @Input() searchInputControl = new FormControl('');
  @Input() searchPlaceholder: string | 'Type to search';
  currentUser: LibUserModel;
  @Input() searchProgressFlag = false;
  destroy = new Subject();

  constructor(private readonly router: Router,
              private readonly storage: StorageService,
              public readonly deviceState: DeviceState,
              private readonly userService: UserService) {
  }

  ngOnInit(): void {
    this.deviceState.isSmallScreen.pipe(takeUntil(this.destroy)).subscribe(value => {
      if (this.sidenav && value === true) {
        this.sidenav.close().catch(console.log);
      }
    });
    this.userService.currentUser().then(user => {
      this.currentUser = user;
    });
    this.searchInputControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(_ => {
      this.searchCallback.emit(this.searchInputControl.value);
    });
    this._clearSearchInputListener();
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }

  logout(): void {
    this.userService.logout(null).finally(() => {
      return this.router.navigateByUrl('/account/login');
    }).catch(console.log);
  }

  private _clearSearchInputListener(): void {
    // this.eventService.listen(SsmEvents.ADD_CART, data => {
    //   this.searchInputControl.reset('');
    // });
  }
}
