import {Component, Input, OnInit} from '@angular/core';
import {RbacService} from '../services/rbac.service';
import {SubMenuModel} from '../models/menu.model';

@Component({
  selector: 'app-drawer-sub-menu',
  template: `
    <mat-list-item routerLink="{{page.link}}" style="padding-left: 20px; height: 35px" *ngIf="hasAccess">
      <mat-icon matListIcon style="display: flex; justify-content: center; align-items: center">
        <div style="width: 8px; height: 3px; border-radius: 5px;background: black"></div>
      </mat-icon>
      <p matLine>{{page.name}}</p>
    </mat-list-item>
  `
})

export class DrawerSubMenuComponent implements OnInit {
  @Input() page: SubMenuModel = {};
  hasAccess = false;

  constructor(private readonly rbacService: RbacService) {
  }

  ngOnInit(): void {
    this.rbacService.hasAccess(this.page.roles).then(value => {
      this.hasAccess = value;
    }).catch(_ => {
    });
  }
}
