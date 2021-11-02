import {NgModule} from '@angular/core';
import {DrawerComponent} from './components/drawer.component';
import {ToolbarComponent} from './components/toolbar.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {NoStockDialogComponent} from './components/no-stock-dialog.component';
import {ShopsPipe} from './pipes/shops.pipe';
import {MatBadgeModule} from '@angular/material/badge';
import {OnFetchComponent} from './components/on-fetch.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SearchInputComponent} from './components/search-input.component';
import {BottomBarComponent} from './components/bottom-bar.component';
import {DataNotReadyComponent} from './components/data-not-ready.component';
import {UploadFilesComponent} from './components/upload-files.component';
import {MatRippleModule} from '@angular/material/core';
import {DashCardComponent} from './components/dash-card.component';
import {CommonModule} from '@angular/common';
import {UploadFileProgressComponent} from './components/upload-file-progress.component';
import {VerifyEMailDialogComponent} from './components/verify-email-dialog.component';
import {DialogDeleteComponent} from './components/delete-dialog.component';
import {SidenavLayoutComponent} from './components/sidenav-layout.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RbacComponent} from './components/rbac.component';
import {FileBrowserDialogComponent} from './components/file-browser-dialog.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {DrawerSubMenuComponent} from './components/drawer-sub-menu.component';
import {FileBrowserSheetComponent} from './components/file-browser-sheet.component';
import {BottomNavComponent} from './components/bottom-nav.component';
import {RbacGuardComponent} from './components/rbac-guard.component';
import {MenuSheetComponent} from './components/menu-sheet.component';

// const env = {baseUrl: 'https://smartstock-faas.bfast.fahamutech.com'};

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatExpansionModule,
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatBadgeModule,
    MatTooltipModule,
    MatRippleModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatChipsModule,
    MatInputModule,
  ],
  exports: [
    DrawerComponent,
    FileBrowserDialogComponent,
    ToolbarComponent,
    ShopsPipe,
    OnFetchComponent,
    BottomBarComponent,
    DataNotReadyComponent,
    UploadFilesComponent,
    DashCardComponent,
    UploadFileProgressComponent,
    FileBrowserDialogComponent,
    FileBrowserSheetComponent,
    SidenavLayoutComponent,
    RbacComponent,
  ],
  declarations: [
    RbacGuardComponent,
    FileBrowserDialogComponent,
    DrawerSubMenuComponent,
    DrawerComponent,
    ToolbarComponent,
    NoStockDialogComponent,
    ShopsPipe,
    OnFetchComponent,
    SearchInputComponent,
    BottomBarComponent,
    DataNotReadyComponent,
    UploadFilesComponent,
    DashCardComponent,
    DialogDeleteComponent,
    UploadFileProgressComponent,
    VerifyEMailDialogComponent,
    SidenavLayoutComponent,
    RbacComponent,
    FileBrowserSheetComponent,
    BottomNavComponent,
    MenuSheetComponent
  ],
  // providers: [
  //   {
  //     provide: 'env',
  //     useValue: env
  //   }
  // ]
})

export class LibModule {
  // public static forRoot(
  //   environment: { baseUrl: string } = env
  // ): ModuleWithProviders<LibModule> {
  //   return {
  //     ngModule: LibModule,
  //     providers: [
  //       {
  //         provide: 'env',
  //         useValue: environment
  //       }
  //     ]
  //   };
  // }
}
