import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, Message, MessageService } from 'primeng/api';
/* import { Asset } from 'src/app/data/models/asset';
import { CustomerModel } from 'src/app/data/models/customer-model';
import { AssetsService } from 'src/app/data/service/assets.service';
import { AuthService } from 'src/app/data/service/auth.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { DemoService } from 'src/app/data/service/demo.service';
import { SharedTable } from 'src/app/shared/component/table/table'; */
import { AssetFormService } from '../asset-form.service';
import { SharedTable } from '../../../shared/components/table/table';
import { AssetsService } from '../../../services/assets.service';
import { DemoService } from '../../../services/demo.service';
import { PrimengModule } from '../../../shared/primeng.module';
import { AssetInfoComponent } from './asset-info/asset-info.component';
import { LocationAndCategoryComponent } from './location-and-category/location-and-category.component';
import { EconomicDataComponent } from './economic-data/economic-data.component';
import { InstallationComponent } from './installation/installation.component';
import { WarrantyInfoComponent } from './warranty-info/warranty-info.component';
import { LibrariesComponent } from './libraries/libraries.component';
import { InstructionComponent } from './fms-instruction/instruction/instruction.component';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { AttachmentsComponent } from '../../../shared/components/attachments/attachments.component';
import { TranslateModule } from '@ngx-translate/core';
/* import { TrPipe } from '../../../shared/pipes/tr.pipe';
import { TranslateModule } from '@ngx-translate/core'; */
/* import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

@Component({
  standalone: true,
  selector: 'app-assets-management',
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    AssetInfoComponent,
    LocationAndCategoryComponent,
    EconomicDataComponent,
    InstallationComponent,
    WarrantyInfoComponent,
    LibrariesComponent,
    InstructionComponent,
    TransactionHistoryComponent,
    TableComponent,
    AttachmentsComponent, TranslateModule
  ],
  templateUrl: './assets-management.component.html',
  styleUrls: ['./assets-management.component.scss'],
  providers: [MessageService, ConfirmationService, AssetFormService],
})
export class AssetsManagementComponent implements OnChanges {

  @Input('mode') mode: string = '';
  @Input('showmodal') showmodal: boolean = false;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;



  items!: MenuItem[];
  uploadedFiles: any[] = [];
  id: any;
  demos: any[] = [];
  showDialog: boolean = false;
  searchForm!: FormGroup;
  filter: any = {};
  tableConfigServiceRequest = new SharedTable();
  tableConfigAssetTransfer = new SharedTable();
  tableConfigVisit = new SharedTable();
  assetGroupId!: number;
  PAGE_TITLE: 'asset-management' = "asset-management";

  constructor(
    private messageService: MessageService,
    public assetFormService: AssetFormService,
    private fb: FormBuilder,
    /*  private activatedRoute: ActivatedRoute, */
    private assetService: AssetsService,
    public demoService: DemoService,
    private cdr: ChangeDetectorRef
  ) {
    console.log("asa edit id", this.edit_asset_id);
    this.showDialog = false;
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.Init();
  }

  ngOnInit() {

  }

  Init() {



    var today = new Date();
    this.searchForm = this.fb.group({
      assetId: [null],
      dateFrom: [new Date(today.getFullYear(), today.getMonth(), 1)],
      dateTo: [new Date(today.getFullYear(), today.getMonth() + 1, 0)]
    });

    console.log("edit id", this.edit_asset_id);

    if (this.edit_asset_id) {
      // this.assetFormService.isAddMode = false;
      // this.assetFormService.isEditMode = true;
      this.assetFormService.id = this.edit_asset_id;
      this.assetFormService.checkMode(this.mode)
      this.cdr.detectChanges
      this.assetFormService.intiateForm();
      this.assetFormService.getAssetById();

      console.log(this.assetFormService.Location_Category.value, this.assetFormService.Assets_Buildings);
    } else {
      // this.assetFormService.isEditMode = false;
      // this.assetFormService.isAddMode = true;
      this.assetFormService.id = null;
      this.assetFormService.checkMode(this.mode)
      this.assetFormService.intiateForm();
      if (!this.assetFormService.multiAssets.length) {
        this.addStage()
      }
    }

    this.assetGroupId = JSON.parse(localStorage.getItem('selectedAssetGroup') || '{}').id;

    /*  this.activatedRoute.queryParams.subscribe((params:any) => {
       if(params.id) {
         this.assetFormService.id = params['id'];
         this.assetFormService.checkMode();
         this.assetFormService.intiateForm();
         this.assetFormService.getAssetById();
       } else {
         this.assetFormService.id = '';
         this.assetFormService.checkMode();
         this.assetFormService.intiateForm();
         if (!this.assetFormService.multiAssets.length) {
           this.addStage()
         }
      }
     }); */
    if (!this.assetFormService.multiAssets.length) {
      this.addStage()
    }
    if (this.assetFormService.isAddMode == true) {
      this.items = [
        { label: 'Home', routerLink: ['/'] },
        { label: 'Add New Asset' },
      ];
    }
    else if (this.assetFormService.isEditMode == true) {
      this.items = [
        { label: 'Home', routerLink: ['/'] },
        { label: 'Edit Asset' },
      ];
    }
    else if (this.assetFormService.isViewMode == true) {
      this.items = [
        { label: 'Home', routerLink: ['/'] },
        { label: 'View Asset' },
      ];
    }

    this.tableConfigServiceRequest.tableHeaders = [
      "Id",
      "Service Request No",
      "Created Date",
      "Call Last Situation",
      "Status"
    ];
    this.tableConfigServiceRequest.addRow = false;
    this.tableConfigServiceRequest.deleteRow = false;
    this.tableConfigServiceRequest.editRow = false;
    this.tableConfigServiceRequest.viewRow = false;
    this.tableConfigServiceRequest.exportRow = false;
    //this.tableConfigServiceRequest.idHeader = 'Id';
    this.tableConfigServiceRequest.tableName = "Service Requests List"

    this.tableConfigAssetTransfer.tableHeaders = [
      "Id",
      "Asset Transfer No",
      "Created Date",
      "Sender Site",
      "Sender Status",
      "Receiver Site",
      "Receiver Status"
    ];
    this.tableConfigAssetTransfer.addRow = false;
    this.tableConfigAssetTransfer.deleteRow = false;
    this.tableConfigAssetTransfer.editRow = false;
    this.tableConfigAssetTransfer.viewRow = false;
    this.tableConfigAssetTransfer.exportRow = false;
    //this.tableConfigServiceRequest.idHeader = 'Id';
    this.tableConfigAssetTransfer.tableName = "Asset Transfer List"

    this.tableConfigVisit.tableHeaders = [
      "Id",
      "Visit No",
      "Created Date",
      "Visit Status"
    ];
    this.tableConfigVisit.addRow = false;
    this.tableConfigVisit.deleteRow = false;
    this.tableConfigVisit.editRow = false;
    this.tableConfigVisit.viewRow = false;
    this.tableConfigVisit.exportRow = false;
    //this.tableConfigServiceRequest.idHeader = 'Id';
    this.tableConfigVisit.tableName = "Visits List"

  }
  addStage() {
    const stageForm: any = this.fb.group({
      assetSerialNo: [null],
      systemID: [null],
      assetNumber: [{ value: null, disabled: true }]
    });
    this.assetFormService.multiAssets.push(stageForm);
    this.fixAssetNumber();
  }

  deleteStage(index: number) {
    if (index >= 1) {
      this.assetFormService.multiAssets.removeAt(index);
      this.fixAssetNumber();
    }
  }

  getStageValue(id: any, index: any) {
    let type = {
      type: null,
      lookup: ''
    }

    return type;

  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(event.files)
    }

    this.messageService.add({ severity: 'success', summary: 'File Upload', detail: 'File Uploaded Successfully ! ' });
  }
  ngOnDestroy() {
    this.assetFormService.id = ''
  }
  selectAssetType(e: any) {
    this.fixAssetNumber();
  }

  fixAssetNumber() {
    if (this.assetFormService.assetForm.value.assetType != null && this.assetFormService.assetForm.value.assetType.id != null) {
      this.assetService.generateAssetNumber(this.assetFormService.assetForm.value).subscribe(
        res => {
          console.log(res.data);
          this.assetFormService.assetForm.controls['multiAssets'].setValue(res.data)
        }
      )
    }

  }

  getDemosData(searchText: any = '') {
    let dto = {
      id: searchText
    }
    this.demoService.getDemoAutoComplete(dto).subscribe((res) => {
      this.demos = res.data;
    });
  }

  selectDemo(event: any) {
    this.getDemosData(event.query);
  }
  clearDemo() {
    this.assetFormService.assetForm.controls['demo'].setValue(null);
  }
  // bindDemo(event: any) {
  //   this.searchFilter.assetSerialNo = event.assetSerialNo
  // }

  openDialog() {
    this.searchHistory();
    this.showDialog = true;

  }

  searchHistory() {
    this.filter.pageNumber = 1;
    this.filter.pageSize = 10;
    this.searchServiceRequest();
    this.searchAssetTransfer();
    this.searchVisits();
  }
  searchServiceRequest() {
    this.filter.assetId = this.assetFormService.id;
    this.filter.dateFrom = this.searchForm.value.dateFrom;
    this.filter.dateTo = this.searchForm.value.dateTo;
    this.assetService.GetAssetHistoryServiceRequest(this.filter).subscribe(data => {
      this.tableConfigServiceRequest.pageFilter.totalItems = data['totalRows'];
      let tableData: any = [];
      data['data']?.forEach((e: any) => {
        tableData.push({
          "Id": e.id,
          "Service Request No": e.callNo,
          "Created Date": e.createdDate,
          "Call Last Situation": e.callLastSituationName,
          "Status": e.statusName
        })

      })
      this.tableConfigServiceRequest.tableData = tableData;
      this.tableConfigServiceRequest.pageFilter.totalRows = data.totalRows
    })
  }

  searchAssetTransfer() {
    this.filter.assetId = this.assetFormService.id;
    this.filter.dateFrom = this.searchForm.value.dateFrom.value;
    this.filter.dateTo = this.searchForm.value.dateTo.value;
    this.assetService.GetAssetHistoryAssetTransfer(this.filter).subscribe(data => {
      this.tableConfigAssetTransfer.pageFilter.totalItems = data['totalRows'];
      let tableData: any = [];
      data['data']?.forEach((e: any) => {
        tableData.push({
          "Id": e.id,
          "Asset Transfer No": e.transferCode,
          "Created Date": e.createdDate,
          "Sender Site": e.senderSite,
          "Sender Status": e.senderStatus,
          "Receiver Site": e.receiverSite,
          "Receiver Status": e.receiverStatus
        })

      })
      this.tableConfigAssetTransfer.tableData = tableData;
      this.tableConfigAssetTransfer.pageFilter.totalRows = data.totalRows
    })
  }

  searchVisits() {
    this.filter.assetId = this.assetFormService.id;
    this.filter.dateFrom = this.searchForm.value.dateFrom.value;
    this.filter.dateTo = this.searchForm.value.dateTo.value;
    this.assetService.GetAssetHistoryVisits(this.filter).subscribe(data => {
      this.tableConfigVisit.pageFilter.totalItems = data['totalRows'];
      let tableData: any = [];
      data['data']?.forEach((e: any) => {
        tableData.push({
          "Id": e.id,
          "Visit No": e.visitNo,
          "Created Date": e.createdDate,
          "Visit Status": e.visitStatus
        })
      })
      this.tableConfigVisit.tableData = tableData;
      this.tableConfigVisit.pageFilter.totalRows = data.totalRows
    })
  }

  paginateServiceRequest(e: any) {

    this.filter.pageNumber = e;
    this.filter.pageSize = 10;
    this.tableConfigServiceRequest.pageFilter.pageNumber = e
    this.searchServiceRequest()
  }


  paginateAssetTransfer(e: any) {

    this.filter.pageNumber = e;
    this.filter.pageSize = 10;
    this.tableConfigAssetTransfer.pageFilter.pageNumber = e
    this.searchAssetTransfer()
  }

  paginateVisit(e: any) {

    this.filter.pageNumber = e;
    this.filter.pageSize = 10;
    this.tableConfigVisit.pageFilter.pageNumber = e;
    this.searchVisits();
  }

  saveAsets() {
    let assetsaved: any = this.assetFormService.Save();
    this.messageService.messageObserver.subscribe((res: any) => {
      console.log("message", res.severity);
      if (res.severity.toLowerCase() == "success") {
        this.cancel();
      }
    }); // severity

  }

  cancel() {
    this.assetFormService.isAddMode = false;
    this.assetFormService.isEditMode = false;
    this.assetFormService.isViewMode = false;
    this.close_modal();
  }

  close_externaldialog() {
    this.showDialog = !this.showDialog;
  }

  close_modal() {
    if (!this.edit_asset_id) {
      this.Init();
    }
    this.openModals.emit(false);
    this
  }
  getFormKeys(formGroup: FormGroup): string[] {
    return Object.keys(formGroup.getRawValue());
  }
}
