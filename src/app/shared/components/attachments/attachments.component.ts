import {
  HttpClient,
  HttpParams,
  HttpRequest,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FilesService } from '../../../services/files.service';
import { PrimengModule } from '../../primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrPipe } from '../../pipes/tr.pipe';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
@Component({
  standalone: true,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    TrPipe,
    TranslateModule
  ],
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.css'],
  providers: [TranslatePipe],
})
export class AttachmentsComponent implements OnInit {
  @Input() attachments: string[] = [];
  @Input() showButton: boolean = true;
  @Input() hasDelete:boolean=false;
  @Input() canNotUploadFile:boolean=false;
  @Output() onUploaded: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() onDeleted: EventEmitter<any> = new EventEmitter<any>();
  isUploading: boolean = false;
  url: string = '';
  constructor(private http: HttpClient,
    private filesService: FilesService) {}

  ngOnInit() {
    this.url = environment.BaseURL.replace('api/', '');
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
              this.onUploaded.emit([...body.data]);
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
