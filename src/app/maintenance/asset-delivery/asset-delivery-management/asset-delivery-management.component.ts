import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, Message, MessageService } from 'primeng/api';
import { BehaviorSubject, Subscription, sequenceEqual } from 'rxjs';
import { ICreateAccount, inits } from '../../../wizards/create-account.helper';
import { AssetDeliveryModel, IAssetDelivery, initAsset } from '../../../models/asset-delivery-model';
import { AssetDeliveryService } from '../../../services/asset-delivery.service';
import { QuotationModel } from '../../../models/quotation-model';
import { Step11Component } from '../steps/step11/step11.component';
import validateForm from '../../../shared/helpers/validateForm';
import { TransactionHistory } from '../../../models/transaction-history';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { AssetDeliveryModel, IAssetDelivery ,initAsset} from 'src/app/data/models/asset-delivery-model';
import { QuotationModel } from 'src/app/data/models/quotation-model';
import { AssetDeliveryService } from 'src/app/data/service/asset-delivery.service';
import { ICreateAccount, inits } from 'src/app/modules/wizards/create-account.helper';
import validateForm from 'src/app/shared/helpers/validateForm';
import { Step1Component } from '../steps/step1/step1.component';
import { Step11Component } from '../steps/step11/step11.component';
import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

@Component({
  selector: 'app-asset-delivery-management',
  templateUrl: './asset-delivery-management.component.html',
  styleUrls: ['./asset-delivery-management.component.scss']
})
export class AssetDeliveryManagementComponent implements   OnChanges, OnDestroy {

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Input('edit_index') edit_index: any = 0;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  transactionHistory!: TransactionHistory
  formsCount = 5;
  account$: BehaviorSubject<ICreateAccount> = new BehaviorSubject<ICreateAccount>(inits);
  assetdelivery$: BehaviorSubject<IAssetDelivery> = new BehaviorSubject<IAssetDelivery>(initAsset);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private unsubscribe: Subscription[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private assetdeliveryService: AssetDeliveryService,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private router: Router) { }

  assetForm!: FormGroup;
  deliveryForm!: FormGroup;
  lineForm!: FormGroup;
  registerFileForm!: FormGroup;

  spare_Part!: FormGroup;
  _attachments !: FormGroup;
  printInfo_SparePart!: FormGroup;
  estimated_Workinghour!: FormGroup;
  items!: MenuItem[];
  attachmentForm!: FormGroup;
  quotationModel: QuotationModel = new QuotationModel();
  assetDeliveryModel: AssetDeliveryModel = new AssetDeliveryModel();
  msgs!: Message[];

  sites: any[] = [];
  operatingUnits: any[] = [];
  poNumbers: any[] = [];
  deliveryNumbers:any[]=[];
  deliveryStatus: any[] = [];
  costCenters: any[] = [];
  deliveries: any[] = [];
  poHeader: any;
  poLines: any[] = [];
  AssetModels: any[] = [];
  SiteList: [] = [];
  sparePartAutoComplete: [] = [];
  siteContactsForm!: FormGroup;

  id: any;
  deliveryAssetId: any;
  deliveryId: any;
  costCenterCode:any;
  workerorderId: any;
  callRequestId: any;
  siteId: any;
  isExternal: boolean = false;
  showmodals: boolean = false;
  showmodal1: boolean = false;
  showmodal2: boolean = false;
  showmodal3: boolean = false;
  typeScreen: string = 'Add';
  createdOn!: any;
  modifiedOn!: any;
  fromDate!: any;
  toDate!: any;

  showDialogPO:boolean=false;
  filterPO:any=[];
  dialogPOForm!:FormGroup;
  totalPORows:any=0;
  disableTab:string="true";

  deliveryInspactionData:any={};
  technicalInspectionData:any={};
  endUserAcceptanceData:any={};
  technicalAcceptanceData:any={};
  finalAcceptanceData:any={};
  lineList:any[]=[];
  @ViewChild(Step11Component) step1!:Step11Component;
  viewHistories:any[]=[];
  showDialogHistory:boolean=false;
  statusValue:any=0;
  changeStatusText:string="";
  showDialogRegistryFiles:boolean=false;
  registryFiles:any[]=[];


  ngOnChanges(changes: SimpleChanges): void {
     this.Init();
  }

   Init(): void {
    this.dialogPOForm=this.formbuilder.group({
        poNumber:['']
    })
    this.assetForm = this.buildForm(this.formbuilder);
    this.deliveryForm = this.buildDeliveryForm(this.formbuilder);
   /*  this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
       this.deliveryAssetId = params['params'];
    }); */

    let editindex = this.edit_index;
    this.id = this.edit_asset_id;
    this.deliveryAssetId = this.edit_asset_id ? {queryParams: { id: this.edit_asset_id, editindex }} :  null;

    /* this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000, }); */
    this.items = [{ label: 'Home', routerLink: ['/'] }];
    this.getSites();
    if (this.id == undefined || this.id == 0) {
      this.typeScreen = 'Add';
    }
    else {
      if (this.edit_index == 0) {
        this.typeScreen = 'View'
        this.assetForm.disable();
        this.getAssetDelivery(this.id);
      }
      else {
        this.typeScreen = 'Edit'
        this.getAssetDelivery(this.id);
      }
    }

  }

  close_modal() {
    this.openModals.emit();
  }

  close_modelfd() {
    this.showmodal1 = this.showmodal1;
  }

  close_models() {
    this.showmodal2 = !this.showmodal2;
  }

  close_modalas() {
    this.showmodal3 = !this.showmodal3;
  }

  // #region Control
  removeControl(controlName: string, index: number) {
    (this.assetForm.get(controlName) as FormArray).removeAt(index);
  }

  getControls(controlName: string) {
    return (<FormArray>this.assetForm.get(controlName)).controls;
  }
  // #endregion


  save() {
    if (this.assetForm.invalid) {
      validateForm.validateAllFormFields(this.assetForm);
      this.assetForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
    }
    else {
     let finalData: any = this.getAssetDeliveryModel(this.assetForm.value);
     var siteData = this.sites.filter((o: any) => o.orG_ID ==finalData.operatingUnit);
     finalData.operatingUnit = siteData[0].oU_NAME;
      if (this.id == undefined || this.id == 0) {
        this.assetdeliveryService.saveAssetDelivery(finalData).subscribe(res => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000, });
             this.close_modal();
            // this.router.navigate(['maintenance/asset-delivery/search-asset-delivery']);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
          }
        })
      }
      else {
        finalData.siteId = this.assetForm.value.siteId.id;
        this.assetdeliveryService.updateAssetDelivery(finalData).subscribe(res => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000, });
            this.router.navigate(['maintenance/asset-delivery/search-asset-delivery']);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
          }

        })
      }
    }
  }

  getAssetDelivery(id: number) {
    this.assetdeliveryService.getAssetDelivery(id).subscribe(res => {
      if (res.isSuccess) {
        const data = res.data;
        this.transactionHistory=new TransactionHistory();
        Object.assign( this.transactionHistory,res.data);
        this.assetDeliveryModel = data;
        var _operatingUnit =res.data.operatingUnitId;
        var _poNumber = res.data.poNumber;
        this.assetdelivery$.value.poNumber =_poNumber;
        this.assetForm.patchValue(data);
        this.createdOn = data.createdOn;
        this.modifiedOn = data.modifiedOn;
        this.assetForm.patchValue({
          invoiceDate: new Date(res.data.invoiceDate),
           operatingUnit: _operatingUnit,
           poNumber:  _poNumber
        });
        this.deliveries = res.data.deliveries;
        this.assetdelivery$.value.deliveries = res.data.deliveries;
        this.assetdelivery$.value.id = id;
        this.getDeliveryNumbers();
      }
    })
  }

  cancel() {
     this.close_modal();
    // this.router.navigate(['maintenance/asset-delivery/search-asset-delivery']);
  }


  getAssetDeliveryModel(formValue: any) {
    let model = { ...formValue };
    model.deliveries = this.cloneAndChangeProp(formValue.deliveries, (n, o) => {
      if (o.id == '')
        n.id = 0;
      n.partId = o.partId.id

    });
    //
    return model;
  }

  cloneAndChangeProp(arr: any[], act: (n: any, old: any) => any) {
    return arr.map(a => {
      let newInst = { ...a };
      act(newInst, a);
      return newInst;
    });
  }



  buildForm(formbuilder: FormBuilder) {
    return formbuilder.group({
      id: 0,
      operatingUnit: [null, Validators.required],
      operatingUnitId: [null],
      poNumber: [null, Validators.required],
      poNumberId: [null],
      supplier: [null],
      type: [null],
      status: [null],
      site: [null],
      paymentTerms: [null , Validators.required],
      buyer: [null],
      complete: false,
      remark: [null],
      total: [null],
      warrantyPeriod: [null, Validators.required],
      totalDeliveryAmount: [null],
      deliveries: this.formbuilder.array([]),
      createdOn: [null],
      modifiedOn: [null],
      assetDeliveryId:0
    });

  }

  buildDeliveryForm(formbuilder: FormBuilder) {
    return formbuilder.group({
      id: 0,
      number: [null, Validators.required],
      statusId: [null, Validators.required],
      lines: this.formbuilder.array([]),
      registryFiles: this.formbuilder.array([]),
      history: this.formbuilder.array([]),

      //Technical Accepteance
      acceptedBy: [null],
      verifiedBy: [null],
      technicalApprovedBy1:  [null],
      technicalApprovedBy2:  [null],
      certificateNumber:  [null],
      //Final Accepteance
      validatedBy:  [null],
      validatedDate: [null],
      finalApprovedBy:  [null],
      approvedDate:  [null],
      acceptanceDate:  [null],

      invoiceNumber: [null],
      invoiceDate: [null],
      invoiceAmount: [null],
      deliveryAmount:  [null],
      invoiceRemarks: [null],
      //employees: [null]
      //costCenterCode:[null]
    });
  }

  //#region ON Change
  changeSite(event: any){
    if(event.value !=null){
    this.assetForm.value.operatingUnit = event.value;
    this.assetForm.get('operatingUnitId')?.setValue( event.value);
    this.getCostCenters(event.value);
    }
  }



  //#endregion

  //#region DROP
  getSites() {
    var sitessb =this.assetdeliveryService.getSites().subscribe((res: any) => {
      this.sites = res.getOuListDetails;
    });
    this.unsubscribe.push(sitessb)
  }

  getCostCenters(data: any) {
  var costcentersb =   this.assetdeliveryService.getCostCenters(data).subscribe((res: any) => {
      this.costCenters = res.costCenterDetails;
    });
    this.unsubscribe.push(costcentersb)
  }

  getPoLines(data: any) {
    var poLinessb = this.assetdeliveryService.getPOLines(data).subscribe((res: any) => {
      this.poLines = res.poLinesDetails;
      //this.assetDeliveryModel.lines.push(this.poLines);
    });
    this.unsubscribe.push(poLinessb);
  }




  //#endregion

  //#region Operation
  // updateAssetDelivery = (part: Partial<IAssetDelivery>, isFormValid: boolean) => {
  //   const currentAssetDelivery = this.assetdelivery$.value;
  //   const updatedAssetDelivery = { ...currentAssetDelivery, ...part };
  //   this.assetdelivery$.next(updatedAssetDelivery);
  //   this.isCurrentFormValid$.next(isFormValid);
  // };
  // updateAccount = (part: Partial<ICreateAccount>, isFormValid: boolean) => {
  //   const currentAccount = this.account$.value;
  //   const updatedAccount = { ...currentAccount, ...part };
  //   this.account$.next(updatedAccount);
  //   this.isCurrentFormValid$.next(isFormValid);
  // };

  nextStep(currentPage:any) {
    const nextStep = currentPage + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    this.currentStep$.next(nextStep);
  }

  prevStep(per:any=0) {

    const prevStep = this.currentStep$.value - (1+per);
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  // New Code

  isChecked:any;
  assetsData:any[]=[];
  onRowSelect(event:any)
  {
    this.deliveryId=event.data.id;

    this.currentStep$.next(1);
    this.getDelivery(event.data.id);
  }


  openDialogPO() {
    this.showDialogPO = true;
    this.searchPODialog();
  }

  searchPODialog()
  {
    this.filterPO.pageNumber = 0;
    this.filterPO.pageSize = 10;
    this.filterPO.Org_ID=this.assetForm.value.operatingUnit;
    this.filterPO.poNumber=this.dialogPOForm.value.poNumber;
    this.getPONumbers(this.filterPO);
  }
  paginatePO(event:any)
  {
    this.filterPO.pageNumber = event.page;
    this.filterPO.pageSize = event.rows;
    this.filterPO.Org_ID=this.assetForm.value.operatingUnit;
    this.filterPO.poNumber=this.dialogPOForm.value.poNumber;
    this.getPONumbers(this.filterPO);
  }
  resetPODialog()
  {
    this.filterPO.pageNumber =10;
    this.filterPO.pageNumber =1;
    this.filterPO.Org_ID=this.assetForm.value.operatingUnit;
    this.dialogPOForm.controls['poNumber'].setValue('');
    this.getPONumbers(this.filterPO);
  }
  getPONumbers(data: any) {
    var poNumberSb =   this.assetdeliveryService.getPONumbers(data.Org_ID,data.pageNumber,data.pageSize,data.poNumber).subscribe((res: any) => {
      this.poNumbers = res.getPoListDetails;
      this.totalPORows = res.totalPORows;
    });
    this.unsubscribe.push(poNumberSb)
  }

  selectRowPO(poHeaderId:any,poNumber:any)
  {
    this.assetForm.controls['poNumber'].setValue(poNumber);
    this.assetForm.controls['poNumberId'].setValue(poHeaderId);
    this.showDialogPO = false;
    this.getPoHeader(poHeaderId);
  }

  getPoHeader(data: any) {
    var poHeadersb = this.assetdeliveryService.getPOHeader(data).subscribe((res: any) => {
      this.poHeader = res.poHeaderDetails;
      this.deliveryForm.get('costCenterCode')?.setValue(res.poHeaderDetails.locatioN_CODE);
      this.assetForm.get('status')?.setValue( res.poHeaderDetails.pO_STATUS);
      this.assetForm.get('supplier')?.setValue( res.poHeaderDetails.supplier);
      this.assetForm.get('type')?.setValue( res.poHeaderDetails.pO_TYPE);
      this.assetForm.get('site')?.setValue( res.poHeaderDetails.supplieR_SITE);
      this.assetForm.get('buyer')?.setValue( res.poHeaderDetails.buyeR_NAME);
      this.assetForm.get('total')?.setValue( res.poHeaderDetails.pO_TOTAL_AMOUNT);
      this.assetForm.get('totalDeliveryAmount')?.setValue(0);
      this.assetForm.get('remark')?.setValue( res.poHeaderDetails.remarks);
      this.assetForm.get('paymentTerms')?.setValue( res.poHeaderDetails.paymenT_TERM);
    });
    this.unsubscribe.push(poHeadersb);
  }

  addNewDelivery(){
    let dto={
      assetDeliveryId:this.id,
      statusId:1,
    }
    this.assetdeliveryService.saveDelivery(dto).subscribe(res => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess==true)
      {

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000, });
        this.getDeliveryNumbers();
      }
      else
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
      }

    })
  }

  getDeliveryNumbers() {
      var deliveryNumberSB = this.assetdeliveryService.GetDeliveryNumbers(this.id).subscribe((res: any) => {
          this.deliveryNumbers = res.data;
      });
      this.unsubscribe.push(deliveryNumberSB);

  }
  getDelivery(id:any)
  {

    this.disableTab="true";
      this.assetdeliveryService.getDelivery(id).subscribe(res=>{
        this.statusValue= res.data.statusValue
        if (res.data.statusValue==6)
          {
            this.changeStatusText="Complete"
          }
          else if (res.data.statusValue==8 || res.data.statusValue==7)
          {
            this.changeStatusText=""
          }
          else
          {
            this.changeStatusText="Change Status"
          }
        if (res.data.statusValue>=2)
        {



          this.disableTab="false";

          this.deliveryInspactionData.id=id;
          this.deliveryInspactionData.statusValue =  res.data.statusValue;
          this.deliveryInspactionData.inspectionDate=res.data.inspectionDate;
          this.deliveryInspactionData.inspectionBy=res.data.inspectionBy;
          this.deliveryInspactionData.inspectionById=res.data.inspectionById;
          this.deliveryInspactionData.deliveryApprovedBy=res.data.deliveryApprovedBy;
          this.deliveryInspactionData.deliveryApprovedById=res.data.deliveryApprovedById;
          this.deliveryInspactionData.deliveryTypeId=res.data.deliveryTypeId;
          this.deliveryInspactionData.paymentTerms=res.data.paymentTerms;
          this.deliveryInspactionData.operatingUnitId = this.assetForm.value.operatingUnitId;
          this.deliveryInspactionData.assetDeliveryId = this.id;
          this.deliveryInspactionData.lines=res.data.lines;
          this.deliveryInspactionData.isTechnicalInspection= res.data.isTechnicalInspection;
          this.step1.ngOnInit();

          this.technicalInspectionData.id=id;
          this.technicalInspectionData.statusValue =  res.data.statusValue;
          this.technicalInspectionData.inspectionDate=res.data.inspectionDate;
          this.technicalInspectionData.inspectionBy=res.data.inspectionBy;
          this.technicalInspectionData.inspectionById=res.data.inspectionById;
          this.technicalInspectionData.deliveryApprovedBy=res.data.deliveryApprovedBy;
          this.technicalInspectionData.deliveryApprovedById=res.data.deliveryApprovedById;
          this.technicalInspectionData.deliveryTypeId=res.data.deliveryTypeId;
          this.technicalInspectionData.paymentTerms=res.data.paymentTerms;
          this.technicalInspectionData.operatingUnitId = this.assetForm.value.operatingUnitId;
          this.technicalInspectionData.assetDeliveryId = this.id;
          this.technicalInspectionData.lines=res.data.lines;

          this.endUserAcceptanceData.id = id;
          this.endUserAcceptanceData.statusValue =  res.data.statusValue;
          this.endUserAcceptanceData.endUserAcceptances = res.data.endUserAcceptances;
          this.endUserAcceptanceData.isTechnicalInspection= res.data.isTechnicalInspection;
          this.lineList=res.data.lines;

          this.technicalAcceptanceData.id = id;
          this.technicalAcceptanceData.number = res.data.number;
          this.technicalAcceptanceData.acceptedBy = res.data.acceptedBy;
          this.technicalAcceptanceData.acceptedById = res.data.acceptedById;
          this.technicalAcceptanceData.verifiedBy = res.data.verifiedBy;
          this.technicalAcceptanceData.verifiedById = res.data.verifiedById;
          this.technicalAcceptanceData.technicalApprovedBy1 = res.data.technicalApprovedBy1;
          this.technicalAcceptanceData.technicalApprovedBy1Id = res.data.technicalApprovedBy1Id;
          this.technicalAcceptanceData.technicalApprovedBy2 = res.data.technicalApprovedBy2;
          this.technicalAcceptanceData.technicalApprovedBy2Id = res.data.technicalApprovedBy2Id;
          this.technicalAcceptanceData.certificateNumber = res.data.certificateNumber;
          this.technicalAcceptanceData.statusValue = res.data.statusValue;

          this.finalAcceptanceData.id = id;
          this.finalAcceptanceData.assetDeliveryId = res.data.assetDeliveryId;
          this.finalAcceptanceData.validatedBy = res.data.validatedBy,
          this.finalAcceptanceData.validatedById = res.data.validatedById,
          this.finalAcceptanceData.validatedDate = res.data.validatedDate,
          this.finalAcceptanceData.finalApprovedBy = res.data.finalApprovedBy,
          this.finalAcceptanceData.finalApprovedById = res.data.finalApprovedById,
          this.finalAcceptanceData.approvedDate = res.data.approvedDate,
          this.finalAcceptanceData.acceptanceDate = res.data.acceptanceDate,
          this.finalAcceptanceData.invoiceNumber = res.data.invoiceNumber,
          this.finalAcceptanceData.invoiceAmount = res.data.invoiceAmount,
          this.finalAcceptanceData.invoiceDate = res.data.invoiceDate,
          this.finalAcceptanceData.deliveryAmount = res.data.deliveryAmount,
          this.finalAcceptanceData.invoiceRemarks = res.data.invoiceRemarks,
          this.finalAcceptanceData.statusValue = res.data.statusValue;
          this.finalAcceptanceData.lines = res.data.lines;
        }

      })
  }

  cancelDelivery(){
    this.assetdeliveryService.cancelDelivery(this.deliveryId).subscribe(res=>
      {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess==true)
        {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000, });
          this.getDeliveryNumbers();
        }
        else
        {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
        }
      })
  }

  viewHistory(id:any){

    this.assetdeliveryService.GetDeliverYHistory(id).subscribe(res=>{
      this.showDialogHistory=true;
      this.viewHistories=res.data;
    })
  }

  UpdateDeliveryStatus(){
    var statusValue=1;
    if (this.statusValue==1)
    {
      statusValue=2
    }
    else if (this.statusValue==2)
    {
      statusValue=3
    }
    else if (this.statusValue==3)
    {
      statusValue=4
    }
    else if (this.statusValue==4)
    {
      statusValue=5
    }
    else if (this.statusValue==5)
    {
      statusValue=6
    }
    else if (this.statusValue==6)
    {
      statusValue=7
    }

    this.assetdeliveryService.UpdateDeliveryStatus(this.deliveryId,statusValue).subscribe(res=>
      {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess==true)
        {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000, });
          this.getDeliveryNumbers();
        }
        else
        {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
        }
      })
  }

  viewRegistryFiles(id:any){
    this.assetdeliveryService.getRegistryFiles(id).subscribe(res=>{
      this.showDialogRegistryFiles=true;
      this.registryFiles = res.data;
    })
  }

  closeRegistryFilesModel(){
    this.showDialogRegistryFiles=false;
  }
}
