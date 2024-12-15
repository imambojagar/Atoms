import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';
import { NewEmployeeModel } from '../../models/employee-model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { ExportService } from '../../shared/services/export.service';
import { CustomerService } from '../../services/customer.service';
import { AssetGroupService } from '../../services/asset-group.service';
import { PrimengModule } from '../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
// import { EmployeeModule } from './employee.module';

@Component({
  selector: 'app-employee',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AddEmployeeComponent,
    EditEmployeeComponent,
    ViewEmployeeComponent,
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit {
  msgs!: Message[];
  newEmployeeModel: NewEmployeeModel = new NewEmployeeModel();
  disabled: boolean = true;
  submitted!: boolean;
  //breadcrumb
  items!: MenuItem[];

  //search filter
  employees: NewEmployeeModel[] = [];

  PageSize!: number;
  PageNumber!: number;
  totalRows: number = 0;
  loading!: boolean;

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };
  employeesName: any[] = [];
  employeesId: any[] = [];
  emails: any[] = [];
  DepartmentList: any = [];
  positionList = [];
  qualfilcationsList = [];
  groupsList = [];
  EmployeeList = [];
  rolesList = [];
  Sites: any[] = [];

  defaultLookup = {
    id: null,
    name: 'None',
    value: 0,
  };

  employeeSearchForm!: FormGroup;
  assetGroupsList: any[] = [];
  showFilterModal: boolean = false;
  searchValue: string = '';
  emp_id: any;
  emp_index: any;
  viewEmpLoaded: boolean = false;
  editEmpLoaded: boolean = false;
  addEmpLoaded: boolean = false;
  editData = {};
  status: string = '';
  balanceFrozen: boolean = false;

  constructor(
    // private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private api: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private fb: FormBuilder,
    private exportService: ExportService,
    private customerService: CustomerService,
    private assetGroupService: AssetGroupService
  ) {}

  ngOnInit(): void {
    this.searchAssetGroup();
    // this.authService.isAuthenticated = true;
    this.employeeSearchForm = this.fb.group({
      name: [],
      dep: [],
      /* pos: [], */
      qual: [],
      group: [],
      role: [],
      site: [],
      assetGroup: [],
      employeeId: [],
      email: [],
    });
    // this.items = [{ label: 'Home', routerLink: ['/'] }, { label: 'Employee' }];

    this.getAllEmployee();
    this.getLookups();
  }

  openViewModel(row: any, index: number) {
    this.newEmployeeModel.userName = row.id;
    this.emp_id = row.id;
    // this.emp_index = index;
    this.emp_index = 0;
    this.status = 'view';
    // this.editData = { data: row.userName, index };
    this.editData = { data: row.userName, index };
    this.viewEmpLoaded = !this.viewEmpLoaded;
    this.addEmpLoaded = false;
    // this.router.navigate(['employees/employee/edit-control'], {
    //   queryParams: { data: row.userName, index },
    // });
  }

  closeViewModel() {
    this.emp_id = 0;
    this.viewEmpLoaded = !this.viewEmpLoaded;
  }

  openEditModel(row: any, index: number) {
    console.log("row", row);
    this.newEmployeeModel.userName = row.id;
    this.emp_id = row.id;
    this.emp_index = index;
    this.editData = { data: row.userName, index };
    this.status = 'edit';
    this.addEmpLoaded = !this.addEmpLoaded;
    this.viewEmpLoaded = false;
  }

   async toggleAdd() {
    this.emp_id = 0;
    // this.emp_index = 0;
    this.status = 'add';
    this.addEmpLoaded = !this.addEmpLoaded;
    this.viewEmpLoaded = false;
  }

  // navToDetails(row: any, index: number) {
  //   this.newEmployeeModel.userName = row.id;
  //   this.router.navigate(['employee/edit-control'], {
  //     queryParams: { data: row.userName, index },
  //   });
  // }

 

  async openEditToggle() {
    this.addEmpLoaded = false;
    this.editEmpLoaded = !this.editEmpLoaded;
  }

  toggleFilter() {
    this.showFilterModal = !this.showFilterModal;
  }

  openAddModal() {
    this.addEmpLoaded = !this.addEmpLoaded;
    this.searchAssetGroup();
    this.getAllEmployee();
    this.getLookups();
  }

  // async openViewModel() {
  //   this.emp_id = this.viewEmpLoaded = !this.viewEmpLoaded;
  // }

  close_filter_modal() {
    this.employeeSearchForm.reset();
    this.showFilterModal = false;
  }

  //Dropdown lists
  getLookups() {
    let department = {
      pageSize: 10,
      pageNumber: 1,
    };
    this.api.getDepartments(department).subscribe((data: any) => {
      this.DepartmentList = data;
      this.cdr.detectChanges();
    });
    this.api.getRoles().subscribe((data: any) => {
      this.rolesList = data;
      this.cdr.detectChanges();
    });
    this.api.getPositions().subscribe((res: any) => {
      this.positionList = res.data;
      this.cdr.detectChanges();
    });
    this.api.getQualifications().subscribe((res: any) => {
      this.qualfilcationsList = res.data;
      this.cdr.detectChanges();
    });
    this.api.getuserGroups().subscribe((res: any) => {
      this.groupsList = res.data;
      this.cdr.detectChanges();
    });
  }

  //Table Data
  getAllEmployee() {
    this.loading = true;
    this.api.getEmployees(this.filter).subscribe((res: any) => {
      this.totalRows = res.totalRows;
      this.employees = res.data;
      console.log('employess', this.employees);
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.getEmployees(this.filter).subscribe((res: any) => {
        const data = res.data;
        this.employees = data;
        this.totalRows = res.totalRows;
        this.loading = false;
      });
    }, 500);
  }

  //filters
  Search() {
    let searchObj = { ...this.filter };
    searchObj.pageNumber = 1;
    this.api.searchEmployee(searchObj).subscribe((res: any) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.employees = data;
      this.cdr.detectChanges();
    });
    this.close_filter_modal();
  }
  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      departmentName: null,
      userPosition: null,
      userQualifiactions: null,
      userGroup: null,
      employeeName: null,
      employeeId: null,
      email: null,
      userRole: null,
    };
    this.employeeSearchForm.reset();
    this.api.searchEmployee(this.filter).subscribe((res: any) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.employees = data;
    });
  }

  nameFilter(e: any) {
    this.api.searchEmployee({ employeeName: e.query }).subscribe((res: any) => {
      const data = res.data;
      this.employeesName = data;
    });
  }

  emailFilter(e: any) {
    this.api.searchEmployee({ email: e.query }).subscribe((res: any) => {
      const data = res.data;
      this.emails = data;
    });
  }

  IDFilter(e: any) {
    this.api.searchEmployee({ employeeId: e.query }).subscribe((res: any) => {
      const data = res.data;
      this.employeesId = data;
    });
  }

  departmentFilter(name: any) {
    this.filter.departmentName = name;
  }

  event(e: any) {
    console.log('event:', e);
  }

  positionFilter(name: any) {
    this.api.searchEmployee({ userPosition: name }).subscribe((res: any) => {});
  }

  qualificationFilter(name: any) {
    this.api
      .searchEmployee({ userQualifiactions: name })
      .subscribe((res: any) => {});
  }

  groupFilter(name: any) {
    this.api.searchEmployee({ userGroup: name }).subscribe((res: any) => {});
  }

  bindSite(event: any) {
    this.filter.site = event.id;
  }
  onSelectSite(event: any) {
    this.searchonSite(event.query);
    //this.filter.site = event.query
  }
  searchonSite(code: any) {
    this.customerService
      .GetCustomersAutoComplete(code)
      .subscribe((data: any) => {
        this.Sites = data.data;
      });
  }
  clearSite() {
    this.filter.site = '';
  }

  export() {
    this.exportService
      .export(this.filter, 'Account/export')
      .subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'File should be downloaded now',
          life: 3000,
        });
        var downloadURL = URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Employees-Report';
        link.click();
      });
  }
  /////////
  deleteEmployee(row: any) {
    this.newEmployeeModel.userName = row.userName;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + row.customerName + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api
          .deleteEmployee(this.newEmployeeModel.userName)
          .subscribe((res: any) => {
            this.getAllEmployee();
          });
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Employee Deleted',
          life: 3000,
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

  searchAssetGroup() {
    this.assetGroupsList = JSON.parse(
      localStorage.getItem('userAssetGroups') || '{}'
    );
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.employees = this.employees.filter((row: any) =>
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
    this.getAllEmployee();
    this.getLookups();
    this.cdr.detectChanges();
  }
}
