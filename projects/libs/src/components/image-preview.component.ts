import {Component, Input} from '@angular/core';
import {FileModel} from '../models/file.model';

@Component({
  selector: 'app-image-preview',
  template: `
    <img (error)="hideImage()" *ngIf="showImage" alt="" [src]="file.url.concat('/thumbnail?width=200')"
         class="media-container">
  `,
  styleUrls: ['../styles/files-browser.style.scss']
})

export class ImagePreviewComponent {
  @Input() file: FileModel;
  showImage = true;

  constructor() {
  }

  hideImage(): void {
    this.showImage = false;
  }
}
