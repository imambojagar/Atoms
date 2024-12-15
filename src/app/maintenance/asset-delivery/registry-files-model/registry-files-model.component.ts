import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { AssetDeliveryService } from '../../../services/asset-delivery.service';
/* import { AssetDeliveryService } from 'src/app/data/service/asset-delivery.service'; */

type Tabs = 'RegistryFiles';
@Component({
  selector: 'app-registry-files-model',
  templateUrl: './registry-files-model.component.html',
  styleUrls: ['./registry-files-model.component.scss'],
})
export class RegistryFilesModelComponent {
  registryFilesForm!: FormGroup;

  @Input() set registryFilesInput(val: any[]) {
    this.buildregistryFiles(0, val);
  }

  @Output() closeModel: EventEmitter<void> = new EventEmitter<void>();

  activeTab: Tabs = 'RegistryFiles';
  registerFileslist: any[] = [];

  constructor(
    private assetdeliveryService: AssetDeliveryService,
    private modalService: NgbModal,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.buildRegistryFilesForm();
  }

  //#region   Build Form
  buildRegistryFilesForm() {
    this.registryFilesForm = this.formBuilder.group({
      registryFiles: this.formBuilder.array([
        this.formBuilder.group({
          id: [0],
          fileName: [''],
          available: [false],
          notAvailable: [false],
          notRequired: [false],
          deliveryId: [0],
        }),
      ]),
    });
  }
  //#endregion

  //#region  Registry Files
  registryFilesFormArray(): FormArray {
    return this.registryFilesForm.get('registryFiles') as FormArray;
  }

  buildregistryFiles(deliveryId: number, data: any[]) {
    this.registerFileslist = data;
    this.registryFilesFormArray().value.forEach((e: any) => {
      this.registryFilesFormArray().removeAt(e);
    });
    this.registerFileslist.forEach((p) => {
      this.registryFilesFormArray().push(
        this.formBuilder.group({
          id: p.id,
          fileName: p.fileName,
          available: p.available,
          notAvailable: p.notAvailable,
          notRequired: p.notRequired,
          deliveryId: p.deliveryId,
        })
      );
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
  }
  //#endregion

  save() {
    this.assetdeliveryService
      .updateRegistryFiles(this.registryFilesForm.value.registryFiles)
      .subscribe((res: any) => {
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

  closeRegistryFilesModel() {
    this.closeModel.emit();
  }
}
