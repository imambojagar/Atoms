import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { LookupService } from '../../services/lookup.service';
import { Router } from '@angular/router';
import { Lookup } from '../../shared/enums/lookup';
import { EmployeeRate } from '../../models/employee-rate';
import { EmployeeRateService } from '../../services/employee-rate.service';
import { PrimengModule } from '../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { ViewEmployeeRateComponent } from './view-employee-rate/view-employee-rate.component';
import { AddEditEmployeeRateComponent } from './add-edit-employee-rate/add-edit-employee-rate.component';

@Component({
  selector: 'app-employee-position-rate',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ViewEmployeeRateComponent,
    AddEditEmployeeRateComponent,
  ],
  templateUrl: './employee-position-rate.component.html',
  styleUrl: './employee-position-rate.component.scss',
})
export class EmployeePositionRateComponent {
  searchForm!: FormGroup;
  employeeRateModel: EmployeeRate = new EmployeeRate();

  items!: MenuItem[];
  empRates: any[] = [];
  totalRows!: number;
  loading!: boolean;
  positions: [] = [];
  rates: [] = [];
  teams: [] = [];
  departmentList: [] = [];
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };
  viewEmpRateLoaded: boolean = false;
  editEmpRateLoaded: boolean = false;
  addEmpRateLoaded: boolean = false;
  showFilterModal: boolean = false;
  emp_id: any;
  emp_index: any;
  searchValue: string = '';
  balanceFrozen: boolean = false;
  status: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private lookupApi: LookupService,
    private api: EmployeeRateService,
    private formbuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    this.searchForm = this.formbuilder.group({
      id: null,
      positionId: null,
      rateId: null,
      serviceTeamId: null,
      departmentId: null,
    });

    // this.items = [
    //   { label: 'Home', routerLink: ['/'] },
    //   { label: 'Employee Rate List' },
    // ];

    this.Reset();
    this.getDepartment();
    this.getAndBindLookup(Lookup.Positions, (a) => (this.positions = a));
    console.log('this.positions', this.positions);
    this.getAndBindLookup(Lookup.Rates, (a) => (this.rates = a));
    this.getAndBindLookup(Lookup.ServiceTeams, (a) => (this.teams = a));
  }

  navToDetails(row: any, index: number) {
    this.employeeRateModel.id = row.id;
    this.emp_id = row.id;
    this.emp_index = index;
    this.status = 'edit';
    this.addEmpRateLoaded = !this.addEmpRateLoaded;
    // this.router.navigate(['/employees/employee-rate/edit-control'], {
    //   queryParams: { data: row.id, index },
    // });
  }

  navToView(row: any, index: number) {
    this.employeeRateModel.id = row.id;
    this.emp_id = row.id;
    this.emp_index = index;
    this.status = 'view';
    this.viewEmpRateLoaded = !this.viewEmpRateLoaded;
  }

  async openModal() {
    this.editEmpRateLoaded = !this.editEmpRateLoaded;
  }

  async openViewModal() {
    this.viewEmpRateLoaded = !this.viewEmpRateLoaded;
  }

  toggleFilter() {
    this.showFilterModal = !this.showFilterModal;
  }

  toggleAddEMp() {
    this.emp_id = 0;
    this.emp_index = 0;
    this.status = 'add';
    this.addEmpRateLoaded = !this.addEmpRateLoaded;
  }

  toggleAdd() {
    this.addEmpRateLoaded = !this.addEmpRateLoaded;
    this.getAllRates();
    this.getDepartment();
    this.getAndBindLookup(Lookup.Positions, (a) => (this.positions = a));
    this.getAndBindLookup(Lookup.Rates, (a) => (this.rates = a));
    this.cdr.detectChanges();
  }

  toggleView() {
    this.viewEmpRateLoaded = !this.viewEmpRateLoaded;
  }

  close_filter_modal() {
    this.searchForm.reset();
    this.showFilterModal = false;
  }

  //bind lookup
  getAndBindLookup(lookup: Lookup, targetProp: (a: any) => void) {
    this.lookupApi
      .get({ queryParams: lookup })
      .subscribe((res: any) => targetProp(res.data));
  }

  getDepartment() {
    this.api.getDepartment({}).subscribe((res: any) => {
      this.departmentList = res.data;
      this.cdr.detectChanges();
    });
  }

  getAllRates() {
    this.api.getAll(this.filter).subscribe((res: any) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.empRates = data;
        this.totalRows = res.totalRows;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
      this.cdr.detectChanges();
    });
    this.close_filter_modal();
  }

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.getAllRates();
    this.loading = false;
  }

  delete(row: any) {
    this.employeeRateModel.id = row.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.delete(row.id).subscribe((res: any) => {
          console.log('delete res', res);
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.getAllRates();
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

  //select lookups
  changePosition(event: any) {
    this.filter.positionId = event.value;
  }

  changeRate(event: any) {
    this.filter.rateId = event.value;
  }

  changeTeams(event: any) {
    this.filter.serviceTeamId = event.value;
  }

  changeDepartment(event: any) {
    this.filter.departmentId = event.value;
  }

  search() {
    this.getAllRates();
  }
  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      id: null,
      positionId: null,
      rateId: null,
      serviceTeamId: null,
      departmentId: null,
    };
    this.searchForm.reset();
    this.getAllRates();
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.empRates = this.empRates.filter((row: any) =>
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
    this.Reset();
    this.getDepartment();
    this.getAndBindLookup(Lookup.Positions, (a) => (this.positions = a));
    this.getAndBindLookup(Lookup.Rates, (a) => (this.rates = a));
    this.getAndBindLookup(Lookup.ServiceTeams, (a) => (this.teams = a));
    this.cdr.detectChanges();
  }
}
