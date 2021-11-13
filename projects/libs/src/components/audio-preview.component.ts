import {Component, Input} from '@angular/core';
import {FileModel} from '../models/file.model';

@Component({
  selector: 'app-audio-preview',
  template: `
    <audio controls [src]="file.url" [preload]="'none'" class="media-container">
    </audio>
  `,
  styleUrls: ['../styles/files-browser.style.scss']
})

export class AudioPreviewComponent {
  @Input() file: FileModel;

  constructor() {
  }
}
