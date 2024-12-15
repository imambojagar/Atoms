import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AssetDeliveryService } from '../../../../services/asset-delivery.service';
import validateForm from '../../../../shared/helpers/validateForm';
import { TechnicalInspectionModalComponent } from '../../technical-assistance-modal/technical-inspection-modal.component';
import { CostCenterModalComponent } from '../../cost-center-modal/cost-center-modal.component';
/* import { AssetDeliveryService } from 'src/app/data/service/asset-delivery.service';
import { CostCenterModalComponent } from '../../cost-center-modal/cost-center-modal.component';
import { IAssetDelivery } from 'src/app/data/models/asset-delivery-model';
import { TechnicalInspectionModalComponent } from '../../technical-assistance-modal/technical-inspection-modal.component';
import { formatDate } from '@angular/common';
import validateForm from 'src/app/shared/helpers/validateForm'; */

type Tabs = 'Lines' | 'RegistryFiles';
@Component({
  selector: 'app-technical-inspection',
  templateUrl: './technical-inspection.component.html',
  styleUrls: ['./technical-inspection.component.scss'],
})
export class TechnicalInspectionComponent
  implements OnInit, OnDestroy, OnChanges
{
  technicalInspectionData: any;
  technicalInspectionForm!: FormGroup;
  @Input()
  set technicalInspection(val: any) {
    this.technicalInspectionData = val;
    if (val.statusValue > 3) {
      this.hideContinue = false;
    } else {
      this.hideContinue = true;
    }
    if (val.statusValue==8)
    {
      this.isCancel=true;
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
  isCancel:boolean=false;
  private unsubscribe: Subscription[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private assetdeliveryService: AssetDeliveryService,
    private modalService: NgbModal,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formbuilder: FormBuilder,
    private router: Router
  ) {}

  //#region   Build Form
  buildTechnicalInspectionForm(formbuilder: FormBuilder) {
    return formbuilder.group({
      lines: this.formbuilder.array([]),
      registryFiles: this.formbuilder.array([]),
      history: this.formbuilder.array([]),
    });
  }
  //#endregion

  //#region   Event
  ngOnInit(): void {
    this.technicalInspectionForm = this.buildTechnicalInspectionForm(
      this.formbuilder
    );
    // this.buildregistryFiles(
    //   this.technicalInspectionData.id,
    //   this.technicalInspectionData.registryFiles
    // );
    this.buildLines(
      this.technicalInspectionData.id,
      this.technicalInspectionData.lines
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {}

  continue() {
    this.sendContinueCurrentPage.emit(2);
  }

  back() {
    this.sendBackCurrentPage.emit();
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
        id: this.technicalInspectionData.id,
        statusId: 3,
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
        this.buildregistryFiles(id, data.registryFiles);
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
      deliveryId: this.technicalInspectionData.id,
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
    // var lineId = this.linesFormArray().at(index).value.id;
    // var accessory = this.linesFormArray().at(index).value.accessory;
    // var requiredInspection =
    //   this.linesFormArray().at(index).value.requiredInspection;
    // this.getLine(lineId, requiredInspection, accessory);
  }
  checkAccessory(event: any, index: number) {
    this.linesFormArray()
      .at(index)
      .get('requiredInspection')
      ?.setValue(!event.isTrusted);
    this.linesFormArray().at(index).get('accessory')?.setValue(event.isTrusted);
    // var lineId = this.linesFormArray().at(index).value.id;
    // var accessory = this.linesFormArray().at(index).value.accessory;
    // var requiredInspection =
    //   this.linesFormArray().at(index).value.requiredInspection;
    // this.getLine(lineId, requiredInspection, accessory);
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
  registryFilesFormArray(): FormArray {
    return this.technicalInspectionForm.get('registryFiles') as FormArray;
  }

  buildregistryFiles(deliveryId: number, data: any) {
    this.registerFileslist = data;
    this.registryFilesFormArray()?.value.forEach((e: any) => {
      this.registryFilesFormArray().removeAt(e);
    });
    this.registerFileslist.forEach((p) => {
      this.registryFilesFormArray().push(
        this.formbuilder.group({
          id: deliveryId == 0 ? 0 : p.id,
          fileName: deliveryId == 0 ? p.name : p.fileName,
          available: deliveryId == 0 ? false : p.available,
          notAvailable: deliveryId == 0 ? false : p.notAvailable,
          notRequired: deliveryId == 0 ? false : p.notRequired,
          deliveryId: deliveryId == 0 ? 0 : p.deliveryId,
        })
      );
    });
  }

  getRegistryFile(
    id: number,
    availableFlag: boolean,
    notAvailableFlag: boolean,
    notRequiredFlag: boolean
  ) {
    // this.assetdeliveryService.getRegistryFile(id).subscribe((res) => {
    //   if (res.isSuccess) {
    //     const data = res.data;
    //     data.available = availableFlag;
    //     data.notAvailable = notAvailableFlag;
    //     data.notRequired = notRequiredFlag;
    //     this.updateRegisterFile(id, data);
    //   }
    // });
  }

  updateRegisterFile(id: number, data: any) {
    this.assetdeliveryService.updateRegistryFile(data).subscribe((res) => {
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

  checkFileAvailable(event: any, index: number) {
    if (event.isTrusted) {
      this.registryFilesFormArray()
        .at(index)
        .get('available')
        ?.setValue(event.isTrusted);
      this.registryFilesFormArray()
        .at(index)
        .get('notRequired')
        ?.setValue(!event.isTrusted);
      this.registryFilesFormArray()
        .at(index)
        .get('notAvailable')
        ?.setValue(!event.isTrusted);
    } else {
      this.registryFilesFormArray()
        .at(index)
        .get('notRequired')
        ?.setValue(false);
      this.registryFilesFormArray()
        .at(index)
        .get('notAvailable')
        ?.setValue(false);
      this.registryFilesFormArray().at(index).get('available')?.setValue(false);
    }
    var notRequired = this.registryFilesFormArray().at(index).get('notRequired')
      ?.value.available;

    var notAvailable = this.registryFilesFormArray()
      .at(index)
      .get('notAvailable')?.value.notAvailable;
    var registryFileId = this.registryFilesFormArray().at(index).value.id;
    this.getRegistryFile(
      registryFileId,
      event.isTrusted,
      notAvailable,
      notRequired
    );
  }
  checkFileNonAvailable(event: any, index: number) {
    if (event.isTrusted) {
      this.registryFilesFormArray()
        .at(index)
        .get('notAvailable')
        ?.setValue(event.isTrusted);
      this.registryFilesFormArray()
        .at(index)
        .get('available')
        ?.setValue(!event.isTrusted);
      this.registryFilesFormArray()
        .at(index)
        .get('notRequired')
        ?.setValue(!event.isTrusted);
    } else {
      this.registryFilesFormArray()
        .at(index)
        .get('notRequired')
        ?.setValue(false);
      this.registryFilesFormArray()
        .at(index)
        .get('notAvailable')
        ?.setValue(false);
      this.registryFilesFormArray().at(index).get('available')?.setValue(false);
    }
    var available = this.registryFilesFormArray().at(index).get('available')
      ?.value.available;
    var notRequired = this.registryFilesFormArray().at(index).get('notRequired')
      ?.value.notAvailable;
    var registryFileId = this.registryFilesFormArray().at(index).value.id;
    this.getRegistryFile(
      registryFileId,
      available,
      event.isTrusted,
      notRequired
    );
  }
  checkFileRequired(event: any, index: number) {
    if (event.isTrusted) {
      this.registryFilesFormArray()
        .at(index)
        .get('notRequired')
        ?.setValue(event.isTrusted);
      this.registryFilesFormArray()
        .at(index)
        .get('notAvailable')
        ?.setValue(!event.isTrusted);
      this.registryFilesFormArray()
        .at(index)
        .get('available')
        ?.setValue(!event.isTrusted);
    } else {
      this.registryFilesFormArray()
        .at(index)
        .get('notRequired')
        ?.setValue(false);
      this.registryFilesFormArray()
        .at(index)
        .get('notAvailable')
        ?.setValue(false);
      this.registryFilesFormArray().at(index).get('available')?.setValue(false);
    }
    var available = this.registryFilesFormArray().at(index).get('available')
      ?.value.available;
    var notAvailable = this.registryFilesFormArray()
      .at(index)
      .get('notAvailable')?.value.notAvailable;
    var registryFileId = this.registryFilesFormArray().at(index).value.id;
    this.getRegistryFile(
      registryFileId,
      available,
      notAvailable,
      event.isTrusted
    );
  }
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
      modalRef.componentInstance.technicalInspectionData = this.technicalInspectionData;
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.hideContinue = this.hideContinue;
      modalRef.result.then((res) => {
        this.technicalInspectionData.lines[index]=res;
        this.linesFormArray().at(index).value.technicalInspection=res.technicalInspection;
        this.linesFormArray().at(index).value.costCenters = res.costCenters;
      });
    }
  }
  //#endregion

  //#region   Cost Center
  addcostcenter(index: any) {
    var requiredInspection =
      this.linesFormArray().at(index).value.requiredInspection;
    var accessory = this.linesFormArray().value.accessory;
    if (requiredInspection != accessory) {

      var remaining: number =
        this.technicalInspectionData.lines[index].remaining +
        this.technicalInspectionData.lines[index].deliveryReceived;
      const modalRef = this.modalService.open(CostCenterModalComponent, {
        size: 'lg',
      });
      modalRef.componentInstance.lineIndex = index;
      modalRef.componentInstance.technicalInspectionData =
        this.technicalInspectionData;
        modalRef.componentInstance.hideContinue = this.hideContinue;
      modalRef.result.then((res) => {
        this.technicalInspectionData.lines[index].costCenters = res;
        this.calc(index, remaining);
        (this.technicalInspectionForm.get('lines') as FormArray).at(index).value.costCenters = res;
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please check item is Accessory or RequiredInspection',
        life: 3000,
      });
    }
  }

  calc(index: any, remaining: any) {
    let line = this.technicalInspectionData.lines[index];
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
    this.router.navigate(['/maintenance/asset-delivery/report'], { queryParams: { deliveryId: this.technicalInspectionData.id,reportNo:1 } });
  }
}
