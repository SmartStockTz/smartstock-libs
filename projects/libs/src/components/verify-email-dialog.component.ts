import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  template: `
    <div>
      <div mat-dialog-title>Account Verification</div>
      <div mat-dialog-content>
        <p>
          Your email is not verified we send a link to the email
          <br>
          you use when open account for you to verify your account
        </p>
      </div>
      <div mat-dialog-actions>
        <button (click)="dialogRef.close()" mat-button color="primary">Close</button>
      </div>
    </div>
  `,
})
export class VerifyEMailDialogComponent {
  constructor(public readonly dialogRef: MatDialogRef<VerifyEMailDialogComponent>) {
  }
}
