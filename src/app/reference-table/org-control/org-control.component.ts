import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { TransactionHistory } from '../../models/transaction-history';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { CustomerService } from '../../services/customer.service';
import { ExportService } from '../../shared/services/export.service';
import { Lookup } from '../../shared/enums/lookup';
import { dateHelper } from '../../shared/helpers/dateHelper';
import validateForm from '../../shared/helpers/validateForm';
import { PrimengModule } from '../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { TransactionHistoryComponent } from '../../shared/components/transaction-history/transaction-history.component';

@Component({
  selector: 'app-org-control',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TransactionHistoryComponent,
  ],
  templateUrl: './org-control.component.html',
  styleUrl: './org-control.component.scss',
})
export class OrgControlComponent {
  transactionHistory!: TransactionHistory;
  orgForm!: FormGroup;
  orgsList = [];
  cityList: [] = [];
  countryList: [] = [];
  @ViewChild('dt') dt!: Table;
  showAddModal = false;
  showEditModal = false;

  orgModel = {
    id: 0,
    name: '',
    orgCode: '',
    orgPostalCode: '',
  };
  totalRows!: number;
  loading!: boolean;

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  displayAdd: boolean = false;
  displayUpdate: boolean = false;
  items!: MenuItem[];

  orgLastNo: any;
  searchValue: string = '';
  balanceFrozen: boolean = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private api: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exporteService: ExportService
  ) {}
  ngOnInit() {
    this.getOrgs();
    this.getLastNumber();

    this.orgForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      orgCode: [],
      orgPostalCode: [],
      fromDate: [''],
      toDate: [''],
      location: [''],
      countryId: [],
      cityId: [''],
      countryName: [''],
      cityName: [''],
    });

    this.getAndBindLookup(Lookup.City, (a) => (this.cityList = a));
    this.getAndBindLookup(
      Lookup.Country_Of_Origin,
      (a) => (this.countryList = a)
    );

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Define Organizations' },
    ];
  }

  getLastNumber() {
    this.api.getOrgLastNumber().subscribe((res: any) => {
      this.orgLastNo = res;
      this.orgForm.controls['orgCode'].setValue('ORG-' + this.orgLastNo);
      this.cdr.detectChanges();
    });
  }

  getOrgs() {
    this.api.getOrganizations(this.filter).subscribe((res: any) => {
      this.totalRows = res.totalRows;
      this.orgsList = res.data;
      this.cdr.detectChanges();
    });
  }

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.getOrganizations(this.filter).subscribe((res: any) => {
        const data = res.data;
        this.orgsList = data;
        this.totalRows = res.totalRows;
        this.loading = false;
      });
    }, 500);
  }
  showAddDialog() {
    this.getLastNumber();
    this.displayAdd = true;
  }
  showUpdateDialog(id: number) {
    this.displayUpdate = true;
    this.showEditModal = true;
    this.api.getSingleOrganization(id).subscribe((res: any) => {
      const data = res.data;
      this.transactionHistory = new TransactionHistory();
      Object.assign(this.transactionHistory, res.data);
      dateHelper.parseDateFilds(data, ['fromDate', 'toDate']);
      this.orgForm.patchValue(data);
    });
  }
  onAdd() {
    if (this.orgForm.invalid) {
      validateForm.validateAllFormFields(this.orgForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      let model = { ...this.orgForm.value };
      dateHelper.reverseDateFilds(model, ['fromDate', 'toDate']);
      model.id = 0;
      this.api.addOrg(model).subscribe((res: any) => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
          this.displayAdd = false;
          this.close_add_modal();
          this.getOrgs();
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
  onUpdate() {
    if (this.orgForm.invalid) {
      validateForm.validateAllFormFields(this.orgForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      let model = { ...this.orgForm.value };
      dateHelper.reverseDateFilds(model, ['fromDate', 'toDate']);
      this.api.updateOrg(model).subscribe((res: any) => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
          this.displayUpdate = false;
          this.close_edit_modal();
          this.getOrgs();
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
  onDelete(org: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + org.name + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteOrg(org.id).subscribe((res: any) => {
          this.getOrgs();
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
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

  changeCity(event: any) {
    this.orgForm.value.cityId = event.value;
  }
  changeCountry(event: any) {
    this.orgForm.value.countryId = event.value;
  }

  //bind lookup and role
  getAndBindLookup(lookup: Lookup, targetProp: (a: any) => void) {
    this.api
      .getLookups({ queryParams: lookup })
      .subscribe((res: any) => targetProp(res.data));
  }
  onHideDialog() {
    this.orgForm.reset();
  }

  export() {
    this.exporteService
      .export(this.filter, 'Organization/exportOrganization')
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
        link.download = 'Organization-Report';
        link.click();
      });
  }

  // onGlobalFilter(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   const filterValue = inputElement.value;
  //   this.dt.filterGlobal(filterValue, 'contains');
  // }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.orgsList = this.orgsList.filter((row: any) =>
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
    this.getOrgs();
    this.cdr.detectChanges();
  }

  toggleAdd() {
    this.showAddModal = !this.showAddModal;
    this.getLastNumber();
  }

  close_add_modal() {
    this.orgForm.reset();
    this.showAddModal = false;
  }

  close_edit_modal() {
    this.orgForm.reset();
    this.showEditModal = false;
  }

  toggleEdit() {
    this.showEditModal = !this.showEditModal;
  }

}
