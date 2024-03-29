import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

@Component({
  selector: 'app-search-input',
  template: `
    <div style="width: 100%">
      <input [formControl]="searchInputControl"
             *ngIf="showSearch"
             class="toolbar-input" type="text" placeholder="{{searchPlaceholder}}">
      <mat-progress-spinner style="display: inline-block; margin-left: -30px"
                            mode="indeterminate" diameter="25"
                            color="primary"
                            *ngIf="showSearch && searchProgressFlag"
                            matSuffix>
      </mat-progress-spinner>
    </div>
  `,
  styleUrls: ['../styles/search-input.style.scss']
})
export class SearchInputComponent implements OnInit {
  @Input() searchInputControl: UntypedFormControl;
  @Input() showSearch = false;
  @Input() searchProgressFlag = false;
  @Input() searchPlaceholder = 'Enter something...';

  constructor() { }

  ngOnInit(): void {
  }

}
