import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FileUploadService } from '../../services/file-upload.service';
import { HttpClient, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DragDropDirective } from '../../directives/drag-drop.directive';
import { environment } from '../../../../environments/environment';
import { FilesService } from '../../../services/files.service';

@Component({
  selector: 'app-file-upload-component',
  standalone: true,
  imports: [CommonModule, DragDropDirective],
  providers: [FileUploadService],
  templateUrl: './file-upload-component.html',
  styleUrl: './file-upload-component.scss'
})
export class FileUploadComponent implements OnInit {

  currentFile?: File;
  message = '';
  fileInfos?: Observable<any>;
  url: string = '';
  isUploading: boolean = false;

  @Input() attachments: string[] = [];
  @Output() onDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Input() multiple: boolean = false;
  @Input() fileType: string = '.doc,.docx,.pdf';
  @Input() dragDropEnabled = true;
  @Output() filesChanged: EventEmitter<FileList>;

  @ViewChild('fileInput') inputRef!: ElementRef<HTMLInputElement>;



  constructor(private uploadService: FileUploadService,
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient, private filesService: FilesService) {
    this.filesChanged = new EventEmitter();
  }

  ngOnInit(): void {
    this.url = environment.BaseURL.replace('api/', '');
  }



  selectFile(event: any): void {
    console.log("event", event);
    this.currentFile = event.target.files.item(0);
  }

  openFile() {
    this.document.getElementById('fileID')?.click();
  }

  addFiles(files: any): void {
    console.log(files);
    this.uploadFile(files);
    // this.filesChanged.emit(files);
  }

  handleFileDrop(event: DragEvent) {
    if (event?.dataTransfer?.files?.length) {
      const files = event.dataTransfer.files;

      this.inputRef.nativeElement.files = files;
      this.uploadFile(event);
      // this.addFiles(files);
    }
  }

  upload(): void {
    if (this.currentFile) {
      this.uploadService.upload(this.currentFile).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        error: (err: any) => {
          console.log(err);

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }
        },
        complete: () => {
          this.currentFile = undefined;
        },
      });
    }
  }

  uploadFile($event: any) {
    this.isUploading = true;
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('files', file, file.name);
      let headers = new Headers();
      headers.append('Content-Type', 'multipart/form-data');

      let params = new HttpParams();
      const options = {
        params: params,
        reportProgress: false,
      };

      const req = new HttpRequest(
        'POST',
        `${environment.BaseURL}Files/UploadFilesToShare`,
        formData,
        options
      );
      this.http.request(req).subscribe((a) => {
        if (a instanceof HttpResponse) {
          if (a.status == 200) {
            const body = <any>a.body;
            if (body.data.length > 0) {
              this.attachments.push(...body.data);
              this.filesChanged.emit(body.data);
              // this.onUploaded.emit([...body.data]);
            }
          }
        }
        this.isUploading = false;
      });
    }
  }

  downloadFile(fileName: any) {
    var url = this.filesService.downloadFile(fileName);
    window.open(url, '_blank');
  }

  deleteFile(index: any) {
    this.attachments.splice(index,1);
    this.onDeleted.emit(index);
  }
}
