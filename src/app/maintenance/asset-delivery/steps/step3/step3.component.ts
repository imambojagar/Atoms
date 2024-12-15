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
import { ICreateAccount } from 'src/app/modules/wizards/create-account.helper';
import validateForm from 'src/app/shared/helpers/validateForm'; */

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit, OnDestroy {
  form!: FormGroup;
  technicalAcceptanceData: any;
  @Input() set technicalAcceptanceInput(val: any) {
    this.technicalAcceptanceData = val;
    if (val.statusValue > 4) {
      this.hideContinue = false;
    } else {
      this.hideContinue = true;
    }
  }
  @Output() sendContinueCurrentPage = new EventEmitter<any>();
  @Output() sendBackCurrentPage = new EventEmitter<any>();
  deliveryId: any;
  deliveryStatus: any[] = [];
  isCanceled: any = true;
  isCompleted: any = true;
  id: any;
  private unsubscribe: Subscription[] = [];
  hideContinue: boolean = false;
  isCancel:boolean=false;
  constructor(
    private _formbuilder: FormBuilder,
    private messageService: MessageService,
    private assetDeliveryService: AssetDeliveryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.technicalAcceptanceData.statusValue > 5) {
      this.hideContinue = false;
    } else {
      this.hideContinue = true;
    }
    if (this.technicalAcceptanceData.statusValue==8)
    {
      this.isCancel=true;
    }
    this.fillTechnicalAcceptanceData();
   this.form.controls["certificateNumber"].setValue(this.technicalAcceptanceData.number);
    this.getLookups();
  }

  initForm() {
    this.form = this._formbuilder.group({
      acceptedBy: ['',[Validators.required]],
      acceptedById: [''],
      verifiedBy: ['',[Validators.required]],
      verifiedById: [''],
      technicalApprovedBy1: ['',[Validators.required]],
      technicalApprovedBy1Id: [''],
      technicalApprovedBy2: ['',[Validators.required]],
      technicalApprovedBy2Id: [''],
      certificateNumber: ['',[Validators.required]],
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
        if (this.technicalAcceptanceData.statusId == cancelDelivery.id) {
          this.isCanceled = false;
        }
        if (this.technicalAcceptanceData.statusId == completeDelivery.id) {
          this.isCompleted = false;
        }
      });
  }

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
      let data = {
        id: this.technicalAcceptanceData.id,
        statusId: 5,
        changeStatus: false,
      };
      Object.assign(data, this.form.value);
      this.assetDeliveryService.updateDelivery(data).subscribe((res) => {
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


  fillTechnicalAcceptanceData() {
    this.form.patchValue(this.technicalAcceptanceData);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  continue() {
    this.sendContinueCurrentPage.emit(4);
  }

  back() {
    this.sendBackCurrentPage.emit();
  }

  onAcceptedBySelected(event: any) {
    this.form.controls['acceptedBy'].setValue(event.rowData['Employee Name']);
    this.form.controls['acceptedById'].setValue(
      event.rowData['Employee Number']
    );
  }
  onVerifiedBySelected(event: any) {
    this.form.controls['verifiedBy'].setValue(event.rowData['Employee Name']);
    this.form.controls['verifiedById'].setValue(
      event.rowData['Employee Number']
    );
  }
  onTechnicalApprovedBy1Selected(event: any) {
    this.form.controls['technicalApprovedBy1'].setValue(
      event.rowData['Employee Name']
    );
    this.form.controls['technicalApprovedBy1Id'].setValue(
      event.rowData['Employee Number']
    );
  }
  onTechnicalApprovedBy2Selected(event: any) {
    this.form.controls['technicalApprovedBy2'].setValue(
      event.rowData['Employee Name']
    );
    this.form.controls['technicalApprovedBy2Id'].setValue(
      event.rowData['Employee Number']
    );
  }

  print4()
  {
    this.router.navigate(['/maintenance/asset-delivery/report'], { queryParams: { deliveryId: this.technicalAcceptanceData.id,reportNo:4 } });
  }

  print5()
  {
    this.router.navigate(['/maintenance/asset-delivery/report'], { queryParams: { deliveryId: this.technicalAcceptanceData.id,reportNo:5 } });
  }
}
