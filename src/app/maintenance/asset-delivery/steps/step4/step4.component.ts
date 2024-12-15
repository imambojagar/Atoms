import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AssetDeliveryService } from '../../../../services/asset-delivery.service';
import { Lookup } from '../../../../shared/enums/lookup';
import validateForm from '../../../../shared/helpers/validateForm';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { IAssetDelivery } from 'src/app/data/models/asset-delivery-model';
import { AssetDeliveryService } from 'src/app/data/service/asset-delivery.service';
import validateForm from 'src/app/shared/helpers/validateForm'; */

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
})
export class Step4Component implements OnInit, OnDestroy {
  form!: FormGroup;
  finalAcceptanceData:any={};
  hideContinue:boolean=false;
  isComplete:boolean=false;
  @Input() set finalAcceptanceInput(val: any) {
    this.finalAcceptanceData = val;
    if (val.statusValue > 6) {
      this.hideContinue = false;
    } else {
      this.hideContinue = true;
    }
    if (val.statusValue==7)
    {
      this.isComplete=true;
    }
    if (val.statusValue==8)
    {
      this.isCancel=true;
    }
  }

  @Output() sendBackCurrentPage = new EventEmitter<any>();
  deliveryId: any;
  deliveryStatus: any[] = [];
  employees: any[] = [];
  isCanceled: any = true;
  isCompleted: any = true;
  id: any;
  isCancel:boolean=false;
  private unsubscribe: Subscription[] = [];
  constructor(
    private _formbuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private assetDeliveryService: AssetDeliveryService
  ) {}

  ngOnInit() {

    this.initForm();
    this.getLookups();
    this.fillFinalAcceptanceData();
  }

  initForm() {
    this.form = this._formbuilder.group({
      invoiceNumber: [null,[Validators.required]],
      invoiceAmount: [null,[Validators.required]],
      invoiceDate: [null,[Validators.required]],
      deliveryAmount: [null],
      invoiceRemarks: [null],
      validatedBy: [null,[Validators.required]],
      validatedById: [null],
      validatedDate: [null,[Validators.required]],
      finalApprovedBy: [null,[Validators.required]],
      finalApprovedById: [null],
      approvedDate: [null,[Validators.required]],
      acceptanceDate: [null,[Validators.required]],
    });
  }

  getLookups() {
    var deliveryStatusSB = this.assetDeliveryService
      .getLookup(Lookup.DeliveryStatus)
      .subscribe((res: any) => {
        this.deliveryStatus = res.data;
        this.deliveryStatus.splice(0, 0, {
          id: 0,
          name: 'Select',
          value: null,
        });
        //this.checkStep();
        var cancelDelivery = this.deliveryStatus.filter(
          (x) => x.name == 'Cancel Delivery'
        )[0];
        var completeDelivery = this.deliveryStatus.filter(
          (x) => x.name == 'Complete Delivery'
        )[0];
        if (this.finalAcceptanceData.statusId == cancelDelivery.value) {
          this.isCanceled = false;
        }
        if (this.finalAcceptanceData.statusId == completeDelivery.value) {
          this.isCompleted = false;
        }
      });

      this.unsubscribe.push(deliveryStatusSB);
  }

  fillFinalAcceptanceData(){
    this.form.patchValue(this.finalAcceptanceData);
    this.form.patchValue({
      invoiceDate: this.finalAcceptanceData?.invoiceDate == null? null : new Date(this.finalAcceptanceData?.invoiceDate),
      validatedDate: this.finalAcceptanceData?.validatedDate == null ? null : new Date(this.finalAcceptanceData?.validatedDate),
      approvedDate: this.finalAcceptanceData?.approvedDate==null? null : new Date(this.finalAcceptanceData?.approvedDate),
      acceptanceDate: this.finalAcceptanceData?.acceptanceDate == null ? null : new Date(this.finalAcceptanceData?.acceptanceDate),
    })
  };

  save() {
    if (this.form.invalid) {
      validateForm.validateAllFormFields(this.form);
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      var finalAcceptance = this.deliveryStatus.filter(
        (x) => x.name == 'Final Acceptance'
      )[0];
      let data = {
        id: this.finalAcceptanceData.id,
        statusId: finalAcceptance.value,
        changeStatus: false
      };
      Object.assign(data, this.form.value);
      this.assetDeliveryService
        .updateDelivery(data)
        .subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            window.location.reload();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
        });
    }
  }

  saveAndChangeStatus() {
    if (this.form.invalid) {
      validateForm.validateAllFormFields(this.form);
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      var finalAcceptance = this.deliveryStatus.filter(
        (x) => x.name == 'Final Acceptance'
      )[0];
      let data = {
        id: this.finalAcceptanceData.id,
        statusId: finalAcceptance.value,
        changeStatus: true
      };
      Object.assign(data, this.form.value);
      this.assetDeliveryService
        .updateDelivery(data)
        .subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            window.location.reload();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
        });
    }
  }


  complete() {
    if (this.form.invalid) {
      validateForm.validateAllFormFields(this.form);
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {

      let data = {
        id: this.finalAcceptanceData.id,
        statusId: 7,
        changeStatus: true
      };
      Object.assign(data, this.form.value);
      this.assetDeliveryService
        .updateDelivery(data)
        .subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            window.location.reload();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
        });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  CompleteDelivery() {
    var currentStatus = this.deliveryStatus.filter(
      (x) => x.name == 'Complete Delivery'
    )[0];

    let data = {
      id: this.finalAcceptanceData.id,
      statusId: currentStatus.value,
      changeStatus: false
    };

    // ------------------------------------
    let total = 0;
    this.finalAcceptanceData.lines.forEach((p: any) => {
      total = total + p.deliveryReceived * p.price;
    });
    this.finalAcceptanceData.deliveryAmount = total;
    // ----------------------------------------
    if (
      this.finalAcceptanceData.deliveryAmount == this.finalAcceptanceData.invoiceAmount
    ) {
      this.updateCompleteDelivery(
        this.finalAcceptanceData,
        this.finalAcceptanceData.deliveryAmount
      );
      this.router.navigate(
        ['/maintenance/asset-delivery/management-asset-delivery'],
        { queryParams: { id: this.finalAcceptanceData.assetDeliveryId } }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Delivery Amount not equal  Invoice Amount',
        life: 3000,
      });
    }
  }

  CancelDelivery() {
    var currentStatus = this.deliveryStatus.filter(
      (x) => x.name == 'Cancel Delivery'
    )[0];
    let data = {
      id: this.finalAcceptanceData.id,
      statusId: currentStatus.value,
      changeStatus: false
    };

    Object.assign(data, this.finalAcceptanceData);
    this.updateDelivery(this.finalAcceptanceData);
  }

  updateCompleteDelivery(data: any, total: any) {
    this.assetDeliveryService.updateDelivery(data).subscribe((res) => {
      const message = res.message;
      const success = res.isSuccess;
      if (success == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.getAssetDelivery(this.finalAcceptanceData.assetDeliveryId, total);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }

  updateDelivery(data: any) {
    this.assetDeliveryService.updateDelivery(data).subscribe((res) => {
      const message = res.message;
      const success = res.isSuccess;
      if (success == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.router.navigate(
          ['/maintenance/asset-delivery/management-asset-delivery'],
          { queryParams: { id: this.finalAcceptanceData.assetDeliveryId } }
        );
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }

  getAssetDelivery(id: number, total: any) {
    this.assetDeliveryService.getAssetDelivery(id).subscribe((res) => {
      if (res.isSuccess) {
        const data = res.data;
        data.totalDeliveryAmount = data.totalDeliveryAmount + total;
        if (data.total == data.totalDeliveryAmount) {
          data.complete = true;
        }
        this.updateAssetDelivery(data);
      }
    });
  }

  updateAssetDelivery(data: any) {
    this.assetDeliveryService.updateAssetDelivery(data).subscribe((res) => {
      const message = res.message;
      const success = res.isSuccess;
      if (success == true) {
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
  }

  back() {
    this.sendBackCurrentPage.emit();
  }

  onValidatedBySelected(event: any) {
    this.form.controls['validatedBy'].setValue(event.rowData['Employee Name']);
    this.form.controls['validatedById'].setValue(
      event.rowData['Employee Number']
    );
  }
  onFinalApprovedBySelected(event: any) {
    this.form.controls['finalApprovedBy'].setValue(
      event.rowData['Employee Name']
    );
    this.form.controls['finalApprovedById'].setValue(
      event.rowData['Employee Number']
    );
  }
  print(){

  }
}
