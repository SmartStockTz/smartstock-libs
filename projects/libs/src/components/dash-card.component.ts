import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dash-card',
  template: `
    <mat-card class="d-flex flex-column" [ngStyle]="{height:height+'px'}">
      <mat-card-header style="margin: 0">
        <span>{{title}}</span>
        <span style="margin-left: 8px"></span>
        <mat-icon matTooltip="{{description}}">info_outline</mat-icon>
      </mat-card-header>
      <mat-card-content class="flex-grow-1">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </mat-card-content>
      <hr *ngIf="reportLink" style="width: 100%; margin: 0; padding: 0">
      <mat-card-actions *ngIf="reportLink" class="d-flex flex-row">
        <span style="flex: 1 1 auto"></span>
        <button (click)="goTo()"color="primary" mat-button>
          EXPLORE REPORT
          <mat-icon matSuffix>arrow_forward</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class DashCardComponent implements OnInit {
  @Input() title = '';
  @Input() height = 300;
  @Input() description = '';
  @Input() reportLink: string;
  @Input() content: TemplateRef<any>;

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  goTo() {
    if (this.reportLink) {
      this.router.navigateByUrl(this.reportLink).catch(console.log);
    }
  }
}
