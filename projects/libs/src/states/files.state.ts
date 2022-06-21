import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FileModel } from "../models/file.model";
import { MessageService } from "../services/message.service";
import { MatDialog } from "@angular/material/dialog";
import { DeviceState } from "./device.state";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { UserService } from "../services/user.service";
import { MediaService } from "../services/media.service";

@Injectable({
  providedIn: "root"
})
export class FilesState {
  isFetchFiles = new BehaviorSubject<boolean>(false);
  filterKeyword = new BehaviorSubject<string>("");
  isUploading = new BehaviorSubject<boolean>(false);
  uploadingPercentage = new BehaviorSubject<number>(0);
  files = new BehaviorSubject<FileModel[]>([]);
  totalFiles = new BehaviorSubject(0);

  constructor(
    private readonly userService: UserService,
    private readonly matDialog: MatDialog,
    private readonly deviceState: DeviceState,
    private readonly mediaService: MediaService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly messageService: MessageService
  ) {}

  fetchFiles(): void {
    this.fetchTotalFiles();
    this.isFetchFiles.next(true);
    this.mediaService
      .fetchFiles(this.filterKeyword.value)
      .then((value) => {
        if (Array.isArray(value)) {
          this.files.next(value);
        }
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason.toString(),
          2000,
          "bottom"
        );
      })
      .finally(() => {
        this.isFetchFiles.next(false);
      });
  }

  private fetchTotalFiles(): void {
    this.mediaService
      .totalFiles(this.filterKeyword.value)
      .then((value) => {
        this.totalFiles.next(value);
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason.toString()
        );
      });
  }

  // loadMoreFiles(page: number): void {
  //   this.fetchTotalFiles();
  //   this.loadMoreProgress.next(true);
  //   this.mediaService.fetchFiles(this.paginationSize, page * this.paginationSize, this.filterKeyword.value)
  //     .then(value => {
  //       this.files.next([...this.files.value, ...value]);
  //     }).catch(reason => {
  //     this.messageService.showMobileInfoMessage(reason.message ? reason.message : reason.toString());
  //   }).finally(() => {
  //     this.loadMoreProgress.next(false);
  //   });
  // }

  uploadFile(file: File, done: () => void): void {
    this.isUploading.next(true);
    this.uploadingPercentage.next(0);
    this.mediaService
      .uploadFile(file, (progress) => {
        this.uploadingPercentage.next(progress);
      })
      .then((value) => {
        this.files.value.unshift(value);
        this.files.next(this.files.value);
        done();
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason.toString(),
          2000,
          "bottom"
        );
      })
      .finally(() => {
        this.isUploading.next(false);
      });
  }
}
