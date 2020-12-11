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
import {ConfigsService} from './services/configs.service';
import {SidenavLayoutComponent} from './components/sidenav-layout.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RbacComponent} from './components/rbac.component';
import {FileBrowserDialogComponent} from './components/file-browser-dialog.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatChipsModule} from '@angular/material/chips';

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
    MatChipsModule
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
    SidenavLayoutComponent,
    RbacComponent
  ],
  declarations: [
    FileBrowserDialogComponent,
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
    RbacComponent
  ]
})

export class LibModule {
  static start(config: {
    browser?: boolean;
    production?: boolean;
    electron?: boolean;
    version?: string
  } = {version: '', browser: true, electron: true, production: true}): void {
    ConfigsService.versionName = config.version;
    ConfigsService.browser = config.browser;
    ConfigsService.electron = config.electron;
    ConfigsService.production = config.production;
  }
}
