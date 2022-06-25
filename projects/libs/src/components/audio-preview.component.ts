import { Component, Input } from "@angular/core";
import { FileModel } from "../models/file.model";

@Component({
  selector: "app-audio-preview",
  templateUrl: "./audio-preview.html",
  styleUrls: ["../styles/files-browser.style.scss"]
})
export class AudioPreviewComponent {
  @Input() file: FileModel;
}
