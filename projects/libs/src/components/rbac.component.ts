import {Component, Input, TemplateRef} from '@angular/core';
import {UserService} from '../services/user.service';
import {UserModel} from '../models/user.model';

@Component({
  selector: 'smartstock-libs-rbac',
  template: `
    <div *ngIf="hasAccess">
      <ng-container *ngTemplateOutlet="component"></ng-container>
    </div>
  `
})
export class RbacComponent {
  hasAccess = false;
  @Input() groups: string[] = [];
  @Input() component: TemplateRef<any>;

  constructor(private readonly userService: UserService) {
    this.userService.currentUser().then((value: UserModel) => {
      let groupAccess: boolean;
      if (this.groups && this.groups.length > 0 && this.groups[0] && this.groups[0] === '*') {
        groupAccess = true;
      } else {
        groupAccess = this.groups.join('.').includes(value.role);
      }
      this.hasAccess = groupAccess;
    });
  }

}
