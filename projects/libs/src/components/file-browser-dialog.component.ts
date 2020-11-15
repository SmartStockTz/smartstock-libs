import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ShopModel} from '../models/shop.model';
import {AngularFileUploaderConfig} from 'angular-file-uploader';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {FilesState} from '../states/files.state';
import {takeUntil} from 'rxjs/operators';
import {FileModel} from '../models/file.model';

// @dynamic
@Component({
  selector: 'smartstock-libs-file-browser',
  template: `
    <div mat-dialog-title style="display: flex">
      <mat-chip-list>
        <mat-chip (click)="filterFilter('all')" [selected]="isSelected('all')">ALL</mat-chip>
        <mat-chip (click)="filterFilter('image')" [selected]="isSelected('image')">IMAGE</mat-chip>
        <mat-chip (click)="filterFilter('video')" [selected]="isSelected('video')">VIDEO</mat-chip>
        <mat-chip (click)="filterFilter('audio')" [selected]="isSelected('audio')">AUDIO</mat-chip>
        <mat-chip (click)="filterFilter('book')" [selected]="isSelected('book')">BOOK</mat-chip>
        <mat-chip (click)="filterFilter('other')" [selected]="isSelected('other')">OTHER</mat-chip>
      </mat-chip-list>
      <span style="flex: 1 1 auto"></span>
      <button (click)="filesState.fetchFiles(data.shop)" color="primary" mat-icon-button>
        <mat-icon>refresh</mat-icon>
      </button>
      <button color="warn" mat-icon-button (click)="dialogRef.close({message: 'No file selected'})">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-divider></mat-divider>
    <div *ngIf="(filesState.isFetchFiles | async)===true"
         style="display: flex; flex-direction: column; justify-content: center; align-items: center">
      <mat-progress-bar mode="indeterminate" color="primary"></mat-progress-bar>
      <p>Fetch files...</p>
    </div>

    <div mat-dialog-content id="dialog-contents" style="max-height: 50vh">
      <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center;">
        <div *ngFor="let file of files.connect() | async">
          <img alt="{{file.suffix}}" *ngIf="file.category === 'image'" [src]="file.url" [ngStyle]="{width: '300px', height: '180px', margin: '5px', borderRadius: '5px',
             background: '#f5f5f5 center', 'background-size': 'cover'}">

          <video controls *ngIf="file.category === 'video'" [src]="file.url" [ngStyle]="{width: '300px', height: '180px', margin: '5px', borderRadius: '5px',
             background: '#f5f5f5 center', 'background-size': 'cover'}">
          </video>

          <audio controls *ngIf="file.category === 'audio'"
                 [src]="file.url"
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

          <span style="display: block">{{file.suffix}}</span>
          <div style="display: flex; flex-wrap: wrap; margin-left: 5px; margin-right: 5px; margin-bottom: 16px; align-items: center">
            <span>{{file.type}} | {{file.size}}</span>
            <span style="flex: 1 1 auto"></span>
            <button (click)="selectedFile(file)" mat-flat-button color="primary">Select</button>
          </div>
        </div>
      </div>
      <mat-paginator #matPaginator [showFirstLastButtons]="true" [pageSize]="12"></mat-paginator>
    </div>
    <div mat-dialog-actions style="padding: 16px">
      <mat-divider></mat-divider>
      <div class="container">
        <angular-file-uploader
          style="width: 100%"
          (ApiResponse)="doneUpload($event)"
          [config]="afuConfig">
        </angular-file-uploader>
      </div>
    </div>
  `,
  styleUrls: ['../styles/files-browser.style.scss']
})

export class FileBrowserDialogComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(public readonly dialogRef: MatDialogRef<FileBrowserDialogComponent>,
              public readonly filesState: FilesState,
              private readonly changeDetector: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public readonly data: {
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
  afuConfig: AngularFileUploaderConfig;

  ngAfterViewInit(): void {
    this.files.paginator = this.matPaginator;
    this.getFiles();
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
  }

  private getFiles(): void {
    if (this.data && this.data.shop) {
      this.afuConfig = {
        maxSize: 1024,
        multiple: false,
        replaceTexts: {
          selectFileBtn: 'Select File From Device'
        },
        formatsAllowed: '.jpg,.png,.pdf,.docx,.txt,.gif,.jpeg,.mp4,.mkv,.mp3,.aac,.epub',
        uploadAPI: {
          url: `https://${this.data.shop.projectId}-daas.bfast.fahamutech.com/storage/${this.data.shop.applicationId}`
        }
      };
      this.filesState.fetchFiles(this.data.shop);
    } else {
      this.dialogRef.close({message: 'current shop must not be null'});
    }
  }

  selectedFile(file: FileModel): void {
    this.dialogRef.close(file);
  }

  doneUpload(response): void {
    if (response && response.body && response.body.urls && Array.isArray(response.body.urls) && response.body.urls.length > 0) {
      this.filesState.appendFile(response.body.urls[0], this.data.shop);
      this.files.paginator.firstPage();
      document.getElementById('dialog-contents').scrollTo(0, 0);
    }
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
}
