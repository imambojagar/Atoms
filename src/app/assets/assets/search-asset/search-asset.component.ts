import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../../shared/primeng.module';
import { ApiService } from '../../../services/name-definition.service';
import { SelectItem } from 'primeng/api';
import { NameDefinitionModel } from '../../../models/name-definition-model';
import { Asset } from '../../../models/asset';
import { CustomerService } from '../../../services/customer.service';
import { LookupService } from '../../../services/lookup.service';
import { AssetsService } from '../../../services/assets.service';
import { Lookup } from '../../../shared/enums/lookup';
import { AssetGroupService } from '../../../services/asset-group.service';
import { TaxonomyService } from '../../../services/taxonomy.service';
import { ModelService } from '../../../services/model-definition.service';
import { DropdownChangeEvent } from 'primeng/dropdown';

@Component({
  selector: 'app-search-assets',
  standalone: true,
  imports: [PrimengModule, CommonModule, ReactiveFormsModule],
  templateUrl: './search-asset.component.html',
  styleUrl: './search-name-definition.component.scss'
})
export class SearchAssetsComponent implements OnInit {

  searchForm!: FormGroup<any>;
  AssetGroups: any[] = [];
  @Input('filter') filter: any; // = { pageSize: 10, pageNumber: 1, assetSerialNo: '', assetNumber: ''};
  @Input('showmodal') showmodal : boolean = false ;
  @ViewChild('drawerFilter') public drawerFilter: any;
  @Output() openSearchModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() AssetsTransferSearch: EventEmitter<any> = new EventEmitter<any>();

  assetnamesList: [] = [];
  businessOptions: [] = [];
  riskOptions: [] = [];
  classOptions: [] = [];
  categoriesOptions: [] = [];
  modilityOptions: [] = [];
  subModilityOptions: [] = [];
  functionOptions: [] = [];
  typeAssetOptions: [] = [];
  lifeSpanOptions: SelectItem[] = [];
  complexOptions: SelectItem[] = [];
  totalRows!: number;
  names: NameDefinitionModel[] = [];
  codes: any[] = [];
  assetsList: any[] = [];
  assetCodesList:any[]=[];
  modelsList: any[] = [];
  Sites: any[] = [];
  manufacturers: any[] = [];
  searchFilter = new Asset();
  Operator_Dates: any;
  oldAssetNums: any;
  Asset_SNs: any;

  constructor(
    private formbuilder: FormBuilder,
    private api: ModelService,
    private customerService: CustomerService,
    private lookupService: LookupService,
    private assetService: AssetsService,
    private assetGroupService:AssetGroupService,
    private assetNDAPI:ApiService,
    private taxonamyService: TaxonomyService) {

  }

  ngOnInit() {
     this.searchForm = this.formbuilder.group({
      code: [null],
      assetSerialNumber: [null],
      supplyDateSymbol: [null],
      supplyDateFrom: [null],
      supplyDateTo: [null],
      warrantyEndDateSymbol: [null],
      warrantyEndDateFrom: [null],
      warrantyEndDateTo: [null],
      delieveryInspectionDateSymbol: [null],
      deliveryInspectionDateFrom: [null],
      deliveryInspectionDateTo: [null],
      maintenanceContract: [null],
      assetClassification: [null],
      assetStatus: [null],
      assetNotScraped: [null],
      assetNo: [null],
      assetName: [null],
      modelName: [null],
      modelDefinition: [null],
      site: [null],
      manufacturer: [null],
      assetGroup:[null],
      codeType: [],
      codeValue: [],
    })

    this.reset();
    this.getAssetCodes();
    this.getlookup();
    /* this.getCodes();
    this.getAssetRisk();
    this.getBusinessCritical();
    this.getCategories();
    this.getClassification();
    this.getModility();
    this.getSubModility(); */
  }

  assetNameFilter(name: any) {
    /* debugger */
    this.api.getAssetName({ assetName: name.query }).subscribe((res: any) => {
      const data = res.data;
      this.assetsList = data;
    });
  }

  close_modal() {
    this.openSearchModals.emit();
    this.reset(); 
  }

  onInput($event: any) {
    this.filter.submodility = $event.target.value;
  }

  onCodeInput($event: any) {
    this.filter.codeValue = $event.target.value;
  }

  onOracleNameInput($event: any) {
    this.filter.orcalName = $event.target.value;
  }

  selectassetOracleCode($event: DropdownChangeEvent) {
    this.searchFilter.assetOracleCodeTypeId=$event.value.id;
  }  

  search() {
    /* this.api.searchNameDefinition(this.filter).subscribe((res) => {
      const data = res.data;
      console.log('data', data);
      this.totalRows = res.totalRows;
      this.names = data;
    }); */
    this.searchFilter.warrantyEndDateSymbol = this.searchForm.value.warrantyEndDateSymbol;
    this.searchFilter.warrantyEndDateFrom = this.searchForm.value.warrantyEndDateFrom;
    this.searchFilter.warrantyEndDateTo = this.searchForm.value.warrantyEndDateTo;
    this.searchFilter.delieveryInspectionDateSymbol = this.searchForm.value.delieveryInspectionDateSymbol;
    this.searchFilter.deliveryInspectionDateFrom = this.searchForm.value.deliveryInspectionDateFrom;
    this.searchFilter.deliveryInspectionDateTo = this.searchForm.value.deliveryInspectionDateTo;
    this.searchFilter.assetGroup = this.searchForm.value.assetGroup;

      this.AssetsTransferSearch.emit(this.searchFilter);    // this.getAssetsTransferSearch();
      this.searchForm.reset();
      this.close_modal(); 
  }

  getCodes() {
    this.api.getLookups({ queryParams: 408 }).subscribe((res) => {
      this.codes = res.data;
      console.log('codes', this.codes);
    });
  }

  reset(){
    this.searchForm.reset();
    this.searchFilter = new Asset();
    /* this.searchAsset(); */
  }

  /* Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      assetName: null,
      altAssetName: null,
      umdns: null,
      riskLevel: null,
      businessCritical: null,
      category: null,
      classification: null,
      complexity: null,
      assetNDCode: null,
      modility: null,
      submodility: null,
      codeTypeId: null,
      codeValue: null,
      essentialEquipement: null,
      orcalName: null,
    };
    this.searchForm.reset();

  } */

    bind(event: any) {
      this.searchFilter.assetSerialNumber = event.value.assetSerialNo
    }
    AssetClear() {
      this.searchFilter.assetSerialNumber = ""
    }

    selectAssetNumber(event: any) {
      console.log("selectAssetNumber", event);
      this.getAssetNumbers(event.query);
      this.searchFilter.assetNo = event.query
    }
    getAssetNumbers(searchText: any = '') {
      var dto = { assetNumber: searchText };
      this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res) => {
        this.oldAssetNums = res.data;
        this.Asset_SNs = res.data
      });
    }

    bindAssetNumber(event: any) {
      this.searchFilter.assetNo = event.value.assetNumber;
    }

    bindAssetNomenclature(event: any) {
      this.searchFilter.assetName = event.value.assetname;
    }


    AssetNumberClear() {
      this.searchFilter.assetNo = "";
    }

    AssetNomenclatureClear() {
      this.searchFilter.assetName = "";
    }

    bindContractor(event: any) {
      this.searchFilter.site = event.value.custName;
    }
    onSelectContractor(event: any) {
      this.searchonContractor(event.query);
      this.searchFilter.site = event.query;
    }
    searchonContractor(code: any) {
      this.customerService.GetCustomersAutoComplete(code).subscribe((data: any) => {
        /* this.Contractors = data.data;*/
        this.Sites = data.data;
      });
    }
    clearContractor() {
      this.searchFilter.site = '';
    }
    selectModels(event: any) {
      /* this.searchonmodels(event.query) */
      this.searchFilter.modelDefinition = event.query;
    }

    getlookup() {
      this.lookupService.getLookUps(Lookup.Operator_Date).subscribe((res: any) => {
        this.Operator_Dates = res.data
      })
      this.assetGroupService.searchAssetGroups({  }).subscribe((res: any) => {
        this.AssetGroups = res.data
      })

    }

    bindModel(event: any) { 
      this.searchFilter.model = event.value.name
    }
    clearModel() {
      this.searchFilter.model = ''
    }
    selectManufacturer(event: any) {
      this.getManufacturers(event.query);
      // this.searchFilter.manufacturer = event.query
    }
    bindManufacturer(event: any) {
      this.searchFilter.manufacturer = event.value.name
    }
    clearManufacturer(){
      this.searchFilter.manufacturer = ''
    }

    getManufacturers(searchText: any = '') {

      this.taxonamyService.GetManufacturerOrModelAutoComplete3(true, searchText).subscribe((res: any) => {
        this.manufacturers = res.data;

      });
    }

    modelNameFilter(name: any) {


      this.taxonamyService.GetManufacturerOrModelAutoComplete3(false, name.query).subscribe((res) => {
        this.modelsList = res.data;

      });

    }

    selectAssetSN(event: any) {
      this.getAssetsData(event.value.query);
      this.searchFilter.assetSerialNumber = event.value.query
    }

    getAssetsData(searchText: any = '') {
      console.log(searchText);
      this.assetService.GetAssetsAutoComplete(searchText).subscribe((res: any) => {
        this.oldAssetNums = res.data;
        this.Asset_SNs = res.data;
      });
    }

    getAssetCodes() {
      this.assetNDAPI.getLookups({ queryParams: 408 }).subscribe((res: any) => {
        this.assetCodesList = res.data;
      });
    }

    /* searchonmodels(code: any) {
      this.modelService.GetModelDefinitionAsset(code).subscribe((data) => {
        this.ModelDefinitions = data.data;
      });
    } */

}
