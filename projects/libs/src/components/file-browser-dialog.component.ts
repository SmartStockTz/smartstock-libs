import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FilesService} from '../services/files.service';
import {ShopModel} from '../models/shop.model';
import {AngularFileUploaderConfig} from 'angular-file-uploader';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'smartstock-libs-file-browser',
  template: `
    <div mat-dialog-title style="display: flex">
      <!--      <h3>-->
      <!--        Choose File-->
      <!--      </h3>-->
      <mat-chip-list>
        <mat-chip (click)="filterFilter('all')" [selected]="isSelected('all')">ALL</mat-chip>
        <mat-chip (click)="filterFilter('image')" [selected]="isSelected('image')">IMAGE</mat-chip>
        <mat-chip (click)="filterFilter('video')" [selected]="isSelected('video')">VIDEO</mat-chip>
        <mat-chip (click)="filterFilter('others')" [selected]="isSelected('others')">OTHERS</mat-chip>
      </mat-chip-list>
      <span style="flex: 1 1 auto"></span>
      <button mat-icon-button (click)="dialogRef.close('No file selected')">
        <mat-icon>close</mat-icon>
      </button>
      <mat-divider></mat-divider>
    </div>
    <div mat-dialog-content id="dialog-contents">
      <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center">
        <div *ngIf="fetchFiles"
             style="height: 25vh; width: 25vh; display: flex; flex-direction: column; justify-content: center; align-items: center">
          <mat-progress-spinner diameter="30" mode="indeterminate" color="primary"></mat-progress-spinner>
          <p>Fetch files...</p>
        </div>
        <div *ngFor="let file of files.connect() | async">
          <div [ngStyle]="{width: '300px', height: '180px', margin: '5px', borderRadius: '5px',
             background: 'url('+ file.url +')'+' #f5f5f5 center', 'background-size': 'cover'}">
          </div>
          <div style="display: flex; flex-wrap: wrap; margin-left: 5px; margin-right: 5px; margin-bottom: 16px; align-items: center">
            <span>{{file.type}} | {{file.size}}</span>
            <span style="flex: 1 1 auto"></span>
            <button (click)="selectedFile(file)" mat-flat-button color="primary">Select</button>
          </div>
        </div>
        <!--        <img alt="" width="200px" height="200px" src="{{file.url}}" *ngFor="let file of files">-->
      </div>
      <mat-paginator #matPaginator [showFirstLastButtons]="true" [pageSize]="12"></mat-paginator>
      <!--      <div *ngIf="!fetchFiles" style="height: 200px; display: flex; justify-content: center; align-items: center">-->
      <!--        <button mat-button class="btn-outline-primary">-->
      <!--          Load More-->
      <!--        </button>-->
      <!--      </div>-->
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
      <!--      <button mat-button color="warn" (click)="dialogRef.close('Process canceled')">-->
      <!--        Cancel-->
      <!--      </button>-->
    </div>
  `,
  styleUrls: ['../styles/files-browser.style.scss']
})

export class FileBrowserDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('matPaginator') matPaginator: MatPaginator;
  filter = 'all';
  fetchFiles = true;
  files: MatTableDataSource<{ url: string, size: string, type: string }> = new MatTableDataSource([]);
  filesArray: { url: string, size: string, type: string }[] = [];
  afuConfig: AngularFileUploaderConfig;

  constructor(public readonly dialogRef: MatDialogRef<FileBrowserDialogComponent>,
              private readonly filesService: FilesService,
              @Inject(MAT_DIALOG_DATA) private readonly data: {
                shop: ShopModel
              }) {
  }

  ngAfterViewInit(): void {
    this.files.paginator = this.matPaginator;
  }

  ngOnInit(): void {
    this.getFiles();
  }

  private getFiles(): void {
    if (this.data && this.data.shop) {
      this.afuConfig = {
        maxSize: 1024,
        multiple: false,
        replaceTexts: {
          // uploadBtn: 'Upload New File',
          selectFileBtn: 'Select File From Device'
        },
        formatsAllowed: '.jpg,.png,.pdf,.docx, .txt,.gif,.jpeg,.mp4,.mkv,.mp3,.aac,.ebook',
        uploadAPI: {
          url: `https://${this.data.shop.projectId}-daas.bfast.fahamutech.com/storage/${this.data.shop.applicationId}`
        }
      };
      this.fetchFiles = true;
      this.filesService.getFiles(this.data.shop).then(value => {
        this.files.data = value.sort((a, b) => a.lastModified > b.lastModified ? -1 : 1).map(x => {
          const nameContents = x.name.split('.');
          const suffixs = x.name.split('-');
          return {
            url: `https://${this.data.shop.projectId}-daas.bfast.fahamutech.com/storage/${this.data.shop.applicationId}/file/${x.name}`,
            size: (Number(x.size) / (1024 * 1024)).toPrecision(3) + ' MB',
            suffix: x.name;
            type: nameContents[nameContents.length - 1].toUpperCase()
          };
        });
        this.filesArray = this.files.data;
      }).catch(reason => {
        // this.dialogRef.close(reason && reason.message ? reason.message : 'Fails to fetch files');
      }).finally(() => {
        this.fetchFiles = false;
      });
    } else {
      this.dialogRef.close('current shop must not be null');
    }
  }

  selectedFile(file: { url: string; size: string, type: string }): void {
    this.dialogRef.close(file.url);
  }

  doneUpload(response): void {
    if (response && response.body && response.body.urls && Array.isArray(response.body.urls) && response.body.urls.length > 0) {
      console.log(response.body.urls[0]);
      const nameContents = response.body.urls[0].split('.');
      this.files.data.unshift({
        url: `https://${this.data.shop.projectId}-daas.bfast.fahamutech.com${response.body.urls[0]}`,
        size: ' MB',
        type: nameContents[nameContents.length - 1].toUpperCase()
      });
      this.files._updateChangeSubscription();
      this.files.paginator.firstPage();
      document.getElementById('dialog-contents').scrollTo(0, 0);
    }
  }

  isSelected(value: 'all' | 'image' | 'video' | 'others'): boolean {
    return this.filter === value;
  }

  filterFilter(value: string): void {
    console.log(value);
    this.filter = value;
    if (value === 'all') {
      this.files.filter = '';
    } else if (value === 'image') {
      this.files.filter = '.png';
    } else if (value === 'video') {
      this.files.filter = '.mp4';
    } else if (value === 'others') {
      this.files.filter = '.pdf';
    }
  }
}
