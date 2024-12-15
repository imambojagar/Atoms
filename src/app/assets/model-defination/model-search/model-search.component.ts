import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModelDefinitionModel } from '../../../models/model-definition-model';
import { ModelService } from '../../../services/model-definition.service';
import { ApiService } from '../../../services/name-definition.service';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-model-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PrimengModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './model-search.component.html',
  styleUrl: './model-search.component.scss',
})
export class ModelSearchComponent implements OnInit {
  // @Input('filter') filter: any; // = { pageSize: 10, pageNumber: 1, assetSerialNo: '', assetNumber: ''};
  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('drawerFilter') public drawerFilter: any;
  @Output() openSearchModals: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() ModelSearch: EventEmitter<boolean> = new EventEmitter<boolean>();

  modelSearchForm!: FormGroup;
  modelDefinition: ModelDefinitionModel[] = [];
  totalRows: number = 0;
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };
  assetsList: any[] = [];
  modelsList: any[] = [];
  modelsCodesList: any[] = [];
  manufacturerList: any[] = [];
  supplierList: any[] = [];
  assetCodesList: any[] = [];
  oracleNames: any[] = [];
  oracleCodes: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private api: ModelService,
    private assetNDAPI: ApiService
  ) { }

  ngOnInit(): void {
    this.modelSearchForm = this.fb.group({
      assetName: [],
      modelName: [],
      modelCode: [],
      manufacturer: [],
      supplier: [],
      oName: [],
      codeType: [],
      codeValue: [],
    });
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      modelDefCode: null,
      assetNDId: null,
      modelId: null,
      manufacturerId: null,
      supplierId: null,
      assetOracleCodeTypeId: null,
      assetOracleCodeValue: null,
      oracleName: null,
    };
    this.getModels();
    this.getAssetCodes();
  }

  getModels() {
    this.api.getModelDefinitions(this.filter).subscribe((res: any) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.cdr.detectChanges()
      console.log('all data', data);
      this.modelDefinition = data;
    });
  }

  getAssetCodes() {
    this.assetNDAPI.getLookups({ queryParams: 408 }).subscribe((res: any) => {
      this.assetCodesList = res.data;
      this.cdr.detectChanges()
    });
  }

  onCodeInput($event: any) {
    this.filter.assetOracleCodeValue = $event.target.value;
    this.cdr.detectChanges()
  }

  assetNameFilter(name: any) {
    this.api.getAssetName({ assetName: name.query }).subscribe((res: any) => {
      const data = res.data;
      this.assetsList = data;
      this.cdr.detectChanges()
    });
  }

  modelNameFilter(name: any) {
    this.api.getModel({ name: name.query }).subscribe((res: any) => {
      const data = res.data;
      console.log('model name:', data);
      this.modelsList = data;
      this.cdr.detectChanges()
    });
  }

  manufacturerFilter(name: any) {
    this.api.getManfacture({ name: name.query }).subscribe((res: any) => {
      const data = res.data;
      this.manufacturerList = data;
      this.cdr.detectChanges()
    });
  }

  supplierFilter(name: any) {
    this.api.getSupplier({ suppliername: name.query }).subscribe((res: any) => {
      const data = res.data;
      this.supplierList = data;
      this.cdr.detectChanges()
    });
  }
  oracleNameFilter(name: any) {
    this.api.getOracleName({ orcalName: name.query }).subscribe((res: any) => {
      const data = res.data;
      this.oracleNames = data;
      this.cdr.detectChanges()
    });
  }

  oracleCodeFilter(name: any) {
    this.api.getOracleCode({ orcalCode: name.query }).subscribe((res: any) => {
      const data = res.data;
      this.oracleCodes = data;
      this.cdr.detectChanges()
    });
  }

  close_modal() {
    this.modelSearchForm.reset();
    this.openSearchModals.emit();
  }

  search() {
    // this.ModelSearch.emit(this.modelSearchForm.value.assetOracleCodeValue); // this.getAssetsTransferSearch();
    this.ModelSearch.emit(this.filter);
    this.close_modal();
    this.cdr.detectChanges()
  }

  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      modelDefCode: null,
      assetNDId: null,
      modelId: null,
      manufacturerId: null,
      supplierId: null,
      assetOracleCodeTypeId: null,
      assetOracleCodeValue: null,
      oracleName: null,
    };
    this.modelSearchForm.reset();
    // this.ModelSearch.emit(this.modelSearchForm.value.assetOracleCodeValue);
  }
}
