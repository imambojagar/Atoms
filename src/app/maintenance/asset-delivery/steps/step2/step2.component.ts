import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AssetDeliveryService } from '../../../../services/asset-delivery.service';
import { Lookup } from '../../../../shared/enums/lookup';
import validateForm from '../../../../shared/helpers/validateForm';
/* import { Subscription } from 'rxjs';
import { Lookup } from 'src/app/data/Enum/lookup';
import { IAssetDelivery } from 'src/app/data/models/asset-delivery-model';
import { AssetDeliveryService } from 'src/app/data/service/asset-delivery.service';
import validateForm from 'src/app/shared/helpers/validateForm'; */

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  @Input() endUserAcceptanceData:any={};
  @Input() lineList:any[]=[];
  @Output() sendContinueCurrentPage = new EventEmitter<any>();
  @Output() sendBackCurrentPage = new EventEmitter<any>();
  form!: FormGroup;
  accessoryList: any[] = [];
  assetList: any[] = [];
  costCenterList: any[] = [];
  status:any[]=[];
  showFiled:boolean=false;
  hideContinue:boolean=false;
  endUserId:any=0;
  isCancel:boolean=false;
  constructor(private formbuilder: FormBuilder,
    private messageService: MessageService,
    private assetDeliveryService: AssetDeliveryService,
    private router: Router) { }

  ngOnInit() {
    this.showFiled=false;
    if (this.endUserAcceptanceData.statusValue > 4) {
      this.hideContinue = false;
    } else {
      this.hideContinue = true;
    }
    if (this.endUserAcceptanceData.statusValue==8)
    {
      this.isCancel=true;
    }
    this.getCostCenters();
    this.initForm();
    this.getLookups();
  }

  getCostCenters(){
    this.lineList.forEach(element => {
      (element.costCenters as any[]).forEach(costCenter=>{
        if (costCenter.costCenter != "")
        {
          var exists:any;
          if (this.costCenterList.length!=0)
          {
             exists = this.costCenterList.filter(x=>x.costCentrer == costCenter.costCenter)[0]
          }
          if (exists==undefined)
          {
            this.costCenterList.push({costCenter:costCenter.costCenter});
          }
        }
      })
    });
  }

  initForm() {
    this.form = this.formbuilder.group({
      id: 0,
      deliveryId:0,
      costCenter: [null, Validators.required],
      acceptanceDate: [null, Validators.required],
      acceptedBy: [null, Validators.required],
      acceptedById: [null],
      assets: this.formbuilder.array([

      ]),
      accessories: this.formbuilder.array([

      ]),
    });
  }

  changeStatusControl(controlName: string, index: number, event: any) {
    (this.form.get(controlName) as FormArray).at(index).get('status')?.setValue(event.value);
    var status = this.status.filter(x=>x.id==event.value)[0];
    (this.form.get(controlName) as FormArray).at(index).get('rejectionReason')?.setValue('');
    (this.form.get(controlName) as FormArray).at(index).get('rejectionReason')?.disable();
    if (status.value==2)
    {
      (this.form.get(controlName) as FormArray).at(index).get('rejectionReason')?.enable();
    }
  }

  getLookups() {
    var statusSB = this.assetDeliveryService.getLookup(Lookup.EndUserAcceptanceStatus).subscribe((res: any) => {
      this.status = res.data
    });

  }

  changeCostCenter(event: any) {
    var endUserAcceptance= this.endUserAcceptanceData.endUserAcceptances == undefined? undefined: (this.endUserAcceptanceData.endUserAcceptances as any[]) .filter(x=>x.costCenter == event.value)[0];
    if (endUserAcceptance != undefined)
    {
      this.endUserId = endUserAcceptance.id;
      this.form.controls['id'].setValue(endUserAcceptance.id);
      this.form.controls['deliveryId'].setValue(this.endUserAcceptanceData.id);
      this.form.controls['costCenter'].setValue(endUserAcceptance.costCenter);
      this.form.controls['acceptanceDate'].setValue(new Date(endUserAcceptance.acceptanceDate));
      this.form.controls['acceptedBy'].setValue(endUserAcceptance.acceptedBy);
      this.form.controls['acceptedById'].setValue(endUserAcceptance.acceptedById);
    }
    else
    {
      this.endUserId = 0;
      this.form.controls['id'].setValue(0);
      this.form.controls['deliveryId'].setValue(0);
      this.form.controls['acceptanceDate'].setValue(null);
      this.form.controls['acceptedBy'].setValue(null);
      this.form.controls['acceptedById'].setValue(null);
    }

    this.showFiled=true;
    (this.form.get('accessories') as FormArray).clear();
    (this.form.get('assets') as FormArray).clear();
    this.lineList.forEach(element => {
      var item=element.item;
      var isAccessory = element.accessory;
      var costCenter = (element.costCenters as any[]).filter(x=>x.costCenter == event.value)[0];
      if (costCenter != undefined)
      {
        if (isAccessory==true)
        {
             var oldData = endUserAcceptance == undefined ? undefined : (endUserAcceptance.accessories as any[]).filter(x=>x.item == item)[0];
             (this.form.get('accessories') as FormArray).push(
              this.formbuilder.group({
                  id:oldData == undefined ? 0 :oldData.id,
                  item:oldData == undefined ? item :oldData.item,
                  endUserAcceptanceStatusId:[oldData == undefined ? null :oldData.endUserAcceptanceStatusId,Validators.required],
                  rejectionReason:oldData == undefined ? '' :oldData.rejectionReason,
                  description:oldData == undefined ? '' :oldData.description,
                  received:costCenter.quantity,
                  rejected:oldData == undefined ? 0 :oldData.rejected,
           })
           )
        }
        if (isAccessory==false)
        {
          (costCenter.technicalInspectionItems as any[]).forEach(y=>{

            var oldData = endUserAcceptance == undefined ? undefined : (endUserAcceptance.assets as any[]).filter(x=>x.item == item && x.assetId == y.assetId)[0];
            (this.form.get('assets') as FormArray).push(
              this.formbuilder.group({
                    id:oldData == undefined ? 0 :oldData.id,
                    item:oldData == undefined ? item :oldData.item,
                    endUserAcceptanceStatusId:[oldData == undefined ? null :oldData.endUserAcceptanceStatusId,Validators.required],
                    rejectionReason:oldData == undefined ? '' :oldData.rejectionReason,
                    description:oldData == undefined ? '' :oldData.description,
                    assetId:oldData == undefined ? y.assetId :oldData.assetId,
                    assetNumber:oldData == undefined ? y.assetNumber :oldData.assetNumber,
                    serialNumber:oldData == undefined ? y.serialNumber :oldData.serialNumber
                })
              )

          })

        }
      }

    });

  }


  getControls(controlName: string) {
    return (<FormArray>this.form.get(controlName)).controls;
  }

  continue() {
    this.sendContinueCurrentPage.emit(3);
  }

  back() {
    if (this.endUserAcceptanceData.isTechnicalInspection==false)
    {
      this.sendBackCurrentPage.emit(1);
    }
    else
    {
      this.sendBackCurrentPage.emit();
    }

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
      let data = {};
      Object.assign(data, this.form.value);
      let saveData:any={
        id: this.endUserAcceptanceData.id,
        statusId: 4,
        changeStatus: false,
        endUserAcceptances:[data]
      }

      this.assetDeliveryService.updateDelivery(saveData).subscribe((res) => {
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

  onAcceptedBySelected(event:any)
  {
    this.form.controls['acceptedBy'].setValue(event.rowData["Employee Name"]);
    this.form.controls['acceptedById'].setValue(event.rowData["Employee Number"]);
  }

  print(){
    this.router.navigate(['/maintenance/asset-delivery/report'], { queryParams: { deliveryId: this.endUserAcceptanceData.id,endUserId: this.endUserId,reportNo:2 } });
  }

  // checkStep() {
  //   var currentStatus = this.deliveryStatus.filter(x => x.name == "User Acceptance")[0];
  //   if ((this.currentDelivery.endUserAcceptances.length > 0) && (this.currentDelivery.statusId >= currentStatus.id)) {
  //     this.updateParentModel(this.currentDelivery, true);
  //   }
  //   else {
  //     this.updateParentModel({}, false);
  //     //this.messageService.add({ severity: 'error', summary: 'Error', detail: "Please Fill  End User  Acceptance", life: 3000, });
  //   }
  // }

  // ngOnDestroy() {
  //   this.unsubscribe.forEach((sb) => sb.unsubscribe());
  // }

  // assets() {
  //   return (<FormArray>this.form.get('assets')).controls;
  // }
  // accessories() {
  //   return (<FormArray>this.form.get('accessories')).controls;
  // }



  // BuildAsset(formbuilder: FormBuilder) {
  //   return this.formbuilder.group({
  //     id: 0,
  //     item: [''],
  //     number: [''],
  //     endUserAcceptanceStatusId: [''],
  //     rejectionReason: [''],
  //     description: [''],
  //     endUserAcceptanceId: 0
  //   });
  // }

  // BuildAccessory(formbuilder: FormBuilder) {
  //   return this.formbuilder.group({
  //     id: 0,
  //     item: [''],
  //     endUserAcceptanceStatusId: [''],
  //     received: 0,
  //     rejected: 0,
  //     rejectionReason: [''],
  //     description: [''],
  //     endUserAcceptanceId: 0
  //   });
  // }

  // buildAssets(id: any, data: any) {
  //   if (id == 0) {
  //     data.filter((s: any) => s.requiredInspection == true).forEach((p: any) => {
  //       (this.form.get('assets') as FormArray).push(
  //         this.formbuilder.group({
  //           id: (id == 0) ? 0 : p.id,
  //           item: p.item,
  //           number: p.item,
  //           endUserAcceptanceStatusId: (id == 0) ? null : p.endUserAcceptanceStatusId,
  //           rejectionReason: (id == 0) ? null : p.rejectionReason,
  //           description: p.description,
  //           endUserAcceptanceId: id
  //         })
  //       );
  //     });
  //   }
  //   else {
  //     data.forEach((p: any) => {
  //       (this.form.get('assets') as FormArray).push(
  //         this.formbuilder.group({
  //           id: p.id,
  //           item: p.item,
  //           number: p.item,
  //           endUserAcceptanceStatusId: p.endUserAcceptanceStatusId,
  //           rejectionReason: p.rejectionReason,
  //           description: p.description,
  //           endUserAcceptanceId: id
  //         })
  //       );
  //     });
  //   }
  // }
  // buildAccessories(id: any, data: any) {
  //   if (id == 0) {
  //     data.filter((s: any) => s.accessory == true).forEach((p: any) => {
  //       (this.form.get('accessories') as FormArray).push(
  //         this.formbuilder.group({
  //           id: (id == 0) ? 0 : p.id,
  //           item: p.item,
  //           endUserAcceptanceStatusId: (id == 0) ? null : p.endUserAcceptanceStatusId,
  //           received: (id == 0) ? p.deliveryReceived : p.deliveryReceived,
  //           rejected: (id == 0) ? 0 : p.deliveryReceived,
  //           rejectionReason: (id == 0) ? null : p.rejectionReason,
  //           description: p.description,
  //           endUserAcceptanceId: id
  //         })
  //       );
  //     });
  //   } else {
  //     data.forEach((p: any) => {
  //       (this.form.get('accessories') as FormArray).push(
  //         this.formbuilder.group({
  //           id: p.id,
  //           item: p.item,
  //           endUserAcceptanceStatusId: p.endUserAcceptanceStatusId,
  //           received: p.received,
  //           rejected: p.rejected,
  //           rejectionReason: p.rejectionReason,
  //           description: p.description,
  //           endUserAcceptanceId: id
  //         })
  //       );
  //     });
  //   }
  // }

  // removeControl(controlName: string, index: number) {
  //   (this.form.get(controlName) as FormArray).removeAt(index);
  // }

  // save() {
  //   if (this.form.invalid) {
  //     validateForm.validateAllFormFields(this.form);
  //     this.form.markAllAsTouched();
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
  //   }
  //   else {
  //     let finalData: any = this.getEndUserAcceptanceModel(this.form.value);
  //     finalData.acceptedBy = finalData.acceptedBy.fulL_NAME;
  //     if (this.currentDelivery.endUserAcceptances.length == 0) {
  //       this.assetDeliveryService.saveEndUserAcceptance(finalData).subscribe(res => {
  //         const message = res.message;
  //         const sucess = res.isSuccess;
  //         if (sucess == true) {
  //           this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000, });
  //           this.ResetForm();
  //           this.getDelivery(this.currentDelivery.id);
  //         } else {
  //           this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
  //         }
  //       })
  //     }
  //     else {
  //       var costcenter = this.form.get('costCenter')?.value;
  //       var selectedCostCenter = this.currentDelivery.endUserAcceptances.filter((c: any) => c.costCenter == costcenter)[0];
  //       finalData.id = selectedCostCenter.id;
  //       this.assetDeliveryService.updateEndUserAcceptance(finalData).subscribe(res => {
  //         const message = res.message;
  //         const sucess = res.isSuccess;
  //         if (sucess == true) {
  //           this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000, });
  //           this.ResetForm();
  //           this.getDelivery(this.currentDelivery.id);
  //         } else {
  //           this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
  //         }

  //       })
  //     }
  //   }
  // }

  // getEndUserAcceptanceModel(formValue: any) {
  //   let model = { ...formValue };
  //   model.assets = this.cloneAndChangeProp(formValue.assets, (n, o) => {
  //     if (o.id == '')
  //       n.id = 0;
  //   });
  //   //
  //   model.accessories = this.cloneAndChangeProp(formValue.accessories, (n, o) => {
  //     if (o.id == '')
  //       n.id = 0;
  //   });

  //   return model;
  // }

  // cloneAndChangeProp(arr: any[], act: (n: any, old: any) => any) {
  //   return arr.map(a => {
  //     let newInst = { ...a };
  //     act(newInst, a);
  //     return newInst;
  //   });
  // }

  // getDelivery(id: number) {
  //   this.assetDeliveryService.getDelivery(id).subscribe(res => {
  //     if (res.isSuccess) {
  //       const data = res.data;
  //       this.currentDelivery = data;
  //       this.updateParentModel(data, true);
  //     }
  //   })
  // }

  // changeCostCenter(event: any) {
  //   this.form.patchValue({ acceptanceDate: null, acceptedBy: null, });
  //   this.resetAsset();
  //   this.resetAccerories()
  //   if (event.value != null) {
  //     this.form.value.costCenter = event.value;
  //     if (this.currentDelivery.endUserAcceptances.length == 0) {
  //       var requiredInspection = this.currentDelivery.lines.filter((x: any) => x.requiredInspection == true);
  //       var accessory = this.currentDelivery.lines.filter((x: any) => x.accessory == true);
  //       if (requiredInspection.length > 0) {
  //         this.buildAssets(0, this.currentDelivery.lines.filter((x: any) => x.requiredInspection == true));
  //       }
  //       if (accessory.length > 0) {
  //         this.buildAccessories(0, this.currentDelivery.lines.filter((x: any) => x.accessory == true));
  //       }
  //     }
  //     else {
  //       var selectedCostCenter = this.currentDelivery.endUserAcceptances.filter((c: any) => c.costCenter == event.value)[0];
  //       this.buildAssets(selectedCostCenter.id, selectedCostCenter.assets);
  //       this.buildAccessories(selectedCostCenter.id, selectedCostCenter.accessories);
  //       this.form.patchValue({
  //         acceptanceDate: new Date(selectedCostCenter.acceptanceDate),
  //         acceptedBy: selectedCostCenter.acceptedBy,
  //       });
  //       this.form.get('acceptedBy')?.setValue({ fulL_NAME: selectedCostCenter.acceptedBy });
  //     }
  //   }
  // }




  //   this.currentDelivery.lines.forEach((p: any) => {
  //     if (p.costCenters.length > 0) {
  //       p.costCenters.forEach((c: any) => { this.costCenterList.push(c); });
  //     }
  //   });
  //   this.unsubscribe.push(statusSB, deliveryStatusSB,employeesSB);
  // }
  // resetAsset() {
  //   this.form.get('assets')?.value.forEach((e: any) => {
  //     (this.form.get('assets') as FormArray).removeAt(e);
  //   });
  // }
  // resetAccerories() {
  //   this.form.get('accessories')?.value.forEach((e: any) => {
  //     (this.form.get('accessories') as FormArray).removeAt(e);
  //   });
  // }

  // ResetForm() {
  //   this.form.reset();
  //   this.resetAsset();
  //   this.resetAccerories();
  // }

  // CancelDelivery() {
  //   var currentStatus = this.deliveryStatus.filter(x => x.name == "Cancel Delivery")[0];
  //   this.currentDelivery.statusId = currentStatus.id;
  //   this.updateDelivery(this.currentDelivery);
  // }

  // updateDelivery(data: any) {
  //   this.assetDeliveryService.updateDelivery(data).subscribe(res => {
  //     const message = res.message;
  //     const sucess = res.isSuccess;
  //     if (sucess == true) {
  //       this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000, });
  //       this.getDelivery(this.currentDelivery.id);
  //     } else {
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
  //     }

  //   })
  // }

  // bindAcceptedBy(event: any) {
  //   this.form.value.acceptedBy = event.fulL_NAME;
  //  }
  // //  searchAcceptedBy(event: any) {
  // //   this.selectedAcceptedBy = this.employees;
  // //    this.selectedAcceptedBy = this.employees.filter(x=>x.fulL_NAME.includes(event.query.toUpperCase()));
  // // }
  // clearAcceptedBy(){
  //   this.form.value.acceptedBy =null;
  //   this.form.get('acceptedBy')?.setValue('');
  // }

}
