import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { DistributionShiftMasterSearch } from '../../models/shift-dist.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedTable } from '../../shared/components/table/table';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { Router } from '@angular/router';
import { ShiftDistributionService } from '../../services/shift-distribution.service';
import { AssetGroupService } from '../../services/asset-group.service';
import { AssetFormService } from '../../assets/assets/asset-form.service';
import { PrimengModule } from '../../shared/primeng.module';
import { AddEditRotaComponent } from './add-edit-rota/add-edit-rota.component';

@Component({
  selector: 'app-rota',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AddEditRotaComponent,
  ],
  templateUrl: './rota.component.html',
  styleUrl: './rota.component.scss',
  providers: [DatePipe],
})
export class RotaComponent {
  searchFilter = new DistributionShiftMasterSearch();
  searchForm!: FormGroup;
  // items = [
  //   { label: 'Home', routerLink: ['/'] },
  //   { label: 'Search Rota', routerLink: ['/hr/rota'] },
  // ];
  tableConfig = new SharedTable();
  pageSize: number = 10;
  pageIndex: number = 1;
  Sites: any = [];
  AssetGroups: any[] = [];
  showFilterModal: boolean = false;
  viewRotaLoaded: boolean = false;
  editRotaLoaded: boolean = false;
  addRotaLoaded: boolean = false;
  dataTable: any;
  searchValue: string = '';
  rotaId: any;
  rotaIndex: any;
  status: string = '';
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    public assetFormService: AssetFormService,
    private shiftDistributionService: ShiftDistributionService,
    private assetGroupService: AssetGroupService
  ) {}

  ngOnInit(): void {
    this.getAssetGroups();
    this.searchForm = this.fb.group({
      site: [null],
      assetGroup: [null],
    });
    this.tableConfig.tableHeaders = ['Site', 'Shift Date'];
    this.tableConfig.deleteRow = true;
    this.tableConfig.editRow = true;
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.tableName = 'Rota List';

    this.tableConfig.clickableLinks = [
      { header: 'Call Id' },
      { header: 'Operation' },
    ];
    this.searchShifts();
  }

  searchShifts() {
    // Object.bind(this.searchFilter, this.searchForm.value)
    this.searchFilter.assetGroup = this.searchForm.value.assetGroup;
    this.searchFilter.site = this.searchForm.value.site;
    this.shiftDistributionService
      .GetDistributionShift(this.searchFilter)
      .subscribe((data) => {
        this.tableConfig.pageFilter.totalItems = data['totalRows'];
        let tableData: any = [];
        // data['data']?.forEach((e: any) => {
        //   tableData.push({
        //     Id: e.id,
        //     Site: e.site?.custName,
        //     'Shift Date':
        //       e.shiftDate == null
        //         ? ''
        //         : this.datePipe.transform(e.shiftDate, 'yyyy-MM-dd'),
        //   });
        // });
        data['data']?.forEach((e: any) => {
          tableData.push({
            id: e.id,
            site: e.site?.custName,
            shiftDate:
              e.shiftDate == null
                ? ''
                : this.datePipe.transform(e.shiftDate, 'yyyy-MM-dd'),
          });
        });
        this.tableConfig.tableData = tableData;
        this.dataTable = tableData;
        this.tableConfig.pageFilter.totalRows = data.totalRows;

        this.cdr.detectChanges();
      });
  }

  reset() {
    this.searchForm.reset();
    this.searchShifts();
  }

  editShift(e: any) {
    // this.router.navigate(['/hr/rota/calender'], { queryParams: { id: e } });
    this.rotaId = e.id;
    this.status = 'edit';
    this.addRotaLoaded = true;
  }
  veiwShift(e: any) {
    this.rotaId = e.id;
    this.status = 'view';
    this.viewRotaLoaded = true;
    // this.router.navigate(['/hr/rota/view-calender'], {
    //   queryParams: { id: e },
    // });
  }

  deleteShift(shift: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + shift.Name + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shiftDistributionService
          .deletedistributionShift(shift.Id)
          .subscribe((res: any) => {
            this.searchShifts();
          });
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Customer Deleted',
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
  paginate(e: any) {
    this.searchFilter.pageNumber = e;
    this.tableConfig.pageFilter.pageNumber = e;
    this.searchShifts();
  }
  onSelectSite(event: any) {
    this.searchOnSite(event.query);
    this.searchFilter.site = event.query;
  }
  bindSite(event: any) {
    this.searchFilter.site = event.custName;
  }
  clearSite() {
    this.searchFilter.site = '';
  }

  searchOnSite(code: any) {
    this.customerService.GetCustomersAutoComplete(code).subscribe((data) => {
      this.Sites = data.data;
    });
  }

  getAssetGroups() {
    this.assetGroupService.searchAssetGroups({}).subscribe((res: any) => {
      this.AssetGroups = res.data;
      this.cdr.detectChanges();
    });
  }

  async openEditModal() {
    this.editRotaLoaded = !this.editRotaLoaded;
  }

  async openViewModal() {
    this.viewRotaLoaded = !this.viewRotaLoaded;
  }

  async openAddModal() {
    this.addRotaLoaded = !this.addRotaLoaded;
  }

  toggleFilter() {
    this.showFilterModal = !this.showFilterModal;
  }

  async add() {
    this.rotaId = 0;
    this.status = 'add';
    this.addRotaLoaded = !this.addRotaLoaded;
  }

  close_filter_modal() {
    this.searchForm.reset();
    this.showFilterModal = false;
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
    this.getAssetGroups();
    this.searchShifts();
    this.cdr.detectChanges();
  }
}
