import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {Observable} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'smartstock-layout-sidenav',
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav [mode]="leftDrawerMode" [opened]="leftDrawerOpened" position="start">
        <ng-container *ngTemplateOutlet="leftDrawer"></ng-container>
      </mat-sidenav>
      <mat-sidenav #cartDrawer [mode]="rightDrawerMode" [opened]="rightDrawerOpened" position="end">
        <ng-container *ngTemplateOutlet="rightDrawer"></ng-container>
      </mat-sidenav>
      <mat-sidenav-content style="min-height: 100vh">
        <smartstock-toolbar [sidenav]="leftDrawer?sidenav:undefined"
                            [showProgress]="showProgress"
                            [hasBackRoute]="hasBackRoute"
                            [backLink]="backLink"
                            [cartDrawer]="rightDrawer?cartDrawer:undefined"
                            [showSearch]="showSearch"
                            (searchCallback)="searchCallback.emit($event)"
                            [searchInputControl]="searchInputControl"
                            [searchPlaceholder]="searchPlaceholder"
                            [searchProgressFlag]="searchProgressFlag"
                            [color]="color"
                            [isMobile]="isMobile"
                            [heading]="heading">
        </smartstock-toolbar>
        <ng-container *ngTemplateOutlet="body"></ng-container>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class SidenavLayoutComponent {
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
}
