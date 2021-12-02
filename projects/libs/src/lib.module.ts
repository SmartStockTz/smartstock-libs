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
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {DrawerSubMenuComponent} from './components/drawer-sub-menu.component';
import {FileBrowserSheetComponent} from './components/file-browser-sheet.component';
import {BottomNavComponent} from './components/bottom-nav.component';
import {RbacGuardComponent} from './components/rbac-guard.component';
import {MenuSheetComponent} from './components/menu-sheet.component';
import {ImagePreviewComponent} from './components/image-preview.component';
import {VideoPreviewComponent} from './components/video-preview.component';
import {AudioPreviewComponent} from './components/audio-preview.component';
import {OtherFilePreviewComponent} from './components/other-file-preview.component';
import {FedhaPipe} from './pipes/fedha.pipe';
import {PaymentDialogComponent} from './components/payment-dialog.component';

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
    PaymentDialogComponent,
    DrawerComponent,
    ToolbarComponent,
    ShopsPipe,
    OnFetchComponent,
    DataNotReadyComponent,
    UploadFilesComponent,
    DashCardComponent,
    UploadFileProgressComponent,
    FileBrowserSheetComponent,
    SidenavLayoutComponent,
    RbacComponent,
    FedhaPipe
  ],
  declarations: [
    FedhaPipe,
    PaymentDialogComponent,
    ImagePreviewComponent,
    VideoPreviewComponent,
    AudioPreviewComponent,
    OtherFilePreviewComponent,
    RbacGuardComponent,
    DrawerSubMenuComponent,
    DrawerComponent,
    ToolbarComponent,
    NoStockDialogComponent,
    ShopsPipe,
    OnFetchComponent,
    SearchInputComponent,
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
  ]
})

export class LibModule {
}
