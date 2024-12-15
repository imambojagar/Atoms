import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, ConfirmEventType, LazyLoadEvent } from 'primeng/api';
import { Lookup } from '../../shared/enums/lookup';
import { Asset } from '../../models/asset';
import { SharedTable } from '../../shared/components/table/table';
import { ModelDefinitionModel } from '../../models/model-definition-model';
import { AssetsService } from '../../services/assets.service';
import { CustomerService } from '../../services/customer.service';
import { ModelService } from '../../services/model-definition.service';
import { LookupService } from '../../services/lookup.service';
import { TaxonomyService } from '../../services/taxonomy.service';
import { ExportService } from '../../shared/services/export.service';
import { AssetGroupService } from '../../services/asset-group.service';
import { ApiService } from '../../services/name-definition.service';
import { PrimengModule } from '../../shared/primeng.module';
import { TableComponent } from '../../shared/components/table/table.component';
import { SearchAssetsComponent } from './search-asset/search-asset.component';
import { AssetsManagementComponent } from './assets-management/assets-management.component';
import { TrPipe } from '../../shared/pipes/tr.pipe';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { Asset } from 'src/app/data/models/asset';
import { ModelDefinitionModel } from 'src/app/data/models/model-definition-model';
import { AssetGroupService } from 'src/app/data/service/asset-group.service';
import { AssetsService } from 'src/app/data/service/assets.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { LookupService } from 'src/app/data/service/lookup.service';
import { ModelService } from 'src/app/data/service/model-definition.service';
import { ApiService } from 'src/app/data/service/name-definition.service';
import { TaxonomyService } from 'src/app/data/service/taxonomy.service';
import { SharedTable } from 'src/app/shared/component/table/table';
import { ExportService } from 'src/app/shared/service/export.service'; */

@Component({
  standalone: true,
  selector: 'app-assets',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    PrimengModule,
    TableComponent,
    SearchAssetsComponent,
    AssetsManagementComponent,
    TranslateModule
  ],
  templateUrl: './assets.component.html',
  providers: [
    DatePipe,
    TranslatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./assets.component.scss'],
})
//  this.router.navigate(['maintenance/customer/edit-delete-customer'], {
//   queryParams: { data: row.id, index },
// });
export class AssetsComponent implements OnInit {

  searchFilter = new Asset();
  searchForm!: FormGroup
  items = [
    { label: 'Home', routerLink: ['/'] },
    { label: 'Search Asset', routerLink: ['/systemsettings/assets'] },
  ];
  tableConfig = new SharedTable();
  pageSize: number = 10;
  pageIndex: number = 1;
  oldAssetNums: any;
  Asset_SNs: any;
  selectedNames!: any[] | null;
  assets: any[] = [];
  assetsList: any[] = [];
  asset_id: number = 0;
  searchValue: string = '';
  addTransferLoaded: boolean = false;
  filterLoaded: boolean = false;
  loading: boolean = false;
  totalRows: number = 0;
  assets_index: number = 0;

  ModelDefinitions: ModelDefinitionModel[] = [];
  Sites: any[] = [];
  Operator_Dates: any;
  modelsList: any[] = [];
  manufacturers: any[] = [];
  Contractors: any;
  AssetGroups: any[] = [];
  assetCodesList: any[] = [];
  lastTableLazyLoadEvent!: LazyLoadEvent;
  mode: string = ''
  constructor(private assetService: AssetsService, private fb: FormBuilder,
    // public assetFormService: AssetFormService,
    private customerService: CustomerService,
    private modelService: ModelService,
    private lookupService: LookupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private taxonamyService: TaxonomyService,
    private cdr: ChangeDetectorRef,
    private exporteService: ExportService,
    private assetGroupService: AssetGroupService,
    private assetNDAPI: ApiService,
    private api: ModelService) {

  }

  async openModal() {
    this.asset_id = 0;
    this.addTransferLoaded = !this.addTransferLoaded;
    this.mode = ''
  }

  async openFilterModal() {
    this.filterLoaded = !this.filterLoaded;
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  loadUserData(event: any): void {
    this.lastTableLazyLoadEvent = event;
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.assets = this.assets.filter((row: any) =>
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
    this.searchAsset();
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    // this.assetFormService.getLookup(); "Id",

    this.tableConfig.tableHeaders = [
      "Asset Number",
      "Census Status",
      "S.N",
      "Asset Name",
      "Model",
      "Manufacturer",
      "Department Code",
      "Department",
      "Site code",
      "Site",
      "End User Acceptance Date",
      "Warranty End Date",
      "Room",
      "Technical Inspection Date",
      "IP Address",
      "Mac Address",
      "PO No.",
      "Replacement Date",
      "Origin Department",
      "Last PO Price",
      "Comment",
      "Port Number",
      "Budget Year",
      "Action"
    ];
    this.tableConfig.deleteRow = false;
    this.tableConfig.editRow = true;
    this.tableConfig.viewRow = true;
    this.tableConfig.openChart = true;
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.tableName = "Assets List"
    // this.clickableLinks.push({header:"Id",path:"systemsettings/assets/asset-management"})
    this.searchAsset();
    this.getlookup();
    this.getAssetCodes();
  }

  getNameAssetSearch(event: any) {
    this.searchFilter = event;
    this.searchAsset();
  }

  searchAsset() {
    // Object.bind(this.searchFilter, this.searchForm.value)

    // this.searchFilter.model = this.searchForm.value.model;
    /* debugger */
    this.loading = true;
    this.assetService.searchAsset(this.searchFilter).subscribe((data: any) => {
      //this.tableConfig.pageFilter.totalItems = data['totalRows'];
      this.totalRows = data['totalRows'];
      this.loading = false;
      this.assets = data['data'];
      this.cdr.detectChanges();
      this.loadUserData(this.lastTableLazyLoadEvent);
      // let tableData: any = [];
      /*  data['data']?.forEach((e: any) => {
         tableData.push({
           "Id": e.id,
           "Asset Number": e.assetNumber,
           "Census Status": e.utilizationStatus,
           "S.N": e.assetSerialNo,
           "Asset Name": e.modelDefinition.assetName,
           "Model": e.modelDefinition.modelName,
           "Manufacturer": e.modelDefinition.manufacturerName,
           "Department Code": e.department?.departmentCode,
           "Department": e.department?.departmentName,
           "Site code": e.site.customerCode,
           "Site": e.site.custName,
           "End User Acceptance Date": e.endUserAcceptanceDate == null? '' : this.datePipe.transform(e.endUserAcceptanceDate, 'yyyy-MM-dd'),
           "Warranty End Date": e.warrantyEndDate == null ? '' : this.datePipe.transform(e.warrantyEndDate, 'yyyy-MM-dd'),
           "Room": e.room?.name,
           "Technical Inspection Date": e.technicalInspectionDate==null ? '' : this.datePipe.transform(e.technicalInspectionDate, 'yyyy-MM-dd'),
           "IP Address": e.ipAddress,
           "Mac Address": e.macAddress,
           "PO No.": e.poNo,
           "Replacement Date": e.replacementDate == null ? '' : this.datePipe.transform(e.replacementDate, 'yyyy-MM-dd'),
           "Origin Department": e.originDepartment?.departmentName,
           "Last PO Price": e.lastPOPrice,
           "Comment": e.comment,
           "Port Number": e.portNumber,
           "Budget Year": e.budgetYear
         })

       })
       this.tableConfig.tableData = tableData;

       this.tableConfig.clickableLinks = [{ header: "Id" }, { header: "Asset Number" }]

       this.tableConfig.Tags = [{ header: "Census Status" }]

       //this.tableConfig.clickableIcons = [{ header: "Census" }]

       this.tableConfig.pageFilter.totalRows = data.totalRows */
    })
  }

  assetNameFilter(name: any) {
    debugger
    this.api.getAssetName({ assetName: name.query }).subscribe((res) => {
      const data = res.data;
      this.assetsList = data;
    });
  }

  getlookup() {
    this.lookupService.getLookUps(Lookup.Operator_Date).subscribe((res: any) => {
      this.Operator_Dates = res.data
    })
    this.assetGroupService.searchAssetGroups({}).subscribe((res: any) => {
      this.AssetGroups = res.data
    })

  }

  navToDetails(row: any, index: number) {
    /* this.nameDefinitionModel.id = row.id; */
    if (index == 0)
      this.mode = 'view'

    console.log("edit asset", row.id);
    this.asset_id = row.id;
    this.assets_index = index;
    this.addTransferLoaded = !this.addTransferLoaded;
    /* this.router.navigate(['/maintenance/asset-transfer/edit-control'], { queryParams: { data: row.id, index } }); */
  }

  editAsset(e: any) {
    this.router.navigate(['systemsettings/assets/edit-control'], { queryParams: { id: e } });
  }
  veiwAsset(e: any) {
    this.router.navigate(['systemsettings/assets/view-control'], { queryParams: { id: e } });
  }
  openChartRow(e: any) {
    this.router.navigate(['/systemsettings/asset-utilization/view-control'], { queryParams: { id: e.Id, assetNumber: e['Asset Number'] } });
  }

  deleteAsset(asset: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + asset?.assetNumber + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.assetService.deleteAsset(asset.Id).subscribe((res: any) => {
          this.searchAsset()
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
  paginate(event: any) {

    /*  this.searchFilter.pageNumber = e;
     this.tableConfig.pageFilter.pageNumber = e
     this.searchAsset() */


    this.loading = true;
    this.searchFilter.pageNumber = event.page + 1;
    this.searchAsset();
    this.loading = false;
  }
  selectAssetSN(event: any) {
    this.getAssetsData(event.query);
    this.searchFilter.assetSerialNumber = event.query
  }
  getAssetsData(searchText: any = '') {
    console.log(searchText);
    this.assetService.GetAssetsAutoComplete(searchText).subscribe((res) => {
      this.oldAssetNums = res.data;
      this.Asset_SNs = res.data;
    });
  }
  bind(event: any) {
    this.searchFilter.assetSerialNumber = event.assetSerialNo
  }
  AssetClear() {
    this.searchFilter.assetSerialNumber = ""
  }

  selectAssetNumber(event: any) {
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
    this.searchFilter.assetNo = event.assetNumber
  }

  bindAssetNomenclature(event: any) {
    this.searchFilter.assetName = event.assetname
  }


  AssetNumberClear() {
    this.searchFilter.assetNo = ""
  }

  AssetNomenclatureClear() {
    this.searchFilter.assetName = ""
  }

  bindContractor(event: any) {
    this.searchFilter.site = event.custName
  }
  onSelectContractor(event: any) {
    this.searchonContractor(event.query);
    this.searchFilter.site = event.query
  }
  searchonContractor(code: any) {
    this.customerService.GetCustomersAutoComplete(code).subscribe((data: any) => {
      this.Contractors = data.data;
      this.Sites = data.data;
      // TO DO ::
      // this.Assets_Buildings=data.data.buildings
      // this.Assets_Floor

    });
  }
  clearContractor() {
    this.searchFilter.site = ''
  }
  selectModels(event: any) {
    this.searchonmodels(event.query)
    this.searchFilter.modelDefinition = event.query
  }

  modelNameFilter(name: any) {


    this.taxonamyService.GetManufacturerOrModelAutoComplete3(false, name.query).subscribe((res) => {
      this.modelsList = res.data;

    });

  }


  bindModel(event: any) {
    debugger
    this.searchFilter.model = event.name
  }
  clearModel() {
    this.searchFilter.model = ''
  }
  selectManufacturer(event: any) {
    this.getManufacturers(event.query);
    // this.searchFilter.manufacturer = event.query
  }
  bindManufacturer(event: any) {
    this.searchFilter.manufacturer = event.name
  }
  clearManufacturer() {
    this.searchFilter.manufacturer = ''
  }
  route(e: any) {
    if (e.header == "Id" || e.header == "Asset Number")
      this.router.navigate(['systemsettings/assets/view-control'], { queryParams: { id: e.rowData.Id } });
    else if (e.header == "Census")
      this.router.navigate(['/systemsettings/asset-utilization/view-control'], { queryParams: { id: e.rowData.Id, assetNumber: e.rowData['Asset Number'] } });
  }

  getManufacturers(searchText: any = '') {

    this.taxonamyService.GetManufacturerOrModelAutoComplete3(true, searchText).subscribe((res) => {
      this.manufacturers = res.data;

    });
  }
  searchonmodels(code: any) {
    this.modelService.GetModelDefinitionAsset(code).subscribe((data) => {
      this.ModelDefinitions = data.data;
    });
  }

  reset() {
    this.searchForm.reset();
    this.searchFilter = new Asset();
    this.searchAsset();
  }


  AddNewAssets() {
    this.router.navigate(['/systemsettings/assets/add-control'])
  }

  exportAsset() {
    // Object.bind(this.searchFilter, this.searchForm.value)
    this.searchFilter.warrantyEndDateSymbol = this.searchForm.value.warrantyEndDateSymbol;
    this.searchFilter.warrantyEndDateFrom = this.searchForm.value.warrantyEndDateFrom;
    this.searchFilter.warrantyEndDateTo = this.searchForm.value.warrantyEndDateTo;
    this.searchFilter.delieveryInspectionDateSymbol = this.searchForm.value.delieveryInspectionDateSymbol;
    this.searchFilter.deliveryInspectionDateFrom = this.searchForm.value.deliveryInspectionDateFrom;
    this.searchFilter.deliveryInspectionDateTo = this.searchForm.value.deliveryInspectionDateTo;

    this.exporteService
      .export(this.searchFilter, 'Asset/ExportAssets')
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
        link.download = 'Assets-Report';
        link.click();
      });
  }

  getAssetCodes() {
    this.assetNDAPI.getLookups({ queryParams: 408 }).subscribe((res) => {
      this.assetCodesList = res.data;
    });
  }
  onCodeInput($event: any) {
    this.searchFilter.assetOracleCodeValue = $event.target.value;
  }
}
