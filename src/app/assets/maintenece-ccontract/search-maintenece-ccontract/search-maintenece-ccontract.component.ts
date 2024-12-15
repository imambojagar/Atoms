import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengModule } from '../../../shared/primeng.module';

import { Message, MenuItem, MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { AssetGroupService } from '../../../services/asset-group.service';
import { AssetsService } from '../../../services/assets.service';
import { AuthService } from '../../../services/auth.service';
import { ModelService } from '../../../services/model-definition.service';
import { ExportService } from '../../../shared/services/export.service';
import { MaintenanceModel } from '../../../models/Maintenance.model';
import { MaintenanceService } from '../../../services/maintenance.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-maintenece-ccontract',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule, ReactiveFormsModule, TranslateModule,],
  templateUrl: './search-maintenece-ccontract.component.html',
  styleUrl: './search-maintenece-ccontract.component.scss'
})
export class SearchMainteneceCcontractComponent {
  @Input('filter') filter: any; // Initialize filter as needed
  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('drawerFilter1') public drawerFilter1: any;
  @Output() openSearchModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() MaintenanceSearch: EventEmitter<any> = new EventEmitter<any>();
  maintenanceModel: MaintenanceModel = new MaintenanceModel();
  allData!: any;
  PageSize!: number;
  PageNumber!: number;
  totalRows: number = 0;
  loading!: boolean;
  //search filter
  // filter: any = {
  //   pageSize: 10,
  //   pageNumber: 1,
  // };

  msgs!: Message[];

  //breadcrumb
  items!: MenuItem[];
  showDialog: boolean = false;

  contractType: any[] = [];
  contractStatus: any[] = [];
  typeOfContract: any[] = [];
  suppliersList: any[] = [];

  mContractSearch!: FormGroup;
  assetsData: any[] = [];
  testArray: any[] = [
    {
      contractNumber: 1,
      contractName: 'num1',
      contractStatus: 'Active',
      contractType: 'Bla',
      contractRelated: null,
      numberOfAssets: 4,
      assetMContract: [
        { assetName: 'Asset name', serialNumber: '123' },
        { assetName: 'Asset name2', serialNumber: '456' },
      ],
    },
  ];
  AssetGroups: any[] = [];
  constructor(
    private authService: AuthService,
    private api: MaintenanceService,
    private assetApi: AssetsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private fb: FormBuilder,
    private apiModel: ModelService, private cdr: ChangeDetectorRef,
    private assetGroupService: AssetGroupService
  ) { }

  ngOnInit(): void {
    this.getAssetGroups();
    this.mContractSearch = this.fb.group({
      assetNo: [],
      site: [],
      contractNo: [],
      cName: [],
      cStatus: [],
      cType: [],
      endDate: [],
      supplier: [],
      sDate: [],
      assetGroup: null,
      pageSize: this.filter?.pageSize || 10,  // Set default page size
      pageIndex: this.filter?.pageNumber || 1 // Set default page number
    });
    this.authService.isAuthenticated = true;
    this.getAllMContracts();
    this.getLookups();
    this.Reset();
    this.items = [{ label: 'Home', routerLink: ['/'] }, { label: 'Maintenance Contract' }];
  }

  navToDetails(row: any, index: number) {
    this.maintenanceModel.id = row.id;
    this.router.navigate(['systemsettings/maintenance-contract/edit-control'], {
      queryParams: { data: row.id, index },
    });
  }
  getAllMContracts() {
    this.api.getMaintenance(this.filter).subscribe((res) => {
      this.totalRows = res.totalRows;
      this.allData = res.data;

      this.cdr.detectChanges();
    });
  }

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.getMaintenance(this.filter).subscribe((res) => {
        const data = res.data;
        this.allData = data;
        this.totalRows = res.totalRows;
        this.loading = false;
      });
    }, 500);
  }
  Date(d: any) {
    if (!d) {
    } else {
      d = new Date(d).toDateString();
      return d;
    }
  }
  getLookups() {
    this.api.getContractType().subscribe((res: any) => {
      this.contractType = res;
    });
    this.api.getContractStatus().subscribe((res: any) => {
      this.contractStatus = res;
    });
    this.api.getTypeOfContract().subscribe((res: any) => {
      this.typeOfContract = res;
    });

    this.cdr.detectChanges();
  }
  //filters
  contractNumberList = [];
  cNumberFilter(number: any) {
    this.filter.maintenanceContractNumber = number;
    this.api
      .getMaintenance({ maintenanceContractNumber: number.query })
      .subscribe((res) => {
        const data = res.data;
        this.contractNumberList = data;
      });
  }

  contractNameList = [];

  getSpplier($event: any) {

    return this.apiModel
      .getSupplier({ suppliername: $event.query })
      .subscribe((res: any) => {
        const data = res.data;
        this.suppliersList = data;
      });
  }

  cNameFilter(name: any) {
    this.api
      .getMaintenance({ maintenanceContractName: name.query })
      .subscribe((res) => {
        const data = res.data;
        this.contractNameList = data;
      });
  }

  cStatusFilter(status: any) {
    this.filter.contractStatus = status;
  }

  cStatusType(Type: any) {
    this.filter.contractType = Type;
  }

  searchStartDate(e: any) {
    let date = new Date(e);
    this.filter.contractStartDate = new Date(
      date.setDate(date.getDate() + 1)
    ).toISOString();
  }
  searchEndDate(e: any) {
    let date = new Date(e);
    this.filter.contractEndDate = new Date(
      date.setDate(date.getDate() + 1)
    ).toISOString();
  }

  deleteMContract(row: any) {
    this.maintenanceModel.id = row.id;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Maintenance Contract?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api
          .deleteMaintenance(this.maintenanceModel.id)
          .subscribe((res) => {
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              this.getAllMContracts();
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

  //forSearch
  assetNameList = [];
  assetNameFilter(event: any) {
    this.assetApi
      .GetAssetsAutoCompleteMultiFilter({ assetNumber: event.query })
      .subscribe((res) => {
        const data = res.data;
        this.assetNameList = data;
      });
  }
  event(e: any) {
  }
  siteList = [];
  siteFilter(e: any) {
    this.api.searchSites(e.query).subscribe((res) => {
      const data = res.data;
      this.siteList = data;
    });
  }
  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      maintenanceContractName: null,
      maintenanceContractNumber: null,
      assetId: null,
      contractStatus: null,
      contractType: null,
      siteId: null,
      contractEndDate: null,
      contractStartDate: null,
      supplierId: null,
      assetGroup: null
    };
    this.mContractSearch.reset();
    this.api.getMaintenance(this.filter).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.allData = data;

      this.cdr.detectChanges();
    });
  }

  Search() {
    const searchCriteria = {
      ...this.filter, // Include all form values, including pageSize and pageIndex
      pageSize: 10,
      pageIndex: this.mContractSearch.value.pageIndex
    };

    this.MaintenanceSearch.emit(searchCriteria);
    this.showmodal = false;

    this.cdr.detectChanges();
    this.close_modal();
  }

  getAssetGroups() {
    this.assetGroupService.searchAssetGroups({}).subscribe((res: any) => {
      this.AssetGroups = res.data

      this.cdr.detectChanges();
    })


  }
  close_modal() {
    this.openSearchModals.emit();

    this.mContractSearch.reset()
    this.filter = null
    this.ngOnInit()

    this.cdr.detectChanges();
  }

  search() {
    const searchCriteria = {
      ...this.filter, // Include all form values, including pageSize and pageIndex
      pageSize: this.mContractSearch.value.pageSize,
      pageIndex: this.mContractSearch.value.pageIndex
    };

    this.MaintenanceSearch.emit(searchCriteria);
    this.showmodal = false;

    this.cdr.detectChanges();
  }
}
