import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PrimengModule } from '../../../shared/primeng.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { LookupValue } from '../../../models/lookup-model';
import { TransactionHistory } from '../../../models/transaction-history';
import { ModelCreationService } from '../model-creation.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Lookup } from '../../../shared/enums/lookup';
import {
  ModelCreationAttachmentDto,
  ModelCreationDto,
  RequestStatus,
} from '../model-creation-dto';
import jwt_decode from 'jwt-decode';
import { AttachmentsComponent } from '../../../shared/components/attachments/attachments.component';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';

@Component({
  selector: 'app-view-model-creation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AttachmentsComponent,
    TransactionHistoryComponent,
  ],
  templateUrl: './view-model-creation.component.html',
  styleUrl: './view-model-creation.component.scss',
})
export class ViewModelCreationComponent implements OnChanges {
  @Input('showmodal') showAddModal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('model_id') model_id: any = 0;
  @Input('model_index') model_index: any;
  @Input('status') status: any;

  items!: MenuItem[];
  form: FormGroup = null as any;
  assignOrigins: LookupValue[] = [];
  readonly: boolean = false;
  isAddMode: boolean | undefined;
  transactionHistory!: TransactionHistory;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private api: ModelCreationService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }
  Init(): void {
    let query = {
      queryParams: { tabIndex: this.model_index },
    };
    this.api.getLookups({ query: Lookup }).subscribe((res) => {
      this.assignOrigins = res.data;
      this.cdr.detectChanges();
    });

    // this.api.getLookups({ queryParams: Lookup.AssetType }).subscribe((res) => {
    //   this.assignOrigins = res.data;
    // });
    this.readonly = true;
    this.buildForm();
    if (this.model_id && this.status == 'view') {
      this.getItemData(this.model_id);
      this.isAddMode = false;
      this.readonly = true;
    } else {
      this.isAddMode = true;
    }
  }
  getItemData(id: number) {
    this.api.get(id).subscribe((res) => {
      this.transactionHistory = new TransactionHistory();
      Object.assign(this.transactionHistory, res.data);
      this.form.patchValue({ ...res.data });
      this.cdr.detectChanges();
    });
  }

  buildForm() {
    let decoded: {
      uid: string;
      sub: string;
    } = this.getDecodedAccessToken(localStorage.getItem('token') as string);
    this.form = this.fb.group<ModelCreationDto>({
      assignOriginId: null,
      assignOrigin: '',
      attachments: [],
      id: null,
      manufacturer: '',
      model: '',
      name: '',
      remarks: '',
      requestStatus: RequestStatus.none,
      supplier: '',
      requesterUserId: decoded.uid,
      userName: decoded.sub,
    });
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  get attachments() {
    var lst = this.form.value.attachments;
    if (!lst) {
      return [];
    }

    return lst.map((a: any) => a.attachmentName);
  }
  attachmentUploaded(files: any[]) {
    let attaches =
      (this.form.value.attachments as ModelCreationAttachmentDto[]) ?? [];
    files.forEach((file) => {
      if (
        attaches.findIndex(
          (a) => a.attachmentName.toLowerCase() == file.toString().toLowerCase()
        ) > -1
      )
        return;

      attaches.push(<any>{
        attachmentName: file,
      });

      this.form.patchValue({
        attachments: attaches,
      });
    });
  }

  close_view_modal() {
    this.form.reset();
    this.openModals.emit(false);
  }
}
