import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {FormControl} from '@angular/forms';
import {DeviceState} from '../states/device.state';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-layout-sidenav',
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav [mode]="leftDrawerMode" [opened]="leftDrawerOpened" position="start">
        <div *ngIf="!isSmallScreen">
          <ng-container *ngTemplateOutlet="leftDrawer"></ng-container>
        </div>
      </mat-sidenav>
      <mat-sidenav #cartDrawer [mode]="rightDrawerMode" [opened]="rightDrawerOpened" position="end">
        <ng-container *ngTemplateOutlet="rightDrawer"></ng-container>
      </mat-sidenav>
      <mat-sidenav-content style="height: 100vh">
        <app-toolbar [sidenav]="leftDrawer?sidenav:undefined"
                     [showProgress]="showProgress"
                     [hasBackRoute]="hasBackRoute"
                     [backLink]="backLink"
                     [cartDrawer]="rightDrawer?cartDrawer:undefined"
                     [showSearch]="showSearch"
                     (searchCallback)="searchCallback.emit($event)"
                     [searchInputControl]="searchInputControl"
                     [searchPlaceholder]="searchPlaceholder"
                     [searchProgressFlag]="searchProgressFlag"
                     [visibleMenu]="visibleMenu"
                     [hiddenMenu]="hiddenMenu"
                     [heading]="heading">
        </app-toolbar>
        <div id="m-body" style="margin-bottom: 100px">
          <ng-container *ngTemplateOutlet="body"></ng-container>
        </div>
        <app-bottom-nav *ngIf="isSmallScreen"></app-bottom-nav>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class SidenavLayoutComponent implements OnInit, OnDestroy {
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
  @Input() searchInputControl = new FormControl('');
  @Input() searchPlaceholder: string | 'Type to search';
  @Input() searchProgressFlag = false;
  @Input() leftDrawer: TemplateRef<any>;
  @Input() leftDrawerMode: 'over' | 'side' | 'push' = 'over';
  @Input() rightDrawerMode: 'over' | 'side' | 'push' = 'side';
  @Input() leftDrawerOpened = false;
  @Input() rightDrawerOpened = false;
  @Input() color = 'primary';
  destroy = new Subject();
  isSmallScreen = false;

  constructor(private readonly deviceState: DeviceState) {
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }

  ngOnInit(): void {
    this.deviceState.isSmallScreen
      .pipe(takeUntil(this.destroy))
      .subscribe(value => {
        this.isSmallScreen = value;
      });
  }
}
