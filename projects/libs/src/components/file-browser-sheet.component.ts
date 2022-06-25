import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { ShopModel } from "../models/shop.model";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Subject } from "rxjs";
import { FilesState } from "../states/files.state";
import { debounceTime, takeUntil } from "rxjs/operators";
import { FileModel } from "../models/file.model";
import { FormControl, Validators } from "@angular/forms";
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef
} from "@angular/material/bottom-sheet";

// @dynamic
@Component({
  selector: "app-libs-file-browser",
  templateUrl: "./file-browser-sheet.html",
  styleUrls: ["../styles/files-browser.style.scss"]
})
export class FileBrowserSheetComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("matPaginator") matPaginator: MatPaginator;
  destroy: Subject<any> = new Subject<any>();
  filter = "all";
  files: MatTableDataSource<FileModel> = new MatTableDataSource([]);
  filesFormControl = new FormControl(
    [],
    [Validators.nullValidator, Validators.required]
  );
  filesSelected = [];
  filterFiles = new FormControl("");

  constructor(
    public readonly sheetRef: MatBottomSheetRef<FileBrowserSheetComponent>,
    public readonly filesState: FilesState,
    private readonly changeDetector: ChangeDetectorRef,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public readonly data: {
      shop: ShopModel;
    }
  ) {
    filesState.files.pipe(takeUntil(this.destroy)).subscribe((value) => {
      this.files.data = value;
    });
  }

  ngAfterViewInit(): void {
    this.files.paginator = this.matPaginator;
    this.getFiles();
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.filterFiles.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      if (value) {
        this.filesState.filterKeyword.next(value.toString().toLowerCase());
      } else {
        this.filesState.filterKeyword.next("");
      }
      this.getFiles();
    });
  }

  private getFiles(): void {
    if (this.data && this.data.shop) {
      this.filesState.fetchFiles();
    } else {
      this.sheetRef.dismiss({ message: "current shop must not be null" });
    }
  }

  selectedFile(file: FileModel): void {
    this.sheetRef.dismiss(file);
  }

  isSelected(
    value: "all" | "image" | "video" | "other" | "book" | "audio"
  ): boolean {
    return this.filter === value;
  }

  filterFilter(value: string): void {
    this.filter = value;
    if (value === "all") {
      this.files.filter = "";
    } else if (value === "image") {
      this.files.filter = "image";
    } else if (value === "video") {
      this.files.filter = "video";
    } else if (value === "audio") {
      this.files.filter = "audio";
    } else if (value === "book") {
      this.files.filter = "book";
    } else if (value === "other") {
      this.files.filter = "other";
    }
  }

  ngOnDestroy(): void {
    this.destroy.next("done");
    this.filesState.filterKeyword.next("");
  }

  uploadFile(): void {
    if (this.filesFormControl.valid) {
      this.filesState.uploadFile(this.filesFormControl.value[0].url, () => {
        this.filesSelected = [];
        // document.getElementById('dialog-contents').scrollTo(0, 0);
      });
    }
  }
}
