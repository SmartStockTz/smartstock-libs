import {Component, Input} from '@angular/core';
import {FileModel} from '../models/file.model';

@Component({
  selector: 'app-other-file-preview',
  template: `
    <div class="media-container">
      <mat-icon color="primary" style="font-size: 50px; width: 50px; height: 50px">
        description
      </mat-icon>
      <span style="width: 90%; overflow: hidden;
       height: 40px; text-overflow: fade" class="text-truncate">{{file.name}}</span>
    </div>
  `,
  styleUrls: ['../styles/files-browser.style.scss']
})
export class OtherFilePreviewComponent {
  @Input() file: FileModel;

  constructor() {
  }
}
