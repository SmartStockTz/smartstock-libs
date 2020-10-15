import {StockModel} from '../models/stock.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';

@Component({
  selector: 'smartstock-lisb-dialog-delete',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <mat-panel-title class="text-center">
            Your about to delete :  <b>{{' '+ data.product}}</b>
          </mat-panel-title>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <div class="align-self-center" style="margin: 8px">
          <button color="primary"  mat-button (click)="delete(data)">Delete</button>
        </div>
        <div class="alert-secondary" style="margin: 8px">
          <button color="primary" mat-button (click)="cancel()">Cancel</button>
        </div>
      </div>
    </div>
  `
})
export class DialogDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StockModel) {
  }

  delete(stock: StockModel): any {
    this.dialogRef.close(stock);
  }

  cancel(): any {
    this.dialogRef.close('no');
  }
}
