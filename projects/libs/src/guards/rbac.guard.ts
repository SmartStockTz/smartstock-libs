import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {RbacService} from '../services/rbac.service';
import {MatDialog} from '@angular/material/dialog';
import {RbacGuardComponent} from '../components/rbac-guard.component';

@Injectable({
  providedIn: 'root'
})

export class RbacGuard implements CanActivate {
  constructor(private readonly rbacService: RbacService,
              private readonly dialog: MatDialog) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.rbacService.hasAccess(['_'], state.url).then(access => {
      if (access === true) {
        return true;
      } else {
        this.dialog.open(RbacGuardComponent, {
          closeOnNavigation: true
        });
        // history.back();
        return false;
      }
    }).catch(reason => {
      this.dialog.open(RbacGuardComponent, {
        closeOnNavigation: true
      });
      // history.back();
      return false;
    });
  }

}
