import {AfterViewInit, Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {RbacService} from '../services/rbac.service';

@Component({
  selector: 'app-libs-rbac',
  template: `
    <div *ngIf="hasAccess">
      <ng-template [ngTemplateOutlet]="component" #ref></ng-template>
    </div>
  `
})
export class RbacComponent implements OnInit, OnDestroy, AfterViewInit {
  hasAccess = false;
  @Input() groups: string[] = [];
  @Input() pagePath: string;
  @ContentChild(TemplateRef) component: TemplateRef<any>;

  constructor(public readonly rbacService: RbacService) {
  }

  async ngOnInit(): Promise<void> {
    this.rbacService.hasAccess(this.groups, this.pagePath).then(value => {
      this.hasAccess = value;
    }).catch(console.log);
  }

  async ngAfterViewInit(): Promise<void> {
  }

  async ngOnDestroy(): Promise<void> {
  }

}
