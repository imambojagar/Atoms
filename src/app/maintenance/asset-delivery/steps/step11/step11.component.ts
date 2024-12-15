import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
/* import { AssetDeliveryService } from 'src/app/data/service/asset-delivery.service';
import validateForm from 'src/app/shared/helpers/validateForm'; */
import { CostCenterModalComponent } from '../../cost-center-modal/cost-center-modal.component';
import { TechnicalInspectionModalComponent } from '../../technical-assistance-modal/technical-inspection-modal.component';
import { AssetDeliveryService } from '../../../../services/asset-delivery.service';
import validateForm from '../../../../shared/helpers/validateForm';
import { Lookup } from '../../../../shared/enums/lookup';
/* import { Lookup } from 'src/app/data/Enum/lookup'; */
type Tabs = 'Lines';
@Component({
  selector: 'app-step11',
  templateUrl: './step11.component.html',
  styleUrls: ['./step11.component.scss']
})
export class Step11Component {
  deliveryInspactionData: any;
  technicalInspectionForm!: FormGroup;
  @Input()
  set technicalInspection(val: any) {
    this.deliveryInspactionData = val;
    if (val.statusValue > 2) {
      this.hideContinue = false;
    } else {
      this.hideContinue = true;
    }

  }
  @Output() sendContinueCurrentPage = new EventEmitter<any>();
  @Output() sendBackCurrentPage = new EventEmitter<any>();
  activeTab: Tabs = 'Lines';
  registerFileslist: any[] = [];
  linesList: any[] = [];
  poNumber: any;
  deliveryId: any;
  assetDeliveryId: any;
  selectedPOLines: any[] = [];
  costCenterList: any[] = [];
  deliveryNumbers: any[] = [];
  hideContinue: boolean = true;
  deliveryTypelist:any[]=[];
  disablePayment:string="true";
  isCancel:boolean=false;
  private unsubscribe: Subscription[] = [];
  constructor(
    private assetdeliveryService: AssetDeliveryService,
    private modalService: NgbModal,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private router: Router
  ) {}

  //#region   Build Form
  buildTechnicalInspectionForm(formbuilder: FormBuilder) {
    return formbuilder.group({
      lines: this.formbuilder.array([]),
      inspectionDate: [null,Validators.required],
      inspectionBy: [null,Validators.required],
      inspectionById: [null],
      deliveryApprovedBy:  [null,Validators.required],
      deliveryApprovedById:  [null],
      deliveryTypeId:  [null,Validators.required],
      paymentTerms:  [null],
    });
  }
  //#endregion

  //#region   Event
  ngOnInit(): void {
    this.getLookup();
    if (this.deliveryInspactionData.statusValue > 2) {
      this.hideContinue = false;
    } else {
      this.hideContinue = true;
    }
    this.isCancel=false;
    if (this.deliveryInspactionData.statusValue==8)
    {
      this.isCancel=true;
    }

    this.technicalInspectionForm = this.buildTechnicalInspectionForm(
      this.formbuilder
    );
    if (this.deliveryInspactionData.inspectionDate)
    {
      this.technicalInspectionForm.controls["inspectionDate"].setValue(new Date(this.deliveryInspactionData.inspectionDate));
    }
    this.technicalInspectionForm.controls["inspectionBy"].setValue(this.deliveryInspactionData.inspectionDate);
    this.technicalInspectionForm.controls["inspectionById"].setValue(this.deliveryInspactionData.inspectionById);
    this.technicalInspectionForm.controls["deliveryApprovedBy"].setValue(this.deliveryInspactionData.deliveryApprovedBy);
    this.technicalInspectionForm.controls["deliveryApprovedById"].setValue(this.deliveryInspactionData.deliveryApprovedById);
    this.technicalInspectionForm.controls["deliveryTypeId"].setValue(this.deliveryInspactionData.deliveryTypeId);
    this.technicalInspectionForm.controls["paymentTerms"].setValue(this.deliveryInspactionData.paymentTerms);


    this.buildLines(
      this.deliveryInspactionData.id,
      this.deliveryInspactionData.lines
    );

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  continue() {

      if (this.deliveryInspactionData.isTechnicalInspection==false)
      {
        this.sendContinueCurrentPage.emit(2);
      }
      else
      {
        this.sendContinueCurrentPage.emit(1);
      }

  }




  save() {
    if (this.technicalInspectionForm.invalid) {
      validateForm.validateAllFormFields(this.technicalInspectionForm);
      this.technicalInspectionForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      let data = {
        id: this.deliveryInspactionData.id,
        statusId: 2,
        changeStatus: false,
        lines: [],
      };
      Object.assign(data, this.technicalInspectionForm.value);
      data.lines.forEach((e: any) => {
        if (typeof e.item == 'object') {
          e.item = e.item.item;
        }
      });
      this.assetdeliveryService.updateDelivery(data).subscribe((res) => {
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
  //#endregion

  //#region  Delivery
  getDelivery(id: number) {
    this.assetdeliveryService.getDelivery(id).subscribe((res) => {
      if (res.isSuccess) {
        const data = res.data;
        this.buildLines(id, data.lines);
      }
    });
  }
  //#endregion

  //#region  Lines
  linesFormArray(): FormArray {
    return this.technicalInspectionForm.get('lines') as FormArray;
  }

  GenerateLines1(deliveryId: number, data: any, lineIndex: number) {
    this.linesList = data;
    const control = this.linesFormArray();
    control.removeAt(lineIndex);
    control.insert(
      lineIndex,
      this.formbuilder.group({
        id: 0,
        item: data.item,
        type: data.type,
        uom: data.uom,
        ordered: data.ordered,
        received: data.received,
        billed: data.billed,
        cancelled: data.cancelled,
        price: data.price,
        accessory: data.accessory,
        requiredInspection: data.requiredInspection,
        deliveryReceived: data.deliveryReceived,
        remaining: data.remaining,
        description: data.description,
        deliveryId: deliveryId,

      })
    );
  }

  buildLines(deliveryId: number, data: any) {
    this.linesList = data;
    this.linesFormArray()?.value.forEach((e: any) => {
      this.linesFormArray().removeAt(e);
    });
    if (this.linesList)
    {
      this.linesList.forEach((p) => {
        this.linesFormArray().push(
          this.formbuilder.group({
            id: deliveryId == 0 ? 0 : p.id,
            item: deliveryId == 0 ? p.iteM_NUMBER : { item: p.item },
            type: deliveryId == 0 ? p.linE_TYPE : p.type,
            uom: deliveryId == 0 ? p.uniT_MEASURE : p.uom,
            ordered: deliveryId == 0 ? p.quantitY_ORDERED : p.ordered,
            received: deliveryId == 0 ? p.quantitY_RECEIVED : p.received,
            billed: deliveryId == 0 ? p.quantitY_BILLED : p.billed,
            cancelled: deliveryId == 0 ? p.quantitY_CANCELLED : p.cancelled,
            price: deliveryId == 0 ? p.uniT_PRICE : p.price,
            accessory: deliveryId == 0 ? false : p.accessory,
            requiredInspection: deliveryId == 0 ? false : p.requiredInspection,
            deliveryReceived: deliveryId == 0 ? 0 : p.deliveryReceived,
            remaining: deliveryId == 0 ? p.quantitY_ORDERED : p.remaining,
            description: deliveryId == 0 ? p.iteM_DESCRIPTION : p.description,
            deliveryId: deliveryId == 0 ? 0 : p.id,
            costCenters: deliveryId == 0 ? []:[p.costCenters],
            technicalInspection: deliveryId == 0 ? []:p.technicalInspection
          })
        );
      });
    }

  }

  bindPoLine(event: any, lineIndex: number) {
    let existItem: boolean = false;
    const currentLine = this.linesFormArray().at(lineIndex).get('item')
      ?.value?.item;
    let index = 0;

    this.linesFormArray()?.value.forEach((e: any) => {

      if (e.item.item == event.item && index != lineIndex) {
        existItem = true;
      }
      index++;
    });

    if (existItem) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The selected item already exist in current delivery',
        life: 3000,
      });
      this.linesFormArray().at(lineIndex).get('item')?.setValue('');
    } else {
      this.GenerateLines1(this.deliveryId, event, lineIndex);
      this.linesFormArray().at(lineIndex).get('item')?.setValue(event);
    }
  }
  searchPoLine(event: any) {
    this.getPOLinesAutoComplete(event.query);
  }
  getPOLinesAutoComplete(searchText: any = '') {
    let data = {
      deliveryId: this.deliveryInspactionData.id,
      searchText: searchText,
    };
    this.assetdeliveryService.getPOLinesAutoComplete(data).subscribe((res) => {
      this.selectedPOLines = res;
    });
  }
  clearPoLine(index: number) {
    this.linesFormArray().at(index).get('item')?.setValue('');
  }

  checkRequiredInspection(event: any, index: number) {
    this.linesFormArray()
      .at(index)
      .get('accessory')
      ?.setValue(!event.isTrusted);
    this.linesFormArray()
      .at(index)
      .get('requiredInspection')
      ?.setValue(event.isTrusted);
      this.linesFormArray().at(index).value.costCenters = this.deliveryInspactionData.lines[index].costCenters;
  }
  checkAccessory(event: any, index: number) {
    this.linesFormArray()
      .at(index)
      .get('requiredInspection')
      ?.setValue(!event.isTrusted);
    this.linesFormArray().at(index).get('accessory')?.setValue(event.isTrusted);
    this.linesFormArray().at(index).value.costCenters = this.deliveryInspactionData.lines[index].costCenters;
  }

  getLine(id: number, inspectionFlag: boolean, accesoryFlag: boolean) {
    this.assetdeliveryService.getLine(id).subscribe((res) => {
      if (res.isSuccess) {
        const data = res.data;
        data.requiredInspection = inspectionFlag;
        data.accessory = accesoryFlag;
        this.updateLine(id, data);
      }
    });
  }

  updateLine(id: number, data: any) {
    this.assetdeliveryService.updateLine(data).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
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

  addMorelines() {
    this.linesFormArray().push(
      this.formbuilder.group({
        id: 0,
        item: [''],
        type: [''],
        uom: [''],
        ordered: 0,
        received: 0,
        billed: 0,
        cancelled: 0,
        price: 0,
        accessory: null,
        requiredInspection: null,
        deliveryReceived: 0,
        remaining: 0,
        description: [''],
        deliveryId: 0,
      })
    );
  }
  //#endregion

  //#region  Registry Files

  //#endregion

  //#region   Technical Inspection
  addtechnicalinspection(index: any) {
    var requiredInspection =
      this.linesFormArray().at(index).value.requiredInspection;
    if (requiredInspection) {
      // var lineId = this.linesFormArray().at(index).value.id;
      // var item = this.linesFormArray().at(index).value.item;
      // var deliveryId = this.linesFormArray().at(index).value.deliveryId;
      var item: any = {};
      const modalRef = this.modalService.open(
        TechnicalInspectionModalComponent,
        { size: 'lg' }
      );
      modalRef.componentInstance.lineIndex = index;
      modalRef.componentInstance.deliveryInspactionData = this.deliveryInspactionData;
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.hideContinue = this.hideContinue;
      modalRef.result.then((res) => {
        this.deliveryInspactionData.lines[index]=res;
        this.linesFormArray().at(index).value.technicalInspection=res.technicalInspection;
        this.linesFormArray().at(index).value.costCenters = res.costCenters;
      });
    }
  }
  //#endregion

  //#region   Cost Center
  addcostcenter(index: any) {


      var remaining: number =
        this.deliveryInspactionData.lines[index].remaining +
        this.deliveryInspactionData.lines[index].deliveryReceived;
      const modalRef = this.modalService.open(CostCenterModalComponent, {
        size: 'lg',
      });
      modalRef.componentInstance.lineIndex = index;
      modalRef.componentInstance.deliveryInspactionData =this.deliveryInspactionData;
      var item: any = {};
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.hideContinue = this.hideContinue;
      modalRef.result.then((res) => {
        this.deliveryInspactionData.lines[index].costCenters = res.costCenters;
        this.calc(index, remaining);
        this.linesFormArray().at(index).value.costCenters = res.costCenters;
      });

  }

  calc(index: any, remaining: any) {
    let line = this.deliveryInspactionData.lines[index];
    this.linesFormArray().at(index).value.remaining = 0;
   // this.linesFormArray().at(index).
    var cs: any[] = [];
    cs = line.costCenters;
    var total: any = 0;
    cs.forEach((c) => {
      total += c.quantity;
    });
    this.linesFormArray()
      .at(index)
      .get('remaining')
      ?.setValue(remaining - total);
    this.linesFormArray().at(index).get('deliveryReceived')?.setValue(total);
  }
  getCostCenters(data: any) {
    var costcentersb = this.assetdeliveryService
      .getCostCenters(data)
      .subscribe((res: any) => {
        this.costCenterList = res.costCenterDetails;
      });
    this.unsubscribe.push(costcentersb);
  }
  //#endregion

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  getControls(controlName: string) {
    return (<FormArray>this.technicalInspectionForm.get(controlName)).controls;
  }

  removeControl(controlName: string, index: number) {
    (this.technicalInspectionForm.get(controlName) as FormArray).removeAt(
      index
    );
  }

  print(){
    this.router.navigate(['/maintenance/asset-delivery/report'], { queryParams: { deliveryId: this.deliveryInspactionData.id,reportNo:1 } });
  }

  getLookup(){
    var deliveryTypes = this.assetdeliveryService.getLookup(Lookup.DeliveryType).subscribe((res: any) => {
       this.deliveryTypelist = res.data
       if (this.deliveryInspactionData.deliveryTypeId)
       {
          this.changedeliveryType({id:this.deliveryInspactionData.deliveryTypeId});
          if (this.deliveryInspactionData.paymentTerms)
                this.technicalInspectionForm.controls['paymentTerms'].setValue(this.deliveryInspactionData.paymentTerms);
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
     this.technicalInspectionForm.controls['paymentTerms'].setValue(null);
   }

   onApprovedBySelected(event:any){
    this.technicalInspectionForm.controls['deliveryApprovedBy'].setValue(event.rowData["Employee Name"]);
    this.technicalInspectionForm.controls['deliveryApprovedById'].setValue(event.rowData["Employee Number"]);
  }

  onInspectionBySelected(event:any){
    this.technicalInspectionForm.controls['inspectionBy'].setValue(event.rowData["Employee Name"]);
    this.technicalInspectionForm.controls['inspectionById'].setValue(event.rowData["Employee Number"]);
  }
}
