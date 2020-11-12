import {Component, Input, TemplateRef} from '@angular/core';
import {RbacService} from '../services/rbac.service';

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

  constructor(private readonly rbacService: RbacService) {
    this.rbacService.hasAccess(this.groups).then(value => {
      this.hasAccess = value;
    });
  }

}
