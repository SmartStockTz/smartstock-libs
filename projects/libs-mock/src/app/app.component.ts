import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <smartstock-layout-sidenav [heading]="'Core Libs'"
                               [leftDrawer]="drawer"
                               [version]="mock" [body]="body">
      <ng-template #drawer>
        <smartstock-drawer></smartstock-drawer>
      </ng-template>
      <ng-template #body>
        <h1>
          body Contents
        </h1>
      </ng-template>
    </smartstock-layout-sidenav>
  `,
})
export class AppComponent {
  title = 'libs-mock';
  mock: Observable<string> = of('mock_11');
}
