import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {init} from 'bfast';
import {UserService} from '../services/user.service';
import {getDaasAddress, getFaasAddress} from '../utils/bfast.util';

@Injectable({
  providedIn: 'root'
})
export class ActiveShopGuard implements CanActivate {
  constructor(private readonly userService: UserService,
              private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      try {
        const activeShop = await this.userService.getCurrentShop();
        if (activeShop && activeShop.projectId && activeShop.applicationId) {
          init({
            applicationId: activeShop.applicationId,
            projectId: activeShop.projectId,
            appPassword: activeShop.masterKey,
            adapters: {
              auth: 'DEFAULT',
              cache: 'DEFAULT',
              http: 'DEFAULT'
            },
            databaseURL: getDaasAddress(activeShop),
            functionsURL: getFaasAddress(activeShop)
          }, activeShop.projectId);
          resolve(true);
        } else {
          this.router.navigateByUrl('/account/shop').catch(reason => console.log(reason));
          reject(false);
        }
      } catch (e) {
        this.router.navigateByUrl('/account/shop').catch(reason => console.log(reason));
        reject(false);
      }
    });
  }
}
