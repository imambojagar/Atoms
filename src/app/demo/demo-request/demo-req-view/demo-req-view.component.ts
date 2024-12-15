import { ExportService } from './../../../shared/services/export.service';
import { EmployeeService } from './../../../services/employee.service';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DemoReqService } from '../data/demo-req.service';
// import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import validateForm from '../../../shared/helpers/validateForm';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demo-req-view',
  templateUrl: './demo-req-view.component.html',
  styleUrls: ['./demo-req-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoReqViewComponent {
  items!: MenuItem[];
  demos: any[] = [];
  totalRows: number = 0;
  loading!: boolean;
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
    isPreview: false,
  };

  selectedRows: any;
  sumbitForm!: FormGroup;
  assessorEmp!: any[];
  assessorTL!: any[];

  isMultiupdate: boolean = false;
  isUpdating: boolean = false;

  userRoles: any[] = JSON.parse(localStorage.getItem('userRoles') || '');

  isAssessor: boolean = false;
  isAssessorTL: boolean = false;
  isInApprovalsView: boolean = false;

  currentRoute!: string;

  approvalForm!: FormGroup;
  YesOrNo: any[] = [
    { key: 'Accept', value: true },
    { key: 'Reject', value: false },
  ];
  Add: boolean = false;
  AddAssessment: boolean = false;
  DemoInfo: boolean = false;
  AddGatePass: boolean = false;
  request: boolean = false;
  approvals: boolean = false;
  QP: any = {};

  constructor(
    private api: DemoReqService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private empServices: EmployeeService,
    // private route: ActivatedRoute,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.sumbitForm = this.fb.group({
      ids: [],
      assessorEmployeeId: ['', Validators.required],
    });
    this.approvalForm = this.fb.group({
      isApproved: true,
    });
    this.currentRoute = this.router.url;
    // this.route.queryParams.subscribe((params: any) => {
    // params.data
    //   ? (this.isMultiupdate = params.data)
    //   : (this.isMultiupdate = false);
    this.selectedRows = [];
    // });
    this.changeViewIfInApproval();
    this.checkUserRole();
    this.searchRequest();
    this.getAssignedEmployee();
    this.items = [{ label: 'Home' }, { label: 'Demo Request' }];
  }

  checkUserRole() {
    this.userRoles.find((role) => role.value === 'R-32')
      ? (this.isAssessor = true)
      : null;
    this.userRoles.find((role) => role.value === 'R-19')
      ? (this.isAssessorTL = true)
      : null;

    this.cdr.detectChanges();
  }

  changeViewIfInApproval() {
    if (this.currentRoute.includes('approvals')) {
      this.isInApprovalsView = true;
      this.isMultiupdate = false;
    } else {
      this.isInApprovalsView = false;
    }

    this.cdr.detectChanges();
  }

  async getAssignedEmployee() {
    this.assessorEmp = await firstValueFrom(
      this.empServices.GetUserByRoleValue('r-32')
    );

    this.cdr.detectChanges();
  }

  searchRequest() {
    this.loading = true;
    if (this.isInApprovalsView) {
      this.api.getDataForApprovals(this.filter).subscribe((res: any) => {
        this.demos = res.data;
        this.totalRows = res.totalRows;
        this.loading = false;
      });
    } else {
      this.api.searchDemoReq(this.filter).subscribe((res) => {
        this.demos = res.data;
        this.totalRows = res.totalRows;
        this.loading = false;
      });
    }

    this.cdr.detectChanges();
  }

  Search() {
    this.filter.pageNumber = 1;
    this.searchRequest();

    this.cdr.detectChanges();
  }

  paginate(event: any) {
    this.filter.pageNumber = event.page + 1;
    this.searchRequest();

    this.cdr.detectChanges();
  }

  navTo(place: string, row?: any, index?: number) {
    // Reset all flags
    this.resetFlags();


    switch (place) {
      case 'AddAssessment':
        this.AddAssessment = true;
        this.QP.data = this.selectedRows.id;
        this.cdr.detectChanges()
        break;
      case 'DemoInfo':
        this.DemoInfo = true;
        this.QP.data = row?.id;
        this.QP.index = index;
        this.cdr.detectChanges()
        break;
      case '':
        this.isMultiupdate = true;
        this.QP.demoRequestId = this.selectedRows.id;
        this.cdr.detectChanges()
        break; case 'AddGatePass':
        this.AddGatePass = true;
        this.QP.demoRequestId = this.selectedRows.id;
        this.cdr.detectChanges()
        break;
      default:
        this.request = true;
        this.QP.data = true;
        this.cdr.detectChanges()
        break;
    }

    // Example debug log
    // console.log('Navigation parameters:', QP);
  }

  closeModal() {
    console.log('Modal closed');
    this.resetFlags(); // Reset flags on modal close
  }

  resetFlags() {
    this.AddAssessment = false;
    this.DemoInfo = false;
    this.AddGatePass = false;
    this.request = false;
    this.Add = false
  }

  getSelectedIds() {
    if (this.selectedRows) {
      let ids: number[] = [];
      this.selectedRows.map((row: any) => {
        ids.push(row.id);
      });
      return ids;
    }

    this.cdr.detectChanges();
  }

  export() {
    console.log('this.filter', this.filter);
    this.exportService
      .export(this.filter, 'DemoRequest/export')
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'File should be downloaded now',
          life: 3000,
        });
        var downloadURL = URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Demo-Request-Report';
        link.click();
      });
  }

  deleteDemoReq(demo: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Demo Request?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteDemoReq(demo.id).subscribe((res) => {
          this.apiResponse(res);
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'You have cancelled',
        });
      },
    });
  }

  SaveCalls() {
    if (this.sumbitForm.invalid) {
      validateForm.validateAllFormFields(this.sumbitForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      let model = this.sumbitForm.value;
      model.ids = this.getSelectedIds()?.join(',');
      this.api.updateMultipleDemos(model).subscribe({
        next: (res) => {
          this.isUpdating = true;
          this.apiResponse(res);
          console.log('added successfully', res);
        },
        error: (e) => {
          console.error('unable to save', e);
        },
        complete: () => {
          this.isUpdating = false;
        },
      });
    }
  }

  documentUploaded() {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to update the status of these Demo Requests?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api
          .moveStatus({
            demoRequestIds: this.getSelectedIds(),
            isApproved: this.approvalForm.value.isApproved,
          })
          .subscribe((res) => {
            this.apiResponse(res);
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'You have cancelled',
        });
      },
    });
  }

  apiResponse(res: any) {
    const message = res.message;
    const sucess = res.isSuccess;
    if (sucess == true) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });
      this.searchRequest();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }

    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    // this.route.queryParams.subscribe((params: any) => {
    //   params.data
    //     ? (this.isMultiupdate = params.data)
    //     : (this.isMultiupdate = false);
    // });
  }


  openModal() {
    this.Add = true
  }
}
