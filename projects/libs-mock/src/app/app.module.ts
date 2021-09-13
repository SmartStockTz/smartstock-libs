import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ConfigsService, LibModule} from '../../../libs/src/public-api';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {HttpClientModule} from '@angular/common/http';
import * as bfast from 'bfast';
import {environment} from '../environments/environment';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoginPageComponent} from './pages/login.page';
import {MatCardModule} from '@angular/material/card';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LandPageComponent} from './pages/land.page';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';


const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'profile', component: LandPageComponent},
  {path: '', component: LandPageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LandPageComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    LibModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    HttpClientModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly configs: ConfigsService) {
    bfast.init({
      applicationId: environment.smartstock.applicationId,
      projectId: environment.smartstock.projectId,
      appPassword: environment.smartstock.pass,
    });
    configs.versionName = 'demo-libs';
    [
      {
        name: 'Dashboard',
        link: '/dashboard',
        roles: ['admin'],
        icon: 'dashboard',
      },
      {
        name: 'Report',
        link: '/report',
        roles: ['admin'],
        icon: 'table_chart'
      },
      {
        name: 'Sale',
        link: '/sale',
        roles: ['*'],
        icon: 'shop_front',
      },
      {
        name: 'Purchase',
        link: '/purchase',
        roles: ['manager', 'admin'],
        icon: 'receipt',
      },
      {
        name: 'Stock',
        link: '/stock',
        roles: ['manager', 'admin'],
        icon: 'store',
      },
      {
        name: 'Account',
        link: '/account',
        roles: ['*'],
        icon: 'supervisor_account',
      },
    ].forEach(menu => {
      this.configs.addMenu(menu);
    });

    this.configs.addMenu({
      name: 'Report',
      link: '/report',
      roles: ['admin'],
      icon: 'shop_front',
      pages: [
        {
          name: 'overview',
          link: '/report/retail',
          roles: ['admin'],
          click: null
        },
        {
          name: 'performance',
          link: '/report/whole',
          roles: ['admin'],
          click: null
        }
      ]
    });
    this.configs.addMenu({
      name: 'Sale',
      link: '/sale',
      roles: ['*'],
      icon: 'shop_front',
      pages: [
        {
          name: 'retail',
          link: '/sale/retail',
          roles: ['*'],
          click: null
        },
        {
          name: 'wholesale',
          link: '/sale/whole',
          roles: ['admin'],
          click: null
        }
      ]
    });
    this.configs.selectedModuleName = 'sale';
  }
}
