import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { OrcalCodeService } from './orcal-code.service';
import { PrimengModule } from '../../../shared/primeng.module';

@Component({
  standalone: true,
  selector: 'app-orcal-code-control',
  imports: [PrimengModule, ReactiveFormsModule],
  templateUrl: './orcal-code-control.component.html',
  styleUrls: ['./orcal-code-control.component.scss'],
})
export class OrcalCodeControlComponent {
  orcalCodesForm!: FormGroup;
  orcalCodesList = [];

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
    orcalCode: null,
  };
  totalRows!: number;
  loading!: boolean;

  orcalCodeModel = {
    id: 0,
    orcalCode: '',
  };

  displayAdd: boolean = false;
  displayUpdate: boolean = false;
  constructor(
    private fb: FormBuilder,
    private api: OrcalCodeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit() {
    this.getOrcalCodes();
    this.orcalCodesForm = this.fb.group({
      id: ['', Validators.required],
      orcalCode: ['', Validators.required],
    });
  }
  getOrcalCodes() {
    this.api.getOrcalCodes(this.filter).subscribe((res) => {
      this.totalRows = res.totalRows;
      this.orcalCodesList = res.data;
    });
  }
  paginate(event: any) {
    this.loading = true;
    console.log('paginate event', event);
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.getOrcalCodes(this.filter).subscribe((res) => {
        const data = res.data;
        this.orcalCodesList = data;
        this.totalRows = res.totalRows;
        this.loading = false;
      });
    }, 500);
  }
  showAddDialog() {
    this.displayAdd = true;
  }
  showUpdateDialog() {
    this.displayUpdate = true;
  }
  onAdd() {
    this.orcalCodeModel.orcalCode = this.orcalCodesForm.value.orcalCode;
    this.api.addOrcalCode(this.orcalCodeModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.displayAdd = false;
        this.getOrcalCodes();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }

  orcalCodeId!: number;
  onUpdate() {
    this.orcalCodeModel.id = this.orcalCodeId;
    this.orcalCodeModel.orcalCode = this.orcalCodesForm.value.orcalCode;
    this.api.updateOrcalCodes(this.orcalCodeModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.displayUpdate = false;
        this.getOrcalCodes();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }
  onDelete(orcalCode: any) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + orcalCode.orcalCodeName + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orcalCodesForm.value.id = orcalCode.id;
        this.api
          .deleteOrcalCodes(this.orcalCodesForm.value.id)
          .subscribe((res) => {
            this.getOrcalCodes();
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 3000,
              });
            }
          });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }
}
