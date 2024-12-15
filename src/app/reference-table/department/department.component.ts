import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TransactionHistory } from '../../models/transaction-history';
import { Departments } from '../../models/department-model';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DepartmentService } from '../../services/department.service';
import { Router } from '@angular/router';
import { ExportService } from '../../shared/services/export.service';
import { PrimengModule } from '../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { TransactionHistoryComponent } from '../../shared/components/transaction-history/transaction-history.component';

@Component({
  selector: 'app-department',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AddDepartmentComponent,
    TransactionHistoryComponent,
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
})
export class DepartmentComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  transactionHistory!: TransactionHistory;
  departmentModel: Departments = new Departments();
  msgs!: Message[];
  balanceFrozen: boolean = false;

  //search filter
  departments: Departments[] = [];

  totalRows: number = 0;
  loading!: boolean;

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  //breadcrumb
  items!: MenuItem[];
  list = [];

  deprtSearchForm!: FormGroup;
  updateDepart!: FormGroup;
  displayUpdate: boolean = false;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showFilterModal: boolean = false;
  showViewModal: boolean = false;
  department_id: any;
  department_index: any;
  addDepartmentLoaded: boolean = false;
  filterDepartmentLoaded: boolean = false;
  searchValue: string = '';

  constructor(
    // private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private api: DepartmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    /* private router: Router, */
    private fb: FormBuilder,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    // this.authService.isAuthenticated = true;
    this.deprtSearchForm = this.fb.group({
      sName: [],
      sCode: [],
      orgCode: [],
    });
    this.updateDepart = this.fb.group({
      id: [],
      departmentName: [],
      departmentCode: [],
      ntCode: [],
      costCenterNumber: [''],
      costCenterName: [''],
    });

    // this.items = [
    //   { label: 'Home', routerLink: ['/'] },
    //   { label: 'Department' },
    // ];

    this.getAllDepartments();
  }

  event(e: any) {
    console.log(e);
  }

  navToDetails(row: any, index: number) {
    this.departmentModel.id = row.id;
    this.department_id = row.id;
    this.department_index = index;
    this.addDepartmentLoaded = !this.addDepartmentLoaded;
    // this.router.navigate(['/reference-table/customer/edit-delete-customer'], {
    //   queryParams: { data: row.id, index },
    // });
  }

  getAllDepartments() {
    this.api.searchDepartments(this.filter).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      console.log('customers:', data);
      this.departments = data;
      this.cdr.detectChanges();
    });
  }

  paginate(event: any) {
    this.loading = true;
    console.log('paginate event', event);
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.searchDepartments(this.filter).subscribe((res) => {
        const data = res.data;
        this.departments = data;
        this.totalRows = res.totalRows;
        this.loading = false;
      });
    }, 500);
  }
  //Filters
  Search() {
    console.log(this.filter);
    let searchObj = { ...this.filter };
    searchObj.pageNumber = 1;
    this.api.searchDepartments(searchObj).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      console.log('data:', data);
      this.departments = data;
      this.cdr.detectChanges();
    });
    this.close_search_modal();
  }

  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      deptName: null,
      departmentCode: null,
      ntCode: null,
    };
    this.deprtSearchForm.reset();
    this.api.searchDepartments(this.filter).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      console.log('data:', data);
      this.departments = data;
    });
  }

  deptNameFilter(name: any) {
    this.api.searchDepartments({ deptName: name.query }).subscribe((res) => {
      this.list = res.data;
    });
  }

  deptCodeFilter(name: any) {
    this.api
      .searchDepartments({ departmentCode: name.query })
      .subscribe((res) => {
        this.list = res.data;
      });
  }

  ntCodeFilter(name: any) {
    this.api.searchDepartments({ ntCode: name.query }).subscribe((res) => {
      this.list = res.data;
    });
  }
  showUpdateDialog(row: any) {
    // this.displayUpdate = true;
    this.showEditModal = true;
    this.updateDepart.controls['departmentName'].setValue(row.departmentName);
    this.updateDepart.controls['departmentCode'].setValue(row.departmentCode);
    this.updateDepart.controls['costCenterNumber'].setValue(
      row.costCenterNumber
    );
    this.updateDepart.controls['costCenterName'].setValue(row.costCenterName);
    this.transactionHistory = new TransactionHistory();
    Object.assign(this.transactionHistory, row);
  }
  codeId!: number;
  onUpdate() {
    this.departmentModel.id = this.codeId;
    this.departmentModel.departmentName =
      this.updateDepart.value.departmentName;
    this.departmentModel.departmentCode =
      this.updateDepart.value.departmentCode;
    this.departmentModel.ntCode = this.updateDepart.value.ntCode;
    this.departmentModel.costCenterNumber =
      this.updateDepart.value.costCenterNumber;
    this.departmentModel.costCenterName =
      this.updateDepart.value.costCenterName;

    this.api.updateDepartment(this.departmentModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.close_edit_modal();
        this.getAllDepartments();
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
  deleteCustomer(row: any) {
    this.departmentModel.id = row.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + row.departmentName + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('this.departmentModel.id', this.departmentModel.id);
        this.api.deleteDepartment(this.departmentModel.id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.getAllDepartments();
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

  export() {
    console.log('this.filter', this.filter);
    this.exportService
      .export(this.filter, 'Department/export')
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
        link.download = 'Department-Report';
        link.click();
      });
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.departments = this.departments.filter((row: any) =>
        Object.values(row).some((val: any) =>
          String(val).toLowerCase().includes(this.searchValue)
        )
      );
    } else {
      this.resetGlobalFilter();
    }
    this.cdr.detectChanges();
  }

  resetGlobalFilter() {
    this.searchValue = ''; // Clear the search input
    this.getAllDepartments();
    this.cdr.detectChanges();
  }

  toggleAdd() {
    this.department_id = 0;
    this.department_index = 0;
    this.addDepartmentLoaded = !this.addDepartmentLoaded;
  }

  async toggleAddModel() {
    this.addDepartmentLoaded = !this.addDepartmentLoaded;
    this.getAllDepartments();
  }

  async toggleEdit() {
    this.showEditModal = !this.showEditModal;
  }

  async toggleFilter() {
    this.showFilterModal = !this.showFilterModal;
  }

  close_edit_modal() {
    this.updateDepart.reset();
    this.showEditModal = false;
  }

  close_search_modal() {
    this.deprtSearchForm.reset();
    this.showFilterModal = false;
  }
}
