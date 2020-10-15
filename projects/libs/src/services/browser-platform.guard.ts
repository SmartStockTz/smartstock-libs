import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrowserPlatformGuard implements CanActivate {
  constructor(private readonly router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
    // if (environment.browser) {
    //   return true;
    // } else {
    //   this.router.navigateByUrl('/account/login').catch(console.log);
    //   return false;
    // }
  }
}
