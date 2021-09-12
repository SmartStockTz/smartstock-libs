import {Component, Input, OnInit} from '@angular/core';
import {RbacService} from '../services/rbac.service';
import {SubMenuModel} from '../models/menu.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-drawer-sub-menu',
  template: `
    <mat-list-item (click)="goTo(page)" style="padding-left: 20px; height: 35px" *ngIf="hasAccess">
      <mat-icon matListIcon style="display: flex; justify-content: center; align-items: center">
        <div style="width: 8px; height: 3px; border-radius: 5px;background: black"></div>
      </mat-icon>
      <p matLine>{{page.name}}</p>
    </mat-list-item>
  `
})

export class DrawerSubMenuComponent implements OnInit {
  @Input() page: SubMenuModel;
  hasAccess = false;

  constructor(private readonly rbacService: RbacService,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.rbacService.hasAccess(this.page.roles, this.page.link).then(value => {
      this.hasAccess = value;
    }).catch(_ => {
    });
  }

  goTo(page: SubMenuModel): void {
    if (page.click) {
      page.click();
    } else {
      this.router.navigateByUrl(page.link).catch(console.log);
    }
  }
}
