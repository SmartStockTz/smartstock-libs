import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {UserModel} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RbacService {
  constructor(private readonly userService: UserService) {
  }

  async hasAccess(groups: string[] = []): Promise<boolean> {
    const user: UserModel = await this.userService.currentUser();
    let groupAccess: boolean;
    if (groups && groups.length === 1 && groups[0] === '*') {
      groupAccess = true;
    } else {
      const result = groups.filter(x => x.toLowerCase().trim() === user.role.toLowerCase().trim());
      return result && result.length === 1;
    }
    return groupAccess;
  }
}
