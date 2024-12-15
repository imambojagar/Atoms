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
import { lookup } from 'dns';

@Component({
  selector: 'app-add-edit-model-creation',
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
  templateUrl: './add-edit-model-creation.component.html',
  styleUrl: './add-edit-model-creation.component.scss',
})
export class AddEditModelCreationComponent implements OnChanges {
  @Input('showmodal') showAddModal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('model_id') model_id: any;
  @Input('model_index') model_index: any;
  @Input('status') status: any;

  items!: MenuItem[];
  modelForm!: FormGroup;
  assignOrigins: LookupValue[] = [];
  readonly: boolean = false;
  isAddMode: boolean | undefined;
  transactionHistory!: TransactionHistory;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private messageService: MessageService,
    private api: ModelCreationService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }
  Init(): void {
    // console.log('this.model_index', this.model_index);
    // if (this.model_id && this.model_index !== undefined) {
    //   if (this.model_index) {
    //     this.api
    //       .getLookups({ queryParams: { index: this.model_index } })
    //       .subscribe((res) => {
    //         this.assignOrigins = res.data;
    //         console.log('assignOrigins', this.assignOrigins);
    //       });
    //   }
    // }

    let query = {
      queryParams: { tabIndex: this.model_index },
    };
    this.api.getLookups({ queryParams: Lookup.AssetType }).subscribe((res) => {
      if (res && res.data) {
        this.assignOrigins = res.data;
        this.cdr.detectChanges();
      }
    });
    this.buildForm();
    // this.activatedRouter.url.subscribe((parms: UrlSegment[]) => {
    //   if (parms[0].path.toLowerCase() == 'view') this.readonly = true;
    // });
    // this.activatedRouter.params.subscribe((params) => {
    //   if (params.id) {
    //     this.getItemData(params.id);
    //     this.isAddMode = false;
    //   }
    // });

    if (this.model_id) {
      this.getItemData(this.model_id);
      this.isAddMode = false;
    } else {
      this.isAddMode = true;
    }
  }

  changeOrigin(event: any) {
    console.log('origin ', event);
    this.modelForm.value.assignOriginId = event.value;
  }

  getItemData(id: number) {
    this.api.get(id).subscribe((res) => {
      this.transactionHistory = new TransactionHistory();
      Object.assign(this.transactionHistory, res.data);
      this.modelForm.patchValue({ ...res.data });
      this.cdr.detectChanges();
    });
  }

  buildForm() {
    let decoded: {
      uid: string;
      sub: string;
    } = this.getDecodedAccessToken(localStorage.getItem('token') as string);
    this.modelForm = this.fb.group<ModelCreationDto>({
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
  save() {
    var model = { ...this.modelForm.getRawValue() };
    if (model.assignOriginId.id != null) {
      model.assignOriginId = model.assignOriginId.id;
    }
    if (model.id != null && model.id != 0)
      this.api.update(model).subscribe((a) => this.handleSaveUpdate(a));
    else this.api.add(model).subscribe((a) => this.handleSaveUpdate(a));
  }
  handleSaveUpdate(res: any) {
    const message = res.message;
    const sucess = res.isSuccess;
    if (sucess == true) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });
      this.close_add_modal();
      // this.router.navigate(['./reference-table/model-creation']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
  // cancel() {
  //   this.router.navigate(['./reference-table/model-creation']);
  // }

  get attachments() {
    var lst = this.modelForm.value.attachments;
    if (!lst) {
      return [];
    }

    return lst.map((a: any) => a.attachmentName);
  }
  attachmentUploaded(files: any[]) {
    let attaches =
      (this.modelForm.value.attachments as ModelCreationAttachmentDto[]) ?? [];
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

      this.modelForm.patchValue({
        attachments: attaches,
      });
    });
  }

  close_add_modal() {
    this.modelForm.reset();
    this.openModals.emit(false);
  }
}
