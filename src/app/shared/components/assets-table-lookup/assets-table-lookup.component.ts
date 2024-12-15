import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
/* import { AssetsService } from 'src/app/data/service/assets.service'; */
/* import { DepartmentService } from 'src/app/data/service/department.service'; */
import { MessageService, ConfirmationService } from 'primeng/api';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
/* import { TaxonomyService } from 'src/app/data/service/taxonomy.service';
import { SupplierService } from 'src/app/data/service/supplier.service'; */
import { CustomerService } from '../../../services/customer.service';
import { AssetGroupService } from '../../../services/asset-group.service';
import { AssetsService } from '../../../services/assets.service';
import { DepartmentService } from '../../../services/department.service';
import { SupplierService } from '../../../services/supplier.service';
import { TaxonomyService } from '../../../services/taxonomy.service';
import { PrimengModule } from '../../primeng.module';
/* import { CustomerService } from 'src/app/data/service/customer.service';
import { AssetGroupService } from 'src/app/data/service/asset-group.service'; */

@Component({
  standalone: true,
  selector: 'app-assets-table-lookup',
  templateUrl: './assets-table-lookup.component.html',
  styleUrls: ['./assets-table-lookup.component.scss'],
  imports: [PrimengModule, ReactiveFormsModule]
})
export class AssetsTableLookupComponent implements OnInit {

  @Output() onSelect: EventEmitter<[]> = new EventEmitter<[]> ();
  @Output() onHideDialog: EventEmitter<any> = new EventEmitter<any> ();
  @Input() showDialog: boolean =false;

  searchFilter: any = {
    pageSize: 10,
    pageNumber: 1
  };
  manufacts: [] = [];
  isChecked:[]=[]
  models: [] = [];
  assetNumbs: [] = [];
  assetNames: [] = [];
  sites: [] = [];
  depsList: [] = [];
  suppList: [] = [];
  searchForm!: FormGroup;

  totalRows!: number;
  assetsData: [] = [];
  serialList: [] = [];
  AssetGroups:any[]=[];

  constructor(

    private formbuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private assetApi: AssetsService,
    private deptApi: DepartmentService,
    private supplierApi: SupplierService,
    private taxonomyService: TaxonomyService,
    private customerService: CustomerService,
   /*  private confirmationService: ConfirmationService, */
    private assetGroupService:AssetGroupService,
    private cdr: ChangeDetectorRef
  ) { }

 

 /*  ngOnChanges(changes: SimpleChanges): void {
     this.Init();
  } */

  closeDialog() {
    this.onHideDialog.emit(false);
  }   

  ngOnInit(): void {
    this.Init();
  }

  /* ngAfterViewInit(): void {
    this.Init();
  } */
  
  Init(): void {

    this.getAssetGroups();
    this.searchForm = this.formbuilder.group({
      assetSerialNumber: null,
      assetNo: null,
      assetName: null,
      manufacturer: null,
      site: null,
      modelDefinition: null,
      model: null,
      department: null,
      supplier: null,
      assetGroup: null
    });

    this.onShowDialog();
  }

  //LookUp
  searchAsset() {
    Object.bind(this.searchFilter, this.searchForm.value)
    // if (this.searchForm.value.site)
    // {
    //   this.searchFilter.site = this.searchForm.value.site.custName
    // }
    if (this.searchForm.value.assetGroup)
    {
      this.searchFilter.assetGroup = this.searchForm.value.assetGroup
    }
    this.assetApi.searchAsset(this.searchFilter).subscribe((res: any) => {
      console.log("rea", res);
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.assetsData = data;
        console.log("this.assetsData", this.assetsData)
        this.totalRows = res.totalRows;
        this.cdr.detectChanges();
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
    this.searchFilter.pageNumber = event.page + 1;
    this.searchAsset();
  }

  serialNumberFilter(event: any) {
    this.searchFilter.pageNumber = 1;
    this.assetApi.GetAssetsAutoComplete(event.query).subscribe((res: any) => {
      this.serialList = res.data;
    });
    this.searchFilter.assetSerialNumber = event.query;
  }

  bindSN(event: any) {
    console.log("bind sn", event)
    this.searchFilter.assetSerialNumber = event.assetSerialNo;
  }

  selectManufact(event: any) {
    this.searchFilter.pageNumber = 1;

    this.taxonomyService.searchManufacturerByName({ name: event.query }).subscribe((res: any) => {
      this.manufacts = res.data;
    });
    this.searchFilter.manufacturer = event.query;
  }


  selectAssetNum(event: any) {
    this.assetApi.GetAssetsAutoCompleteMultiFilter({ assetNumber: event.query }).subscribe((res: any) => {
      this.assetNumbs = res.data;

    });
    this.searchFilter.assetNo = event.query
    console.log("asset number", event)
  }
  bindAssetNumber(event: any) {
    console.log("asset number", event)
    this.searchFilter.assetNo = event.assetNumber;
  }

  selectAssetName(event: any) {
    this.assetApi.searchAsset(<any>{ assetName: event.query }).subscribe((res: any) => {
      this.assetNames = res.data;
    })
    this.searchFilter.assetName = event.query;
  }
  bindAssetName(event: any) {
    console.log('event', event);
    this.searchFilter.assetName = event.modelDefinition.assetName;

  }
  selectAssetSite(event: any) {
    this.customerService.GetCustomersAutoComplete(event.query).subscribe((res: any) => {

      this.sites = res.data;
      console.log("this.sites", this.sites)
    });
    this.searchFilter.site = event.query;
  }
  bindSite(event: any) {
    console.log('event', event.site.custName);
    this.searchFilter.site = event.site.custName;

  }


  searchModel($event: any) {
    console.log("Model $event", $event)
    this.taxonomyService.searchTaxonomy({ name: $event.query }).subscribe((res: any) => {
      this.models = res.data;
    });
    this.searchFilter.model = $event.query;
  }
  bindModel(event: any) {
    console.log('event', event);
    this.searchFilter.model = event.modelName;

  }
  fillDeps(event: any) {
    this.deptApi.searchDepartments({ deptName: event.query }).subscribe((res: any) => {
      this.depsList = res.data;
    });
    this.searchFilter.department = event.query;
  }
  selectDept(event: any) {
    console.log("department", event);
    this.searchFilter.department = event.departmentName;

  }
  fillSuppliers(event: any) {
    this.supplierApi.getSupplier({ suppliername: event.query }).subscribe((res: any) => {
      this.suppList = res.data;
    });
    this.searchFilter.supplier = event.query;
  }
  selectSupplier(event: any) {
    console.log("supplier", event);
    this.searchFilter.supplier = event.suppliername;
  }
  onShowDialog() {
    this.searchAsset();
  }
  onHide(){
    this.showDialog=false;
    this.onHideDialog.emit(this.showDialog)

  }

  bindManufacturer(event: any) {
    console.log("event.taxonomyName", event)
    this.searchFilter.manufacturer = event.taxonomyName;
  }

  search() {
    this.searchAsset();
  }
  Reset() {
    this.searchForm.reset();
    this.searchFilter = {
      pageSize: 10,
      pageNumber: 1,
      assetSerialNumber: null,
      assetNo: null,
      assetName: null,
      manufacturer: null,
      site: null,
      modelDefinition: null,
      model: null,
      department: null,
      supplier: null,
      assetGroup:null

    }
    this.assetApi.searchAsset(this.searchFilter).subscribe((res: any) => {
      console.log("rea", res);
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.assetsData = data;
        console.log("this.assetsData", this.assetsData)
        this.totalRows = res.totalRows;
        this.cdr.detectChanges();
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

  onRowSelect(event: any) {
    console.log("isChecked", this.isChecked);


    /* this.techRetirementForm.controls['assetId'].setValue(event.data.id);
     this.techRetirementForm.controls['assetSerialNo'].patchValue(event.data.assetSerialNo);
     this.techRetirementForm.controls['assetNumber'].setValue(event.data.assetNumber);
     this.techRetirementForm.controls['assetName'].setValue(event.data.modelDefinition.assetName);*/


  }
  addAsset() {
    this.onSelect.emit(this.isChecked);
    this.showDialog = false;
  }

  getAssetGroups(){
    this.assetGroupService.searchAssetGroups({  }).subscribe((res: any) => {
      this.AssetGroups = res.data
      this.cdr.detectChanges();
    });

  }
}
