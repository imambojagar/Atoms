import { PPMEntryService } from 'src/app/data/service/ppm-entry.service';
import { ModelService } from 'src/app/data/service/model-definition.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { AssetsService } from 'src/app/data/service/assets.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterService, MenuItem } from 'primeng/api';
import { ConfirmationService, ConfirmEventType, MessageService, Message } from 'primeng/api';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { PpmModel } from 'src/app/data/models/ppm-model';
import { PpmService } from 'src/app/data/service/ppm.service';
import { AssetFormService } from '../../../systemsettings/assets/asset-form.service';
import { TaxonomyService } from 'src/app/data/service/taxonomy.service';
import { DepartmentService } from 'src/app/data/service/department.service';
import { SupplierService } from 'src/app/data/service/supplier.service';
import { ExportService } from 'src/app/shared/service/export.service';
import { AssetGroupService } from 'src/app/data/service/asset-group.service';
import { Lookup } from 'src/app/data/Enum/lookup';
import { Modal } from 'bootstrap';




@Component({
  selector: 'view-ppm',
  templateUrl: './view-ppm.component.html',
  styleUrls: ['./view-ppm.component.scss']
})
export class ViewPpmComponent {
  addPpmForm !: FormGroup;
  searchForm!:FormGroup;
  cer !: FormGroup;
  assets !: FormGroup;
  attachments !: FormGroup;
  ppmModel: PpmModel = new PpmModel();
  ppms: [] = [];
  departments:[]=[];
  manfactus:[]=[];
  key!: any;
  disabled: boolean = true;
  items!: MenuItem[];
  period: [] = [];
  suppliers: [] = [];
  models:[]=[];
  assigned: [] = [];
  TypeService: [] = [];
  groupLeader: [] = [];
  schduleList:[]=[];
  serialList:[]=[];
  assetNumberList:[]=[];
  siteList:[]=[];
  totalRows: number=0;
  loading!: boolean;
  fromFlag:boolean=false;
  toFlag:boolean=false;
  engineerId:any;
  employee:any;
  buildingList:[]=[];
  floorList:[]=[];
  AssetNames: any[] = [];
  roomList: any[] = [];
  archivedData:boolean=false;
  //filter
  filter: any = {
    pageSize: 10,
    pageNumber: 1
  };
  AssetGroups:any[]=[];
  constructor(
    private cd:ChangeDetectorRef,
    private modelApi:TaxonomyService,
    private deptApi:DepartmentService,
    private supplierApi:SupplierService,
    private visitApi:PPMEntryService,
    private exporteService: ExportService,
    private siteApi:CustomerService,
    private assetApi: AssetsService,
    private formbuilder: FormBuilder, 
    private api: PpmService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, 
    private httpClient: HttpClient, 
    private router: Router, 
    private filterService: FilterService,
    private assetGroupService:AssetGroupService,
    private modelService: ModelService) { }

  ngOnInit(): void {
    this.getAssetGroups();
    this.searchForm=this.formbuilder.group({
      timePeriodId: null,
      assignedToId: null,
      maintenanceContractId: null,
      typeOfServiceId: null,
      groupLeaderId: null,
      assetId:null,
      ppmId: null,
      siteId: null,
      expectedDateFrom: null,
      expectedDateTo: null,
      planNo:null,
      modelId:null,
      manufacturerId:null,
      departmentId:null,
      supplierId:null,
      assetGroup:null,
      assetName: null,
      buildingId:null,
      floorId:null,
      archivedData:null
    })
       

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'PPM List' },
    ];

    this.Reset();
    this.getTimePeriod();
    this.getAssignedTo();
    this.getTypeService();
    this.getAssignedTo();

    this.getAndBindLookup(Lookup.Building, a => this.buildingList = a);
    this.getAndBindLookup(Lookup.Floor, a => this.floorList = a);
    this.getAndBindLookup(Lookup.Rooms, a => this.roomList = a);
  }

  getAndBindLookup(lookup: Lookup, targetProp: (a:any) => void) {
    this.api.getLookups({queryParams: lookup}).subscribe(res => targetProp(res.data));
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

  navToDetails(row: any, index: number) {
    this.ppmModel.id = row.id;
    this.router.navigate(['/maintenance/ppm/edit-control'], { queryParams: { data: row.id, index } })
  }


  getAllPpm() {
    this.filter.assetGroup = this.searchForm.value.assetGroup;
    this.filter.archivedData = this.archivedData;
    this.api.getPpm(this.filter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.ppms = data;
        this.totalRows = res.totalRows;
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
    this.filter.pageNumber = event.page + 1;
    this.getAllPpm();
    this.loading = false;
  }


  
  deletePpm(row: any) {
    this.ppmModel = row.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this PPM ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deletePpm(row.id).subscribe(res => {
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
            this.getAllPpm();
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

  getTimePeriod() {
    this.api.getLookups({ queryParams: 32 }).subscribe(res => {
      this.period = res.data;
    })
  }


  getAssignedTo() {
    this.api.getLookups({ queryParams: 33 }).subscribe(res => {
      this.assigned = res.data;
    })
  }

  getGroupLeader() {
    return this.api
      .getAssignedEmp(['64f4e5a7-a15d-4d02-9645-5b86a0b79429'])
      .subscribe((res: any) => {
        console.log('group leader', res);
        this.groupLeader = res;
      });
  }

  getTypeService() {
    this.api.getLookups({ queryParams: 34 }).subscribe(res => {
      this.TypeService = res.data;
    })
  }
  
 

  ppmScheduleFilter(event: any) {
    this.filter.pageNumber=1;
    this.api.getPpm({planNo:event.query}).subscribe((res) => {
      const data = res.data;
      this.schduleList = data;
    });
  }
 
  serialNumberFilter(event: any){
    this.filter.pageNumber=1;
    this.assetApi.GetAssetsAutoComplete(event.query).subscribe((res) => {
      this.serialList =res.data;
    });
   
}


assetNumberFilter(event:any){
  this.filter.pageNumber=1;
  this.assetApi.GetAssetsAutoCompleteMultiFilter({assetNumber:event.query}).subscribe((res) => {
    const data = res.data;
    this.assetNumberList = data;
})
}


siteNumberFilter(event: any) {
  this.filter.pageNumber=1;
  this.siteApi.searchCustomer({custName:event.query}).subscribe((res) => {
    const data = res.data;
    console.log("asset serial list", data)
    this.siteList = data;
  })
}

modelFilter(event: any) {
  this.filter.pageNumber=1;
  this.modelApi.searchTaxonomy({name:event.query}).subscribe((res) => {
    this.models = res.data;
  })
}
manufaturerFilter(event: any) {
  this.filter.pageNumber=1;
  this.modelApi.searchManufacturerByName({name:event.query}).subscribe((res) => {
    this.manfactus = res.data;
  })
}
 
deptFilter(event: any) {
  this.filter.pageNumber=1;
  this.deptApi.searchDepartments({deptName:event.query}).subscribe((res) => {
    this.departments = res.data;
  })
}
searchSupplier(event: any) {
  this.supplierApi
    .getSupplier({ suppliername: event.query })
    .subscribe((res) => {
      this.suppliers = res.data;
    });
}
  search(){
    this.getAllPpm();
  }
  Reset(){
    this.filter = {
    pageSize: 10,
    pageNumber: 1,
    timePeriodId: null,
    assignedToId: null,
    maintenanceContractId: null,
    typeOfServiceId: null,
    groupLeaderId: null,
    assetId:null,
    ppmId: null,
    siteId: null,
    expectedDateFrom: null,
    expectedDateTo: null,
    planNo:null,
    modelId:null,
    manufacturerId:null,
    departmentId:null,
    supplierId:null,
    assetGroup:null

    };
    this.searchForm.reset();
    this.getAllPpm();
  }

  export() {
    console.log('this.filter', this.filter);
    this.exporteService
      .export(this.filter, 'PPM/ExportToExcel')
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
        link.download = 'PPM-Schedule-Report';
        link.click();
      });
  }

  getAssetGroups(){
    this.assetGroupService.searchAssetGroups({  }).subscribe((res: any) => {
      this.AssetGroups = res.data
    })

  }

  setCheckbox(event:any){
    this.archivedData=event.checked;
    }
}

