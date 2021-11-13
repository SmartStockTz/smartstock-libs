import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShopModel} from '../models/shop.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {FilesState} from '../states/files.state';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {FileModel} from '../models/file.model';
import {FormControl, Validators} from '@angular/forms';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

// @dynamic
@Component({
  selector: 'app-libs-file-browser',
  template: `
    <div class="media-header">
      <input class="media-filter" [formControl]="filterFiles" placeholder="Search file by name...">
      <!--      <span style="flex: 1 1 auto"></span>-->
      <button (click)="filesState.fetchFiles()" color="primary" mat-icon-button>
        <mat-icon>refresh</mat-icon>
      </button>
      <button color="warn" mat-icon-button (click)="sheetRef.dismiss({message: 'No file selected'})">
        <mat-icon>close</mat-icon>
      </button>
      <mat-divider></mat-divider>
    </div>

    <div *ngIf="(filesState.isFetchFiles | async)===false">
      <div style="width: 100%">
        <app-upload-files [files]="filesSelected" [uploadFileFormControl]="filesFormControl"
                          [multiple]="true">
        </app-upload-files>

        <button *ngIf="filesFormControl.valid" [disabled]="filesState.isUploading | async" (click)="uploadFile()"
                mat-flat-button
                color="primary">Upload
        </button>
        <div style="width: 20px; height: 20px"></div>
        <app-upload-file-progress *ngIf="filesState.isUploading | async" [onUploadFlag]="true"
                                  [name]="'Upload '+filesFormControl.value[0].name"
                                  [uploadPercentage]="filesState.uploadingPercentage | async">
        </app-upload-file-progress>
      </div>
    </div>

    <div *ngIf="(filesState.isFetchFiles | async)===true"
         style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100px">
      <mat-progress-bar mode="indeterminate" color="primary"></mat-progress-bar>
      <p>Fetch files...</p>
    </div>

    <div class="medias-container">
      <div (click)="selectedFile(file)" *ngFor="let file of files.connect() | async">
        <app-image-preview *ngIf="file.category === 'image'" [file]="file"></app-image-preview>
        <app-video-preview *ngIf="file.category === 'video'" [file]="file"></app-video-preview>
        <app-audio-preview *ngIf="file.category === 'audio'" [file]="file"></app-audio-preview>
        <app-other-file-preview *ngIf="file.category === 'other'" [file]="file"></app-other-file-preview>
      </div>
    </div>
<!--    <mat-paginator #matPaginator [length]="total" [pageSize]="filesState.paginationSize"></mat-paginator>-->
  `,
  styleUrls: ['../styles/files-browser.style.scss']
})

export class FileBrowserSheetComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('matPaginator') matPaginator: MatPaginator;
  destroy: Subject<any> = new Subject<any>();
  filter = 'all';
  files: MatTableDataSource<FileModel> = new MatTableDataSource([]);
  filesFormControl = new FormControl([], [Validators.nullValidator, Validators.required]);
  filesSelected = [];
  filterFiles = new FormControl('');

  constructor(public readonly sheetRef: MatBottomSheetRef<FileBrowserSheetComponent>,
              public readonly filesState: FilesState,
              private readonly changeDetector: ChangeDetectorRef,
              @Inject(MAT_BOTTOM_SHEET_DATA) public readonly data: {
                shop: ShopModel
              }) {
    filesState.files.pipe(
      takeUntil(this.destroy)
    ).subscribe(value => {
      this.files.data = value;
    });
  }

  ngAfterViewInit(): void {
    this.files.paginator = this.matPaginator;
    this.getFiles();
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.filterFiles.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      if (value) {
        this.filesState.filterKeyword.next(value.toString().toLowerCase());
      } else {
        this.filesState.filterKeyword.next('');
      }
      this.getFiles();
    });
  }

  private getFiles(): void {
    if (this.data && this.data.shop) {
      this.filesState.fetchFiles();
    } else {
      this.sheetRef.dismiss({message: 'current shop must not be null'});
    }
  }

  selectedFile(file: FileModel): void {
    this.sheetRef.dismiss(file);
  }

  isSelected(value: 'all' | 'image' | 'video' | 'other' | 'book' | 'audio'): boolean {
    return this.filter === value;
  }

  filterFilter(value: string): void {
    this.filter = value;
    if (value === 'all') {
      this.files.filter = '';
    } else if (value === 'image') {
      this.files.filter = 'image';
    } else if (value === 'video') {
      this.files.filter = 'video';
    } else if (value === 'audio') {
      this.files.filter = 'audio';
    } else if (value === 'book') {
      this.files.filter = 'book';
    } else if (value === 'other') {
      this.files.filter = 'other';
    }
  }

  ngOnDestroy(): void {
    this.destroy.next('done');
    this.filesState.filterKeyword.next('');
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
