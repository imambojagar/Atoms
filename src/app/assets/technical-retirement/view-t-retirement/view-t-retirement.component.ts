/* import { CustomerService } from 'src/app/data/service/customer.service'; */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { TechnicalRetirementModel } from '../../../models/technical-retirement';
import { TechnicalRetirementService } from '../../../services/technical-retirement.service';
import { LookupService } from '../../../services/lookup.service';
import { AssetsService } from '../../../services/assets.service';
import { ExportService } from '../../../shared/services/export.service';
import { CustomerService } from '../../../services/customer.service';
import { AssetGroupService } from '../../../services/asset-group.service';
import { SupplierService } from '../../../services/supplier.service';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { SearchTechnicalRetairementsComponent } from "../search-technical-retairements/search-technical-retairements.component";
import { AddEditTRetirementComponent } from '../add-edit-t-retirement/add-edit-t-retirement.component';
import { ViewDetailsTRetirementComponent } from '../view-details-t-retirement/view-details-t-retirement.component';
/* import { TechnicalRetirementModel } from 'src/app/data/models/technical-retirement';
import { AssetsService } from 'src/app/data/service/assets.service';
import { LookupService } from 'src/app/data/service/lookup.service';
import { TechnicalRetirementService } from 'src/app/data/service/technical-retirement.service';
import { ExportService } from 'src/app/shared/service/export.service';
import { AssetGroupService } from 'src/app/data/service/asset-group.service';
import { SupplierService } from 'src/app/data/service/supplier.service'; */


@Component({
  standalone: true,
  selector: 'view-t-retirement',
  templateUrl: './view-t-retirement.component.html',
  styleUrls: ['./view-t-retirement.component.scss'],
  imports: [PrimengModule, CommonModule, SearchTechnicalRetairementsComponent, AddEditTRetirementComponent, ViewDetailsTRetirementComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewTRetirementComponent implements OnInit {



  searchForm!: FormGroup;
  tRetirementModel: TechnicalRetirementModel = new TechnicalRetirementModel();

  items!: MenuItem[];
  techs: any[] = [];
  totalRows: number = 0;
  loading!: boolean;
  serialList: [] = [];
  siteList: [] = [];
  assetNumbs: [] = [];
  assetNames: [] = [];
  departmentList: [] = [];
  reasonsOptions: [] = [];
  supplierList: any[] = [];
  filterLoaded: boolean = false;
  asset_id: any = 0;
  lastTableLazyLoadEvent!: LazyLoadEvent;
  filter: any = {
    pageSize: 10,
    pageNumber: 1
  };
  assetGroupsList: any[] = [];
  addEditTechnicalRetairementLoaded: boolean = false;
  viewTechnicalRetairementLoaded: boolean = false;
  edit_index: number = 0;
  searchValue: any;
  constructor(
    private formbuilder: FormBuilder,
    private api: TechnicalRetirementService,
    private messageService: MessageService,
    private assetApi: AssetsService,
    private cdr: ChangeDetectorRef,
    private exporteService: ExportService,
    private siteApi: CustomerService,
    /*  private partCatalogApi: PartCatalogService, */
    private confirmationService: ConfirmationService,
    private assetGroupService: AssetGroupService,
    private supplierService: SupplierService
  ) { }

  loadUserData(event: any): void {
    this.lastTableLazyLoadEvent = event;
  }

  ngOnInit(): void {
    this.searchAssetGroup();
    this.searchForm = this.formbuilder.group({
      id: null,
      assetId: null,
      siteId: null,
      departmentId: null,
      retirementDateFrom: null,
      retirementDateTo: null,
      reasonId: null,
      assetGroup: [],
      supplier: []
    })


    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Technical Retirement List' },
    ];

    this.Reset();
    this.getDepartment();
    this.reasonsLookup();

  }

  navToDetails(row: any, index: number) {
    this.tRetirementModel.id = row.id;
    this.asset_id = row.id;
    this.edit_index = index;
    this.addEditTechnicalRetairementLoaded = !this.addEditTechnicalRetairementLoaded;
    /* this.router.navigate(['/systemsettings/technical-retirement/edit-control'], { queryParams: { data: row.id, index } }) */
  }

  viewDetails(row: any, index: number) {
    this.tRetirementModel.id = row.id;
    this.asset_id = row.id;
    this.edit_index = index;
    this.viewTechnicalRetairementLoaded = !this.viewTechnicalRetairementLoaded;
  }

  async openModal() {
    this.addEditTechnicalRetairementLoaded = !this.addEditTechnicalRetairementLoaded;
    this.asset_id = null
  }

  async openViewModal() {

    this.viewTechnicalRetairementLoaded = !this.viewTechnicalRetairementLoaded;
    this.asset_id = null
  }

  async openFilterModal() {
    this.filterLoaded = !this.filterLoaded;
  }

  getNameAssetSearch(event: any) {
    console.log("filter data", event);
    this.filter = event;
    this.getAllTechs();
  }

  getAllTechs() {
    /* this.techs = viewdata.data; */
    this.api.getAll(this.filter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.techs = data;
        this.totalRows = res.totalRows;
        this.cdr.detectChanges();
        this.loadUserData(this.lastTableLazyLoadEvent);
      }
      else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.getAllTechs();
    this.loading = false;
  }

  serialNumberFilter(event: any) {
    this.filter.pageNumber = 1;
    this.assetApi.GetAssetsAutoComplete(event.query).subscribe((res) => {
      this.serialList = res.data;
    });

  }
  selectAssetNum(event: any) {
    this.assetApi.GetAssetsAutoCompleteMultiFilter({ assetNumber: event.query }).subscribe((res) => {
      this.assetNumbs = res.data;
    });
  }


  selectAssetName(event: any) {
    this.assetApi.searchAsset(<any>{ assetName: event.query }).subscribe((res) => {
      this.assetNames = res.data;
      console.log("athis.assetNames", this.assetNames)
    })

  }

  siteNumberFilter(event: any) {
    this.filter.pageNumber = 1;
    this.siteApi.searchCustomer({ custName: event.query }).subscribe((res) => {
      const data = res.data;
      console.log("asset serial list", data)
      this.siteList = data;
    })
  }

  supplierFilter(name: any) {
    this.supplierService.getSupplier({ suppliername: name.query }).subscribe((res) => {
      const data = res.data;
      this.supplierList = data;
    });
  }

  getDepartment() {
    this.api.getDepartment({}).subscribe((res) => {
      this.departmentList = res.data;
    });
  }
  delete(row: any) {
    this.tRetirementModel.id = row.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.delete(row.id).subscribe(res => {
          console.log("delete res", res)
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.getAllTechs();
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
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });

  }
  reasonsLookup() {
    this.api.getLookups({ queryParams: 415 }).subscribe((res) => {
      this.reasonsOptions = res.data;
    });
  }
  search() {
    this.getAllTechs();
  }
  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      id: null,
      assetId: null,
      siteId: null,
      departmentId: null,
      retirementDateFrom: null,
      retirementDateTo: null,
      reasonId: null,
      assetGroup: null
    };
    this.searchForm.reset();
    this.getAllTechs();
  }

  export() {
    console.log('this.filter', this.filter);
    this.exporteService
      .export(this.filter, 'TechnicalRetirement/ExportToExcel')
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
        link.download = 'TechnicalRetirement-Report';
        link.click();
      });
  }

  searchAssetGroup() {
    this.assetGroupService
      .searchAssetGroups({})
      .subscribe((res) => (this.assetGroupsList = res.data));
  }

  // Global search and filter logic
  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.techs = this.techs.filter((row: any) =>
        Object.values(row).some((val: any) => String(val).toLowerCase().includes(this.searchValue))
      );
    }
    else {
      this.resetGlobalFilter()
    }
    this.cdr.detectChanges();
  }

  resetGlobalFilter() {
    this.searchValue = ''; // Clear the search input
    this.search()
    this.cdr.detectChanges();
  }

}

