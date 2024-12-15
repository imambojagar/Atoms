import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
/* import { SearchModelDefinition } from 'src/app/data/models/model-definition-model';
import { ModelService } from 'src/app/data/service/model-definition.service';
import { ApiService } from 'src/app/data/service/name-definition.service';
import { TaxonomyService } from 'src/app/data/service/taxonomy.service'; */
import { AssetFormService } from '../../asset-form.service';
import { Asset } from '../../../../models/asset';
import { SearchModelDefinition } from '../../../../models/model-definition-model';
import { AssetsService } from '../../../../services/assets.service';
import { ModelService } from '../../../../services/model-definition.service';
import {  ServiceRequestFormService} from '../../../../maintenance/service-request/service-request-form.service';
import { TaxonomyService } from '../../../../services/taxonomy.service';
import { DepartmentService } from '../../../../services/department.service';
import { CustomerService } from '../../../../services/customer.service';
import { SupplierService } from '../../../../services/supplier.service';
import { ApiService } from '../../../../services/name-definition.service';
import { PrimengModule } from '../../../../shared/primeng.module';
/* import { AssetsService } from 'src/app/data/service/assets.service';
import { Asset } from 'src/app/data/models/asset';
import { DepartmentService } from 'src/app/data/service/department.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { SupplierService } from 'src/app/data/service/supplier.service';
import { ServiceRequestFormService } from 'src/app/modules/maintenance/service-request/service-request-form.service';
 */





@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, PrimengModule],
  selector: 'app-asset-info',
  templateUrl: './asset-info.component.html',
  styleUrls: ['./asset-info.component.scss'],
  providers: [MessageService, ConfirmationService, ServiceRequestFormService],
})
export class AssetInfoComponent implements OnInit {

  searchFilterAsset = new Asset();
  assetsData: [] = [];
  selectedItems: any[] = [];
  showDialog: boolean = false;
  showDialogasset: boolean = false;
  searchFilter = new SearchModelDefinition();
  modelDefinitions: any[] = [];
  totalRows: number = 0;
  searchForm!: FormGroup;
  dialogForm!: FormGroup
  manufacturers: any[] = [];
  assetNames: any[] = [];
  models: any[] = [];
  departments: [] = [];
  sites: [] = [];
  suppliers: [] = [];
  loading!: boolean;
  pageSize = 10;
 /* public serviceRequestFormService: ServiceRequestFormComponent; */

  dialogsource!: string;
  constructor(public assetFormService: AssetFormService, private apiAsset: AssetsService,
    private modelDefinitionService: ModelService,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    public serviceRequestFormService: ServiceRequestFormService,
    private taxonamyService: TaxonomyService,
    private departmentService: DepartmentService,
    private customerService: CustomerService,
    private supplierService: SupplierService,
    private apiServiceNameDefinition: ApiService) {
  }

  ngOnInit(): void {
    this.searchForm = this.formbuilder.group({
      assetNDId: null,
      modelId: null,
      manufacturerId: null
    })
    this.dialogForm = this.formbuilder.group({

      manufacturer: null,
      assetSerialNumber: null,
      assetNo: null,
      assetName: null,
      model: null,
      department: null,
      site: null,
      supplier: null,

    })
    this.searchFilter.pageNumber = 1;
    this.searchFilter.pageSize = this.pageSize;
    this.searchModelDefinition();
  }
  searchAsset() {


    this.apiAsset.searchAsset(this.searchFilterAsset).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.assetsData = data;
        this.totalRows = res.totalRows;
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

  selectSN(event: any) {
    this.assetFormService.getAssetsData(event.query);
    this.searchFilterAsset.assetSerialNumber = event.query;
  }

  bindSN(event: any) {
    this.searchFilterAsset.assetSerialNumber = event.assetSerialNo;
  }
  clearSN() {
    this.searchFilterAsset.assetSerialNumber = "";
  }
  selectAssetNumber(event: any) {
    this.assetFormService.getAssetNumbers(event.query);
    this.searchFilterAsset.assetNo = event.query;
  }
  bindAssetNumber(event: any) {
    this.searchFilterAsset.assetNo = event.assetNumber;
  }
  clearAssetNumber() {
    this.searchFilterAsset.assetNo = "";
  }
  selectDepartment(event: any) {
    this.departmentService.GetDepartmentsAutoComplete1(event.query).subscribe(res => {
      this.departments = res.data;
      this.searchFilterAsset.department = event.query
    });
  }

  clearDepartment() {
    this.searchFilterAsset.department = "";
  }

  bindDepartment(event: any) {
    this.searchFilterAsset.department = event.departmentName;
  }
  selectSite(event: any) {
    this.customerService.GetCustomersAutoComplete(event.query).subscribe(res => {
      this.sites = res.data;
      this.searchFilterAsset.site = event.query
    });

  }
  bindSite(event: any) {
    this.searchFilterAsset.site = event.custName;
  }



  clearSite() {
    this.searchFilterAsset.site = "";
  }


  selectSupplier(event: any) {
    this.supplierService.getSuppliersAutoComplete(event.query).subscribe(res => {
      this.suppliers = res.data;
      this.searchFilterAsset.supplier = event.query
    });

  }
  bindSupplier(event: any) {
    this.searchFilterAsset.supplier = event.suppliername;
  }
  clearSupplier() {
    this.searchFilterAsset.supplier = "";
  }

  onRowSelect(event: any) {
    console.log(this.selectedItems);

  }


  addSerialNumber() {
    if (this.selectedItems.length > 0) {
      (this.serviceRequestFormService.assets).controls.forEach((element, index) => {
        if (element.value.assetNumber == null) {
          (this.serviceRequestFormService.assets).controls.splice(index, 1);
        }
      });
    }
    this.selectedItems.forEach(x => {
      this.serviceRequestFormService.selectAssetPOPUP(x.id)
    })
  }
  searchModelDefinition() {

    this.modelDefinitionService.getModelDefinitions(this.searchFilter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.modelDefinitions = data;
        this.totalRows = res.totalRows;
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
  search() {
    this.searchAsset();
  }


  Reset() {
    this.searchFilter.assetNDId = null;
    this.searchFilter.modelId = null;
    this.searchFilter.manufacturerId = null;
    this.searchFilter.pageNumber = 1;
    this.searchForm.reset();
    this.modelDefinitionService.getModelDefinitions(this.searchFilter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.modelDefinitions = data;
        this.totalRows = res.totalRows;
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

  getManufacturers(searchText: any = '') {

    this.taxonamyService.GetManufacturerOrModelAutoComplete3(true, searchText).subscribe((res) => {
      this.manufacturers = res.data;

    });
  }

  selectManufacturer(event: any) {
    this.getManufacturers(event.query);
    this.searchFilter.manufacturerId = event.id
    this.searchFilterAsset.manufacturer = event.query;
  }
  bindManufacturer(event: any) {
    this.searchFilter.manufacturerId = event.id;
    this.searchFilterAsset.manufacturer = event.name;
  }
  clearManufacturer() {
    this.searchFilter.manufacturerId = null;
    this.searchFilterAsset.manufacturer = null;
  }

  selectAssetName(event: any) {
    this.apiServiceNameDefinition.searchNameDefinition(<any>{ assetName: event.query }).subscribe((res) => {
      this.assetNames = res.data;
    })
    this.searchFilterAsset.assetName = event.query;
  }
  bindAssetName(event: any) {
    this.searchFilter.assetNDId = event.id;
    this.searchFilterAsset.assetName = event.name;
  }
  clearAssetName() {
    this.searchFilter.assetNDId = null;
    this.searchFilterAsset.assetName = null;
  }

  selectModel(event: any) {
    this.taxonamyService.GetManufacturerOrModelAutoComplete3(false, event.query).subscribe(res => {
      this.models = res.data;
    });

  }
  bindModel(event: any) {
    this.searchFilter.modelId = event.id;
  }
  clearModel() {
    this.searchFilter.modelId = null;
  }

  paginate(event: any) {
    this.loading = true;
    this.searchFilter.pageNumber = event.page + 1;
    this.searchModelDefinition();
    this.loading = false;
  }

  openDialog() {
    this.showDialog = true;
    this.searchFilter.pageNumber = 1;
    this.searchFilter.pageSize = this.pageSize;
    this.searchModelDefinition();

  }

  close_dialog() {
    this.showDialog = !this.showDialog;
  }

  close_dialogassets() {
    this.showDialogasset = !this.showDialogasset;
  }

  selectRow(event: any) {
    this.modelDefinitionService.GetModelDefinitionAssetId(event).subscribe((data) => {
      this.assetFormService.onSelectName(data.data[0]);
      this.showDialog = false;
    });
  }
  openDialogasset(inputType: string) {
    this.dialogsource = inputType
    this.showDialogasset = true;
    this.searchFilterAsset.pageNumber = 1;
    this.searchFilterAsset.pageSize = this.pageSize;
    this.searchAsset();

  }


  selectRowasset(event: any) {
    let dto = { id: event }
    this.apiAsset.GetAssetsAutoCompleteMultiFilter(dto).subscribe((data) => {
      if (this.dialogsource=='parentassetnumber') {

        // this.oldassetid = data.data[0].id;
        this.assetFormService.parentassetid = data.data[0].id;
        this.assetFormService.parentassetnumber = data.data[0].assetNumber;
        this.showDialogasset = false;

      } else {
        this.assetFormService.oldassetid = data.data[0].id;
        this.assetFormService.oldassetnumber = data.data[0].assetNumber;
        this.showDialogasset = false;

      }


    });
  }

  clearOldAsset(){
    this.assetFormService.oldassetid=null;
    this.assetFormService.oldassetnumber=null;
  }

  clearParentAsset(){
    this.assetFormService.parentassetid=null;
    this.assetFormService.parentassetnumber=null;
  }

}
