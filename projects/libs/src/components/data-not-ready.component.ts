import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-data-not-ready',
  template: `
    <div *ngIf="!isLoading" style="margin-top: 10px; margin-bottom: 10px"
         class="d-flex flex-column justify-content-center align-items-center">
      <img alt="no data" src="../../../../assets/img/data.svg" width="{{width}}" height="{{height}}"/>
      <span>Data is not ready yet</span>
    </div>
    <div *ngIf="isLoading" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
      <mat-progress-spinner mode="indeterminate" [diameter]="30"></mat-progress-spinner>
    </div>
  `,
})
export class DataNotReadyComponent implements OnInit {
  @Input() width = 200;
  @Input() height = 200;
  @Input() isLoading = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
