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

export const configs = {version: ''};

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
    MatRippleModule
  ],
  exports: [
    DrawerComponent,
    ToolbarComponent,
    ShopsPipe,
    OnFetchComponent,
    BottomBarComponent,
    DataNotReadyComponent,
    UploadFilesComponent,
    DashCardComponent,
    UploadFileProgressComponent
  ],
  declarations: [
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
    VerifyEMailDialogComponent
  ]
})

export class LibModule {
  static start(config: { version: string } = {version: ''}): void {
    configs.version = config.version;
  }
}
