import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {StorageService} from '../services/storage.service';
import {UserService} from '../services/user.service';
import {UserModel} from '../models/user.model';
import {EventService} from '../services/event.service';

@Component({
  selector: 'smartstock-toolbar',
  template: `
    <mat-toolbar style="position: sticky; top: 0" [color]="color" class="mat-elevation-z4">
      <mat-toolbar-row>
        <!--        <button routerLink="{{backLink}}" *ngIf="hasBackRoute && backLink" mat-icon-button>-->
        <!--          <mat-icon>arrow_back</mat-icon>-->
        <!--        </button>-->
        <button mat-icon-button *ngIf="sidenav" (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span>{{heading}}</span>
        <span *ngIf="isMobile" style="flex: 1 1 auto"></span>
        <span *ngIf="!isMobile && showSearch" style="width: 16px"></span>
        <span *ngIf="!isMobile && !showSearch" style="flex: 1 1 auto"></span>
        <smartstock-search-input [searchProgressFlag]="searchProgressFlag"
                                 *ngIf="!isMobile && showSearch" style="flex: 1 1 auto"
                                 [showSearch]="showSearch"
                                 [searchInputControl]="searchInputControl"
                                 [searchPlaceholder]="searchPlaceholder">
        </smartstock-search-input>
        <span *ngIf="!isMobile && showSearch" style="width: 16px"></span>
        <button *ngIf="cartDrawer" mat-icon-button (click)="cartDrawer.toggle()">
          <mat-icon>shopping_cart</mat-icon>
        </button>
        <button class="ft-button" mat-button [matMenuTriggerFor]="menu">
          <mat-icon>account_circle</mat-icon>
          <span *ngIf="currentUser">{{"  " + currentUser.firstname}}</span>
        </button>
        <button *ngIf="isMobile" mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
          <!--      <span *ngIf="currentUser">{{"  " + currentUser.username}}</span>-->
        </button>
        <mat-menu #menu>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            Logout
          </button>
          <button mat-menu-item routerLink="/account/profile">
            <mat-icon>person</mat-icon>
            My Profile
          </button>
        </mat-menu>
      </mat-toolbar-row>

      <mat-toolbar-row *ngIf="isMobile && showSearch">
        <!--    <span style="flex-grow: 1"></span>-->
        <smartstock-search-input [searchProgressFlag]="searchProgressFlag"
                                 style="flex: 1 1 auto"
                                 [showSearch]="showSearch"
                                 [searchInputControl]="searchInputControl"
                                 [searchPlaceholder]="searchPlaceholder">
        </smartstock-search-input>
        <!--    <span style="flex-grow: 1"></span>-->
      </mat-toolbar-row>
    </mat-toolbar>
  `,
})
export class ToolbarComponent implements OnInit {
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
  currentUser: UserModel;
  @Input() searchProgressFlag = false;
  @Input() isMobile = false;

  constructor(private readonly router: Router,
              private readonly storage: StorageService,
              private readonly userDatabase: UserService,
              private readonly eventService: EventService) {
  }

  ngOnInit(): void {
    this.storage.getActiveUser().then(user => {
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

  logout(): void {
    this.userDatabase.logout(null).finally(() => {
      return this.router.navigateByUrl('/account/login');
    }).catch(console.log);
  }

  private _clearSearchInputListener(): void {
    // this.eventService.listen(SsmEvents.ADD_CART, data => {
    //   this.searchInputControl.reset('');
    // });
  }
}
