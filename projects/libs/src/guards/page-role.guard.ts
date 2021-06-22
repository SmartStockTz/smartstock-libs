import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';
import {LibUserModel} from '../models/lib-user.model';

@Injectable({
  providedIn: 'root'
})

export class PageRoleGuard implements CanActivate {
  constructor(private readonly userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      const user: LibUserModel = await this.userService.currentUser();
    });
  }

}
