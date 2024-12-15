import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, Message, MessageService } from 'primeng/api';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { PurchaseOrderModel } from 'src/app/data/models/purchaseorder-model';
import { AssetsService } from 'src/app/data/service/assets.service';
import { PurchaseOrderService } from 'src/app/data/service/purchase-order.service';
import { QuotationService } from 'src/app/data/service/quotaion.service';
import { WorkOrderService } from 'src/app/data/service/work-order.service';
import validateForm from 'src/app/shared/helpers/validateForm'; */
import { PartCatalogService } from '../../../store/partcatalog/part-catalog.service';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import { PurchaseOrderModel } from '../../../models/purchaseorder-model';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { QuotationService } from '../../../services/quotaion.service';
import { AssetsService } from '../../../services/assets.service';
import { WorkOrderService } from '../../../services/work-order.service';
import validateForm from '../../../shared/helpers/validateForm';
import { Lookup } from '../../../shared/enums/lookup';
/* import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */
type Tabs = 'BasicInformation' | 'MaintenanceInformation';
@Component({
  selector: 'app-purchase-order-management',
  templateUrl: './purchase-order-management.component.html',
  styleUrls: ['./purchase-order-management.component.scss']
})
export class PurchaseOrderManagementComponent implements OnChanges {

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Input('indexs') indexs: number = 0;
  @Input('queryData') queryData: any = [];
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  linkDialog: boolean = false;
  transactionHistory!: TransactionHistory
  purchaseOrderForm !: FormGroup;
  purchaseOrderModel: PurchaseOrderModel = new PurchaseOrderModel();
  msgs!: Message[];
  items!: MenuItem[];
  tabIndex: number = 0;
  sparePart! : FormGroup;
  uploadedFiles: any[] = [];
    //Dropdown Lists
    posparePartList:any;
    sparePartList:[]=[];
    assetSerialNumbers :[] = [];
    assetStatus:[]=[];
    callLastSituation :[]=[];
    Status:[]=[];
    PartStatus:[]=[];
    currency :[] = [];
    reasons :[] = [];
    componentToBeFixeds:[]=[];
    activeTab: Tabs = 'BasicInformation';

  attachments: any;
  fileList:[]=[];
  assetSerialNumberList: [] = [];
  SiteList: [] = [];
  sparePartAutoComplete: [] = [];
  fileName = '';
  purchaseOrderSparePartsForm!: FormGroup;
  id: any;
  quotationId: any;
  callRequestId:any;
  siteId: any;
  typeScreen: string = 'Add';
  assginedEmployeeId: any;
  createdOn!: any;
  modifiedOn!: any;
  fromDate!: any;
  toDate!: any;
  ParentWOId:any;
  steps:any[]=[];
  isPR:string='PR';
  assetId:number = 0;
  constructor(private activatedRoute: ActivatedRoute,
    private route:Router,
    private formbuilder: FormBuilder,
    private partCatalogService : PartCatalogService,
    private poService: PurchaseOrderService,
    private quotationService: QuotationService,
    private messageService: MessageService,
    private assetService: AssetsService,
    private confirmationService: ConfirmationService,
    private workOrdersService:WorkOrderService) { }


    ngOnChanges(changes: SimpleChanges): void {
       this.Init();
    }

    close_modal() {
      this.openModals.emit(false);
    }

     Init(): void {
      /* this.activatedRoute.queryParams.subscribe(params => {
        this.id = params['id'];
        this.quotationId = params['quotationId'];
        this.ParentWOId = params['ParentWOId'];
        this.isPR= params['isPR'];
      }); */

      this.id = this.edit_asset_id;
      if(this.queryData) {
        this.id = this.queryData['id'];
        this.quotationId = this.queryData['quotationId'];
        this.ParentWOId = this.queryData['ParentWOId'];
        this.isPR= this.queryData['isPR']; 
      }

      this.purchaseOrderForm = this.buildForm(this.formbuilder);

      if (!(this.id == undefined || this.id==0))
      {
        this.GetLookupCallLastSituationBasedOnCase(this.ParentWOId,false,this.id,this.isPR);
      }
      else
      {
        this.GetLookupCallLastSituationBasedOnCase(this.ParentWOId,true,0,this.isPR);
      }


      this.workOrdersService.getStepsWorkOrder(this.ParentWOId).subscribe(res1 => {
          if (res1.isSuccess)
          {
            this.steps=res1.data;
          }
      })
      /* this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      }); */
      this.items = [
        { label: 'Home', routerLink: ['/']}
      ];

      this.getCurrency();
      this.getAssetStatus();
      this.getStatus();
      this.getPartStatus();
      this.getReasons();
      this.getcomponentToBeFixed();
      if (this.id == undefined || this.id == 0) {
        this.typeScreen = 'Add';
        this.getQuotaionInfo(this.quotationId == undefined ? 0 : this.quotationId);
      }
      else {
        if (this.route.url.includes('view')) {
          this.typeScreen = 'View'
          this.purchaseOrderForm.disable();
          this.getPurchaseOrder(this.id);
        }
        else {
          this.typeScreen = 'Edit'
          this.getPurchaseOrder(this.id);
        }
      }

    }

    GetLookupCallLastSituationBasedOnCase(parentWOId:any,isAdd:any,id:number,typeTransaction:string){
      this.workOrdersService.GetLookupCallLastSituationBasedOnCase(parentWOId,isAdd,id,typeTransaction).subscribe((res: any) => {
        this.callLastSituation = res.data
      });
    }

    getQuotaionInfo(quotaionId: number) {
      if(quotaionId) {
        this.quotationService.getQuotation(quotaionId).subscribe((res) => {
          if (res.data == null) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'work order does not exist',
              life: 3000,
            });
            setTimeout(() => {
              this.route.navigate(['maintenance/purchase-order']);
            }, 3000);
          }
          else {

            this.purchaseOrderForm.patchValue({ quotationNo: res.data.quotationNo });
            this.purchaseOrderForm.patchValue({ quotationId: res.data.id });
            this.purchaseOrderForm.patchValue({ callNo: res.data.callNo });
            this.purchaseOrderForm.patchValue({ callRequestId: res.data.callRequestId });
            this.purchaseOrderForm.patchValue({ assetId: res.data.assetId });
            this.purchaseOrderForm.patchValue({ assetNo: res.data.assetSerialNo });
            this.purchaseOrderForm.patchValue({ assetNumber: res.data.assetNumber });
            this.purchaseOrderForm.patchValue({ assetName: res.data.assetName });
            this.assetId=res.data.assetId;
            this.workOrdersService.lastTransaction(this.ParentWOId).subscribe(last=>{
              if (last.data.previousType == 'W')
              {
                this.workOrdersService.getWorkOrder(last.data.previousId).subscribe(w=>{
                  this.setExistingSparePartsFromWO(w.data.sparePartsWorkOrders,res.data.quotationSpareParts);
                })
              }
              else if (last.data.previousType == 'PR')
              {
                this.poService.getPurcahseOrder(last.data.previousId).subscribe(w=>{
                  this.setExistingSparePartsFromPR(w.data.purchaseOrderSpareParts);
                })
              }
              else
              {
                this.setExistingSpareParts(res.data.quotationSpareParts);
              }
            })

          }

        });
       }
    }

    purchaseOrderSpareParts() {
      return (<FormArray>this.purchaseOrderForm.get('purchaseOrderSpareParts')).controls;
    }

    removeSparePart(index: number) {
      (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).removeAt(index);
    }

    addMoreSparePart() {
      (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).push(
        this.formbuilder.group({
          partId: '',
          partNo: '',
          description: '',
          quantityRequested: '',
          quantityRecieved: '',
          unitPrice:'',
          discount: '',
          currencyId: '',
          partStatusId:'',
          purchaseOrderId:0,
        })
      );
    }

    setActiveTab(tab: Tabs) {
      this.activeTab = tab;
    }

    removeControl(controlName: string,index: number) {
      (this.purchaseOrderForm.get(controlName) as FormArray).removeAt( index );
    }

    getControls(controlName: string) {
      return (<FormArray>this.purchaseOrderForm.get(controlName)).controls;
    }
   // #endregion
    onUpload(event: any) {
      for (let file of event.files) {
        this.uploadedFiles.push(file);
      }

      this.messageService.add({ severity: 'success', summary: 'File Upload', detail: 'File Uploaded Successfully ! ' });
    }

    setExistingSpareParts(purchaseOrderSpareParts: any[]) {
      if (purchaseOrderSpareParts.length==0)
      {
          (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).push(
            this.formbuilder.group({
              id:0,
              partId: null,
              partNo: null,
              description: null,
              quantityRequested: 0,
              quantityRecieved: 0,
              unitPrice:0,
              discount: 0,
              currencyId: 0,
              partStatusId:0,
              purchaseOrderId:0,
            })
            );

      }
      else
      {
        purchaseOrderSpareParts.forEach((p, index) => {
          (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).push(
            this.formbuilder.group({
              id:0,
              partId: p.partId,
              partNo: p.partNo,
              description: p.description,
              quantityRequested: p.quantity,
              quantityRecieved: 0,
              unitPrice:p.unitPrice,
              discount: p.discount,
              currencyId: 0,
              partStatusId:0,
              purchaseOrderId:0,
            })
            );
            (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).at(index).get('partId')?.setValue({partNo: p.partNo,id: p.partId})
        });
      }


    }

    setExistingSparePartsFromWO(purchaseOrderSpareParts: any[],quotationSparePartQuotation:any[]) {
      if (purchaseOrderSpareParts.length==0)
      {
          (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).push(
            this.formbuilder.group({
              id:0,
              partId: null,
              partNo: null,
              description: null,
              quantityRequested: 0,
              quantityRecieved: 0,
              unitPrice:0,
              discount: 0,
              currencyId: 0,
              partStatusId:0,
              purchaseOrderId:0,
            })
            );

      }
      else
      {
        purchaseOrderSpareParts.forEach((p, index) => {
          var valuefromQuotation = quotationSparePartQuotation.filter(x=>x.partId==p.sparePart.id);
          (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).push(
            this.formbuilder.group({
              id:0,
              partId: p.sparePart.partId,
              partNo: p.sparePart.partNo,
              description: p.sparePart.partName,
              quantityRequested: p.qty,
              quantityRecieved: 0,
              unitPrice:valuefromQuotation.length >0 ? valuefromQuotation[0].unitPrice : 0,
              discount: valuefromQuotation.length >0 ? valuefromQuotation[0].discount : 0,
              currencyId: 0,
              partStatusId:0,
              purchaseOrderId:0,
            })
            );
            (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).at(index).get('partId')?.setValue({partNo: p.sparePart.partNo,id: p.sparePart.id})
        });
      }


    }

    setExistingSparePartsFromPR(purchaseOrderSpareParts: any[]) {
      if (purchaseOrderSpareParts.length==0)
      {
        (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).push(
          this.formbuilder.group({
            id:0,
            partId: null,
            partNo: null,
            description: null,
            quantityRequested: 0,
            quantityRecieved: 0,
            unitPrice:0,
            discount: 0,
            currencyId: null,
            partStatusId:null,
            purchaseOrderId:null,
          })
          );
      }
      else
      {
        purchaseOrderSpareParts.forEach((p, index) => {
          (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).push(
            this.formbuilder.group({
              id:0,
              partId: p.partId,
              partNo: p.partNo,
              description: p.partName,
              quantityRequested: p.quantityRequested,
              quantityRecieved: p.quantityRecieved,
              unitPrice:p.unitPrice,
              discount: p.discount,
              currencyId: p.currencyId,
              partStatusId:p.partStatusId,
              purchaseOrderId:p.purchaseOrderId,
            })
            );
            (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).at(index).get('partId')?.setValue({partNo: p.partNo,id: p.partId})
        });
      }


    }

    onSelectSparePart(event: any) {
      var dto = {
        id: 0,
        partNo: event.query,
        partName: '',
        AssetId: this.assetId
      }

      this.partCatalogService.GetPartAutoComplete(dto).subscribe((data) => {
        this.sparePartAutoComplete = data.data;
      });
    }

    bindSparePart(event: any, index: number) {
      let isExists:boolean=false;
      (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).controls.forEach((element,i) => {
        if (element.value.partId?.id==event.id && i!=index)
        {
          (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).at(index).get('description')?.setValue('');
          (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).at(index).get('partId')?.setValue('')
          isExists=true;
        }
      });
      if (isExists==false)
      {
        (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).at(index).get('description')?.setValue(event.partName);
        (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).at(index).get('partId')?.setValue({partNo:event.partNo,id:event.id})
      }

    }
    clearSparePart(index: number) {
      (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).at(index).get('partId')?.setValue(0);
    }

    save() {
      if (this.purchaseOrderForm.invalid) {
        validateForm.validateAllFormFields(this.purchaseOrderForm);
        this.purchaseOrderForm.markAllAsTouched();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
      }
      else {
        let finalData: any = this.getPurchaseOrderModel(this.purchaseOrderForm.value);
        finalData.isPR=this.isPR=='PR'? true:false;
        finalData.quotationId =  this.quotationId;
        finalData.ParentWOId=this.ParentWOId;
        if (this.id == undefined || this.id == 0) {
          this.poService.addPurcahseOrder(finalData).subscribe(res => {
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });
              this.Init();
              this.close_modal();
             // this.route.navigate(['maintenance/purchase-order']);
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
        else {
          finalData.quotationId =  this.purchaseOrderForm.value.quotationId;
          this.poService.updatePurcahseOrder(finalData).subscribe(res => {
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });
              this.route.navigate(['maintenance/purchase-order']);
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
    }

    getPurchaseOrder(quotationId: number) {
      this.poService.getPurcahseOrder(quotationId).subscribe(res => {
        if (res.isSuccess) {
          const data = res.data;
          this.transactionHistory=new TransactionHistory();
          Object.assign( this.transactionHistory,res.data);

          this.isPR= data.isPR==true? 'PR':'PO';
          this.purchaseOrderForm.patchValue(data);
          this.createdOn = data.createdOn;
          this.modifiedOn = data.modifiedOn;
          this.assetId = data.assetId;
          this.purchaseOrderForm.patchValue({
            purchaseOrderDate: new Date(res.data.purchaseOrderDate),
            deadlineDate: res.data.deadlineDate != null ? new Date(res.data.deadlineDate) : null,
            dismissalNoticeDate:res.data.dismissalNoticeDate != null ? new Date(res.data.dismissalNoticeDate) : null ,
            endOfWorkDate: res.data.endOfWorkDate != null ? new Date(res.data.endOfWorkDate) : null ,
            endOfWorkTime: res.data.endOfWorkTime != null ? new Date(res.data.endOfWorkTime) : null ,

          });
          this.purchaseOrderForm.get('siteId')?.setValue({id: res.data.siteId,custName: res.data.siteName})
          //  purchaseOrderSpareParts
          let purchaseOrderSpareParts: any[] = [];
          purchaseOrderSpareParts = res.data.purchaseOrderSpareParts;
          if (purchaseOrderSpareParts.length==0)
          {
              (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).push(
                this.formbuilder.group({
                  id: null,
                  partId: null,
                  partNo: null,
                  description:null,
                  quantityRequested:null,
                  quantityRecieved:null,
                  unitPrice:null,
                  discount: null,
                  currencyId: null,
                  partStatusId:null,
                  purchaseOrderId:null,
                })
              );

          }
          else
          {
            purchaseOrderSpareParts.forEach((p, index) => {
              (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).push(
                this.formbuilder.group({
                  id: p.id,
                  partId: p.partId,
                  partNo: p.partNo,
                  description:p.description,
                  quantityRequested:p.quantityRequested,
                  quantityRecieved:p.quantityRecieved,
                  unitPrice:p.unitPrice,
                  discount: p.discount,
                  currencyId: p.currencyId,
                  partStatusId:p.partStatusId,
                  purchaseOrderId:p.purchaseOrderId,
                })
              );
              (this.purchaseOrderForm.get('purchaseOrderSpareParts') as FormArray).at(index).get('partId')?.setValue({partNo: p.partNo,id: p.partId})
            });
          }

          this.purchaseOrderForm.patchValue({
            startofWorkTime: res.data.startofWorkTime != null ? new Date(res.data.startofWorkTime) : null ,
            endofWorkNewTime: res.data.endofWorkNewTime != null ? new Date(res.data.endofWorkNewTime) : null ,
          })

        }

      })
    }

    delete() {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this Purchase Order?',
        header: 'Confirm',
        rejectButtonStyleClass: 'p-button-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.poService.deletePurcahseOrder(this.id).subscribe((res) => {
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              this.route.navigate(['maintenance/purchase-order']);
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });
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

    selectQuotationDate() {
      this.purchaseOrderForm.controls['quotationDate'].setValue(this.purchaseOrderForm.value.quotationDate);
    }

    getPurchaseOrderModel(formValue:any) {
      let model = {...formValue };
      model.purchaseOrderSpareParts =[];
      let spares:any[]= formValue.purchaseOrderSpareParts;
      spares.forEach(y=>
        {
          if (y.partId != null && y.partId.id != null && y.partId.id != undefined && y.partId.id != 0)
          {
            let item={
              id:y.id == undefined?0:y.id,
              partId:y.partId.id,
              currencyId:y.currencyId ==0 ? null: y.currencyId,
              description:y.description==null?"":y.description,
              discount:y.discount=="" || y.discount==null ?0:y.discount,
              partStatusId:y.partStatusId==0 ? null: y.partStatusId,
              purchaseOrderId:y.purchaseOrderId,
              quantityRecieved:y.quantityRequested=="" || y.quantityRequested==null ?0:y.quantityRequested,//y.quantityRecieved=="" || y.quantityRecieved==null ?0:y.quantityRecieved,
              quantityRequested:y.quantityRequested=="" || y.quantityRequested==null ?0:y.quantityRequested,
              unitPrice:y.unitPrice=="" || y.unitPrice==null ?0:y.unitPrice,

            }
            model.purchaseOrderSpareParts.push(item);
          }

        })
      // model.purchaseOrderSpareParts = this.cloneAndChangeProp(formValue.purchaseOrderSpareParts, (n, o) => {
      //   // if (Object.keys(o.purchaseOrderSpareParts).length > 0)
      //   if (o.id == '')
      //   n.id = 0;
      //   n.partId = o.partId.id

      // });
      return model;
    }

    cloneAndChangeProp(arr:any[], act: (n: any, old:any) => any) {
      return arr.map(a => {
        let newInst = { ...a };
        act(newInst, a);
        return newInst;
      });
    }

    buildSparepart(formbuilder: FormBuilder) {
      return formbuilder.group({
        id: 0,
        partId: [''],
        partNo: [''],
        description: [''],
        quantityRequested: 0,
        quantityRecieved: 0,
        unitPrice:0,
        discount: 0,
        currencyId: 0,
        partStatusId:0,
        purchaseOrderId:0,
      });
    }

    buildAttachment(formbuilder: FormBuilder) {
      return formbuilder.group({
        id: 0,
        attachmentName: 0,
        quotationId:0,
      });
    }

      buildForm(formbuilder: FormBuilder) {
      return formbuilder.group({
        id:0,
        purchaseOrderNo:[null],
        purchaseOrderYear: 0,
        purchaseOrderSequennce: 0,
        callRequestId:[null],
        callNo: [null],
        assetId: [null],
        assetNo:[null],
        assetNumber:[null],
        assetName:[null],
        quotationId: [null],
        quotationNo: [null],
        purchaseOrderDate:[null, Validators.required],
        purchaseOrderDateText:[null],
        importCodeNo: [null,Validators.required],
        callLastSituationId: [null, Validators.required],
        callLastSituationName: [null],
        assetStatusId: [null],
        assetStatusName:[null],
        deadlineDate: [null],
        deadlineDateText: [null],
        externalPONo:[null],
        dismissalNoticeDate: [null],
        dismissalNoticeDateText: [null],
        statusId: [null],
        statusName:[null],
        createdOn:[null],
        modifiedOn:[null],
        reasonId: [null],
        reasonName:[null],
        workPerformed: [null],
        componentToBeFixedId: [null],
        componentToBeFixedName: [null],
        sparePartsNeeded: [null],
        comment: [null],
        startofWorkTime:[null],
        endofWorkNewTime:[null],
        purchaseOrderAttachments:[null],
        purchaseOrderSpareParts: formbuilder.array([])
      });

    }



    //#region ON Change
       changeGuotationTypes(event: any) {
        this.purchaseOrderForm.value.QuotationTypeId = event.value;
      }
      changeQuotationOfferType(event: any) {
        this.purchaseOrderForm.value.OfferTypeId = event.value;
      }
      changeCurrency(event: any) {
        this.purchaseOrderForm.value.CurrencyId = event.value;
      }
      changeCallLastSituation(event: any) {
        this.purchaseOrderForm.value.CallLastSituationId = event.value;
      }

      changeQuotationStatus(event: any) {
        this.purchaseOrderForm.value.StatusId = event.value;
      }
      changeRelatedEmployee(event: any) {
        this.purchaseOrderForm.value.RelatedEmployeeId = event.value;
      }

      onMapItemsToPrintChange(event: any) {
        this.purchaseOrderForm.value.MapItemsToPrint = event.target.checked;
        // perform some action when the checkbox state changes
      }

      handleFileInput(files: any) {
        // this.fileList = files.currentFiles[0];
        // console.log('this.fileList', this.fileList);
        // this.poService.uploadFiles(this.fileList).subscribe((res) => {
        //   const data = res.data;
        //   this.attachmentForm.value.attachmentName = data[0];
        //   console.log(
        //     'this.attachmentForm.value.attachmentName',
        //     this.attachmentForm.value.attachmentName
        //   );
        //   const sucess = res.isSuccess;
        //   const message = res.message;
        //   if (sucess == true) {
        //     this.messageService.add({
        //       severity: 'success',
        //       summary: 'Successful',
        //       detail: message,
        //       life: 3000,
        //     });
        //   } else {
        //     this.messageService.add({
        //       severity: 'error',
        //       summary: 'Error',
        //       detail: message,
        //       life: 3000,
        //     });
        //   }
        // });
      }

      //#endregion


    // #region DROP
    getcomponentToBeFixed(){ this.poService.getLookups({ queryParams: Lookup.POComponentToBeFixed }).subscribe(res=>this.componentToBeFixeds = res.data)}
   changecomponentToBeFixed(event:any){
     this.purchaseOrderForm.value.componentToBeFixedId=event.value;
   }
   getReasons(){
     this.poService.getLookups({ queryParams: Lookup.POReasons }).subscribe(res=>this.reasons = res.data)
   }
   changeReason(event:any){
     this.purchaseOrderForm.value.reasonId=event.value;
   }
   getPartStatus(){
     this.poService.getLookups({ queryParams: Lookup.POPartStatus }).subscribe(res=>this.PartStatus = res.data)
   }
   changepartStatus(event:any){
     this.purchaseOrderForm.value.partStatusId=event.value;
   }
   getCurrency(){
     this.poService.getLookups({ queryParams: Lookup.Currency }).subscribe(res=>this.currency = res.data)
   }

   getAssetStatus(){
     this.poService.getLookups({ queryParams: Lookup.POAssetStatut }).subscribe(res=> this.assetStatus = res.data )
   }
   changeAssetStatus(event:any){
     this.purchaseOrderForm.value.assetStatusId=event.value;
   }


   getStatus(){
     this.poService.getLookups({ queryParams: Lookup.POStatus }).subscribe(res=> this.Status = res.data )
   }
   changeStatus(event:any){
     this.purchaseOrderForm.value.statusId=event.value;
   }
   searchAssetBySN(event: any) {
     this.assetService.GetAssetsAutoCompleteMultiFilter(<any>{ AssetSerialNumber: event.query }).subscribe((res) => {
       this.assetSerialNumbers = res.data;
     });
   }
    // #endregion
    navigate(){
      this.route.navigate(['/general-reports/invoice-report/invoice-in-po-management'], { queryParams: { poId: this.id } });
    }

    clickStep(step:any)
  {
    if (step.typeTransaction=="W")
    {
      if (step.processed==false)
      {
        if (step.parentWOId==null)
        {
          this.route.navigate(['/maintenance/work-orders/add-control'], { queryParams: { callId: step.callId } });
        }
        else
        {
          this.route.navigate(['/maintenance/work-orders/add-control'], { queryParams: { callId: step.callId,ParentWOId: step.parentWOId } });
        }

      }
      else
      {
        let perantId=step.parentWOId==null?step.id:step.parentWOId;
        this.workOrdersService.GetPreviousAndNextStepById("W",step.id,perantId).subscribe(res=>{
          if (res.isSuccess)
          {
            if (res.data.nextId != null)
            {
              if (res.data.previousId == null)
              {
                this.route.navigate(['/maintenance/work-orders/view-control'], { queryParams: { id: step.id,callId:step.callId } });
              }
              else
              {
                this.route.navigate(['/maintenance/work-orders/view-control'], { queryParams: { id: step.id,ParentWOId: step.parentWOId,callId:step.callId } });
              }
            }
            else
            {
              if (res.data.previousId == null)
              {
                this.route.navigate(['/maintenance/work-orders/edit-control'], { queryParams: { id: step.id,callId:step.callId } });
              }
              else
              {
                this.route.navigate(['/maintenance/work-orders/edit-control'], { queryParams: { id: step.id,ParentWOId: step.parentWOId,callId:step.callId } });
              }
            }
          }
        })
      }

    }
    if (step.typeTransaction=="Q")
    {
      if (step.processed==false)
      {

        this.workOrdersService.lastTransaction(step.parentWOId).subscribe(last=>{
          if (last.isSuccess)
          {
            this.route.navigate(['/maintenance/quotations/add-control'], { queryParams: { workerorderId: last.data.previousId,ParentWOId: step.parentWOId } });
          }
        })

      }
      else
      {
        this.workOrdersService.GetPreviousAndNextStepById("Q",step.id,step.parentWOId).subscribe(res=>{
          if (res.isSuccess)
          {
            if (res.data.nextId != null)
            {
              this.route.navigate(['/maintenance/quotations/view-control'], { queryParams: { id:step.id, workerorderId: res.data.previousId,ParentWOId: step.parentWOId } });
            }
            else
            {
                this.route.navigate(['/maintenance/quotations/edit-control'], { queryParams: { id:step.id, workerorderId: res.data.previousId,ParentWOId: step.parentWOId } });
            }
          }
        })
      }

    }
    if (step.typeTransaction=="PR")
    {
      if (step.processed==false)
      {

        this.workOrdersService.lastTransaction(step.parentWOId).subscribe(last=>{
          if (last.isSuccess)
          {
            this.route.navigate(['/maintenance/purchase-order/add-control'], { queryParams: { quotationId: last.data.previousId,ParentWOId: step.parentWOId,isPR:'PR' } });
          }
        })

      }
      else
      {
        this.workOrdersService.GetPreviousAndNextStepById("PR",step.id,step.parentWOId).subscribe(res=>{
          if (res.isSuccess)
          {
            if (res.data.nextId != null)
            {
              this.route.navigate(['/maintenance/purchase-order/view-control'], { queryParams: { id:step.id, quotationId: res.data.previousId,ParentWOId: step.parentWOId ,isPR:'PR'} });
            }
            else
            {
                this.route.navigate(['/maintenance/purchase-order/edit-control'], { queryParams: { id:step.id, quotationId: res.data.previousId,ParentWOId: step.parentWOId,isPR:'PR' } });
            }
          }
        })
      }
    }
    if (step.typeTransaction=="PO")
    {
      if (step.processed==false)
      {

        this.workOrdersService.lastTransaction(step.parentWOId).subscribe(last=>{
          if (last.isSuccess)
          {
            this.route.navigate(['/maintenance/purchase-order/add-control'], { queryParams: { quotationId: last.data.previousId,ParentWOId: step.parentWOId,isPR:'PO' } });
          }
        })

      }
      else
      {
        this.workOrdersService.GetPreviousAndNextStepById("PO",step.id,step.parentWOId).subscribe(res=>{
          if (res.isSuccess)
          {
            if (res.data.nextId != null)
            {
              this.route.navigate(['/maintenance/purchase-order/view-control'], { queryParams: { id:step.id, quotationId: res.data.previousId,ParentWOId: step.parentWOId,isPR:'PO' } });
            }
            else
            {
                this.route.navigate(['/maintenance/purchase-order/edit-control'], { queryParams: { id:step.id, quotationId: res.data.previousId,ParentWOId: step.parentWOId,isPR:'PO' } });
            }
          }
        })
      }
    }
    if (step.typeTransaction=="PD")
    {
      if (step.processed==false)
      {

        this.workOrdersService.lastTransaction(step.parentWOId).subscribe(last=>{
          if (last.isSuccess)
          {
            if (last.typeTransaction=='PO')
            {
              this.route.navigate(['/store/part-delivery/add-part-delivery'], { queryParams: { poId: last.data.previousId,ParentWOId: step.parentWOId } });
            }
            else
            {
              this.route.navigate(['/store/part-delivery/add-part-delivery'], { queryParams: { workOrderId: last.data.previousId,ParentWOId: step.parentWOId } });
            }
          }
        })

      }
      else
      {
        this.workOrdersService.GetPreviousAndNextStepById("PD",step.id,step.parentWOId).subscribe(res=>{
          if (res.isSuccess)
          {
            if (res.data.nextId != null)
            {
              if (res.data.previousType=='PO')
              {
                this.route.navigate(['store/partDelivery/edit-control'], { queryParams: { data: step.id, index : 0,poId: res.data.previousId,ParentWOId: step.parentWOId  } });
              }
              else
              {
                this.route.navigate(['store/partDelivery/edit-control'], { queryParams: { data: step.id, index : 0,workOrderId: res.data.previousId,ParentWOId: step.parentWOId  } });
              }

            }
            else
            {
              if (res.data.previousType=='PO')
              {
                this.route.navigate(['store/partDelivery/edit-control'], { queryParams: { data: step.id, index : 1,poId: res.data.previousId,ParentWOId: step.parentWOId  } });
              }
              else
              {
                this.route.navigate(['store/partDelivery/edit-control'], { queryParams: { data: step.id, index : 1,workOrderId: res.data.previousId,ParentWOId: step.parentWOId  } });
              }
            }
          }
        })
      }

    }

  }
}
