import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {UserModel} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RbacService {
  constructor(private readonly userService: UserService) {
  }

  async hasAccess(groups: string[]): Promise<boolean> {
    const user: UserModel = await this.userService.currentUser();
    let groupAccess: boolean;
    if (groups && groups.length > 0 && groups[0] && groups[0] === '*') {
      groupAccess = true;
    } else {
      groupAccess = groups.join('.').includes(user.role);
    }
    return groupAccess;
  }
}
