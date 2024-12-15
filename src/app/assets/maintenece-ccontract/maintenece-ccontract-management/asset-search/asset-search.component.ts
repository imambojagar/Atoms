import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NewEmployeeModel } from '../../../../models/employee-model';
import { AssetGroupService } from '../../../../services/asset-group.service';
import { AssetsService } from '../../../../services/assets.service';
import { EmployeeService } from '../../../../services/employee.service';
import { MaintenanceService } from '../../../../services/maintenance.service';
import { TaxonomyService } from '../../../../services/taxonomy.service';
import { AssetFormService } from '../../../assets/asset-form.service';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../../../shared/primeng.module';
import { MainteneceCcontractManagementComponent } from '../maintenece-ccontract-management.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule, ReactiveFormsModule, MainteneceCcontractManagementComponent
  ],
  selector: 'app-asset-search',
  templateUrl: './asset-search.component.html',
  styleUrls: ['./asset-search.component.scss'],
})
export class AssetSearchComponent {
  constructor(
    private api: EmployeeService,
    private mainService: MaintenanceService,
    public config: DynamicDialogConfig,
    private taxonomyService: TaxonomyService,
    private formbuilder: FormBuilder,
    public assetFormService: AssetFormService,
    private apiAsset: AssetsService,
    private messageService: MessageService,
    private assetGroupService: AssetGroupService,

    public contract: MainteneceCcontractManagementComponent,

  ) { }
  totalRows!: number;
  loading!: boolean;
  employees: NewEmployeeModel[] = [];
  allAssets: [] = [];
  manufacts: [] = [];
  assetNames: [] = [];

  filter: any = {
    pageSize: 5,
    pageNumber: 1,
  };
  searchFilter: any = {
    pageSize: 5,
    pageNumber: 1,
  };

  searchForm!: FormGroup;
  assetSearchForm!: FormGroup;
  selectedRowIds: Set<number> = new Set<number>();
  selectedRowData: any[] = [];
  assetsNumberList: any[] = [];
  AssetGroups: any[] = [];
  ngOnInit() {
    this.assetSearchForm = this.formbuilder.group({
      serialNo: null,
      assetNo: null,
      manufacturer: null,
      assetName: null,
      assetGroup: null
    });
    this.getAssetGroups();
    this.getAssets();
    this.assetSerach();

  }

  Reset() {
    this.searchFilter = {
      pageSize: 5,
      pageNumber: 1,
      serialNo: null,
      assetNo: null,
      manufacturer: null,
      assetName: null,
      assetGroup: null
    };

    this.assetSearchForm.reset();
    this.apiAsset.searchAsset(this.searchFilter).subscribe((res) => {
      console.log('rea', res);
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.allAssets = data;
        this.totalRows = res.totalRows;
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

  getAssets() {
    this.mainService.getAssets(this.filter).subscribe((res: any) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.allAssets = data;
    });
  }
  paginate(event: any) {
    this.searchFilter.pageNumber = event.page + 1;
    this.searchAsset();
  }

  closeDialog() {
    if (this.contract.ref) {
      this.contract.ref.close();
      // }
      // if (this.editContract.ref) {
      //   this.editContract.ref.close();
    }
  }

  nameFilter(name: any) {
    this.filter.employeeName = name;
    this.api.searchEmployee(this.filter).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.employees = data;
    });
  }
  onSelectName(name: any) {
    this.filter.employeeName = name.userName;
    this.api.searchEmployee(this.filter).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.employees = data;
    });
  }

  assetSerach() {
    this.searchForm = this.formbuilder.group({
      code: [null],
      assetSerialNumber: [null],
      supplyDateSymbol: [null],
      supplyDateFrom: [null],
      supplyDateTo: [null],
      warrantyEndDateSymbol: [null],
      warrantyEndDateFrom: [null],
      warrantyEndDateTo: [null],
      recievingDateSymbol: [null],
      recievingDateFrom: [null],
      recievingDateTo: [null],
      maintenanceContract: [null],
      assetClassification: [null],
      assetStatus: [null],
      assetNotScraped: [null],
      assetNo: [null],
      modelDefinition: [null],
      site: [null],
      manufacturer: [null],
      assetGroup: [null]
    });
  }
  onRowSelect(event: any) {
    const id = event.data.id;
    const data = event.data;
    if (this.selectedRowData.includes(data)) {
      this.selectedRowIds.delete(id);
      this.selectedRowData.splice(this.selectedRowData.indexOf(data), 1);
    } else {
      this.selectedRowIds.add(id);
      this.selectedRowData.push(data);
    }
  }
  onRowUnselect(event: any) {
    const id = event.data.id;
    const data = event.data;
    if (this.selectedRowData.includes(data)) {
      this.selectedRowIds.delete(id);
      this.selectedRowData.splice(this.selectedRowData.indexOf(data), 1);
    } else {
      this.selectedRowIds.add(id);
      this.selectedRowData.push(data);
    }
  }
  rowIsSelected(id: number) {
    return this.selectedRowIds.has(id);
  }
  addSerialNumber() {
    this.closeDialog();
    this.contract.selectedRowIds = this.selectedRowIds;
    this.contract.selectedRowData = [];
    // this.editContract.selectedRowData = [];
    console.log(this.contract.selectedRowData);
    this.selectedRowData.forEach((x) => {
      this.contract.selectedRowData.push(x)
      //   this.editContract.selectedRowData.push(x);
    });
    this.contract.setAssets();
    // this.editContract.setAssets();
  }
  searchAsset() {
    Object.bind(this.searchFilter, this.searchForm.value);
    this.searchFilter.assetGroup = this.assetSearchForm.value.assetGroup;
    this.apiAsset.searchAsset(this.searchFilter).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.allAssets = data;
        this.totalRows = res.totalRows;
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
  manfacturersList = [];
  selectManufacturer(event: any) {
    this.searchFilter.pageNumber = 1;
    this.taxonomyService
      .searchManufacturerByName({ name: event.query })
      .subscribe((res) => {
        this.manufacts = res.data;
      });
    this.searchFilter.manufacturer = event.query;
  }
  bindManufacturer(event: any) {
    this.searchFilter.manufacturer = event.taxonomyName;
  }
  serialNosList = [];
  selectSN(event: any) {
    this.searchFilter.pageNumber = 1;
    this.apiAsset.GetAssetsAutoComplete(event.query).subscribe((res) => {
      this.serialNosList = res.data;
    });
    this.searchFilter.assetSerialNumber = event.query;
  }
  bindSN(event: any) {
    this.searchFilter.assetSerialNumber = event.assetSerialNo;
  }
  selectAssetNumber(event: any) {
    this.apiAsset
      .GetAssetsAutoCompleteMultiFilter({
        assetNumber: event.query,
      })
      .subscribe((res) => {
        this.assetsNumberList = res.data;
      });
    this.searchFilter.assetNo = event.query;
  }
  bindAssetNumber(event: any) {
    this.searchFilter.assetNo = event.assetNumber;
  }

  selectAssetName(event: any) {
    this.apiAsset
      .searchAsset(<any>{ assetName: event.query })
      .subscribe((res) => {
        this.assetNames = res.data;
      });
    this.searchFilter.assetName = event.query;
  }
  bindAssetName(event: any) {
    console.log('event', event);
    this.searchFilter.assetName = event.modelDefinition.assetName;
  }

  getAssetGroups() {
    this.assetGroupService.searchAssetGroups({}).subscribe((res: any) => {
      this.AssetGroups = res.data
    })

  }
}
