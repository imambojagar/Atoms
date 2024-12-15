
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
/* import { Servicerequest } from 'src/app/data/models/servicerequest';
import { ServicerequestService } from 'src/app/data/service/servicerequest.service';
import { SharedTable } from 'src/app/shared/component/table/table';
import validateForm from 'src/app/shared/helpers/validateForm';
import { AssetFormService } from '../../../systemsettings/assets/asset-form.service'; */
import { ServiceRequestFormService } from '../service-request-form.service';
import { Servicerequest } from '../../../models/servicerequest';
import { SharedTable } from '../../../shared/components/table/table';
import { AssetFormService } from '../../../assets/assets/asset-form.service';
import { ServicerequestService } from '../../../services/servicerequest.service';
import { ModelService } from '../../../services/model-definition.service';
import { AssetsService } from '../../../services/assets.service';
import { ExportService } from '../../../shared/services/export.service';
import { CallRequestService } from '../../../services/call-request.service';
import { AssetGroup } from '../../../shared/enums/asset-group';
import validateForm from '../../../shared/helpers/validateForm';
import { PrimengModule } from '../../../shared/primeng.module';
import { ServiceRequestManagementComponent } from '../service-request-management/service-request-management.component';
import { TrPipe } from '../../../shared/pipes/tr.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceRequestViewComponent } from '../service-request-view/service-request-view.component';
/* import { CallRequestService } from 'src/app/data/service/call-request.service';
import { ModelService } from 'src/app/data/service/model-definition.service';
import { AssetGroup } from 'src/app/data/Enum/asset-group';
import { AssetsService } from 'src/app/data/service/assets.service';
import { ExportService } from 'src/app/shared/service/export.service';
import { NgxSpinnerService } from 'ngx-spinner'; */
@Component({
  standalone: true,
  selector: 'app-service-request-search',
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceRequestManagementComponent,
    ServiceRequestViewComponent,
    TrPipe,
    TranslateModule,
  ],
  templateUrl: './service-request-search.component.html',
  styleUrls: ['./service-request-search.component.scss'],
  providers: [MessageService, ConfirmationService, ServiceRequestFormService, AssetFormService]
})


export class ServiceRequestSearchComponent implements OnInit {

  searchFilter = new Servicerequest();
  searchForm!: FormGroup

  items = [
    { label: 'Home', routerLink: ['/'] },
    { label: 'search Service Request', routerLink: ['/maintenance/service-request'] },
  ];

  modelsList: any[] = [];

  rowData = [];
  totalRows!: number;
  loading!: boolean;
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };
  showActionHistoryDialog: boolean = false;
  actionHistoryList: any[] = [];
  callReqID: any;
  callReqNum!: string;


  tableConfig = new SharedTable();
  pageSize: number = 10;
  pageIndex: number = 1;
  showDialog: boolean = false;
  callRequestId: any;
  callId: any;
  comments: any[] = [];
  archivedData: boolean = false;

  assginedEmployeeId: any;
  assginedEmployeeName: any;

  commentForm!: FormGroup;
  assetGroupSelectorForm!: FormGroup;
  isNurse = false
  assetNumberList: any[] = [];
  assetSerialList: any[] = [];
  dataTableLoading: boolean = false;

  showmodal: boolean = false;
  showmodal1: boolean = false;
  showmodal2: boolean = false;
  selected_CallId: any = null;
  servicerequest: any[] = [];
  selectedNames!: any[] | null;
  addTransferLoaded: boolean = false;
  viewServiceTransferLoaded: boolean = false;
  service_request_edit_id: number = 0;
  searchValue: any = '';

  constructor(private fb: FormBuilder, public serviceRequestFormService: ServiceRequestFormService, public callRequestService: CallRequestService,
    private messageService: MessageService, private confirmationService: ConfirmationService, private model: ModelService,
    private router: Router, public assetFormService: AssetFormService, private serviceRequestService: ServicerequestService,
    private assetService: AssetsService, private exporteService: ExportService, private cdr: ChangeDetectorRef) { }

    close_modal() {
      this.showmodal = !this.showmodal;
    }

    openFilterModal() {
      this.showmodal = !this.showmodal;
    }

    openModal() {
      this.service_request_edit_id = 0;
      this.addTransferLoaded = !this.addTransferLoaded
    }

    openViewModal() {
      this.viewServiceTransferLoaded = !this.viewServiceTransferLoaded;
    }

    clearValue(event: any) {
      event.target.value = '';
    }

    navToDetails(row: any, index: number) {
      /* this.nameDefinitionModel.id = row.id; */
      this.service_request_edit_id  =  row.id;
      console.log("edit asset", row.id);
      this.addTransferLoaded = !this.addTransferLoaded;
    }

    navToView(row: any, index: number) {
      /* this.nameDefinitionModel.id = row.id; */
      this.service_request_edit_id  =  row.id;
      console.log("edit asset", row.id);
      this.viewServiceTransferLoaded = !this.viewServiceTransferLoaded;
    }

    applyGlobalFilter(event: Event) {
      if (this.searchValue) {
        this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
        this.servicerequest = this.servicerequest.filter((row: any) =>
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
      this.searchServiceRequest()
      this.cdr.detectChanges();
    }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      requestedDateSymbol: [null],
      requestedDateFrom: [null],
      requestedDateTo: [null],
      firstActionSymbol: [null],
      firstActionFrom: [null],
      firstActionTo: [null],
      callId: [null],
      site: [null],
      assetNo: [null],
      assetSerialNo: [null],
      assetSerialNumber: [null],
      maintenanceSituation: [null],
      status: [null],
      assignedEmployee: [null],
      firstActionstatus: [null],
      CallslastSituationWO: [null],
      assetName: [null],
      manufacturer: [null],
      modelName: [null],
      modelDefinition: [null],
      typeOfrequest: [null],
      priority: [null],
      assetGroup: [null],
      archivedData: [null],
      requestedThrough:[null],
      problemDescription:[null],
      longDescription:[''],
      jobstatus:[null],
    });

    this.commentForm = this.fb.group({
      comment: ['']
    });

    this.assetGroupSelectorForm = this.fb.group({
      assetGroup: [null, Validators.required]
    });

    this.ifUserNurse();
    if (this.isNurse) {
      this.tableConfig.tableHeaders = [
        "Call Id",
        "Status",
        "Call's last Situation",
        "Asset Number",
        "S.N",
        "Asset Name",
        "Model",
        "Manufacturer",
        "Site",
        "Assigned Employee",
        "Customer Survey",
        "Action"
      ];
    } else {
      this.tableConfig.tableHeaders = [
        "Call Id",
        "Status",
        "Call's last Situation",
        "Asset Number",
        "S.N",
        "Asset Name",
        "Model",
        "Manufacturer",
        "Site",
        "Assigned Employee",
        "Operation",
        "Customer Survey",
        "Action"
      ];
    }

    this.tableConfig.deleteRow = true;
    this.tableConfig.editRow = true;
    this.tableConfig.viewRow = true;
    this.tableConfig.print = true;
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.tableName = "Service Requests List"

    this.tableConfig.clickableLinks = [{ header: "Call Id" }, { header: "Operation" }, { header: "Customer Survey" }]
    this.searchServiceRequest()
  }




  searchServiceRequest() {

    var AssetNo = this.searchFilter.AssetNo;
    var AssetSerialNumber = this.searchFilter.AssetSerialNumber;
    Object.bind(this.searchFilter, this.searchForm.value);
    this.searchFilter.AssetNo = AssetNo;
    this.searchFilter.AssetSerialNumber = AssetSerialNumber;
    this.searchFilter.RequestedDateSymbol = this.searchForm.value.requestedDateSymbol;
    this.searchFilter.RequestedDateFrom = this.searchForm.value.requestedDateFrom;
    this.searchFilter.MaintenanceSituation = this.searchForm.value.CallslastSituationWO;
    // this.searchFilter.assignedEmployee = this.searchForm.value.assignedEmployee;
    if (this.searchForm.value.assignedEmployee != null) {
      this.searchFilter.assignedEmployee = { id: this.searchForm.value.assignedEmployee?.userId, name: this.searchForm.value.assignedEmployee?.userName }
    }
    else {
      this.searchFilter.assignedEmployee = this.searchForm.value.assignedEmployee;
    }
    this.searchFilter.FirstActionStatus = this.searchForm.value.firstActionstatus;
    this.searchFilter.TypeOfrequest = this.searchForm.value.typeOfrequest;
    this.searchFilter.Priority = this.searchForm.value.priority;
    this.searchFilter.Status = this.searchForm.value.status;
    this.searchFilter.Site = this.searchForm.value.site?.custName;
    this.searchFilter.assetGroup = this.searchForm.value.assetGroup;
    this.searchFilter.archivedData = this.archivedData;
    this.searchFilter.Jobstatus=this.searchForm.value.jobstatus;
    this.searchFilter.ProblemDescription=this.searchForm.value.problemDescription;
    this.searchFilter.longDescription=this.searchForm.value.longDescription;
    this.searchFilter.requestedThrough=this.searchForm.value.requestedThrough;
    this.searchFilter.AssetGroup= this.serviceRequestFormService.userAssetGroupSelected ? this.serviceRequestFormService.userAssetGroupSelected.id : 0;

    // this.searchFilter = { ...this.searchFilter, ...this.searchForm.value };
    //this.spinner.show(); searchnewServiceRequest
    this.dataTableLoading = true;
    /* this.serviceRequestService.searchServiceRequest(this.searchFilter).subscribe( */
    this.serviceRequestService.searchnewServiceRequest(this.searchFilter).subscribe(
      {
        next: (data) => {
          console.log("data", data);
          this.tableConfig.pageFilter.totalItems = data['totalRows'];
          let tableData: any = [];
          data['data']?.forEach((e: any) => {
            //this.spinner.hide();
            this.dataTableLoading = false;
            if (this.isNurse)
              tableData.push({
                "Id": e.id,
                "CallId": e.callNo,
                "Status": e.status?.name,
                "CallslastSituation": e.callLastSituation?.name,
                "AssetNumber": e.asset.assetNumber,
                "sn": e.asset.assetSerialNo,
                "AssetName": e.asset.modelDefinition?.assetName,
                "Model": e.asset.modelDefinition?.modelName,
                "Manufacturer": e.asset.modelDefinition?.manufacturerName,
                "Site": e.asset.site?.custName,
                "AssignedEmployee": e.assignedEmployee?.name,
                "CustomerSurvey": "Customer Survey"
              })
            else
              tableData.push({
                "Id": e.id,
                "CallId": e.callNo,
                "Status": e.status?.name,
                "CallslastSituation": e.callLastSituation?.name,
                "AssetNumber": e.asset.assetNumber,
                "sn": e.asset.assetSerialNo,
                "AssetName": e.asset.modelDefinition?.assetName,
                "Model": e.asset.modelDefinition?.modelName,
                "Manufacturer": e.asset.modelDefinition?.manufacturerName,
                "Site": e.asset.site?.custName,
                "AssignedEmployee": e.assignedEmployee?.name,
                "Operation": e.status?.value == 5 ? "" : e.status?.value == 3 ? "Review" : (e.assignedEmployee == null ? "Assign Employee" : e.firstAction == null ? "First Action" : "Work Order"),
                "CustomerSurvey": "Customer Survey"
              })
          })

          this.servicerequest = tableData;
          this.totalRows =  data.totalRows;
          this.tableConfig.tableData = tableData;
          this.tableConfig.pageFilter.totalRows = data.totalRows;
          this.cdr.detectChanges();
        },
        error: (e) => {
          this.dataTableLoading = false;
          console.log("error");
          console.error(e);
        },
        complete: () => {
          this.dataTableLoading = false;
          console.log("complete");
        }
      }
    )
  }

  EditRecord(id: any) {
    // this.router.navigate(['pages/users-management/user-action'], { queryParams: { id: id } })
  }


  editServiceRequest(e: any) {
    this.router.navigate(['/maintenance/service-request/edit-control'], { queryParams: { id: e } });
  }

  //rahaf
  viewActionHistory(serviceRequestId: any) {
    this.showActionHistoryDialog = true;
    this.SearchCallRequestHistory(serviceRequestId);
  }

  veiwServiceRequest(e: any) {
    this.router.navigate(['/maintenance/service-request/view-control'], { queryParams: { id: e } });
  }

  print(e: any) {
    this.router.navigate(['/maintenance/service-request/report'], { queryParams: { serviceRequestId: e } });
  }

  deleteServiceRequest(service_request: any) {
    this.serviceRequestService.CheckIfCallHasWorkOrder(service_request.Id).subscribe(res => {
      if (res.isSuccess) {
        if (res.data == true) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Can not edit this service request because already has work order',
            life: 3000,
          });

          return;
        }
        else {
          this.confirmationService.confirm({
            message: 'Are you sure you want to delete ?',
            header: 'Confirm',
            rejectButtonStyleClass: 'p-button-danger',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.serviceRequestService.deleteServiceRequest(service_request.Id).subscribe((res: any) => {
                this.searchServiceRequest()
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
      }
    })
  }

  paginate(e: any) {
    this.searchFilter.pageNumber = e;
    this.tableConfig.pageFilter.pageNumber = e
    this.searchServiceRequest();
    debugger
    if(this.callReqID =! true){
      this.SearchCallRequestHistory(this.callReqID);
    }
  }


  SearchCallRequestHistory(callRequestId: any) {
    this.callReqID = callRequestId;
    this.serviceRequestService.GetCallRequestHistory(callRequestId).subscribe(res => {
      if (res.isSuccess) {
        this.totalRows = res.totalRows;
        this.actionHistoryList = res.data;
        this.callReqNum = this.actionHistoryList[0].callRequestNo;
      }
    })

  }


  getAssetNumbers(searchText: any = '') {
    var dto = { assetNumber: searchText };
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res) => {
      this.assetNumberList = res.data
    });
  }

  getAssetSerials(searchText: any = '') {
    var dto = { assetSerialNumber: searchText };
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res) => {
      this.assetSerialList = res.data
    });
  }


  getAssetNumbersAuto(event: any) {
    this.getAssetNumbers(event.query);
  }

  getAssetSerialsAuto(event: any) {
    this.getAssetSerials(event.query);
  }

  bindAssetNumber(event: any) {
    this.searchFilter.AssetNo = event.assetNumber
  }

  bindAssetSearialNumber(event: any) {
    this.searchFilter.AssetSerialNumber = event.assetSerialNo
  }

  bindContractor(event: any) {
    // this.searchFilter.ServiceRequestSerialNumber = event.ServiceRequestSerialNo
  }

  onSelectContractor(event: any) {
    this.assetFormService.onSelectContractor(event.query);
    // this.searchFilter.site = event.query
    // this.searchForm.patchValue({ServiceRequestSerialNumber:event.query})
  }

  selectModels(event: any) {
    this.assetFormService.onSelectName(event.query)

    // this.searchFilter.modelDefinition = event.query
    // this.searchForm.patchValue({ServiceRequestSerialNumber:event.query})
  }


  bindModel(event: any) {
    this.searchFilter.ModelDefinition = event.modelName
  }

  bindAssetName(event: any) {
    this.searchFilter.AssetName = event.assetname
  }


  bindCallId(event: any) {
    this.searchFilter.CallId = event.callNo
  }

  selectCallId(event: any) {
    this.GetCallRequestAutoComplete(event.query);
    this.searchFilter.CallId = event.query
  }

  GetCallRequestAutoComplete(callId: string) {
    this.callRequestService.GetCallRequestAutoComplete(callId).subscribe((res) => {
      this.callId = res.data;
    });
  }

  selectManufacturer(event: any) {
    this.assetFormService.getManufacturers(event.query);
    // this.searchFilter.manufacturer = event.query
    // this.searchForm.patchValue({ServiceRequestSerialNumber:event.query}
  }

  selectAssetName(event: any) {
    this.serviceRequestFormService.getAssetNames(event);
    // this.searchFilter.manufacturer = event.query
    // this.searchForm.patchValue({ServiceRequestSerialNumber:event.query})
  }

  bindManufacturer(event: any) {
    this.searchFilter.Manufacturer = event.name
  }

  clearInput() {
  }

  clearInputNumber() {
    this.searchFilter.AssetNo = "";
  }
  clearInputSerial() {
    this.searchFilter.AssetSerialNumber = "";
  }

  reset() {
    this.searchForm.reset();
    this.searchFilter = new Servicerequest();
    this.searchServiceRequest();
  }
  route(e: any) {
    if (e.header == "Call Id")
      this.router.navigate(['/maintenance/service-request/view-control'], { queryParams: { id: e.rowData.Id } });
    else if (e.header == "Customer Survey") {
      this.callRequestId = e.rowData.Id;
      this.getHistoryComment();
    }
    else if (e.header == "Operation" && e.rowData.Operation == "First Action")
      this.router.navigate(['/maintenance/service-request/edit-control'], { queryParams: { id: e.rowData.Id } });
    else if (e.header == "Operation" && e.rowData.Operation == "Assign Employee")
      this.router.navigate(['/maintenance/service-request/edit-control'], { queryParams: { id: e.rowData.Id } });
    else if (e.header == "Operation" && e.rowData.Operation == "Work Order")
      this.router.navigate(['/maintenance/work-orders/add-control'], { queryParams: { callId: e.rowData.Id } });
    else if (e.header == "Operation" && e.rowData.Operation == "Review")
      this.router.navigate(['/maintenance/service-request/edit-control'], { queryParams: { id: e.rowData.Id } });
  }

  add() {
    this.serviceRequestFormService.checkAssetGroup();
  }

  assetGroupSubmit() {
    if (this.assetGroupSelectorForm.invalid) {
      validateForm.validateAllFormFields(this.assetGroupSelectorForm);
    } else {
      let data = this.assetGroupSelectorForm.value;
      this.serviceRequestFormService.loadLookups(data.assetGroup.id == 1 ? AssetGroup.FM : AssetGroup.FMS)
      this.router.navigate(['/maintenance/service-request/add-control']);
    }
  }

  get assetGroupSelectorFormControls() {
    return this.assetGroupSelectorForm.controls;
  }

  openDialogComments() {
    this.showDialog = true;
  }

  getHistoryComment() {
    this.serviceRequestService.getHistoryComments(this.callRequestId).subscribe(res => {
      this.comments = res.data;
      this.showDialog = true;
    })
  }


  modelNameFilter(name: any) {
    this.model.getModel({ name: name.query }).subscribe((res) => {
      const data = res.data;
      console.log('model name:', data);
      this.modelsList = data;
    });
  }


  saveComment() {
    if (this.commentForm.value.comment == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    }
    else {
      let finalData: any = {};
      finalData.comment = this.commentForm.value.comment;
      finalData.callRequestId = this.callRequestId;
      this.serviceRequestService.AddHistoryComment(finalData).subscribe(res => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
          this.getHistoryComment();
          this.commentForm.reset();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
      })
    }
  }
  ifUserNurse() {
    let userRoles = localStorage.getItem("userRoles") ? JSON.parse(localStorage.getItem("userRoles") || "") : '';
    let result: any[] = [];
    result = userRoles;
    var hospitalRole = result ? result.filter(x => x.value == "R-7" || x.value == "R-33") : [];
    var group!: FormGroup;

    if (hospitalRole.length != 0) {
      this.isNurse = true

    }
  }
  export() {

    this.exporteService
      .export(this.searchFilter, 'CallRequest/exportCallRequest')
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
        link.download = 'CallRequest-Report';
        link.click();
      });
  }

  setCheckbox(event: any) {
    this.archivedData = event.checked;
  }

}
