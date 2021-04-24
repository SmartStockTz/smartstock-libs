import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ConfigsService, LibModule} from '../../../libs/src/public-api';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {HttpClientModule} from '@angular/common/http';
import {BFast} from 'bfastjs';
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly configs: ConfigsService) {
    BFast.init({
      applicationId: environment.smartstock.applicationId,
      projectId: environment.smartstock.projectId,
      appPassword: environment.smartstock.pass,
    });
    configs.versionName = 'demo-libs';
    this.configs.addMenu({
      name: 'Profile',
      icon: 'supervisor_account',
      link: '/account',
      roles: ['*'],
      pages: [
        {
          link: '/login',
          roles: ['*'],
          name: 'Login'
        }
      ]
    });
    this.configs.selectedModuleName = 'profile';
  }
}
