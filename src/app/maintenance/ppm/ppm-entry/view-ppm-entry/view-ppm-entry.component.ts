import { dateHelper } from 'src/app/shared/helpers/dateHelper';
import { PpmService } from 'src/app/data/service/ppm.service';
import { PPMEntryService } from 'src/app/data/service/ppm-entry.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { PpmEntryModel } from 'src/app/data/models/ppm-entry-model';
import { AssetsService } from 'src/app/data/service/assets.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { ExportService } from 'src/app/shared/service/export.service';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { AssetGroupService } from 'src/app/data/service/asset-group.service';
import { ModelService } from 'src/app/data/service/model-definition.service';
import { Lookup } from 'src/app/data/Enum/lookup';
import { DepartmentService } from 'src/app/data/service/department.service';


@Component({
  selector: 'view-ppm-entry',
  templateUrl: './view-ppm-entry.component.html',
  styleUrls: ['./view-ppm-entry.component.scss']
})
export class ViewPpmEntryComponent {
  ppmEntryModel: PpmEntryModel = new PpmEntryModel();
  searchForm!: FormGroup;
  visites: [] = [];
  engineerId: any;
  items!: MenuItem[];
  period: [] = [];
  assigned: [] = [];
  TypeService: [] = [];
  visitStatus: [] = [];
  deviceStatus: [] = [];
  tasks: [] = [];
  employee: [] = [];
  schduleList: [] = [];
  serialList: [] = [];
  assetNumberList: [] = [];
  siteList: [] = [];
  totalRows: number=0;
  loading!: boolean;
  fromFlag: boolean = false;
  toFlag: boolean = false;
  empRole: any;
  roleValue: any;
  userId: any;
  userFlag: boolean;
  firstDayOfMonth: any;
  lastDayOfMonth: any;
  buildingList:[]=[];
  floorList:[]=[];
  AssetNames: any[] = [];
  roomList: any[] = [];
  departments:[]=[];
  archivedData:boolean=false;
  //filter
  filter: any = {
    pageSize: 10,
    pageNumber: 1
  };
  AssetGroups:any[]=[];
  constructor(
    private exporteService: ExportService, 
    private ppmApi: PpmService, 
    private siteApi: CustomerService, 
    private assetApi: AssetsService, 
    private formbuilder: FormBuilder, 
    private api: PPMEntryService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, 
    private httpClient: HttpClient, 
    private router: Router,
    private employeeService:EmployeeService,
    private assetGroupService:AssetGroupService,
    private modelService: ModelService,
    private deptApi:DepartmentService) { }

  ngOnInit(): void {
    this.getAssetGroups();
    this.empRole = JSON.parse(localStorage.getItem("userRoles") || '{}');
    this.userId = localStorage.getItem('userId');
    console.log("roles", this.empRole);
    this.empRole.forEach((e: any) => {
      this.roleValue = e.value;
      if (this.roleValue == 'R-6') {
        this.filter.assignedEmployeeId = this.userId;
        this.userFlag = true;

      }
      
      else {
        this.filter.assignedEmployeeId = null;
        this.userFlag = false;
      }
    });

    this.searchForm = this.formbuilder.group({
      classification: null,
      visitStatusId: null,
      deviceStatusId: null,
      groupLeaderReviewId: null,
      assignedEmployeeId: null,
      assetId: null,
      ppmId: null,
      siteId: null,
      ppmScheduleId: null,
      expectedDateFrom: null,
      expectedDateTo: null,
      actualDateFrom: null,
      actualDateTo: null,
      planNo: null,
      modelId: null,
      jobSheetNo: null,
      typeOfServiceId: null,
      planNumber: null,
      assetGroup:null,
      assetName: null,
      buildingId:null,
      floorId:null,
      departmentId:null,
      archivedData:null
    })
    var today = new Date();
    this.firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    this.lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.searchForm.controls['expectedDateFrom'].setValue(this.firstDayOfMonth);
    this.searchForm.controls['expectedDateTo'].setValue(this.lastDayOfMonth);
    this.filter.expectedDateFrom = dateHelper.ConvertDateWithSameValue(this.firstDayOfMonth);
    this.filter.expectedDateTo = dateHelper.ConvertDateWithSameValue(this.lastDayOfMonth);
    this.getAllVisites();
    this.getDeviceStatus();
    this.getTaskReview();
    this.getTypeService();
    this.getVisitStatus();
    this.getEmployee();

    this.getAndBindLookup(Lookup.Building, a => this.buildingList = a);
    this.getAndBindLookup(Lookup.Floor, a => this.floorList = a);
    this.getAndBindLookup(Lookup.Rooms, a => this.roomList = a);

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'PPM Entries List' },
    ];
  }

  getAndBindLookup(lookup: Lookup, targetProp: (a:any) => void) {
    this.api.getLookups({queryParams: lookup}).subscribe(res => targetProp(res.data));
  }
  
  navToDetails(row: any, index: number) {
    console.log("row", row)
    this.ppmEntryModel.id = row;
    this.router.navigate(['/maintenance/ppm/ppm-entry/edit-control'], { queryParams: { data: row, index } })
  }

  navToSchdule(row: any, index: number) {
    console.log("row:", row)
    this.router.navigate(['/maintenance/ppm/edit-control'], { queryParams: { data: row, index } })
  }



  getAllVisites() {
    console.log("this.filter in get all", this.filter)
    this.filter.assetGroup = this.searchForm.value.assetGroup;
    this.filter.archivedData = this.archivedData;
    this.api.getVisits(this.filter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.visites = data;
        this.totalRows = res.totalRows;
        debugger
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
    this.loading = true;
    console.log("pagination event", event);
    this.filter.pageNumber = event.page + 1;
    console.log("this.filter.pageNumber", this.filter.pageNumber);
    console.log("this.filter in paginate", this.filter);
    this.getAllVisites();
    this.loading = false;
  }


  deleteVisit(row: any) {
    this.ppmEntryModel.id = row;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this visit ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteVisit(this.ppmEntryModel.id).subscribe(res => {
          console.log("delete res", res)
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.getAllVisites();
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
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });

  }


  print(e: any) {
    debugger
    this.router.navigate(['/maintenance/ppm/ppm-entry/report'], { queryParams: { ppmId: 1 } });
  }


  selectDateFrom(event: any) {
    this.filter.expectedDateFrom = dateHelper.ConvertDateWithSameValue(event);
  }
  selectDateTo(event: any) {
    this.filter.expectedDateTo = dateHelper.ConvertDateWithSameValue(event);
  }
  clearDateFrom(){
    console.log("in clear")
    this.filter.expectedDateFrom = null;
  }
  clearDateTo(){
    this.filter.expectedDateTo= null;
  }
  getTypeService() {
    this.api.getLookups({ queryParams: 34 }).subscribe(res => {
      this.TypeService = res.data;
    })
  }

  getVisitStatus() {
    this.api.getLookups({ queryParams: 402 }).subscribe(res => {
      this.visitStatus = res.data;
    })
  }

  getDeviceStatus() {
    this.api.getLookups({ queryParams: 401 }).subscribe(res => {
      this.deviceStatus = res.data;
    })
  }

  getTaskReview() {
    this.api.getLookups({ queryParams: 404 }).subscribe(res => {
      this.tasks = res.data;
    })
  }
  getEmployee() {
    this.employeeService.GetUserByRoleValueSiteAndAssetGroup('R-6').subscribe((res: any) => {
      this.employee = res;
    });
  }
  onPpmScheduleSelect(schdule: any) {
    console.log("schdule", schdule)
    this.filter.ppmId = schdule.ppmId;
  }

  ppmScheduleFilter($event: any) {
    console.log("$event", $event)
    this.filter.pageNumber = 1;
    this.api.getVisits({ planNumber: $event.query }).subscribe((res) => {
      const data = res.data;
      this.schduleList = data;
      console.log("schduleList", this.schduleList)
    });
  }

  selectAssetSN(event: any) {
    this.assetApi.GetAssetsAutoComplete(event.query).subscribe((res) => {
      this.serialList = res.data;
    });
  }
  onAssetNumberSelect(number: any) {
    this.filter.assetId = number.id.toString();

  }
  assetNumberFilter($event: any) {
    this.filter.pageNumber = 1;
    this.assetApi.searchAsset(<any>{ assetNo: $event.query }).subscribe((res) => {
      const data = res.data;
      this.assetNumberList = data;
    })
  }

  changeVisitStatuse(event: any) {
    this.filter.visitStatusId = event.value;
  }
  changeDevice(event: any) {
    this.filter.deviceStatusId = event.value;
  }

  changeTasks(event: any) {
    this.filter.groupLeaderReviewId = event.value;
  }
  changeEmployee(event: any) {
    this.filter.assignedEmployeeId = event.value;
  }

  changeService(typeId: any) {
    this.filter.typeOfServiceId = typeId.value;
  }

  siteNumberFilter(event: any) {
    this.filter.pageNumber = 1;
    this.siteApi.searchCustomer({ custName: event.query }).subscribe((res) => {
      const data = res.data;
      console.log("asset serial list", data)
      this.siteList = data;
    })
  }

  search() {
   this.getAllVisites();
  }
  Reset() {
   
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      classification: null,
      visitStatusId: null,
      deviceStatusId: null,
      groupLeaderReviewId: null,
      assignedEmployeeId: null,
      assetId: null,
      ppmId: null,
      siteId: null,
      ppmScheduleId: null,
      expectedDateFrom: this.firstDayOfMonth,
      expectedDateTo: this.lastDayOfMonth,
      actualDateFrom: null,
      actualDateTo: null,
      planNo: null,
      modelId: null,
      jobSheetNo: null,
      typeOfServiceId: null,
      planNumber: null,
      assetGroup:null
    };
    if (this.userFlag == true) {
      this.filter.assignedEmployeeId = this.userId;
    }
    else {
      this.filter.assignedEmployeeId = null;
    }
    this.searchForm.reset();
    this.searchForm.controls['expectedDateFrom'].setValue(this.firstDayOfMonth);
    this.searchForm.controls['expectedDateTo'].setValue(this.lastDayOfMonth);
    this.getAllVisites();
  }
  export() {
    console.log('this.filter', this.filter);
    this.filter.assetGroup = this.searchForm.value.assetGroup;
    this.exporteService
      .export(this.filter, 'Visit/ExportToExcel')
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
        link.download = 'PPM-Entries-Report';
        link.click();
      });
  }
  getAssetGroups(){
    this.assetGroupService.searchAssetGroups({  }).subscribe((res: any) => {
      this.AssetGroups = res.data
    })

  }

  getAssetNames($event: any) {
    this.modelService.getAssetName({ assetName: $event.query }).subscribe((res) => {
      const data = res.data;
      this.AssetNames = data;
    });
  }

  bindAssetName(event: any) {
    this.filter.AssetName = event.assetname
  }

  deptFilter(event: any) {
    this.filter.pageNumber=1;
    this.deptApi.searchDepartments({deptName:event.query}).subscribe((res) => {
      this.departments = res.data;
    })
  }

  setCheckbox(event:any){
    this.archivedData=event.checked;
    }
}
