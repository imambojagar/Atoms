import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
  Validators,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { TransactionHistory } from '../../../models/transaction-history';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftPeriodService } from '../../../services/shift.service';
import { LookupService } from '../../../services/lookup.service';
import { CustomerService } from '../../../services/customer.service';
import { ServiceRequestFormService } from '../../../maintenance/service-request/service-request-form.service';
import { WorkOrderService } from '../../../services/work-order.service';
import { AssetGroupService } from '../../../services/asset-group.service';
import { Lookup } from '../../../shared/enums/lookup';
import validateForm from '../../../shared/helpers/validateForm';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';

@Component({
  selector: 'app-add-edit-shift',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TransactionHistoryComponent,
  ],
  templateUrl: './add-edit-shift.component.html',
  styleUrl: './add-edit-shift.component.scss',
  providers: [DatePipe, ServiceRequestFormService],
})
export class AddEditShiftComponent implements OnChanges {
  @Input('showmodal') showAddModal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('shift_id') shift_id: any;
  @Input('shift_index') shift_index: any;
  @Input('status') status: any;

  transactionHistory!: TransactionHistory;
  Shift_Types: any[] = [];
  shiftForm!: FormGroup;
  id: any = {};
  isViewMode: boolean = false;
  isEditMode: boolean = false;
  isAddMode: boolean = false;
  url: string = '';
  items!: MenuItem[];
  startTime!: Date | null;
  endTime!: Date | null;
  AssetGroups: any[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public shiftsService: ShiftPeriodService,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private customerService: CustomerService,
    private router: Router,
    public serviceRequestFormService: ServiceRequestFormService,
    private confirmationService: ConfirmationService,
    public workOrdersService: WorkOrderService,
    private assetGroupService: AssetGroupService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log('shift_id', this.shift_id);
    console.log('shift_index', this.shift_index);
    console.log('status', this.status);
    this.Init();
  }

  /////////////////////////////
  Init(): void {
    this.getAssetGroups();
    // this.activatedRoute.queryParams.subscribe(params => {
    this.id = this.shift_id;
    // });

    this.checkMode();
    // this.messageService.add({
    //   severity: 'error',
    //   summary: 'Error',
    //   detail: 'Please Fill Required Data',
    //   life: 3000,
    // });
    this.shiftForm = this.formbuilder.group({
      assetGroup: [null, Validators.required],
      shiftName: [null, Validators.required],
      shiftType: [null, Validators.required],
      startShift: [null],
      endShift: [null],
    });
    if (!this.isAddMode) {
      this.getshift(this.id);
    }

    this.getLookup();

    if (this.isViewMode) {
      this.shiftForm.disable();
    }
  }
  checkMode() {
    this.isViewMode = false;
    this.isEditMode = false;
    this.isAddMode = false;
    this.url = this.router.url;
    if (this.id && this.status == 'view') this.isViewMode = true;
    else if (this.id && !(this.status == 'view')) this.isEditMode = true;
    else {
      this.isAddMode = true;
    }
  }

  getLookup() {
    this.lookupService.getLookUps(Lookup.Shift_Type).subscribe((res: any) => {
      this.Shift_Types = res.data;
      //this.Shift_Types.splice(0, 0, { id: 0, name: "Select", value: null })
    });
  }

  save() {
    if (this.shiftForm.invalid) {
      console.log('save not valid');
      validateForm.validateAllFormFields(this.shiftForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      let finalData: any = {};
      Object.assign(finalData, this.shiftForm.value);
      if (this.startTime) {
        finalData.startShift = dateHelper.ConvertDateToStringTimeOnly(
          this.startTime
        );
      }
      if (this.endTime) {
        finalData.endShift = dateHelper.ConvertDateToStringTimeOnly(
          this.endTime
        );
      }
      if (this.id) {
        finalData.id = Number(this.id);
        this.shiftsService.updateshift(finalData).subscribe((res) => {
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
            this.Init();
            // this.router.navigate(['hr/shifts']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
        });
      } else
        this.shiftsService.saveshift(finalData).subscribe((res) => {
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
            this.Init();
            // this.router.navigate(['hr/shifts']);
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
  }

  getshift(shiftId: number) {
    this.shiftsService.getshiftById(shiftId).subscribe((res) => {
      this.transactionHistory = new TransactionHistory();
      Object.assign(this.transactionHistory, res.data);
      this.startTime = res.data.startShift
        ? new Date(res.data.startShift)
        : null;
      this.endTime = res.data.endShift ? new Date(res.data.endShift) : null;
      this.shiftForm.patchValue({
        assetGroup: res.data.assetGroup,
        shiftName: res.data.shiftName,
        shiftType: res.data.shiftType,
        startShift: res.data.startShift ? new Date(res.data.startShift) : null,
        endShift: res.data.endShift ? new Date(res.data.endShift) : null,
      });
    });
  }

  addMinutes(date: Date, minutes: number): Date {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }

  delete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Shift?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shiftsService.deleteshift(this.id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.router.navigate(['/hr/shifts']);
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
  resetPeriod() {
    this.shiftForm.value.startShift = null;
    this.shiftForm.value.endShift = null;
    this.startTime = null;
    this.endTime = null;
  }

  changeDate() {
    if (this.shiftForm.value.startShift) {
      this.startTime = this.shiftForm.value.startShift;
    }
    if (this.shiftForm.value.endShift) {
      this.endTime = this.shiftForm.value.endShift;
    }
  }
  getAssetGroups() {
    this.assetGroupService.searchAssetGroups({}).subscribe((res: any) => {
      this.AssetGroups = res.data;
      this.cdr.detectChanges();
    });
  }

  close_add_modal() {
    this.isAddMode = false;
    this.isViewMode = false;
    this.isEditMode = false;
    this.shiftForm.reset();
    this.openModals.emit(false);
  }
}
