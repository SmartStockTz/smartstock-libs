import {Component} from '@angular/core';

@Component({
  selector: 'app-rbac-guard',
  template: `
    <div>
      <!--      <mat-card-subtitle>Permission</mat-card-subtitle>-->
      <div mat-dialog-content>
        <p>You do not have a permission to visit this link </p>
      </div>
      <div mat-dialog-actions>
        <button color="primary" mat-button mat-dialog-close>Close</button>
      </div>
    </div>
  `
})

export class RbacGuardComponent {
  constructor() {
  }
}
