import {
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
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionHistory } from '../../../models/transaction-history';
import { EmployeeRate } from '../../../models/employee-rate';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeRateService } from '../../../services/employee-rate.service';
import { LookupService } from '../../../services/lookup.service';
import { Lookup } from '../../../shared/enums/lookup';
import validateForm from '../../../shared/helpers/validateForm';
import { buildForm, getEmpRateModel } from '../add-form-builder';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';

@Component({
  selector: 'app-add-edit-employee-rate',
  standalone: true,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TransactionHistoryComponent,
  ],
  templateUrl: './add-edit-employee-rate.component.html',
  styleUrl: './add-edit-employee-rate.component.scss',
})
export class AddEditEmployeeRateComponent implements OnChanges {
  @Input('showmodal') showAddModal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('emp_id') emp_id: any;
  @Input('emp_index') emp_index: any;
  @Input('status') status: any;

  transactionHistory!: TransactionHistory;
  empRateForm!: FormGroup;

  employeeRateModel: EmployeeRate = new EmployeeRate();

  id!: number;
  isAddMode!: boolean;
  msgs!: Message[];
  items!: MenuItem[];
  tabIndex: number = 0;
  createdOn: any;
  modifiedOn: any;
  positions: [] = [];
  rates: [] = [];
  teams: [] = [];
  departmentList: [] = [];

  constructor(
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private api: EmployeeRateService,
    private lookupApi: LookupService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }
  Init(): void {
    this.empRateForm = buildForm(this.formbuilder);
    // this.route.queryParams.subscribe((params: any) => {
    //   this.id = params.data;
    //   this.isAddMode = !this.id;
    //   this.employeeRateModel.id = params.data;
    //   this.tabIndex = params.index;
    // });
    this.id = this.emp_id;
    this.isAddMode = !this.id;
    this.employeeRateModel.id = this.emp_id;
    this.tabIndex = this.emp_index;
    if (!this.isAddMode && this.status == 'edit') {
      this.handleChange();
    }

    // this.items = [
    //   { label: 'Home', routerLink: ['/'] },
    //   { label: this.isAddMode ? 'Add Employee Rate' : 'Edit Employee Rate' },
    // ];

    //fill lookups
    this.getDepartment();
    this.getAndBindLookup(Lookup.Positions, (a) => (this.positions = a));
    console.log('this.positions', this.positions);
    this.getAndBindLookup(Lookup.Rates, (a) => (this.rates = a));
    this.getAndBindLookup(Lookup.ServiceTeams, (a) => (this.teams = a));
  }
  //bind lookup
  getAndBindLookup(lookup: Lookup, targetProp: (a: any) => void) {
    this.lookupApi
      .get({ queryParams: lookup })
      .subscribe((res) => targetProp(res.data));
  }

  getDepartment() {
    this.api.getDepartment({}).subscribe((res) => {
      this.departmentList = res.data;
    });
  }

  //select lookups
  changePosition(event: any) {
    this.empRateForm.value.positionId = event.value;
  }

  changeRate(event: any) {
    this.empRateForm.value.rateId = event.value;
  }

  changeTeams(event: any) {
    this.empRateForm.value.serviceTeamId = event.value;
  }

  changeDepartment(event: any) {
    this.empRateForm.value.departmentId = event.value;
  }

  handleChange() {
    this.api.getSingle(this.id).subscribe((res) => {
      this.transactionHistory = new TransactionHistory();
      Object.assign(this.transactionHistory, res.data);
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.empRateForm.patchValue(data);
        this.createdOn = data.createdOn;
        this.modifiedOn = data.modifiedOn;
        console.log('data', data);
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
  onSubmit() {
    // stop here if form is invalid
    if (this.empRateForm.invalid) {
      validateForm.validateAllFormFields(this.empRateForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      if (this.isAddMode) {
        this.save();
      } else {
        this.update();
      }
    }
  }

  save() {
    let model = getEmpRateModel(this.empRateForm.value);
    console.log('model', model);
    this.api.post(model).subscribe((res) => {
      console.log('api res:', res);
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.empRateForm.reset();
        this.close_add_modal();
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

  update() {
    let model = getEmpRateModel(this.empRateForm.value);
    console.log('model', model);
    this.api.update(model).subscribe((res) => {
      console.log('api res:', res);
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.empRateForm.reset();
        this.close_add_modal();
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

  // delete() {
  //   this.route.queryParams.subscribe((params: any) => {
  //     this.employeeRateModel.id = params.data;
  //     this.confirmationService.confirm({
  //       message: 'Are you sure you want to delete this ?',
  //       header: 'Confirm',
  //       rejectButtonStyleClass: 'p-button-danger',
  //       icon: 'pi pi-exclamation-triangle',
  //       accept: () => {
  //         this.api.delete(this.employeeRateModel.id).subscribe((res) => {
  //           console.log('delete res', res);
  //           const message = res.message;
  //           const sucess = res.isSuccess;
  //           if (sucess == true) {
  //             this.messageService.add({
  //               severity: 'success',
  //               summary: 'Successful',
  //               detail: message,
  //               life: 3000,
  //             });
  //             this.router.navigate(['/employees/employee-rate']);
  //           } else {
  //             this.messageService.add({
  //               severity: 'error',
  //               summary: 'Error',
  //               detail: message,
  //               life: 3000,
  //             });
  //           }
  //         });
  //       },
  //       reject: (type: any) => {
  //         switch (type) {
  //           case ConfirmEventType.REJECT:
  //             this.messageService.add({
  //               severity: 'warn',
  //               summary: 'Cancelled',
  //               detail: 'You have cancelled',
  //             });
  //             break;
  //           case ConfirmEventType.CANCEL:
  //             this.messageService.add({
  //               severity: 'warn',
  //               summary: 'Cancelled',
  //               detail: 'You have cancelled',
  //             });
  //             break;
  //         }
  //       },
  //     });
  //   });
  // }

  // cancel() {
  //   this.empRateForm.reset();
  // }

  close_add_modal() {
    this.isAddMode = false;
    this.empRateForm.reset();
    this.openModals.emit(false);
  }
}
