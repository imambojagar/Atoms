import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { SharedTable } from '../../shared/components/table/table';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomerExperience } from '../../models/customer-experience';
import { MenuItem } from 'primeng/api';
import { QuestionsCustomerExperienceTeamModel } from '../../models/search-questions-customer-experience-team-model';
import { CallRequestService } from '../../services/call-request.service';
import { LookupService } from '../../services/lookup.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { QuestionsCustomerExperienceService } from '../../services/questions-customer-experience.service';
import { DepartmentService } from '../../services/department.service';
import { CommonModule, DatePipe } from '@angular/common';
import { PrimengModule } from '../../shared/primeng.module';
import { EmployeeService } from '../../services/employee.service';
import { AddEditCustomerExperienceComponent } from './add-edit-customer-experience/add-edit-customer-experience.component';

@Component({
  selector: 'app-customer-experience',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AddEditCustomerExperienceComponent,
  ],
  templateUrl: './customer-experience.component.html',
  styleUrl: './customer-experience.component.scss',
  providers: [DatePipe],
})
export class CustomerExperienceComponent {
  tableConfig = new SharedTable();
  searchForm!: FormGroup;
  searchFilter = new CustomerExperience();
  items!: MenuItem[];
  sites: any[] = [];
  tableData: QuestionsCustomerExperienceTeamModel[] = [];

  departments: any[] = [];
  customer_Name: any[] = [];

  callId: any;
  showFilterModal: boolean = false;
  dataTable: any;
  searchValue: string = '';
  addcusExpLoaded: boolean = false;
  cusExp_index: any;
  cusExp_id: any;
  viewcusExpLoaded: boolean = false;
  status: string = '';
  balanceFrozen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public callRequestService: CallRequestService,
    private formbuilder: FormBuilder,
    public employeeService: EmployeeService,
    private lookupService: LookupService,
    private router: Router,
    public QuestionsCustomerExperienceService: QuestionsCustomerExperienceService,
    private customerService: CustomerService,
    private departmentService: DepartmentService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    // this.items = [
    //   { label: 'Home', routerLink: ['/'] },
    //   { label: 'Search Customer Experience' },
    // ];

    this.searchForm = this.fb.group({
      site: [null],
      department: [null],
      customerName: [null],
      SurveyDate: [null],
    });

    this.tableConfig.tableHeaders = [
      'Site',
      'Department',
      'Customer Name',
      'Survey Date',
    ];
    this.tableConfig.tableName = 'Customer Experience List';

    this.tableConfig.deleteRow = false;
    this.tableConfig.addRow = true;
    this.tableConfig.editRow = true;
    this.tableConfig.idHeader = 'Id';

    this.getDepartments();

    this.searchCustomerExperience();
  }

  searchCustomerExperience() {
    //Object.assign(this.searchFilter, this.searchForm.value);
    Object.bind(this.searchFilter, this.searchForm.value);
    // this.searchFilter.site = this.searchForm.value.site.custName;
    this.searchFilter.department =
      this.searchForm.value.department?.departmentName;
    this.searchFilter.customerName =
      this.searchForm.value.customerName?.customerName;
    this.searchFilter.surveyDate = this.searchForm.value.SurveyDate;

    this.QuestionsCustomerExperienceService.searchQuestionsCustomerExperienceTeam(
      this.searchFilter
    ).subscribe((data: any) => {
      this.tableConfig.pageFilter.totalItems = data['totalRows'];
      let tableData: any = [];
      // data['data']?.forEach((e: any) => {
      //   tableData.push({
      //     Id: e.id,
      //     Site: e.site,
      //     Department: e.department,
      //     'Customer Name': e.customerName,
      //     'Survey Date': new DatePipe('en-us').transform(
      //       e.surveyDate,
      //       'yyyy/MM/dd'
      //     ),
      //   });
      // });

      data['data']?.forEach((e: any) => {
        tableData.push({
          id: e.id,
          site: e.site,
          department: e.department,
          customerName: e.customerName,
          surveyDate: new DatePipe('en-us').transform(
            e.surveyDate,
            'yyyy/MM/dd'
          ),
        });
      });

      this.tableConfig.tableData = tableData;
      this.dataTable = tableData;
      this.tableConfig.pageFilter.totalRows = data.totalRows;
      this.cdr.detectChanges();
    });
    this.close_filter_modal();
  }

  onSelectSite(event: any) {
    this.searchOnSite(event.query);
    this.searchFilter.site = event.query;
  }

  bindSite(event: any) {
    this.searchFilter.site = event.custName;
    // this.searchFilter.customerName = event.customerName
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

  paginate(e: any) {
    this.searchFilter.pageNumber = e;
    this.tableConfig.pageFilter.pageNumber = e;
    this.searchCustomerExperience();
  }

  editCustomerExperience(event: any) {
    // this.router.navigate(
    //   ['/hr/customer-service/questions-customer-experience-team'],
    //   { queryParams: { id: event } }
    // );
    this.cusExp_id = event.id;
    this.cusExp_index = event.index;
    this.status = 'edit';
    this.addcusExpLoaded = !this.addcusExpLoaded;
  }

  reset() {
    this.searchForm.reset();
    this.searchFilter = new CustomerExperience();
    this.searchCustomerExperience();
  }

  add() {
    //   this.router.navigate([
    //     '/hr/customer-service/questions-customer-experience-team',
    //   ]);

    this.cusExp_id = 0;
    this.cusExp_index = 0;
    this.status = 'add';
    this.addcusExpLoaded = !this.addcusExpLoaded;
  }

  async toggleAdd() {
    this.addcusExpLoaded = !this.addcusExpLoaded;
    this.getDepartments();
    this.searchCustomerExperience();
    this.cdr.detectChanges();
  }

  close_filter_modal() {
    this.searchForm.reset();
    this.showFilterModal = false;
  }

  toggleFilter() {
    this.showFilterModal = !this.showFilterModal;
  }

  async openViewModal() {
    this.status = 'view';
    this.viewcusExpLoaded = !this.viewcusExpLoaded;
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.dataTable = this.dataTable.filter((row: any) =>
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
    this.getDepartments();
    this.searchCustomerExperience();
    this.cdr.detectChanges();
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
    ).subscribe((res) => {
      this.customer_Name = res.data;
      // this.Asset_SNs = res.data;
    });
  }

  bindCustomerName(event: any) {
    this.searchFilter.customerName = event.value.customerName;
  }

  ClearCustomerName() {
    this.searchFilter.customerName = '';
  }
}
