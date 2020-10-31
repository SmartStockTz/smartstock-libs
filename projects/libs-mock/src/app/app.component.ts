import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav [opened]="true">
        <smartstock-drawer style="width: 300px" [versionNumber]="mock"></smartstock-drawer>
      </mat-sidenav>
      <mat-sidenav-content style="min-height: 100vh">
        <smartstock-toolbar [sidenav]="sidenav" [heading]="'Core'"></smartstock-toolbar>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class AppComponent {
  title = 'libs-mock';
  mock: Observable<string> = of('mock');
}
