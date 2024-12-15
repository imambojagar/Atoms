import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CustomerModel } from '../../models/customer-model';
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
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { ExportService } from '../../shared/services/export.service';
import { PrimengModule } from '../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { AddSitesComponent } from './add-sites/add-sites.component';
import { ViewSupplierComponent } from '../supplier/view-supplier/view-supplier.component';
import { ViewSitesComponent } from './view-sites/view-sites.component';

@Component({
  selector: 'app-sites',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AddSitesComponent,
    ViewSitesComponent,
  ],
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.scss',
})
export class SitesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  PAGE_TITLE = 'site';
  customerModel: CustomerModel = new CustomerModel();
  allData!: any;
  msgs!: Message[];
  editData = {};

  //search filter
  customers: CustomerModel[] = [];
  PageSize!: number;
  PageNumber!: number;
  totalRows: number = 0;
  loading!: boolean;

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  //breadcrumb
  items!: MenuItem[];
  list = [];

  siteSearchForm!: FormGroup;
  showAddModal: boolean = false;
  showFilterModal: boolean = false;
  showEditModal: boolean = false;
  site_id: any;
  site_index: any;
  addSiteLoaded: boolean = false;
  viewSiteLoaded: boolean = false;
  status: string = '';
  searchValue: string = '';
  balanceFrozen: boolean = false;

  constructor(
    // private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private api: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private fb: FormBuilder,
    private exporteService: ExportService
  ) {}

  ngOnInit(): void {
    // this.authService.isAuthenticated = true;
    this.siteSearchForm = this.fb.group({
      sName: [],
      sCode: [],
      orgCode: [],
      orgName: [],
      orgPost: [],
    });
    // this.items = [{ label: 'Home', routerLink: ['/'] }, { label: 'Site' }];

    this.getAllCustomers();
  }

  event(e: any) {
    console.log(e);
  }

  navToDetails(row: any, index: number) {
    this.customerModel.id = row.id;
    this.site_id = row.id;
    this.site_index = index;
    this.status = 'edit';
    this.addSiteLoaded = !this.addSiteLoaded;
    // this.router.navigate(['/reference-table/customer/edit-control'], {
    //   queryParams: { data: row.id, index },
    // });
  }

  navToView(row: any, index: number) {
    this.customerModel.id = row.id;
    this.site_id = row.id;
    this.site_index = index;
    this.status = 'view';
    this.editData = { data: row.id, index };
    this.viewSiteLoaded = !this.viewSiteLoaded;
    // this.router.navigate(['/reference-table/customer/edit-control'], {
    //   queryParams: { data: row.id, index },
    // });
  }

  async openViewModal() {
    this.viewSiteLoaded = !this.viewSiteLoaded;
  }

  async openAddModal() {
    this.site_id = 0;
    this.site_index = 0;
    this.status = 'add';
    this.addSiteLoaded = !this.addSiteLoaded;
  }

  async toggleAdd() {
    this.addSiteLoaded = !this.addSiteLoaded;
    this.getAllCustomers();
  }
  //Customers list
  getAllCustomers() {
    this.loading = true;
    this.api.searchCustomer(this.filter).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      console.log('customers:', data);
      this.loading = false;
      this.customers = data;
      this.cdr.detectChanges();
    });
  }

  paginate(event: any) {
    this.loading = true;
    console.log('paginate event', event);
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.searchCustomer(this.filter).subscribe((res) => {
        const data = res.data;
        this.customers = data;
        this.totalRows = res.totalRows;
        this.loading = false;
      });
    }, 500);
  }
  //Onselect Autocomplete
  onSelect(name: any) {
    this.filter.custName = name.custName;
    this.api.searchCustomer(this.filter).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      console.log('customer:', data);
      this.customers = data;
    });
  }
  //Filters
  Search() {
    let searchObj = { ...this.filter };
    searchObj.pageNumber = 1;
    this.loading = true;
    this.api.searchCustomer(searchObj).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      console.log('data:', data);
      this.loading = false;
      this.customers = data;
      this.cdr.detectChanges();
    });
    this.close_filter_modal();
  }

  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      custName: null,
      name: null,
      customerCode: null,
      cityId: null,
      organizationId: null,
    };
    this.siteSearchForm.reset();
    this.api.searchCustomer(this.filter).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      console.log('data:', data);
      this.customers = data;
    });
  }
  customerNameFilter(name: any) {
    this.api.searchCustomer({ custName: name.query }).subscribe((res) => {
      this.list = res.data;
    });
  }
  codeFilter(customerCode: any) {
    this.api
      .searchCustomer({ customerCode: customerCode.query })
      .subscribe((res) => {
        this.list = res.data;
      });
  }
  orgCodeFilter(orgCode: any) {
    this.api
      .getOrganizations({ orgCode: orgCode.query, autoComplete: true })
      .subscribe((res) => {
        this.list = res.data;
      });
  }
  orgNameFilter(orgName: any) {
    this.api
      .getOrganizations({ name: orgName.query, autoComplete: true })
      .subscribe((res) => {
        this.list = res.data;
      });
  }
  orgPostFilter(orgPostalCode: any) {
    this.api
      .searchCustomer({ orgPostalCode: orgPostalCode.query })
      .subscribe((res) => {
        this.list = res.data;
      });
  }

  export() {
    console.log('this.filter', this.filter);
    this.exporteService
      .export(this.filter, 'Customer/export-Customer')
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
        link.download = 'Sites-Report';
        link.click();
      });
  }

  deleteCustomer(row: any) {
    this.customerModel.id = row.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + row.custName + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteCustomer(this.customerModel.id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.getAllCustomers();
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

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.customers = this.customers.filter((row: any) =>
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
    this.getAllCustomers();
    this.cdr.detectChanges();
  }

  toggleFilter() {
    this.showFilterModal = !this.showFilterModal;
  }

  close_filter_modal() {
    this.siteSearchForm.reset();
    this.showFilterModal = false;
  }
}
