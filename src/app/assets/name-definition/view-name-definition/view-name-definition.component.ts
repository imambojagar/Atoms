import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterService, LazyLoadEvent, MenuItem, PrimeNGConfig, SelectItem } from 'primeng/api';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
  Message,
} from 'primeng/api';
import { Router } from '@angular/router';
import { NameDefinitionModel } from '../../../models/name-definition-model';
import { SupplierPersons } from '../../../models/supplierPersons';
import { ApiService } from '../../../services/name-definition.service';
import { ExportService } from '../../../shared/services/export.service';
import { PrimengModule } from '../../../shared/primeng.module';
import { AddNameDefinitionComponent } from '../add-name-definition/add-name-definition.component';
import { SearchNameDefinitionComponent } from '../search-name-definition/search-name-definition.component';
import { TranslatePipe } from '@ngx-translate/core';
import { EditDeleteNameDefinitionComponent } from '../edit-delete-name-definition/edit-delete-name-definition.component';
import { ViewDetailsNameDefinitionComponent } from '../view-details-name-definition/view-details-name-definition';

@Component({
  standalone: true,
  selector: 'view-name-definition',
  templateUrl: './view-name-definition.component.html',
  styleUrls: ['./view-name-definition.component.css'],
  imports: [
    PrimengModule,
    AddNameDefinitionComponent,
    SearchNameDefinitionComponent,
    EditDeleteNameDefinitionComponent,
    ViewDetailsNameDefinitionComponent
  ],
  providers: [MessageService, ConfirmationService, FilterService, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewNameDefinitionComponent implements OnInit {
  userDialog!: boolean;
  linkDialog: boolean = false;
  msgs!: Message[];

  addNameForm!: FormGroup;
  searchForm!: FormGroup;
  nameDefinitionModel: NameDefinitionModel = new NameDefinitionModel();
  supplierPersonsModel!: SupplierPersons[];
  names: NameDefinitionModel[] = [];
  assetnamesList: [] = [];
  altAssetnamesList: [] = [];
  umdnsList: [] = [];
  ntCodeList: [] = [];
  orcalNameList: [] = [];
  orcalCodeList: [] = [];
  selectedNames!: any[] | null;
  PageSize!: number;
  PageNumber!: number;
  totalRows!: number;
  key!: any;
  disabled: boolean = true;
  loading!: boolean;
  first: number = 0;

  //filter

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  //Dropdown Lists
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
  codeList: [] = [];

  submitted!: boolean;
  //breadcrumb
  items!: MenuItem[];

  //checkboxes
  alChecked: boolean = true;
  uChecked: boolean = true;
  riskChecked: boolean = true;
  copChecked: boolean = true;
  classChecked: boolean = true;
  catChecked: boolean = true;
  modChecked: boolean = true;
  subChecked: boolean = true;
  funChecked: boolean = true;
  typeChecked: boolean = true;
  lifeChecked: boolean = true;
  oracleChecked: boolean = true;
  ntChecked: boolean = true;

  codes: any[] = [];
  codeName: any[] = [];
  searchValue: string = '';
  public loginFlag: boolean = false;
  addTransferLoaded: boolean = false;
  editTransferLoaded: boolean = false;
  filterLoaded: boolean = false;
  asset_id: any = 0;
  edit_index_tab: any = 0;
  lastTableLazyLoadEvent!: LazyLoadEvent;
  balanceFrozen: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private api: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exporteService: ExportService,
    private cdr: ChangeDetectorRef,
    private router: Router // private header: HeaderComponent, // public signalRService: SignalRService,
  ) { }

  async openModal() {
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  async openFilterModal() {
    this.filterLoaded = !this.filterLoaded;
  }

  async openEditModal() {
    this.editTransferLoaded = !this.editTransferLoaded;
  }



  loadUserData(event: any): void {
    this.lastTableLazyLoadEvent = event;
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.names = this.names.filter((row: any) =>
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

  ngOnInit(): void {
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

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Asset Nomenclature' },
    ];

    this.Reset();
    this.getCodes();
    this.getAssetRisk();
    this.getBusinessCritical();
    this.getCategories();
    this.getClassification();
    this.getModility();
    this.getSubModility();

    //fill compelxity options
    Array(10)
      .fill(0)
      .map((x, i) => {
        this.complexOptions.push({ label: `${i + 1}`, value: i + 1 });
      });
  }

  getCodes() {
    this.api.getLookups({ queryParams: 408 }).subscribe((res: any) => {
      this.codes = res.data;
      console.log('codes', this.codes);
    });
  }

  assetNameFilter(event: any) {
    this.filter.pageNumber = 1;
    console.log('event', event);
    this.api
      .searchNameDefinition({ assetName: event.query })
      .subscribe((res: any) => {
        const data = res.data;
        console.log('asset name list', data);
        this.assetnamesList = data;
      });
  }

  oracleCodeFilter(event: any) {
    this.filter.pageNumber = 1;
    this.api
      .searchNameDefinition({ oraclecode: event.query })
      .subscribe((res: any) => {
        const data = res.data;
        console.log('code list', data);
        this.orcalCodeList = data;
      });
  }

  ntCodeFilter(event: any) {
    this.filter.pageNumber = 1;
    this.api
      .searchNameDefinition({ assetNDCode: event.query })
      .subscribe((res: any) => {
        const data = res.data;
        this.ntCodeList = data;
      });
  }

  orcalNameFilter(name: any) {
    this.filter.orcalName = name;
    this.api.searchNameDefinition(this.filter).subscribe((res: any) => {
      const data = res.data;
      this.orcalNameList = data;
    });
  }

  onOrcalNameSelect(name: any) {
    this.filter.orcalName = name.orcalName;
    this.api.searchNameDefinition(this.filter).subscribe((res: any) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.names = data;
      this.cdr.detectChanges();
    });
  }

  getAssetRisk() {
    this.api.getLookups({ queryParams: 21 }).subscribe((res: any) => {
      this.riskOptions = res.data;
    });
  }

  getBusinessCritical() {
    this.api.getLookups({ queryParams: 22 }).subscribe((res: any) => {
      this.businessOptions = res.data;
    });
  }

  getCategories() {
    this.api.getLookups({ queryParams: 23 }).subscribe((res: any) => {
      this.categoriesOptions = res.data;
    });
  }
  getModility() {
    this.api.getLookups({ queryParams: 26 }).subscribe((res: any) => {
      this.modilityOptions = res.data;
    });
  }
  getSubModility() {
    this.api.getLookups({ queryParams: 27 }).subscribe((res: any) => {
      this.subModilityOptions = res.data;
    });
  }
  getClassification() {
    this.api.getLookups({ queryParams: 24 }).subscribe((res: any) => {
      this.classOptions = res.data;
    });
  }

  /* navToDetails(row: any, index: number) {
    this.nameDefinitionModel.id = row.id;
    this.router.navigate(
      ['/systemsettings/name-definition/edit-control'],
      { queryParams: { data: row.id, index } }
    );
  } */

  navToDetails(row: any, index: number) {
    this.nameDefinitionModel.id = row.id;
    this.asset_id = row.id;
    this.edit_index_tab = index;
    this.editTransferLoaded = !this.editTransferLoaded;
    /* this.router.navigate(['/maintenance/asset-transfer/edit-control'], { queryParams: { data: row.id, index } }); */
  }

  getNameDefinitionSearch(event: any) {
    this.filter = event;
    this.search();
  }

  getAllNameDefinition() {

    this.api.searchNameDefinition(this.filter).subscribe((res: any) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.names = data;
        this.totalRows = res.totalRows;
        this.cdr.detectChanges();
        this.loadUserData(this.lastTableLazyLoadEvent);
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

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.getAllNameDefinition();
    this.loading = false;
  }

  deleteNameDefinition(row: any) {
    this.nameDefinitionModel.id = row.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + row.assetname + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteNameDefinition(row.id).subscribe((res: any) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.getAllNameDefinition();
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
    this.api.searchNameDefinition(this.filter).subscribe((res: any) => {
      const data = res.data;
      console.log('data', data);
      this.totalRows = res.totalRows;
      this.names = data;
      this.cdr.detectChanges();
      this.loadUserData(this.lastTableLazyLoadEvent);
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
    this.getAllNameDefinition();
  }
  export() {
    console.log('this.filter', this.filter);
    this.exporteService
      .export(this.filter, 'AssetNameDefinition/ExportAssetND')
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
        link.download = 'AssetND-Report';
        link.click();
      });
  }
}
