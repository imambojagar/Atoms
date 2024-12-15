import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SupplierModel } from '../../models/supplier-model';
import {
  ConfirmationService,
  ConfirmEventType,
  FilterService,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { SupplierService } from '../../services/supplier.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PrimengModule } from '../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { EditDeleteSupplierComponent } from './edit-delete-supplier/edit-delete-supplier.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { ViewSupplierComponent } from './view-supplier/view-supplier.component';

@Component({
  selector: 'app-supplier',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    EditDeleteSupplierComponent,
    AddSupplierComponent,
    ViewSupplierComponent,
  ],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss',
})
export class SupplierComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  userDialog!: boolean;
  submitted!: boolean;
  linkDialog: boolean = false;
  searchForm!: FormGroup;
  supplierModel: SupplierModel = new SupplierModel();
  suppliers: SupplierModel[] = [];
  PageSize!: number;
  PageNumber!: number;
  totalRows: number = 0;
  supplierNameList: [] = [];
  nameList: [] = [];
  codeList: [] = [];
  cityList: [] = [];
  statusList: [] = [];
  loading!: boolean;
  first: number = 0;

  //search filter
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  codeAutoCompelete: any = {
    pageSize: 10,
    pageNumber: 1,
    code: null,
    codeContains: null,
  };

  msgs!: Message[];
  codes: any[] = [];

  filter1 = {};
  //breadcrumb
  items!: MenuItem[];
  balanceFrozen: boolean = false;

  //checkbox
  supNameChecked: boolean = true;
  nameChecked: boolean = true;
  teleChecked: boolean = true;
  addrChecked: boolean = true;
  faxChecked: boolean = true;
  webChecked: boolean = true;
  commentChecked: boolean = true;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showViewModal: boolean = false;
  showFilterModal: boolean = false;
  supplier_id: any;
  supplier_index: any;
  editSupplierLoaded: boolean = false;
  addSupplierLoaded: boolean = false;
  viewSupplierLoaded: boolean = false;
  searchValue: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private api: SupplierService,

    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private httpClient: HttpClient,
    private router: Router,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formbuilder.group({
      supplierName: null,
      name: null,
      cityId: null,
      code: null,
      suppStatusId: null,
      codeTypeId: null,
      codeValue: null,
    });

    // this.items = [{ label: 'Home', routerLink: ['/'] }, { label: 'Supplier' }];
    this.Reset();
    this.getCodes();
    this.getStatus();
    this.getCity();
  }

  getCodes() {
    this.api.getLookups({ queryParams: 407 }).subscribe((res) => {
      this.codes = res.data;
      console.log('codes', this.codes);
      this.cdr.detectChanges();
    });
  }
  supplierNameFilter($event: any) {
    this.filter.pageNumber = 1;
    this.api
      .getautoComplete({ supplierName: $event.query })
      .subscribe((res: any) => (this.supplierNameList = res));
  }

  nameFilter(name: any) {
    this.filter.name = name;
    this.filter.pageNumber = 1;
    this.api.getSupplier(this.filter).subscribe((res) => {
      const data = res.data;
      this.nameList = data;
    });
  }

  onNameSelect(name: any) {
    this.filter.name = name.name;
    this.api.getSupplier(this.filter).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.suppliers = data;
    });
  }
  codeFilter($event: any) {
    console.log('$event', $event);
    this.codeAutoCompelete.pageNumber = 1;
    this.codeAutoCompelete.codeContains = true;
    this.codeAutoCompelete.code = $event.query;
    this.api.getSupplier(this.codeAutoCompelete).subscribe((res) => {
      const data = res.data;
      this.codeList = data;
    });
  }

  getStatus() {
    this.api.getLookups({ queryParams: 35 }).subscribe((res) => {
      this.statusList = res.data;
      this.cdr.detectChanges();
    });
  }
  getCity() {
    this.api.getLookups({ queryParams: 11 }).subscribe((res) => {
      this.cityList = res.data;
      this.cdr.detectChanges();
    });
  }

  navToDetails(row: any, index: number) {
    this.supplierModel.id = row.id;
    this.supplier_id = row.id;
    this.supplier_index = index;
    this.editSupplierLoaded = !this.editSupplierLoaded;
    // this.router.navigate(['/reference-table/supplier/edit-control'], {
    //   queryParams: { data: row.id, index },
    // });
  }

  navToView(row: any, index: number) {
    this.supplierModel.id = row.id;
    this.supplier_id = row.id;
    this.supplier_index = index;
    this.viewSupplierLoaded = !this.viewSupplierLoaded;
  }

  async openModal() {
    // this.supplier_id = 0;
    // this.supplier_index = 0;
    this.editSupplierLoaded = !this.editSupplierLoaded;
  }

  async openViewModal() {
    // this.supplier_id = 0;
    // this.supplier_index = 0;
    this.viewSupplierLoaded = !this.viewSupplierLoaded;
  }

  async openAddModal() {
    this.supplier_id = 0;
    this.supplier_index = 0;
    this.addSupplierLoaded = !this.addSupplierLoaded;
  }

  getAllSuppliers() {
    console.log('this.filter', this.filter);

    this.api.getSupplier(this.filter).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.suppliers = data;
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
  }

  paginate(event: any) {
    this.loading = true;
    console.log('paginate event', event);
    this.filter.pageNumber = event.page + 1;
    this.getAllSuppliers();
    this.loading = false;
  }

  deleteSupplier(row: any) {
    this.supplierModel.id = row.id;
    this.cdr.detectChanges();
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + row.suppliername + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteSupplier(this.supplierModel.id).subscribe((res) => {
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
            this.getAllSuppliers();
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
  onCodeInput($event: any) {
    this.filter.codeValue = $event.target.value;
  }

  search() {
    this.api.getSupplier(this.filter).subscribe((res) => {
      const data = res.data;
      console.log('data', data);
      this.totalRows = res.totalRows;
      this.suppliers = data;
      this.cdr.detectChanges();
    });
    this.close_filter_modal();
  }
  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      supplierName: null,
      name: null,
      cityId: null,
      code: null,
      suppStatusId: null,
      codeContains: null,
      codeTypeId: null,
      codeValue: null,
    };
    this.searchForm.reset();
    this.getAllSuppliers();
  }

  export() {
    console.log('this.filter', this.filter);
    this.api.export(this.filter).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'File should be downloaded now',
        life: 3000,
      });
      var downloadURL = URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'Supplier-Report';
      link.click();
    });
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.suppliers = this.suppliers.filter((row: any) =>
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
    this.getCodes();
    this.getStatus();
    this.getCity();
    this.cdr.detectChanges();
  }

  async toggleAdd() {
    this.addSupplierLoaded = !this.addSupplierLoaded;
    this.getCodes();
    this.getStatus();
    this.getCity();
    this.cdr.detectChanges();
  }

  async toggleFilter() {
    this.showFilterModal = !this.showFilterModal;
  }

  close_add_modal() {
    // this.orgForm.reset();
    this.showAddModal = false;
  }

  close_edit_modal() {
    // this.orgForm.reset();
    this.showEditModal = false;
  }

  close_filter_modal() {
    this.searchForm.reset();
    this.showFilterModal = false;
  }
}
