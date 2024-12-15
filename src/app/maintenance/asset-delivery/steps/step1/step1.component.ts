import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
/* import { Subscription } from 'rxjs';
import { AssetDeliveryService } from 'src/app/data/service/asset-delivery.service';
import { ICreateAccount } from 'src/app/modules/wizards/create-account.helper';
import { TechnicalInspectionModalComponent } from '../../technical-assistance-modal/technical-inspection-modal.component';
import { CostCenterModalComponent } from '../../cost-center-modal/cost-center-modal.component'; */
/* import { Lookup } from 'src/app/data/Enum/lookup'; */
/* import { DeliveryHistoryModel, IAssetDelivery } from 'src/app/data/models/asset-delivery-model';
import validateForm from 'src/app/shared/helpers/validateForm'; */
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { AssetDeliveryService } from '../../../../services/asset-delivery.service';
import { Lookup } from '../../../../shared/enums/lookup';
import validateForm from '../../../../shared/helpers/validateForm';

@Component({ selector: 'app-step1', templateUrl: './step1.component.html', })
export class Step1Component implements OnInit {
    @Input() deliveryInspactionData:any={};
    @Output() sendContinueCurrentPage = new EventEmitter<any>();
    form!:FormGroup;
    deliveryTypelist:any[]=[];
    disablePayment:string="true";
    hideContinue:boolean=true;
    constructor(private formbuilder: FormBuilder,
     private modalService: NgbModal,
     private assetdeliveryService: AssetDeliveryService,
     private messageService: MessageService,
     private router: Router,
     private confirmationService: ConfirmationService,) { }
  ngOnInit() {
     this.form = this.formbuilder.group({
      inspectionDate: [null,Validators.required],
      inspectionBy: [null,Validators.required],
      inspectionById: [null],
      deliveryApprovedBy:  [null,Validators.required],
      deliveryApprovedById:  [null],
      deliveryTypeId:  [null,Validators.required],
      paymentTerms:  [null],
     })
        this.getData();
  }

  public getData(){
      this.getLookup();
       if (this.deliveryInspactionData.statusValue>1)
       {
        this.hideContinue = false;
       }
       else{
        this.hideContinue = true;
       }

      if (this.deliveryInspactionData.inspectionDate)
         this.form.controls['inspectionDate'].setValue(new Date(this.deliveryInspactionData.inspectionDate))
      else
         this.form.controls['inspectionDate'].setValue(null)
      if (this.deliveryInspactionData.inspectionBy)
          this.form.controls['inspectionBy'].setValue(this.deliveryInspactionData.inspectionBy);
      else
          this.form.controls['inspectionBy'].setValue(null);
      if (this.deliveryInspactionData.inspectionById)
          this.form.controls['inspectionById'].setValue(this.deliveryInspactionData.inspectionById);
      else
          this.form.controls['inspectionById'].setValue(null);
      if (this.deliveryInspactionData.deliveryApprovedBy)
          this.form.controls['deliveryApprovedBy'].setValue(this.deliveryInspactionData.deliveryApprovedBy);
      else
          this.form.controls['deliveryApprovedBy'].setValue(null);
      if (this.deliveryInspactionData.deliveryApprovedById)
          this.form.controls['deliveryApprovedById'].setValue(this.deliveryInspactionData.deliveryApprovedById);
      else
          this.form.controls['deliveryApprovedById'].setValue(null);
      if (this.deliveryInspactionData.deliveryTypeId)
          this.form.controls['deliveryTypeId'].setValue(this.deliveryInspactionData.deliveryTypeId);
      else
          this.form.controls['deliveryTypeId'].setValue(null);
      if (this.deliveryInspactionData.paymentTerms)
          this.form.controls['paymentTerms'].setValue(this.deliveryInspactionData.paymentTerms);
      else
          this.form.controls['paymentTerms'].setValue(null);

  }

  getLookup(){
   var deliveryTypes = this.assetdeliveryService.getLookup(Lookup.DeliveryType).subscribe((res: any) => {
      this.deliveryTypelist = res.data
      if (this.deliveryInspactionData.deliveryTypeId)
      {
         this.changedeliveryType({id:this.deliveryInspactionData.deliveryTypeId});
         if (this.deliveryInspactionData.paymentTerms)
               this.form.controls['paymentTerms'].setValue(this.deliveryInspactionData.paymentTerms);
      }
    });
  }

  changedeliveryType(event:any)
  {
    var type = this.deliveryTypelist.filter(x=>x.id==event.value)[0];
    if (type?.value==2)
    {
      this.disablePayment="false";
    }
    else
    {
      this.disablePayment="true";
    }
    this.form.controls['paymentTerms'].setValue(null);
  }

  save(){
   if (this.form.invalid) {
      validateForm.validateAllFormFields(this.form);
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
    } else {
      var type = this.deliveryTypelist.filter(x=>x.id==this.form.value.deliveryTypeId)[0];
      if (type.value==2 && !this.form.value.paymentTerms)
      {
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Payment terms is required", life: 3000, });
         return;
      }
      let data={
         id:this.deliveryInspactionData.id,
         statusId:2
      };
      Object.assign(data,this.form.value);
      this.assetdeliveryService.updateDelivery(data).subscribe(res => {
         const message = res.message;
         const sucess = res.isSuccess;
         if (sucess == true) {
           this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000, });
           window.location.reload();
         } else {
           this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
         }

      });
    }

  }

  saveAndChangeStatus(){
   if (this.form.invalid) {
      validateForm.validateAllFormFields(this.form);
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
    }
    else
    {
      var type = this.deliveryTypelist.filter(x=>x.id==this.form.value.deliveryTypeId)[0];
      if (type.value==2 && !this.form.value.paymentTerms)
      {
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Payment terms is required", life: 3000, });
         return;
      }
      let data={
         id:this.deliveryInspactionData.id,
         statusId:2,
         changeStatus:true
      };
      Object.assign(data,this.form.value);
      this.assetdeliveryService.updateDelivery(data).subscribe(res => {
         const message = res.message;
         const sucess = res.isSuccess;
         if (sucess == true) {
           this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000, });
           window.location.reload();
         } else {
           this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
         }
      });
    }

  }

  continue()
  {
    this.sendContinueCurrentPage.emit(1);
  }

  openDialogEmployee(){

  }

  onApprovedBySelected(event:any){
    this.form.controls['deliveryApprovedBy'].setValue(event.rowData["Employee Name"]);
    this.form.controls['deliveryApprovedById'].setValue(event.rowData["Employee Number"]);
  }

  onInspectionBySelected(event:any){
    this.form.controls['inspectionBy'].setValue(event.rowData["Employee Name"]);
    this.form.controls['inspectionById'].setValue(event.rowData["Employee Number"]);
  }
}
