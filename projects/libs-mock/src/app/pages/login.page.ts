import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as bfast from 'bfast';
import {UserService} from '../../../../libs/src/public-api';
import {getDaasAddress, getFaasAddress} from '../../../../libs/src/public-api';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login',
  template: `
    <div style="height: 100vh; display: flex; justify-content: center; align-items: center; flex-direction: column">
      <mat-card>
        <mat-card-content>
          <form *ngIf="loginForm" [formGroup]="loginForm" (submit)="login()"
                style="display: flex; flex-direction: column">
            <mat-form-field style="width: 300px">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username">
              <mat-error>Field required</mat-error>
            </mat-form-field>
            <mat-form-field style="width: 300px">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password">
              <mat-error>Field required</mat-error>
            </mat-form-field>
            <button *ngIf="!isLogin" mat-flat-button color="primary">Login</button>
            <mat-progress-spinner color="primary" mode="indeterminate" diameter="30"
                                  *ngIf="isLogin"></mat-progress-spinner>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  isLogin = false;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly router: Router,
              private readonly userService: UserService,
              private readonly snack: MatSnackBar) {
  }

  login(): void {
    if (!this.loginForm.valid) {
      this.snack.open('Please fill all required fields', 'Ok', {duration: 3000});
    } else {
      this.isLogin = true;
      this.userService.login({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      }).then(async user => {
        const shops = await this.userService.getShops(user);
        const shop = shops[0];
        bfast.init({
          applicationId: shop.applicationId,
          projectId: shop.projectId,
          databaseURL: getDaasAddress(shop, environment.baseUrl),
          functionsURL: getFaasAddress(shop, environment.baseUrl),
          adapters: {
            http: 'DEFAULT',
            auth: 'DEFAULT',
            cache: 'DEFAULT'
          }
        }, shop.projectId);
        await this.userService.saveCurrentShop(shop);
        this.router.navigateByUrl('/').catch(console.log);
      }).catch(reason => {
        console.log(reason);
        this.snack.open(reason && reason.message ? reason.message : reason, 'Ok');
      }).finally(() => {
        this.isLogin = false;
      });
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.nullValidator, Validators.required]],
      password: ['', [Validators.nullValidator, Validators.required]],
    });
  }
}
