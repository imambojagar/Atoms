import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AssetDeliveryService } from '../../../services/asset-delivery.service';
/* import { AssetDeliveryService } from 'src/app/data/service/asset-delivery.service';
import { CustomerService } from 'src/app/data/service/customer.service'; */

@Component({
    selector: 'app-cost-center-modal',
    templateUrl: './cost-center-modal.component.html',
    styleUrls: ['./cost-center-modal.component.scss']
})
export class CostCenterModalComponent implements OnInit {
    @Input() lineIndex!: number;
    @Input() deliveryInspactionData:any={};
    @Input() hideContinue:boolean=false;
    @Input() Item:any={};
    newReceived:any=0;
    costCenterList: any[] = [];
    costCenterForm!:FormGroup;
    formGroup: any;
    ItemNum!:string;
  constructor(
    public modal: NgbActiveModal,
    private router: Router,
    private messageService: MessageService,
    private assetdeliveryService: AssetDeliveryService,
    private formbuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
    var line = this.deliveryInspactionData.lines[this.lineIndex];
    this.ItemNum = line.item;
    var costCenters:any[]=[];
    costCenters = line.costCenters
    if (costCenters.length==0)
    {
      (this.costCenterForm.get('costcenters') as FormArray).push(this.BuildlCostCenter(this.formbuilder));
    }
    else
    {
      costCenters.forEach(e=>{
        (this.costCenterForm.get('costcenters') as FormArray).push(this.BuildlCostCenterAdd(this.formbuilder,e));
      })
    }

  }

  initForm() {
    this.costCenterForm = this.formbuilder.group({
      costcenters: this.formbuilder.array([]),
    });

    this.getCostCenters(this.deliveryInspactionData.operatingUnitId);


  }

  save() {
    // if (this.costCenterForm.invalid) {
    //   this.costCenterForm.markAllAsTouched();
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
    //   return;
    // }
    var isEnter:boolean=true;
    this.costcenters().forEach(e=>{
      if (e.get("costCenter")?.value == "" && e.get("quantity")?.value>0)
      {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
          isEnter=false;
      }
    })
    if (isEnter)
    {
      var c = this.costcenters();
      this.Item = this.deliveryInspactionData.lines[this.lineIndex];
      this.newReceived=0;
      c.forEach(element=>{
        this.newReceived +=element.value.quantity
      });
      if (this.newReceived>this.Item.remaining+this.Item.deliveryReceived)
      {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'quantity cost center greater than line quantity',
          life: 3000,
        });
        return;
      }

      this.Item.costCenters = [];

      c.forEach(element=>{
        this.Item.costCenters.push({id:element.get("id")?.value,costCenter:element.get("costCenter")?.value,quantity:element.get("quantity")?.value});
      })
      this.modal.close(this.Item);
     // let finalData: any = this.getCostCenterModel(this.costCenterForm.value);
      //this.getLine(this.lineId, finalData)
    }

  }


  BuildlCostCenter(formbuilder: FormBuilder) {
    return formbuilder.group({
      id: 0,
      costCenter: [''],
      quantity: 0
    })
  }

  BuildlCostCenterAdd(formbuilder: FormBuilder,data:any) {
    return formbuilder.group({
      id: data.id,
      costCenter: data.costCenter,
      quantity: data.quantity,
    })
  }


  costcenters() {
    return (<FormArray>this.costCenterForm.get('costcenters')).controls;
  }

  addMorecostcenters() {
    (this.costCenterForm.get('costcenters') as FormArray).push(
      this.formbuilder.group({
        id: 0,
        costCenter: ['',Validators.required],
        quantity: 0,
      })
    );
  }

  removeControl(controlName: string, index: number) {
    (this.costCenterForm.get(controlName) as FormArray).removeAt(index);
  }
  getControls(controlName: string) {
    return (<FormArray>this.costCenterForm.get(controlName)).controls;
  }

  //#region AutoComplete

  getCostCenters(data: any) {
    this.assetdeliveryService.getCostCenters(data).subscribe((res: any) => {
      this.costCenterList = res.costCenterDetails;
    });
  }





}
