import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Servicerequest } from '../../../models/servicerequest';
import { PrimengModule } from '../../../shared/primeng.module';
import { SharedTable } from '../../../shared/components/table/table';
import { ServiceRequestFormService } from '../service-request-form.service';
import { AssetFormService } from '../../../assets/assets/asset-form.service';
import { ServicerequestService } from '../../../services/servicerequest.service';
import { ModelService } from '../../../services/model-definition.service';
import { ExportService } from '../../../shared/services/export.service';
import { AssetGroupService } from '../../../services/asset-group.service';
import { AssetsService } from '../../../services/assets.service';
import { Role } from '../../../shared/enums/role';
import { TableComponent } from '../../../shared/components/table/table.component';
/* import { Role } from 'src/app/data/Enum/role';
import { Asset } from 'src/app/data/models/asset';
import { Servicerequest } from 'src/app/data/models/servicerequest';
import { AssetsService } from 'src/app/data/service/assets.service';
import { ServicerequestService } from 'src/app/data/service/servicerequest.service';
import { SharedTable } from 'src/app/shared/component/table/table';
import { AssetFormService } from '../../../systemsettings/assets/asset-form.service';
import { ServiceRequestFormService } from '../service-request-form.service';
import { AssetGroupService } from 'src/app/data/service/asset-group.service';
import { ExportService } from 'src/app/shared/service/export.service';
import { ModelService } from 'src/app/data/service/model-definition.service'; */

@Component({
  standalone: true,
  selector: 'app-service-request-bulk-update',
  imports: [PrimengModule, FormsModule, ReactiveFormsModule, TableComponent],
  templateUrl: './service-request-bulk-update.component.html',
  styleUrls: ['./service-request-bulk-update.component.scss'],
  providers: [ServiceRequestFormService, AssetFormService]
})
export class ServiceRequestBulkUpdateComponent {
  searchFilter = new Servicerequest();

  modelsList: any[] = [];
  assetSerialList:any[]=[];
  assetNumberList:any[]=[];

  searchForm!: FormGroup
  sumbitForm!: FormGroup
  items = [
    { label: 'Home', routerLink: ['/'] },
    { label: 'search Service Request', routerLink: ['/maintenance/service-request/service-request-bulk-update'] },
  ];
  tableConfig = new SharedTable();
  assetGroupsList:any[]=[];
  totalRows: number = 0;
  // pageSize: number = 10;
  // pageIndex: number = 1;

  showmodal: boolean=false;
  showmodal1: boolean=false;
  showmodal2: boolean=false;
  selected_CallId: any = null;
  serviBlulkUpdte: any[] = [];
  selectedNames!: any[] | null;
  addTransferLoaded: boolean = false;
  service_request_edit_id: number = 0;

  constructor(private fb: FormBuilder, public serviceRequestFormService: ServiceRequestFormService,
    public assetFormService: AssetFormService, private serviceRequestService: ServicerequestService,
    private messageService: MessageService, private router: Router, private model: ModelService, private assetService:AssetsService,
    private assetGroupService:AssetGroupService, private exporteService:ExportService) {

  }

  close_modal() {
    this.showmodal = !this.showmodal;
  }

  openFilterModal() {
    this.showmodal = !this.showmodal;
  }

  openModal() {
    this.addTransferLoaded = !this.addTransferLoaded
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  navToDetails(row: any, index: number) {
    /* this.nameDefinitionModel.id = row.id; */
    this.service_request_edit_id  =  row.id;
    console.log("edit asset", row.id);
    this.addTransferLoaded = !this.addTransferLoaded;
    /* this.asset_id = row.id;
    this.assets_index = index;
    this.addTransferLoaded = !this.addTransferLoaded; */
    /* this.router.navigate(['/maintenance/asset-transfer/edit-control'], { queryParams: { data: row.id, index } }); */
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
      maintenanceSituation: [null],
      status: [null],
      groupLeader: [null],
      assignedEmployee: [null],
      firstActionstatus: [null],
      assetName: [null],
      manufacturer: [null],
      modelName: [null],
      modelDefinition: [null],
      typeOfrequest: [null],
      priority: [null],
      assetGroup: [null],
      assetSerialNo: [null]
    })
    this.sumbitForm = this.fb.group({
      // groupLeader: [null],
      assignedEmployee: [null, Validators.required],
    })
    this.tableConfig.tableHeaders = [
      "Call Id",
      "Status",
      "Call's last Situation",
      "Asset Number",
      "S.N",
      "Asset Name",
      "Model",
      "Manufacturer",
      "Department",
      "Site",
      "Operation",
      "Assigned Employee",
      "Fault description",
      "Work Performed",
      "Call Comments",
      "End of Work",
      "	Updated date",
      "Created by",
      "Requested Through",
      "Survey Status",
      "Service Type",
      "Debriefed Hours",
      "Reasons",
    ];
    this.tableConfig.deleteRow = false;
    this.tableConfig.editRow = false;
    this.tableConfig.addRow = false;
    this.tableConfig.exportRow=true;
    this.tableConfig.idHeader = 'Id';
    this.tableConfig.tableName = "Service Requests List"

    this.searchServiceRequest()
    this.serviceRequestFormService.getAssignedEmployees(Role.engineersvalue)
    this.searchAssetGroup();
  }


  searchServiceRequest() {

    var AssetNo = this.searchFilter.AssetNo
    var AssetSerialNumber = this.searchFilter.AssetSerialNumber


    Object.bind(this.searchFilter, this.searchForm.value)

    this.searchFilter.AssetNo = AssetNo;
    this.searchFilter.AssetSerialNumber = AssetSerialNumber;
    this.searchFilter.AssetName = this.searchFilter.AssetName;
    this.searchFilter.Manufacturer = this.searchFilter.Manufacturer;
    this.searchFilter.ModelDefinition = this.searchFilter.ModelDefinition;

    this.searchFilter.Status = this.searchForm.value.status;
    this.searchFilter.assetGroup = this.searchForm.value.assetGroup;
    this.searchFilter.RequestedDateSymbol = this.searchForm.value.requestedDateSymbol;                           /////////////////////// not Filter
    this.searchFilter.RequestedDateFrom = this.searchForm.value.requestedDateFrom;
    this.searchFilter.FirstActionStatus = this.searchForm.value.firstActionstatus;
    this.searchFilter.TypeOfrequest = this.searchForm.value.typeOfrequest;
    this.searchFilter.Priority = this.searchForm.value.priority;

    if(this.searchForm.value.assignedEmployee != null){
     this.searchFilter.assignedEmployee = {id:this.searchForm.value.assignedEmployee?.userId, name:this.searchForm.value.assignedEmployee?.userName}
    }
    else {
      this.searchFilter.assignedEmployee = this.searchForm.value.assignedEmployee;
    }


    this.serviceRequestService.searchServiceRequest(this.searchFilter).subscribe(data => {
      this.tableConfig.pageFilter.totalItems = data['totalRows'];
      let tableData: any = [];
      /* data['data']?.forEach((e: any) => {
        tableData.push({
          "Id": e.id,
          "Call Id": e.callNo,
          "Status": e.status?.name,
          "Call's last Situation": e.callLastSituation?.name,
          "Asset Number": e.asset.modelDefinition.assetNumber,
          "S.N": e.asset.assetSerialNo,
          "Asset Name": e.asset.modelDefinition.assetName,
          "Model": e.asset.modelDefinition.modelName,
          "Manufacturer": e.asset.modelDefinition.manufacturerName,
          "Department": e.asset.department?.departmentName,
          "Site": e.asset.site.custName,
          "Operation": "New Work Order",
          "Assigned Employee": e.assignedEmployee?.name,
          "Fault description": e.workOrder?.faultDescription?.name,
          "Call Comments": e.callComments,
          "Work Performed": e.workOrder?.workPerformed?.name,
          "End of Work": e.workOrder?.endofWork?.name,
          "Updated date": e.workOrder?.updateDate,
          "Created by": e.callCreatedBy?.name,
          "Requested Through": e.requestedThrough?.name,
          "Survey Status": "",
          "Comment	": e.comments,
          "Debriefed Hours": e.workOrder?.debriefedHours,
          "Reasons": e.workOrder?.reasons?.name,
        })

      }) */
      this.serviBlulkUpdte = data['data'];
      this.totalRows = data['totalRows'];
      this.tableConfig.tableData = tableData;

      // this.tableConfig.tableData = tableData
      this.tableConfig.pageFilter.totalRows = data.totalRows;
    })
  }


  reset(){
    this.searchFilter.AssetSerialNumber = "";
    this.searchFilter.AssetNo = "";
    this.searchFilter.AssetName = "";
    this.searchFilter.Manufacturer = "";
    this.searchFilter.ModelDefinition = "";

    this.searchForm.reset();
    this.searchServiceRequest();
  }



  getAssetSerialsAuto(event: any) {
    this.getAssetSerials(event.query);
  }


  getAssetSerials(searchText: any = '') {
    var dto = { assetSerialNumber: searchText };
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res) => {
      this.assetSerialList = res.data
    });
  }

  bindAssetSearialNumber(event: any) {
    this.searchFilter.AssetSerialNumber = event.assetSerialNo
  }

  clearInputSerial() {
    this.searchFilter.AssetSerialNumber="";
  }

  getAssetNumbers(searchText: any = '') {
    var dto = { assetNumber: searchText };
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res) => {
      this.assetNumberList = res.data
    });
  }

  getAssetNumbersAuto(event: any) {
    this.getAssetNumbers(event.query);
  }

  bindAssetNumber(event: any) {
    this.searchFilter.AssetNo = event.assetNumber
  }

  clearInputNumber(){
    this.searchFilter.AssetNo = "";
  }

  clearInputAssetName(){
    this.searchFilter.AssetName = "";
  }

  bindAssetName(event: any) {
    this.searchFilter.AssetName = event.assetname
  }



  paginate(e: any) {
    this.searchFilter.pageNumber = e;
    this.tableConfig.pageFilter.pageNumber = e
    this.searchServiceRequest()
  }
  selectServiceRequestSN(event: any) {
    this.assetFormService.getAssetsData(event.query);
    // this.searchFilter.ServiceRequestSerialNumber = event.query

    // this.searchForm.patchValue({ServiceRequestSerialNumber:event.query})

  }
  bind(event: any) {
    // this.searchFilter.ServiceRequestSerialNumber = event.ServiceRequestSerialNo
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
    // this.searchFilter.modelDefinition = event.name
    this.searchFilter.ModelDefinition = event.modelName
  }

  modelNameFilter(name: any) {
    this.model.getModel({ name: name.query }).subscribe((res) => {
      const data = res.data;
      console.log('model name:', data);
      this.modelsList = data;
    });
  }

  selectManufacturer(event: any) {
    this.assetFormService.getManufacturers(event.query);
    // this.searchFilter.manufacturer = event.query

    // this.searchForm.patchValue({ServiceRequestSerialNumber:event.query})

  }

  bindManufacturer(event: any) {
    this.searchFilter.Manufacturer = event.name
  }

  clearInput() {
    // this.searchFilter.ServiceRequestSerialNumber = null;
    // this.searchForm.controls['ServiceRequestSerialNumber'].reset()
    // console.log( this.searchForm.value);
  }
  selectAssetName(event: any) {
    // this.assetFormService.getManufacturers(event.query);
    this.serviceRequestFormService.getAssetNames(event);
    // this.searchFilter.manufacturer = event.query

    // this.searchForm.patchValue({ServiceRequestSerialNumber:event.query})

  }
  SaveCalls() {
    if (this.sumbitForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill at least on field to modify',
        life: 3000,
      });
      return;
    }
    if (this.callRequests().length == 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select at least one Service Request',
        life: 3000,
      });
      return;
    }
    let body =
    {
      "callRequests": this.callRequests(),
      "assginedEmployee": this.sumbitForm.controls['assignedEmployee'].value.userId
    }

    this.serviceRequestService.updateMultiServiceRequests(body).subscribe(
      res => {
        if (res.isSuccess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: "Update Successfully",
            life: 1000,
          });
          setTimeout(() => {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['systemsettings/assets/assets-bulk-update']);
          }, 1000);


        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
            life: 3000,
          });
        }

      }
    )
  }

  callRequests() {
    let callRequests: any[] = []
    this.tableConfig.selectedItems.forEach((p: any) => {


      callRequests.push(p.Id)

    });
    return callRequests
  }

  searchAssetGroup() {
    this.assetGroupService
    .searchAssetGroups({  })
    .subscribe((res) => (this.assetGroupsList = res.data));
  }

  export(){
    this.searchFilter.page="bulkRequest";
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
        link.download = 'Service-Request-bulk-Report';
        link.click();
      });
  }

}
