import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
/* import { Asset } from 'src/app/data/models/asset';
import { ppmAssets } from 'src/app/data/models/ppm-model';
import { AssetsService } from 'src/app/data/service/assets.service';
import { ApiService } from 'src/app/data/service/name-definition.service';
import { AssetFormService } from 'src/app/modules/systemsettings/assets/asset-form.service'; */
import { ServiceRequestFormService } from '../../service-request-form.service';
/* import { TaxonomyService } from 'src/app/data/service/taxonomy.service';
import { DepartmentService } from 'src/app/data/service/department.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { SupplierService } from 'src/app/data/service/supplier.service';
import { environment } from 'src/environments/environment';
import { Role } from 'src/app/data/Enum/role'; */
/* import { AssetGroupService } from 'src/app/data/service/asset-group.service'; */
import { Router } from '@angular/router';
/* import { FileServiceService } from 'src/app/data/service/file-service.service'; */
import { DomSanitizer } from '@angular/platform-browser';
import { AssetFormService } from '../../../../assets/assets/asset-form.service';
import { AssetsService } from '../../../../services/assets.service';
import { ApiService } from '../../../../services/name-definition.service';
import { TaxonomyService } from '../../../../services/taxonomy.service';
import { DepartmentService } from '../../../../services/department.service';
import { CustomerService } from '../../../../services/customer.service';
import { SupplierService } from '../../../../services/supplier.service';
import { AssetGroupService } from '../../../../services/asset-group.service';
import { Asset } from '../../../../models/asset';
import { FileServiceService } from '../../../../services/file-service.service';
import { PrimengModule } from '../../../../shared/primeng.module';
/* import { PPMEntryService } from 'src/app/data/service/ppm-entry.service'; */

@Component({
  standalone: true,
  selector: 'app-call-info',
  imports:[FormsModule, ReactiveFormsModule, PrimengModule],
  templateUrl: './call-info.component.html',
  styleUrls: ['./call-info.component.scss'],
  providers: [ServiceRequestFormService]
})
export class CallInfoComponent implements OnInit {
  uploadedFiles: any[] = [];
  showDialog: boolean = false;
  totalRows!: number;
  assetsData: [] = [];
  searchFilter = new Asset();
  searchForm!: FormGroup
  pageSize = 10;
  selectedItems: any[] = [];
  // serialNumbersArray: Set<string> = new Set<string>();
  isSubmit: boolean = false;
  // isChecked = [];
  assetNames: [] = [];

  Role: any;
  roleValue: any;

  models: [] = [];
  departments: [] = [];
  sites: [] = [];
  suppliers: [] = [];
  loading!: boolean;
  loanAssetAuto: any[] = [];
  assetGroupsList: [] = [];
  constructor(
    public serviceRequestFormService: ServiceRequestFormService,
    public assetFormService: AssetFormService, private apiAsset: AssetsService,
    private messageService: MessageService, private formbuilder: FormBuilder,
    private apiServiceNameDefinition:ApiService,
    private taxonomyService : TaxonomyService,
    private departmentService:DepartmentService,

    private customerService:CustomerService,
    private supplierService:SupplierService,
    private assetService:AssetsService,
    private assetGroupService:AssetGroupService,
    private router: Router,
    private fileService:FileServiceService,
    private domSanitizer:DomSanitizer
  ) {

  }
  ngOnInit(): void {

    // this.Role = JSON.parse(localStorage.getItem('userRoles') || '{}');
    // this.Role.forEach((e: any) => {
    //   this.roleValue = e.value;
    //   debugger
    //   if (this.roleValue == 'R-2') {
    //     // this.imEngineer = true;
    //   }
    // });


    if (this.serviceRequestFormService.isAddMode && this.serviceRequestFormService.userAssetGroupSelected == null) {
      // this.router.navigate(['/maintenance/service-request']);
    }
    this.searchForm = this.formbuilder.group({
      assetSerialNumber: null,
      assetNo: null,
      assetName: null,
      manufacturer: null,
      model:null,
      department:null,
      site:null,
      supplier:null,
      assetGroup:null
    })

  }



  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(event.files)
    }

    this.messageService.add({ severity: 'success', summary: 'File Upload', detail: 'File Uploaded Successfully ! ' });
  }

  searchAsset() {

    this.searchFilter.assetGroup = this.searchForm.controls['assetGroup'].value;
    this.apiAsset.searchAsset(this.searchFilter).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.assetsData = data;
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
  selectSN(event: any) {
    this.assetFormService.getAssetsData(event.query);
    this.searchFilter.assetSerialNumber = event.query;
  }


  bindSN(event: any) {
    this.searchFilter.assetSerialNumber = event.assetSerialNo;
  }
  clearSN() {
    this.searchFilter.assetSerialNumber = "";
  }

  selectAssetNumber(event: any) {
    this.assetFormService.getAssetNumbers(event.query);
    this.searchFilter.assetNo = event.query;
  }
  bindAssetNumber(event: any) {
    this.searchFilter.assetNo = event.assetNumber;
  }
  clearAssetNumber() {
    this.searchFilter.assetNo = "";
  }

  selectAssetName(event: any) {
    this.apiServiceNameDefinition.searchNameDefinition(<any>{ assetName: event.query }).subscribe((res) => {
      this.assetNames = res.data;
    })

  }
  bindAssetName(event: any) {
    this.searchFilter.assetName = event.assetname;
  }
  clearAssetName() {
    this.searchFilter.assetName = "";
  }



  changeSafetyStatus(event: any) {
    this.searchForm.value.Safety = event.value;
    debugger
  }


  openDialog() {
    var assetGroup =this.searchForm.get("assetGroup") as FormControl;
    assetGroup.setValue(this.serviceRequestFormService.userAssetGroupSelected);
    this.searchForm.controls['assetGroup'].disable();
    this.showDialog = true;
    this.searchAsset();
  }
  onRowSelect(event: any) {
    console.log(this.selectedItems);

  }

  addSerialNumber() {
    if (this.selectedItems.length>0)
    {
      (this.serviceRequestFormService.assets).controls.forEach((element,index)=>{
        if (element.value.assetNumber != null)
        {
          this.selectedItems.forEach((e,i)=>{
                if (element.value.assetNumber.id == e.id)
                {
                  this.selectedItems.splice(i,1);
                }
          });
         // this.selectedItems.forEach(x => {
        }
      });
      (this.serviceRequestFormService.assets).controls.forEach((element,index)=>{
        if (element.value.assetNumber == null)
        {
          (this.serviceRequestFormService.assets).controls.splice(index,1);
        }
     });
    }
    this.selectedItems.forEach(x => {
      this.serviceRequestFormService.selectAssetPOPUP(x.id)
    })






    // let itemEnterd:any[]=[];
    // this.selectedItems.forEach(x => {
    //   let isEnterd:boolean=false;
    //   (this.serviceRequestFormService.assets).controls.forEach((element,index)=>{

    //       if ((this.serviceRequestFormService.assets).controls[index].get("assetNumber")?.value != null && (this.serviceRequestFormService.assets).controls[index].get("assetNumber")?.value.id == x.id)
    //       {
    //         isEnterd=true
    //       }
    //   });
    //   if (isEnterd==false)
    //   {
    //     itemEnterd.push(x.id);

    //   }
    // })
    // this.serviceRequestFormService.selectAssets(itemEnterd);


    this.showDialog = false;
    this.isSubmit = true;
    this.selectedItems=[]

  }


  deleteSerial() {
    // this.selectedItems.clear();
    //  this.ppmModel.ppmAssets=[];
    // this.serialNumbersArray.clear();
    // this.isChecked = [];

  }


  selectManufacturer(event: any) {
    this.assetFormService.getManufacturers(event.query);
    this.searchFilter.manufacturer = event.query
  }
  bindManufacturer(event: any) {
    this.searchFilter.manufacturer = event.name;
  }
  clearManufacturer() {
    this.searchFilter.manufacturer = "";
  }
  selectSerialNumber(event: any) {
    this.assetFormService.getAssetsData(event.query);
    //this.searchFilter.Asset_SNs = event.query
  }


  search() {
    this.searchAsset();
  }
  Reset() {
    this.searchForm.reset();
    this.searchFilter.assetName=""
    this.searchFilter.assetNo=""
    this.searchFilter.manufacturer=""
    this.searchFilter.assetSerialNumber=""
    if(this.serviceRequestFormService.userAssetGroupSelected){
      var assetGroup =this.searchForm.get("assetGroup") as FormControl;
      assetGroup.setValue(this.serviceRequestFormService.userAssetGroupSelected);
      this.searchForm.controls['assetGroup'].disable();
    }

    this.apiAsset.searchAsset(<any>{}).subscribe(res => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.assetsData = data;
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


  selectModel(event: any) {
    this.taxonomyService.GetManufacturerOrModelAutoComplete3(false,event.query).subscribe(res=>{
      this.models = res.data;
      this.searchFilter.model = event.query
    });

  }
  bindModel(event: any) {
    this.searchFilter.model = event.name;
  }
  clearModel() {
    this.searchFilter.model = "";
  }

  selectDepartment(event: any) {
    this.departmentService.GetDepartmentsAutoComplete1(event.query).subscribe(res=>{
      this.departments = res.data;
      this.searchFilter.department = event.query
    });

  }
  bindDepartment(event: any) {
    this.searchFilter.department = event.departmentName;
  }
  clearDepartment() {
    this.searchFilter.department = "";
  }

  selectSite(event: any) {
    this.customerService.GetCustomersAutoComplete(event.query).subscribe(res=>{
      this.sites = res.data;
      this.searchFilter.site = event.query
    });

  }
  bindSite(event: any) {
    this.searchFilter.site = event.custName;
  }
  clearSite() {
    this.searchFilter.site = "";
  }

  selectSupplier(event: any) {
    this.supplierService.getSuppliersAutoComplete(event.query).subscribe(res=>{
      this.suppliers = res.data;
      this.searchFilter.supplier = event.query
    });

  }

  bindSupplier(event: any) {
    this.searchFilter.supplier = event.suppliername;
  }

  clearSupplier() {
    this.searchFilter.supplier = "";
  }

  selectAssetGroup(event: any) {
    this.assetGroupService.GetAssetGroupsAutoComplete(event.query).subscribe(res=>{
      this.assetGroupsList = res.data;
      this.searchFilter.assetGroup = event.query
    });
  }

  bindAssetGroup(event: any) {
    this.searchFilter.assetGroup = event;
  }
  clearAssetGroup() {
    this.searchFilter.assetGroup = "";
  }
  getAssetLoan(searchText: any = '') {
    var dto={
      assetNumber:searchText
    }
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res) => {
      this.loanAssetAuto = res.data;
    });
  }

  bindAssetLoan(event: any) {
   var assetLoan = this.serviceRequestFormService.callInfoForm.get("assetLoan") as FormControl;
   assetLoan.setValue({id:event.id,assetNumber:event.assetNumber});
  }
  clearAssetLoan() {
    var assetLoan = this.serviceRequestFormService.callInfoForm.get("assetLoan") as FormControl;
    assetLoan.setValue(null);
  }
  onChange(event:any)
  {
    if (event.value!=1)
    {
      var assetLoan = this.serviceRequestFormService.callInfoForm.get("assetLoan") as FormControl;
      assetLoan.setValue(null);
    }
  }
  get loanAvaliblity(){
    return this.serviceRequestFormService.callInfoForm.get("loanAvailablity") as FormControl;
  }

  downloadFile() {
      var fileName = this.serviceRequestFormService.callInfoForm.get("voiceNote") as FormControl
      this.fileService.downloadImage(fileName.value).subscribe(res=>{
        var a =fileName.value.split(".")
        let audio=new Audio();
        audio.src=`data:audio/${a[1]};base64, ${res}`;
        audio.load();
        audio.play();
      })

  }

  close_modal() {
    this.showDialog = false;
  }

}
