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
    <div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <div style="margin: 0 4px">
          <input [formControl]="filterFiles" placeholder="filter...">
        </div>
        <span style="flex: 1 1 auto"></span>
        <button (click)="filesState.fetchFiles()" color="primary" mat-icon-button>
          <mat-icon>refresh</mat-icon>
        </button>
        <button color="warn" mat-icon-button (click)="sheetRef.dismiss({message: 'No file selected'})">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <div style="display: flex; flex-direction: column; margin-top: 8px">
        <mat-chip-list>
          <mat-chip (click)="filterFilter('all')" [selected]="isSelected('all')">ALL</mat-chip>
          <mat-chip (click)="filterFilter('image')" [selected]="isSelected('image')">IMAGE</mat-chip>
          <mat-chip (click)="filterFilter('video')" [selected]="isSelected('video')">VIDEO</mat-chip>
          <mat-chip (click)="filterFilter('audio')" [selected]="isSelected('audio')">AUDIO</mat-chip>
          <mat-chip (click)="filterFilter('book')" [selected]="isSelected('book')">BOOK</mat-chip>
          <mat-chip (click)="filterFilter('other')" [selected]="isSelected('other')">OTHER</mat-chip>
        </mat-chip-list>
      </div>


      <div *ngIf="(filesState.isFetchFiles | async)===true"
           style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100px">
        <mat-progress-bar mode="indeterminate" color="primary"></mat-progress-bar>
        <p>Fetch files...</p>
      </div>

      <div id="dialog-contents">
        <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center;">
          <div *ngFor="let file of files.connect() | async">
            <img alt="{{file.suffix}}" *ngIf="file.category === 'image'" [src]="file.url.concat('/thumbnail?width=150')"
                 [ngStyle]="{width: '300px', height: '180px', margin: '5px', borderRadius: '5px',
             background: '#f5f5f5 center', 'background-size': 'cover'}">

            <video controls [preload]="'none'" *ngIf="file.category === 'video'" [src]="file.url" [ngStyle]="{width: '300px', height: '180px', margin: '5px', borderRadius: '5px',
             background: '#f5f5f5 center', 'background-size': 'cover'}">
            </video>

            <audio controls *ngIf="file.category === 'audio'"
                   [src]="file.url"
                   [preload]="'none'"
                   [ngStyle]="{width: '300px', height: '180px', margin: '5px', borderRadius: '5px',background: '#f5f5f5 center', 'background-size': 'cover'}">
            </audio>

            <div *ngIf="file.category === 'book'" [ngStyle]="{width: '300px', height: '180px', margin: '5px', borderRadius: '5px',
             background: '#f5f5f5 center', 'background-size': 'cover', display: 'flex', justifyContent: 'center', alignItems: 'center'}">
              <mat-icon color="primary" style="font-size: 100px; width: 100px; height: 100px">
                description
              </mat-icon>
            </div>

            <div *ngIf="file.category === 'other'" [ngStyle]="{width: '300px', height: '180px', margin: '5px', borderRadius: '5px',
             background: '#f5f5f5 center', 'background-size': 'cover', display: 'flex', justifyContent: 'center', alignItems: 'center'}">
              <mat-icon color="primary" style="font-size: 100px; width: 100px; height: 100px">
                description
              </mat-icon>
            </div>

            <div style="width: 290px; padding: 5px; word-break: break-all">
              {{file.suffix}}
            </div>
            <div style="display: flex; flex-wrap: wrap; margin-left: 5px; margin-right: 5px; margin-bottom: 16px; align-items: center">
              <span>{{file.type}} | {{file.size}}</span>
              <span style="flex: 1 1 auto"></span>
              <button (click)="selectedFile(file)" mat-flat-button color="primary">Select</button>
              <!--            <button mat-icon-button color="warn">-->
              <!--              <mat-icon>delete</mat-icon>-->
              <!--            </button>-->
            </div>
          </div>
        </div>
        <mat-paginator #matPaginator [showFirstLastButtons]="true" [pageSize]="12"></mat-paginator>
      </div>

      <div style="padding: 16px">
        <div style="width: 100%">
          <app-upload-files [files]="filesSelected" [uploadFileFormControl]="filesFormControl"
                            [multiple]="true"></app-upload-files>
          <div>
            <button *ngIf="filesFormControl.valid" [disabled]="filesState.isUploading | async" (click)="uploadFile()" mat-flat-button
                    color="primary">Upload
            </button>
            <div style="width: 20px; height: 20px"></div>
            <app-upload-file-progress *ngIf="filesState.isUploading | async" [onUploadFlag]="true"
                                      [name]="'Upload '+filesFormControl.value[0].name"
                                      [uploadPercentage]="filesState.uploadingPercentage | async">
            </app-upload-file-progress>
          </div>
        </div>
      </div>

    </div>
  `,
  styleUrls: ['../styles/files-browser.style.scss']
})

export class FileBrowserSheetComponent implements OnInit, OnDestroy, AfterViewInit {

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

  @ViewChild('matPaginator') matPaginator: MatPaginator;
  destroy: Subject<any> = new Subject<any>();
  filter = 'all';
  files: MatTableDataSource<FileModel> = new MatTableDataSource([]);
  filesFormControl = new FormControl([], [Validators.nullValidator, Validators.required]);
  filesSelected = [];
  filterFiles = new FormControl('');

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
        this.files.filter = value.toString().toLowerCase();
      } else {
        this.files.filter = '';
      }
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
    this.destroy.next();
  }

  uploadFile(): void {
    if (this.filesFormControl.valid) {
      this.filesState.uploadFile(this.filesFormControl.value[0].url, () => {
        this.filesSelected = [];
        this.files.paginator.firstPage();
        document.getElementById('dialog-contents').scrollTo(0, 0);
      });
    }
  }
}
