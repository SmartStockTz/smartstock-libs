import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {RbacService} from '../services/rbac.service';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private readonly router: Router,
              private readonly rbacService: RbacService,
              private readonly userDatabase: UserService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.userDatabase.currentUser().then(async user => {
        const hasAccess = await this.rbacService.hasAccess(['admin'], state.url);
        const guardAccess = user && user.applicationId && user.projectId && user.role === 'admin';
        if (guardAccess || hasAccess) {
          resolve(true);
        } else {
          this.router.navigateByUrl('/sale').catch(reason => console.log(reason));
          reject(false);
        }
      }).catch(_ => {
        this.router.navigateByUrl('/account/login?url=' + encodeURIComponent(state.url))
          .catch(reason => console.log(reason));
        reject(false);
      });
    });
  }

}
