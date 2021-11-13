import {Component, Input} from '@angular/core';
import {FileModel} from '../models/file.model';

@Component({
  selector: 'app-video-preview',
  template: `
    <video controls [preload]="'none'" [src]="file.url" class="media-container">
    </video>
  `,
  styleUrls: ['../styles/files-browser.style.scss']
})

export class VideoPreviewComponent {
  @Input() file: FileModel;

  constructor() {
  }
}
