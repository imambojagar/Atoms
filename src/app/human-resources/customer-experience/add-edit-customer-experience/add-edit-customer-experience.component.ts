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
import { TransactionHistory } from '../../../models/transaction-history';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  MessageService,
} from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomerExperience } from '../../../models/customer-experience';
import { ActivatedRoute, Router } from '@angular/router';
import { CallRequestService } from '../../../services/call-request.service';
import { LookupService } from '../../../services/lookup.service';
import { DepartmentService } from '../../../services/department.service';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule, DatePipe } from '@angular/common';
import validateForm from '../../../shared/helpers/validateForm';
import { QuestionsCustomerExperienceService } from '../../../services/questions-customer-experience.service';
import { PrimengModule } from '../../../shared/primeng.module';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';

@Component({
  selector: 'app-add-edit-customer-experience',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TransactionHistoryComponent,
  ],
  templateUrl: './add-edit-customer-experience.component.html',
  styleUrl: './add-edit-customer-experience.component.scss',
})
export class AddEditCustomerExperienceComponent implements OnChanges {
  @Input('showmodal') showAddModal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('cusExp_id') cusExp_id: any;
  @Input('cusExp_index') cusExp_index: any;
  @Input('status') status: any;

  transactionHistory!: TransactionHistory;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;

  url!: string;
  items!: MenuItem[];
  customerExperienceForm!: FormGroup;
  id: any;
  siteId: any;
  questionExperienceAnswers: any[] = [];

  searchFilter = new CustomerExperience();

  sites: any;

  departments: any[] = [];
  customer_ID: any[] = [];
  customer_Name: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    public QuestionsCustomerExperienceService: QuestionsCustomerExperienceService,
    private callRequest: CallRequestService,
    private lookupService: LookupService,
    private departmentService: DepartmentService,
    private customerService: CustomerService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  Init(): void {
    // this.items = [
    //   { label: 'Home', routerLink: ['/'] },
    //   { label: 'Create Customer Experience' },
    // ];

    // this.activatedRoute.queryParams.subscribe((params) => {
    //   this.id = params['id'];
    // });
    this.id = this.cusExp_id;
    this.customerExperienceForm = this.formbuilder.group({
      site: [null],
      sitetxt: [null],

      department: [null],
      customerID: [null],
      customerName: [null],
      Position: [null],
      ExtensionNumber: [null],
      MobileNumber: [null],
      Email: [null],
      SurveyDate: [null],

      question1: [null],
      question2: [null],
      question3: [null],
      question4: [null],
      question5: [null],
    });

    this.checkMode();

    if (this.isViewMode) {
      this.customerExperienceForm.disable();
    }

    if (!this.isAddMode) {
      this.getQuestionsCustomerExperienceTeamById();
    }

    this.getDepartments();

    //this.getCallInfo(this.callId == undefined ? 0 : this.callId);
  }

  checkMode() {
    this.isViewMode = false;
    this.isEditMode = false;
    this.isAddMode = false;

    // this.url = this.router.url;

    if (this.id)
      if (this.status.toLocaleLowerCase() == 'view') {
        this.isViewMode = true;
      } else this.isEditMode = true;
    else this.isAddMode = true;
  }

  onSelectSite(event: any) {
    this.searchOnSite(event.query);
    this.searchFilter.site = event.query;
  }

  bindSite(event: any) {
    this.searchFilter.site = event.value.custName;
  }

  clearSite() {
    this.searchFilter.site = '';
  }

  searchOnSite(code: any) {
    this.customerService
      .GetCustomersAutoComplete(code)
      .subscribe((data: any) => {
        this.sites = data.data;
      });
  }

  getQuestionsCustomerExperienceTeamById() {
    this.QuestionsCustomerExperienceService.getQuestionsCustomerExperienceTeamById(
      this.id
    ).subscribe((res: any) => {
      res.data.surveyDate = new DatePipe('en-us').transform(
        res.data.surveyDate,
        'yyyy/MM/dd'
      );
      this.transactionHistory = new TransactionHistory();
      Object.assign(this.transactionHistory, res.data);
      this.customerExperienceForm.patchValue(res.data);
      this.customerExperienceForm.patchValue({
        sitetxt: res.data.site.custName,
        Department: res.data.department?.departmentName,
        CustomerID: res.data.customerID,
        CustomerName: res.data.customerName,
        Position: res.data.position,
        ExtensionNumber: res.data.extensionNumber,
        MobileNumber: res.data.mobileNumber,
        Email: res.data.email,
        SurveyDate: res.data.surveyDate,
      });

      this.customerExperienceForm
        .get('customerID')
        ?.setValue({ customerID: res.data.customerID });
      this.customerExperienceForm
        .get('customerName')
        ?.setValue({ customerName: res.data.customerName });
    });
  }

  save() {
    if (this.customerExperienceForm.invalid) {
      validateForm.validateAllFormFields(this.customerExperienceForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      let finalData: any = {};
      Object.assign(finalData, this.customerExperienceForm.getRawValue());

      finalData.customerID =
        this.customerExperienceForm.value.customerID.customerID;
      finalData.customerName =
        this.customerExperienceForm.value.customerName.customerName;

      // finalData.questionExperienceAnswers = this.getQuestions()

      if (this.id == undefined || this.id == 0) {
        this.QuestionsCustomerExperienceService.saveQuestionsCustomerExperienceTeam(
          finalData
        ).subscribe((res: any) => {
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
            // this.addCustomerForm.reset();
            // this.router.navigate([
            //   '/hr/customer-service/search-questions-customer-experience-team',
            // ]);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
        });
      } else {
        finalData.id = this.id;

        finalData.customerID =
          this.customerExperienceForm.value.customerID.customerID;
        finalData.customerName =
          this.customerExperienceForm.value.customerName.customerName;

        // finalData.department = res.data.department?.departmentName
        this.QuestionsCustomerExperienceService.updateQuestionsCustomerExperienceTeam(
          finalData
        ).subscribe((res: any) => {
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
            // this.addCustomerForm.reset();
            // this.router.navigate([
            //   '/hr/customer-service/search-questions-customer-experience-team',
            // ]);
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
  }

  delete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Customer Experience ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.QuestionsCustomerExperienceService.deleteQuestionsCustomerExperienceTeam(
          this.id
        ).subscribe((res: any) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            // this.router.navigate([
            //   '/hr/customer-service/search-questions-customer-experience-team',
            // ]);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 5000,
            });
            this.close_add_modal();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 5000,
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

  getDepartments() {
    this.departmentService
      .GetDepartmentsAutoComplete()
      .subscribe((data: any) => {
        this.departments = data.data;
        this.cdr.detectChanges();
      });
  }

  getAutoComplete(searchText: any = '') {
    this.QuestionsCustomerExperienceService.GetQuestionsCustomerExperienceTeamAutoComplete(
      searchText.query
    ).subscribe((res: any) => {
      this.customer_ID = res.data;
      this.customer_Name = res.data;
      this.cdr.detectChanges();
      console.log('customer_ID', res.data);
    });
  }

  bindCustomerID(event: any) {
    this.searchFilter.customerID = event.value.customerID;
  }

  bindCustomerName(event: any) {
    this.searchFilter.customerName = event.value.customerName;
  }

  ClearCustomerID() {
    this.searchFilter.customerID = '';
  }

  ClearCustomerName() {
    this.searchFilter.customerName = '';
  }

  changeDepartment(event: any) {
    this.customerExperienceForm.value.department = event.value;
  }

  close_add_modal() {
    this.isAddMode = false;
    this.isEditMode = false;
    this.customerExperienceForm.reset();
    this.openModals.emit(false);
  }
}
