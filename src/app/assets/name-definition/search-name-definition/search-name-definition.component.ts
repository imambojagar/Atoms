import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../../shared/primeng.module';
import { ApiService } from '../../../services/name-definition.service';
import { SelectItem } from 'primeng/api';
import { NameDefinitionModel } from '../../../models/name-definition-model';

@Component({
  selector: 'app-search-name-definition',
  standalone: true,
  imports: [PrimengModule, CommonModule, ReactiveFormsModule],
  templateUrl: './search-name-definition.component.html',
  styleUrl: './search-name-definition.component.scss'
})
export class SearchNameDefinitionComponent implements OnInit {

  searchForm!: FormGroup<any>;
  AssetGroups: any[] = [];
  @Input('filter') filter: any; // = { pageSize: 10, pageNumber: 1, assetSerialNo: '', assetNumber: ''};
  @Input('showmodal') showmodal : boolean = false ;
  @ViewChild('drawerFilter') public drawerFilter: any;
  @Output() openSearchModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() AssetsTransferSearch: EventEmitter<boolean> = new EventEmitter<boolean>();

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

  constructor(private formbuilder: FormBuilder, private api: ApiService) {

  }

  ngOnInit() {
    this.searchForm = this.formbuilder.group({
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
      orcalName: null
    });

    this.Reset();
    this.getCodes();
    this.getAssetRisk();
    this.getBusinessCritical();
    this.getCategories();
    this.getClassification();
    this.getModility();
    this.getSubModility();
  }

  assetNameFilter(event: any) {
    this.filter.pageNumber = 1;
    console.log('event', event);
    this.api
      .searchNameDefinition({ assetName: event.query })
      .subscribe((res) => {
        const data = res.data;
        console.log('asset name list', data);
        this.assetnamesList = data;
      });
  }

  onNameFilterSelect(event: any) {
    /* this.filter.assetId = event.value.id;  */
    this.filter.assetName = event.value.assetname;
    /* (onSelect)="filter.assetName=$event.assetname" */
  }

  close_modal() {
    this.openSearchModals.emit();
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

  search() {
    /* this.api.searchNameDefinition(this.filter).subscribe((res) => {
      const data = res.data;
      console.log('data', data);
      this.totalRows = res.totalRows;
      this.names = data; this.searchForm.value.assetGroup
    }); */

      this.AssetsTransferSearch.emit(this.filter);    // this.getAssetsTransferSearch();
      this.searchForm.reset();
      this.Reset();
      this.close_modal(); 
  }

  getCodes() {
    this.api.getLookups({ queryParams: 408 }).subscribe((res) => {
      this.codes = res.data;
      console.log('codes', this.codes);
    });
  }

  Reset() {
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
    /* this.getAllNameDefinition(); */
  }

  getAssetRisk() {
    this.api.getLookups({ queryParams: 21 }).subscribe((res) => {
      this.riskOptions = res.data;
    });
  }

  getBusinessCritical() {
    this.api.getLookups({ queryParams: 22 }).subscribe((res) => {
      this.businessOptions = res.data;
    });
  }

  getCategories() {
    this.api.getLookups({ queryParams: 23 }).subscribe((res) => {
      this.categoriesOptions = res.data;
    });
  }
  getModility() {
    this.api.getLookups({ queryParams: 26 }).subscribe((res) => {
      this.modilityOptions = res.data;
    });
  }
  getSubModility() {
    this.api.getLookups({ queryParams: 27 }).subscribe((res) => {
      this.subModilityOptions = res.data;
    });
  }
  getClassification() {
    this.api.getLookups({ queryParams: 24 }).subscribe((res) => {
      this.classOptions = res.data;
    });
  }

}
