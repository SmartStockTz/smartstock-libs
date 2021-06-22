import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {LibUserModel} from '../models/lib-user.model';

@Injectable({
  providedIn: 'root'
})
export class RbacService {
  constructor(private readonly userService: UserService) {
  }

  async hasAccess(groups: string[] = [], pagePath: string): Promise<boolean> {
    const user: LibUserModel = await this.userService.currentUser();

    console.log(user.role, '******user role');
    console.log(user.acl, '*******user acl');
    console.log(groups, '******groups');
    console.log(pagePath, '******path');

    let groupAccess: boolean;
    let pathAccess: boolean;
    if (groups && groups.length === 1 && groups[0] === '*') {
      groupAccess = true;
    } else {
      const result = groups.filter(x => x.toLowerCase().trim() === user?.role?.toLowerCase()?.trim());
      groupAccess = (result && result.length === 1);
    }
    if (pagePath && pagePath.trim() !== '') {
      const result = user?.acl?.filter(x => x.toLowerCase().trim().startsWith(pagePath.toLowerCase().trim()));
      pathAccess = (result && result.length === 1);
    } else {
      pathAccess = false;
    }
    return groupAccess || pathAccess;
  }
}
