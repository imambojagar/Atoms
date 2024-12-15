import { TaxonomyService } from 'src/app/data/service/taxonomy.service';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, Message, MessageService } from 'primeng/api';
import { attachments, ppmAssets, PpmModel } from 'src/app/data/models/ppm-model';
import validateForm from 'src/app/shared/helpers/validateForm';
import { PpmService } from 'src/app/data/service/ppm.service';
import { AssetsService } from 'src/app/data/service/assets.service';
import { Asset } from 'src/app/data/models/asset';
import { AssetFormService } from '../../../systemsettings/assets/asset-form.service';
import { dateHelper } from 'src/app/shared/helpers/dateHelper';
import { SupplierService } from 'src/app/data/service/supplier.service';
import { DepartmentService } from 'src/app/data/service/department.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { AssetGroupService } from 'src/app/data/service/asset-group.service';

@Component({
  selector: 'add-ppm',
  templateUrl: './add-ppm.component.html',
  styleUrls: ['./add-ppm.component.scss'],
  providers: [MessageService]
})

export class AddPpmComponent {
  addPpmForm !: FormGroup;
  attachmentForm!: FormGroup;
  attachmentName: any[] = [];
  ppmModel: PpmModel = new PpmModel();
  msgs!: Message[];
  uploadedFiles: any[] = [];
  fileName = '';
  items!: MenuItem[];
  cer !: FormGroup;
  assets !: FormGroup;
  period: any[] = [];
  manufacts: [] = [];
  models: [] = [];
  assigned: [] = [];
  TypeService: any[] = [];
  groupLeader: [] = [];
  contractList: [] = [];
  serialList: [] = [];
  assetNumbs: [] = [];
  contractNum: number = 0;
  fromFlag: boolean = false;
  toFlag: boolean = false;
  fileList: File[] = [];
  showDialog!: boolean;
  totalRows!: number;
  assetsData: [] = [];
  suppliers: [] = [];
  sites: [] = [];
  searchForm!: FormGroup
  pageSize = 10;
  selectedRowIds: Set<number> = new Set<number>();
  selectedId!: string;
  serialNumbersArray: Set<string> = new Set<string>();
  assetNumberArray: Set<string> = new Set<string>();
  isSubmit: boolean = false;
  isChecked = [];
  assetNames: [] = [];
  suppList: any[] = [];
  depsList: any[] = [];
  loading!: boolean;
  start: any;
  searchFilter: any = {
    pageSize: 10,
    pageNumber: 1
  };
  check: boolean = true;
  timePeriodValue: any;

  isShow: boolean = true;
  autoRenew: boolean = false;
  AssetGroups:any[]=[];

  timeFrame: [] = [];
  InstructionDescription: any[] = [];
  isInstruction: boolean = true;
  constructor(private deptApi: DepartmentService, private supplierApi: SupplierService, 
    private taxonomyService: TaxonomyService, public assetFormService: AssetFormService, 
    private assetApi: AssetsService, private apiAsset: AssetsService, private api: PpmService, 
    private formbuilder: FormBuilder, private router: Router, private messageService: MessageService, 
    private confirmationService: ConfirmationService,private customerService:CustomerService,
    private assetGroupService:AssetGroupService) { }
  ngOnInit(): void {
    
    this.getAssetGroups();
    this.addPpmForm = this.formbuilder.group({
      
      timePeriodId: ['', Validators.required],
      assignedToId: [''],
      ppmTasks: [''],
      maintenanceContractId: [''],
      typeOfServiceId: [''],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      executionTimeFrameId:[null,Validators.required],
      ppmAssets: this.formbuilder.array([
        this.formbuilder.group({
          id: [''],
          ppmId: [''],
          assetId: [''],
        })
      ], Validators.required),
      groupLeaderId: [''],
      comments: [''],
      workPerformedBy: [''],
      numOfVisitsDone: [''],
      supplierName: [''],
      supplierId: [''],
      autoRenew: [''],
      instructionDescription: [''],
      InstructionDescriptionId:0,

    })

    this.searchForm = this.formbuilder.group({
      assetSerialNumber: null,
      assetNo: null,
      assetName: null,
      manufacturer: null,
      site: null,
      modelDefinition: null,
      model: null,
      department: null,
      supplier: null,
      assetGroup:null
    })
    this.attachmentForm=this.formbuilder.group({
      attachments: this.formbuilder.array([]),
    });


    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'PPMs Schedule' },
    ]
    this.getTimeFrame();
    this.getTimePeriod();
    this.getAssignedTo();
    this.getTypeService();



  }

  getAllInstructionDescription(assetId:number) {
    this.apiAsset.GetAssetInstructionDescriptionById(assetId).subscribe(res => {
      let InstructionDes=[];
      if(res.data.length>0){
      this.isInstruction=false;
      for (let v=0; v<res.data.length; v++) {
        InstructionDes.push(res.data[v].instructionDescription)
      }
      this.InstructionDescription = InstructionDes;
    }
    else{
      this.isInstruction=true;
    }
    });
  }


  //submit form
  addPpmSubmit() {
    if (this.addPpmForm.invalid) {
      validateForm.validateAllFormFields(this.addPpmForm);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
    }
    else {
      this.ppmModel.assignedToId = this.addPpmForm.value.assignedToId;
      this.ppmModel.timePeriodId = this.addPpmForm.value.timePeriodId;
      this.ppmModel.typeOfServiceId = this.addPpmForm.value.typeOfServiceId;
      this.ppmModel.executionTimeFrameId = this.addPpmForm.value.executionTimeFrameId;
      this.ppmModel.comments = this.addPpmForm.value.comments;
      this.ppmModel.fromDate = this.addPpmForm.value.fromDate;
      this.ppmModel.toDate = this.addPpmForm.value.toDate;
      this.ppmModel.supplierId = this.addPpmForm.value.supplierId;
      this.ppmModel.autoRenew = this.autoRenew;
      this.ppmModel.fromDate = dateHelper.ConvertDateWithSameValue(this.addPpmForm.value.fromDate);
      this.ppmModel.toDate = dateHelper.ConvertDateWithSameValue(this.addPpmForm.value.toDate);

      this.ppmModel.InstructionDescriptionId = this.addPpmForm.value.instructionDescription;


      //dateHelper.reverseDateFilds(this.ppmModel, ['fromDate','toDate']);


      // if (!this.ppmModel.attachments) {
      //   this.ppmModel.attachments = [];
      // }
      // (this.addPpmForm.get('attachments') as FormArray).controls.forEach(element => {

      //   let attach = new attachments();
      //   attach.ppmId = this.ppmModel.id;
      //   attach.attachmentName = this.attachmentForm.value.attachmentName;
      //   console.log('attach', attach)
      //   this.ppmModel.attachments.push(attach);

      // });
      this.ppmModel.attachments=[];
      (this.attachmentForm.get('attachments') as FormArray).controls.forEach(
        (element) => {
          let attach = new attachments();
          attach.id=element.value.id;
          attach.attachmentName = element.value.attachmentName;
          this.ppmModel.attachments.push(attach);
        }
      );

      this.api.postPpm(this.ppmModel).subscribe(res => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000 });
          this.addPpmForm.reset();
          this.router.navigate(['/maintenance/ppm']);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        }
      })
    }
  }



  setCheckbox(event: any) {
    this.autoRenew = event.checked;
  }
  getTimePeriod() {
    this.api.getLookups({ queryParams: 32 }).subscribe(res => {
      this.period = res.data;
      console.log("time", res.data)
    })
  }


  getAssignedTo() {
    this.api.getLookups({ queryParams: 33 }).subscribe(res => {
      this.assigned = res.data;
    })
  }

  getTypeService() {
    this.api.getLookups({ queryParams: 34 }).subscribe(res => {
      this.TypeService = res.data;
    })
  }

  changeInstructionDescription(event: any) {
    this.addPpmForm.value.InstructionDescriptionId = event.value;
  }

  changePeriod(event: any) {
    this.addPpmForm.value.timePeriodId = event.value;
    let p = this.period.find(x => x.id == event.value)
    this.timePeriodValue = p.value;
    this.isShow = false;
    if (this.timePeriodValue && this.start) {
      this.calcEndDate(this.start);
    }

  }
  selectFromDate(event: any) {
    this.start = event;
    this.calcEndDate(this.start);
  }

  calcEndDate(startDate: any) {
   
    let end = new Date(startDate);
    
    if(this.timePeriodValue==49)
    {
      end.setMonth(end.getMonth()+ 0);
      console.warn()
      var toDate = new Date(end.setDate(end.getDate()));
      this.addPpmForm.controls['toDate'].setValue(toDate)
    }
    else if(this.timePeriodValue==50)
    {
      end.setMonth(end.getMonth()+0);
      console.warn()
      var toDate = new Date(end.setDate(end.getDate()+7));
      this.addPpmForm.controls['toDate'].setValue(toDate)
    }
    else if(this.timePeriodValue==51)
    {
      end.setMonth(end.getMonth()+0);
      console.warn()
      var toDate = new Date(end.setDate(end.getDate()+14));
      this.addPpmForm.controls['toDate'].setValue(toDate)
    }else{
      end.setMonth(end.getMonth() + this.timePeriodValue);
    var toDate = new Date(end.setDate(end.getDate() - 1));
    this.addPpmForm.controls['toDate'].setValue(toDate)
    }


  }

  changeAssigned(event: any) {
    this.addPpmForm.value.assignedToId = event.value;
    console.log(" this.addPpmForm.value.assignedToId", this.addPpmForm.value.assignedToId)
  }

  changeService(event: any) {
    this.addPpmForm.value.typeOfServiceId = event.value;
    console.log("type", event.value)
    if (event.value == this.TypeService[1].id) {
      this.check = false;

    } else {
      this.check = true;

    }
  }


  searchContract(event: any) {
    this.api.getContractNum({ maintenanceContractNumber: event.query }).subscribe((res) => {
      this.contractList = res.data;
    });
  }

  onSelectContract(event: any) {
    this.contractNum = event.id;
    this.ppmModel.maintenanceContractId = this.contractNum;
    console.log("this.contractNum", this.contractNum)
  }




  searchSupplier(event: any) {
    this.supplierApi
      .getSupplier({ suppliername: event.query })
      .subscribe((res) => {
        this.suppliers = res.data;
      });
  }
  onSelectSupplier(event: any) {
    this.addPpmForm.controls['supplierId'].patchValue(event.id);
    this.addPpmForm.controls['supplierName'].patchValue({
      suppliername: event.suppliername,
    });

    console.log('supp event', event.id);
  }

  //LookUp
  searchAsset() {
    debugger;
    Object.bind(this.searchFilter, this.searchForm.value)
    this.searchFilter.assetGroup= this.searchForm.value.assetGroup;
    this.apiAsset.searchAsset(this.searchFilter).subscribe(res => {
      console.log("rea", res);
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.assetsData = data;
        console.log("this.assetsData", this.assetsData)
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
    this.searchFilter.pageNumber = event.page + 1;
    this.searchAsset();
    this.loading = false;
  }

  serialNumberFilter(event: any) {
    this.searchFilter.pageNumber = 1;
    this.assetApi.GetAssetsAutoComplete(event.query).subscribe((res) => {
      this.serialList = res.data;
    });
    this.searchFilter.assetSerialNumber = event.query;
  }

  bindSN(event: any) {
    console.log("bind sn", event)
    this.searchFilter.assetSerialNumber = event.assetSerialNo;
  }

  selectManufact(event: any) {
    this.searchFilter.pageNumber = 1;

    this.taxonomyService.searchManufacturerByName({ name: event.query }).subscribe((res) => {
      this.manufacts = res.data;
    });
    this.searchFilter.manufacturer = event.query;
  }

  selectAssetNumber(event: any) {
    
    this.assetApi.GetAssetsAutoCompleteMultiFilter({ assetNumber: event.query }).subscribe((res) => {
      
      this.assetNumbs = res.data;
    });
    this.searchFilter.assetNo = event.query;
    console.log("asset number", event)
  }
  bindAssetNumber(event: any) {
    console.log("asset number", event)
    this.searchFilter.assetNo = event.assetNumber;
  }

  selectAssetName(event: any) {
    this.apiAsset.searchAsset(<any>{ assetName: event.query }).subscribe((res) => {
      this.assetNames = res.data;
    })
    this.searchFilter.assetName = event.query;
  }
  bindAssetName(event: any) {
    console.log('event', event);
    this.searchFilter.assetName = event.modelDefinition.assetName;

  }
  selectSite(event: any) {
    this.customerService.GetCustomersAutoComplete(event.query).subscribe(res=>{
      this.sites = res.data;
    });
    this.searchFilter.site = event.query;
    
  }
  bindSite(event: any) {
    console.log('event', event.custName);
    this.searchFilter.site = event.custName;

  }


  searchModel($event: any) {
    console.log("Model $event", $event)
    this.taxonomyService.searchTaxonomy({ name: $event.query }).subscribe((res) => {
      this.models = res.data;
    });
    this.searchFilter.model = $event.query;
  }
  bindModel(event: any) {
    console.log('event', event);
    this.searchFilter.model = event.modelName;

  }
  fillDeps(event: any) {
    this.deptApi.searchDepartments({ deptName: event.query }).subscribe((res) => {
      this.depsList = res.data;
    });
    this.searchFilter.department = event.query;
  }
  selectDept(event: any) {
    console.log("department", event);
    this.searchFilter.department = event.departmentName;

  }
  fillSuppliers(event: any) {
    this.supplierApi.getSupplier({ suppliername: event.query }).subscribe((res) => {
      this.suppList = res.data;
    });
    this.searchFilter.supplier = event.query;
  }
  selectSupplier(event: any) {
    console.log("supplier", event);
    this.searchFilter.supplier = event.suppliername;
  }

  openDialog() {
    this.showDialog = true;
    this.searchAsset();

  }
  onRowSelect(event: any) {
    console.log("checkbox", event)
    const assetSerialNumber = event.data.assetSerialNo;
    const assetNumber = event.data.assetNumber;
    const id = event.data.id;
    this.serialNumbersArray.add(assetSerialNumber);
    this.assetNumberArray.add(assetNumber);
    this.selectedRowIds.add(id);
    console.log("this.isChecked", this.isChecked)
    console.log("this.selectedRowIds", this.selectedRowIds)
  }

  onRowUnselect(event: any) {
    console.log("uncheckbox", event)
    const id = event.data.id
    const assetSerialNumber = event.data.assetSerialNo;
    const assetNumber = event.data.assetNumber;
    if (this.selectedRowIds.has(id)) {
      this.selectedRowIds.delete(id);
      this.serialNumbersArray.delete(assetSerialNumber);
      this.assetNumberArray.delete(assetNumber)
    }
    else {
      this.selectedRowIds.add(id);
      this.serialNumbersArray.add(assetSerialNumber);
      this.assetNumberArray.add(assetNumber);
    }
    console.log("this.selectedRowIds", this.selectedRowIds)
    console.log("this.isChecked", this.isChecked)
  }

  addSerialNumber() {
    console.log("this.selectedRowIds", this.selectedRowIds)
    if (!this.ppmModel.ppmAssets) {
      this.ppmModel.ppmAssets = [];
    }
    if (this.selectedRowIds.size == 0) {
      this.ppmModel.ppmAssets = [];
    }

    this.selectedRowIds.forEach(x => {
      (this.addPpmForm.get('ppmAssets') as FormArray).controls.forEach(element => {
        let asset = new ppmAssets();
        asset.ppmId = this.ppmModel.id;
        asset.assetId = x;
        var existitem = this.ppmModel.ppmAssets.find(x => x.assetId == asset.assetId);
        console.log("existitem", existitem)

        if (existitem) {
          this.ppmModel.ppmAssets = [];
          asset.ppmId = this.ppmModel.id;
          asset.assetId = x;
          this.ppmModel.ppmAssets.push(asset);
        }
        else {
          console.log('asset array', asset)
          this.ppmModel.ppmAssets.push(asset);
          this.getAllInstructionDescription( asset.assetId);
         
        }

        
      });

    })
    console.log("this.ppmModel.ppmAssets", this.ppmModel.ppmAssets)
    this.showDialog = false;
    this.isSubmit = true;
   
  }

  deleteSerial() {
    this.selectedRowIds.clear();
    this.ppmModel.ppmAssets = [];
    this.serialNumbersArray.clear();
    this.assetNumberArray.clear();
    this.isChecked = [];
    this.InstructionDescription=[];
    this.isInstruction=true;

  }


  selectManufacturer(event: any) {
    this.assetFormService.getManufacturers(event.query);
    this.searchFilter.manufacturer = event.query
  }
  selectSerialNumber(event: any) {
    this.assetFormService.getAssetsData(event.query);
    //this.searchFilter.Asset_SNs = event.query
    console.log("this.searchFilter.manufacturer", this.searchFilter.manufacturer)
  }
  bindManufacturer(event: any) {
    console.log("event.taxonomyName", event)
    this.searchFilter.manufacturer = event.taxonomyName;
  }

  search() {
    this.searchAsset();
  }
  Reset() {
    this.searchForm.reset();
    this.searchFilter = {
      pageSize: 10,
      pageNumber: 1,
      assetSerialNumber: null,
      assetNo: null,
      assetName: null,
      manufacturer: null,
      site: null,
      modelDefinition: null,
      model: null,
      department: null,
      supplier: null

    }
    this.apiAsset.searchAsset(this.searchFilter).subscribe(res => {
      console.log("rea", res);
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.assetsData = data;
        console.log("this.assetsData", this.assetsData)
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


  cancel() {
    this.addPpmForm.reset();
  }

  getAssetGroups(){
    this.assetGroupService.searchAssetGroups({  }).subscribe((res: any) => {
      this.AssetGroups = res.data
    })

  }

  attachmentReady(event: any) {
    (this.attachmentForm.get('attachments') as FormArray).push(
       this.formbuilder.group({
        attachmentName: event[0],
        attachmentURL: [''],
        id: 0,
      })
    );

  }

  changeTimeFrame(event: any) {
    this.addPpmForm.value.executionTimeFrameId = event.value;
  }
  getTimeFrame() {
    this.api.getLookups({ queryParams: 400 }).subscribe((res) => {
      this.timeFrame = res.data;
      if (this.timeFrame.length>0)
      {
        this.addPpmForm.controls["executionTimeFrameId"].setValue(res.data[0].id);
      }
      
    });
  }
}
