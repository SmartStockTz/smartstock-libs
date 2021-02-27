import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {RbacService} from '../services/rbac.service';

@Component({
  selector: 'app-libs-rbac',
  template: `
    <div *ngIf="hasAccess">
      <ng-container *ngTemplateOutlet="component"></ng-container>
    </div>
  `
})
export class RbacComponent implements OnInit{
  hasAccess = false;
  @Input() groups: string[] = [];
  @Input() component: TemplateRef<any>;

  constructor(private readonly rbacService: RbacService) {
  }

  ngOnInit(): void {
    this.rbacService.hasAccess(this.groups).then(value => {
      this.hasAccess = value;
    }).catch(console.log);
  }

}
