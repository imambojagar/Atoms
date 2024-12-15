import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { SearchModelDefinition } from '../../../models/model-definition-model';
import { ModelService } from '../../../services/model-definition.service';
import { AssetsService } from '../../../services/assets.service';
import { TaxonomyService } from '../../../services/taxonomy.service';
import { AssetDeliveryService } from '../../../services/asset-delivery.service';
import { ApiService } from '../../../services/name-definition.service';
import { Lookup } from '../../../shared/enums/lookup';
import validateForm from '../../../shared/helpers/validateForm';
/* import { Subscription } from 'rxjs';
import { Lookup } from 'src/app/data/Enum/lookup';
import { DeliveryHistoryModel } from 'src/app/data/models/asset-delivery-model';
import { ModelDefinitionModel, SearchModelDefinition } from 'src/app/data/models/model-definition-model';
import { AssetDeliveryService } from 'src/app/data/service/asset-delivery.service';
import { AssetsService } from 'src/app/data/service/assets.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { ModelService } from 'src/app/data/service/model-definition.service';
import { ApiService } from 'src/app/data/service/name-definition.service';
import { TaxonomyService } from 'src/app/data/service/taxonomy.service';
import validateForm from 'src/app/shared/helpers/validateForm'; */

@Component({
    selector: 'app-technical-inspection-modal',
    templateUrl: './technical-inspection-modal.component.html',
    styleUrls: ['./technical-inspection-modal.component.scss']
})
export class TechnicalInspectionModalComponent implements OnInit {
  showmodals: boolean = false;

    close_modal() {
      this.showmodals = !this.showmodals;
    }

    @Input() lineIndex!: number;
    @Input() technicalInspectionData:any={};
    @Input() Item:any={};
    @Input() hideContinue:boolean=false;
    ItemNum:any="";
    costCenterList: any[] = [];
    frequencylist: any[] = [];
    voltagelist: any[] = [];
    modelDefinitions: any[] = [];
    testList: any[] = [];
    alertList: any[] = [];
    technicalInspectionItems: any[] = [];
    powerSupplyTypelist: any[] = [];
    deliveryStatus: any[] = [];
    formGroup!: FormGroup;
    technicalInspectionForm!: FormGroup;

    form: any;
    showDialog: boolean = false;
    searchFilter = new SearchModelDefinition();
    totalRows:any;
    pageSize:any=10;
    manufacturers: any[] = [];
    assetNames: any[] = [];
    models: any[] = [];
    searchForm!: FormGroup;

    assetsData:any[]=[]
    constructor(
        public modal: NgbActiveModal,
        private modelService: ModelService,
        private assetService:AssetsService,
        private router: Router,
        private messageService: MessageService,
        private taxonamyService: TaxonomyService,
        private assetDeliveryService :AssetDeliveryService,
        private formbuilder: FormBuilder,
        private modelDefinitionService:ModelService,
        private apiServiceNameDefinition: ApiService
    ) { }

    ngOnInit(): void {
      this.searchForm = this.formbuilder.group({
        assetNDId: null,
        modelId: null,
        manufacturerId: null
      })
        this.initForm();
        this.searchFilter.pageNumber = 1;
        this.searchFilter.pageSize = 10;
        this.searchModelDefinition();
        this.costCenterList = this.technicalInspectionData.lines[this.lineIndex].costCenters;
        if (this.technicalInspectionData.lines[this.lineIndex].technicalInspection)
        {
          this.technicalInspectionForm.controls["id"].setValue(this.technicalInspectionData.lines[this.lineIndex].technicalInspection.id);
          this.technicalInspectionForm.controls["assetModelId"].setValue(this.technicalInspectionData.lines[this.lineIndex].technicalInspection.assetModelId);
          this.technicalInspectionForm.controls["assetName"].setValue(this.technicalInspectionData.lines[this.lineIndex].technicalInspection.assetName);
          this.technicalInspectionForm.controls["Model"].setValue(this.technicalInspectionData.lines[this.lineIndex].technicalInspection.model);
          this.technicalInspectionForm.controls["Manufacturer"].setValue(this.technicalInspectionData.lines[this.lineIndex].technicalInspection.manufacturer);
          this.technicalInspectionForm.controls["voltageId"].setValue(this.technicalInspectionData.lines[this.lineIndex].technicalInspection.voltageId);
          this.technicalInspectionForm.controls["maxCurrent"].setValue(this.technicalInspectionData.lines[this.lineIndex].technicalInspection.maxCurrent);
          this.technicalInspectionForm.controls["frequencyId"].setValue(this.technicalInspectionData.lines[this.lineIndex].technicalInspection.frequencyId);
          this.technicalInspectionForm.controls["powerReading"].setValue(this.technicalInspectionData.lines[this.lineIndex].technicalInspection.powerReading);
          this.technicalInspectionForm.controls["powerSupplyTypeId"].setValue(this.technicalInspectionData.lines[this.lineIndex].technicalInspection.powerSupplyTypeId);

        }
        this.ItemNum=this.technicalInspectionData.lines[this.lineIndex].item;
    }

    initForm() {
      this.technicalInspectionForm = this.formbuilder.group({
          id: 0,
          assetModelId: 0,
          assetName:[null],
          Model:[null],
          Manufacturer:[null],
          voltageId: ['',Validators.required],
          maxCurrent:  ['',Validators.required],
          frequencyId:  ['',Validators.required],
          powerReading:  ['',Validators.required],
          powerSupplyTypeId:  ['',Validators.required],
          costCenter:  ['',Validators.required],
          quantity: ['',Validators.required],
          lineId:0,
          technicalInspectionItems: this.formbuilder.array([]),
        });
        this. getLookups();


    }

    changeCostCenter(event: any) {
      this.resetTechnicalInspection();
      if (event.value != null) {
        this.technicalInspectionForm.value.costCenter = event.value;
        var received = this.costCenterList.find(x=>x.costCenter==event.value);
        this.technicalInspectionForm.get('quantity')?.setValue(received.quantity);
        var data:any[]= received.technicalInspectionItems;
        this.addMoreitems(received.quantity,data);
      }
    }

    resetTechnicalInspection(){
      this.technicalInspectionForm.get('quantity')?.setValue(0);
       this.technicalInspectionForm.get('technicalInspectionItems')?.value.forEach((e:any) => {
      (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).removeAt(e);
    });
  }


  addMoreitems(quantity: number,data:any[]) {
    this.technicalInspectionForm.value.technicalInspectionItems = this.formbuilder.array([])
      for (let i = 0; i < quantity; i++) {
        (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).push(
          this.formbuilder.group({
            id: 0,
            status:false,
            assetId:0,
            assetNumber:[''],
            serialNumber: [''],
            inspectionDate: new Date(),
            floor: [''],
            location: [''],
            flagphysicalInspection: false,
            flagFunctionPerformance: false,
            flagGroundingResistance: false,
            flagChassiss: false,
            flagLeadsLeakage: false,
            flagAlert: false,
            //lineId: this.lineId
          })
        );
        if (data != undefined)
        {
          var one = data[i];
          if (one != undefined)
          {
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('id')?.setValue(one.id);
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('status')?.setValue(one.status);
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('assetId')?.setValue(one.assetId);
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('assetNumber')?.setValue({id:one.assetId,assetNumber:one.assetNumber});
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('serialNumber')?.setValue(one.serialNumber);
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('inspectionDate')?.setValue(one.inspectionDate? new Date(one.inspectionDate) : null);
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('floor')?.setValue(one.floor);
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('location')?.setValue(one.location);
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('flagphysicalInspection')?.setValue(one.flagphysicalInspection);
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('flagFunctionPerformance')?.setValue(one.flagFunctionPerformance);
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('flagGroundingResistance')?.setValue(one.flagGroundingResistance);
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('flagChassiss')?.setValue(one.flagChassiss);
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('flagLeadsLeakage')?.setValue(one.flagLeadsLeakage);
            (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(i).get('flagAlert')?.setValue(one.flagAlert);
          }

        }

      }

    //if (quantity != null) {

    //}
    // else {
    //   this.technicalInspectionForm.get('technicalInspectionItems')?.value.forEach((e: any) => {
    //     (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).removeAt(e);
    //   });
    // }
  }

  getLookups() {
    var freqsub =  this.assetDeliveryService.getLookup(Lookup.Frequency).subscribe((res: any) => {
       this.frequencylist = res.data
     });
    var powesupllyfreq =  this.assetDeliveryService.getLookup(Lookup.PowerSupplyType).subscribe((res: any) => {
       this.powerSupplyTypelist = res.data
     });
    var voltagesub=  this.assetDeliveryService.getLookup(Lookup.Voltage).subscribe((res: any) => {
       this.voltagelist = res.data
     });
     var deliveryStatusSB = this.assetDeliveryService.getLookup(Lookup.DeliveryStatus).subscribe((res: any) => {
       this.deliveryStatus = res.data
       this.deliveryStatus.splice(0, 0, { id: 0, name: "Select", value: null })
     });
   }

   changeFrequency(event:any){
     this.technicalInspectionForm.value.frequencyId=event.value;
   }
   changeVoltage(event:any){
     this.technicalInspectionForm.value.voltageId=event.value;
   }
   changePowerSupplyType(event:any){
     this.technicalInspectionForm.value.powerSupplyTypeId=event.value;
   }

   CheckTestAlert(index: number) {
    var flagphysicalInspection = (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray)?.at(index).value.flagphysicalInspection;
    var flagFunctionPerformance = (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray)?.at(index).value.flagFunctionPerformance;
    var flagGroundingResistance = (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray)?.at(index).value.flagGroundingResistance;
    var flagChassiss = (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(index)?.value.flagChassiss;
    var flagLeadsLeakage = (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray)?.at(index).value.flagLeadsLeakage;
    var flagAlert = (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(index)?.value.flagAlert;
    var check = (flagphysicalInspection && flagFunctionPerformance && flagGroundingResistance && flagChassiss && flagLeadsLeakage && flagAlert);
    (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(index).get('status')?.setValue(check);
  }

   onNoClick(event: Event): void {
    event.preventDefault();
  }

  removeControl(controlName: string, index: number) {
    (this.technicalInspectionForm.get(controlName) as FormArray).removeAt(index);
  }
  getControls(controlName: string) {
    return (<FormArray>this.technicalInspectionForm.get(controlName)).controls;
  }

   save(){
      if (this.technicalInspectionForm.invalid) {
        validateForm.validateAllFormFields(this.technicalInspectionForm);
        this.technicalInspectionForm.markAllAsTouched();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
      }
      else {
        this.Item = this.technicalInspectionData.lines[this.lineIndex]
        if (this.Item.technicalInspection==null)
        {
          this.Item.technicalInspection={
            id:0
          };
        }
        this.Item.technicalInspection.assetModelId = this.technicalInspectionForm.value.assetModelId;
        this.Item.technicalInspection.assetName = this.technicalInspectionForm.value.assetName;
        this.Item.technicalInspection.model = this.technicalInspectionForm.value.Model;
        this.Item.technicalInspection.manufacturer = this.technicalInspectionForm.value.Manufacturer;
        this.Item.technicalInspection.voltageId = this.technicalInspectionForm.value.voltageId;
        this.Item.technicalInspection.maxCurrent = this.technicalInspectionForm.value.maxCurrent;
        this.Item.technicalInspection.frequencyId = this.technicalInspectionForm.value.frequencyId;
        this.Item.technicalInspection.powerReading = this.technicalInspectionForm.value.powerReading;
        this.Item.technicalInspection.powerSupplyTypeId = this.technicalInspectionForm.value.powerSupplyTypeId;

          (this.Item.costCenters as any[]).forEach(e=>{
              if (e.costCenter == this.technicalInspectionForm.value.costCenter)
              {
                e.technicalInspectionItems=[];
                (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).value.forEach((element:any) => {
                  if (element.assetId !=0)
                  {
                      e.technicalInspectionItems.push({id:element.id,
                      status:element.status,
                      assetId:element.assetId,
                      assetNumber:element.assetNumber.assetNumber,
                      serialNumber:element.serialNumber,
                      inspectionDate:element.inspectionDate,
                      floor:element.floor,
                      location:element.location,
                      flagphysicalInspection:element.flagphysicalInspection,
                      flagFunctionPerformance:element.flagFunctionPerformance,
                      flagGroundingResistance:element.flagGroundingResistance,
                      flagChassiss:element.flagChassiss,
                      flagLeadsLeakage:element.flagLeadsLeakage,
                      flagAlert:element.flagAlert
                    })
                  }

                });
              }
            })
            this.modal.close(this.Item);
      }

   }

    // save() {
    //   if (this.technicalInspectionForm.invalid) {
    //     validateForm.validateAllFormFields(this.technicalInspectionForm);
    //     this.technicalInspectionForm.markAllAsTouched();
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
    //   }
    //   else {

    //   }
    // }



  // BuildlAsset(formbuilder: FormBuilder) {
  //   return formbuilder.group({
  //     id: 0,
  //     status: [''],
  //     assetNumber: [''],
  //     serialNumber: [''],
  //     inspectionDate: new Date(),
  //     assetFloor: [''],
  //     assetLocation: [''],
  //     flagphyzicalInspection: false,
  //     flagFunctionPerformance: false,
  //     flagGroundingResistance: false,
  //     flagChassiss: false,
  //     flagLeadsLeakage: false,
  //     flagAlert: false,
  //     technicalInspectionId: 0,
  //     lineId: this.lineId
  //   })
  // }

  // buildTechnicalInspectionItems(inspectionId: number, data: any) {
  //   this.technicalInspectionItems = data;
  //   this.technicalInspectionForm.get('technicalInspectionItems')?.value.forEach((e: any) => {
  //     (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).removeAt(e);
  //   });
  //   this.technicalInspectionItems.forEach((p, index)  => {
  //     (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).push(
  //       this.formbuilder.group({
  //         id: (inspectionId == 0) ? 0 : p.id,
  //         status: (inspectionId == 0) ? false : p.status,
  //         serialNumber: (inspectionId == 0) ? [''] : p.serialNumber,
  //         inspectionDate: new Date(p.inspectionDate=null? new Date(): p.inspectionDate),
  //         floor: p.floor,
  //         location: (inspectionId == 0) ? [''] : p.location,
  //         flagphysicalInspection: (inspectionId == 0) ? false : p.flagphysicalInspection,
  //         flagFunctionPerformance: (inspectionId == 0) ? false : p.flagFunctionPerformance,
  //         flagGroundingResistance: (inspectionId == 0) ? false : p.flagGroundingResistance,
  //         flagChassiss: (inspectionId == 0) ? false : p.flagChassiss,
  //         flagLeadsLeakage: (inspectionId == 0) ? false : p.flagLeadsLeakage,
  //         flagAlert: (inspectionId == 0) ? false : p.flagAlert,
  //         technicalInspectionId: (inspectionId == 0) ? 0 : p.technicalInspectionId,
  //         lineId: this.lineId
  //       })
  //       );
  //       (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(index).get('serialNumber')?.setValue({ id: p.serialNumber, assetSerialNo: p.serialNumber });
  //   });
  // }




  //#region Lookup









  getTechnicalInspectionModel(formValue: any) {
    let model = { ...formValue };
    model.technicalInspectionItems = this.cloneAndChangeProp(formValue.technicalInspectionItems, (n, o) => {
      if (o.id == '')
        n.id = 0;
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


  // GetTechnicalInspectionByLineId(id: number) {
  //   this.assetDeliveryService.GetTechnicalInspectionByLineId(id).subscribe(res => {
  //     if (res.isSuccess) {
  //       const data = res.data;
  //       this.technicalInspectionForm.patchValue(data);
  //       this.technicalInspectionForm.get('assetModelId')?.setValue({ id: data.assetModelId, modelDefCode: data.assetModelName });
  //       this.technicalInspectionForm.get('manufacturerId')?.setValue({ id: data.manufacturerId, name: data.manufacturerName });
  //       this.buildTechnicalInspectionItems(data.id,data.technicalInspectionItems);
  //     }
  //   })
  // }




//   saveHistory(){
//     var technicalInspection = this.deliveryStatus.filter(x => x.name == "Technical Inspection")[0];
//     this.deliveryHistory.deliveryId = this.deliveryId;
//     this.deliveryHistory.statusId = technicalInspection.id;
//     this.assetDeliveryService.newHistory(this.deliveryHistory).subscribe(res => {
//      const message = res.message;
//      const sucess = res.isSuccess;
//      if (sucess == true) {
//       this.modal.close();
//        this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000, });
//      } else {
//        this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
//      }
//    })
//  }




//#endregion
getAssetNumbers(searchText: any = '',index:number) {
  var dto = { assetNumber: searchText,assetModelId: this.technicalInspectionForm.value.assetModelId};
  this.assetService.GetAssetsAutoCompleteMultiFilter(dto).subscribe((res) => {
    this.assetsData = res.data
  });
}
selectAsset(event: any,index:number) {
  this.assetService.getAssetById(event.id).subscribe((res) => {
    var result = res.data;
    (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(index).get('assetNumber')?.setValue({ id: event.id, assetNumber: event.assetNumber });
    (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(index).get('serialNumber')?.setValue(event.assetSerialNo);
    (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(index).get('assetId')?.setValue(event.id);
    (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(index).get('location')?.setValue(result.building.name);
    (this.technicalInspectionForm.get('technicalInspectionItems') as FormArray).at(index).get('floor')?.setValue(result.floor.name);

  });
 }

 openDialog() {
  this.showDialog = true;
  this.searchFilter.pageNumber = 1;
  this.searchFilter.pageSize = 10;
  this.searchModelDefinition();

}
selectRow(event: any) {
  this.modelDefinitionService.GetModelDefinitionAssetId(event).subscribe((data) => {
    var res = data.data[0];
    this.technicalInspectionForm.controls['assetModelId'].setValue(res.id);
    this.technicalInspectionForm.controls['Manufacturer'].setValue(res.manufacturerName);
    this.technicalInspectionForm.controls['Model'].setValue(res.modelName);
    this.technicalInspectionForm.controls['assetName'].setValue(res.assetName);
    this.showDialog = false;
  });
}

searchModelDefinition() {

  this.modelDefinitionService.getModelDefinitions(this.searchFilter).subscribe(res => {
    const data = res.data;
    const message = res.message;
    const sucess = res.isSuccess;
    if (sucess == true) {
      this.modelDefinitions = data;
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
  this.searchFilter.pageNumber = event.page + 1;
  this.searchModelDefinition();
}

Reset() {
  this.searchFilter.assetNDId = null;
  this.searchFilter.modelId = null;
  this.searchFilter.manufacturerId = null;
  this.searchFilter.pageNumber = 1;
  this.searchForm.reset();
  this.modelDefinitionService.getModelDefinitions(this.searchFilter).subscribe(res => {
    const data = res.data;
    const message = res.message;
    const sucess = res.isSuccess;
    if (sucess == true) {
      this.modelDefinitions = data;
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

getManufacturers(searchText: any = '') {

  this.taxonamyService.GetManufacturerOrModelAutoComplete3(true, searchText).subscribe((res) => {
    this.manufacturers = res.data;

  });
}

selectManufacturer(event: any) {
  this.getManufacturers(event.query);
  this.searchFilter.manufacturerId = event.id
}
bindManufacturer(event: any) {
  this.searchFilter.manufacturerId = event.id;
}
clearManufacturer() {
  this.searchFilter.manufacturerId = null;
}

selectAssetName(event: any) {
  this.apiServiceNameDefinition.searchNameDefinition(<any>{ assetName: event.query }).subscribe((res) => {
    this.assetNames = res.data;
  })

}
bindAssetName(event: any) {
  this.searchFilter.assetNDId = event.id;
}
clearAssetName() {
  this.searchFilter.assetNDId = null;
}

selectModel(event: any) {
  this.taxonamyService.GetManufacturerOrModelAutoComplete3(false, event.query).subscribe(res => {
    this.models = res.data;
  });

}
bindModel(event: any) {
  this.searchFilter.modelId = event.id;
}
clearModel() {
  this.searchFilter.modelId = null;
}


}

