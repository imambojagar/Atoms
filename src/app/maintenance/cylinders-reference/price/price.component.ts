import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ReferenceCylindersLOX } from '../data/cylinders-reference.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CylindersReferenceService } from '../data/cylinders-reference.service';
/* import validateForm from 'src/app/shared/helpers/validateForm'; */
import { buildReferenceForm } from '../data/cylinders-reference-form-builder';
/* import { ModelService } from 'src/app/data/service/model-definition.service'; */
import { cylinderProperties } from '../../ordering-cylinders-lox/data/ordering-cylinders-lox.model';
import { ModelService } from '../../../services/model-definition.service';
import validateForm from '../../../shared/helpers/validateForm';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
})
export class PriceComponent implements OnChanges {

  @Input('showmodal') showmodal : boolean = false ;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('edit_asset_id') edit_asset_id: number = 0;
  @Input('indexprice') indexprice: number = 0;

  refForm!: FormGroup;
  model!: ReferenceCylindersLOX;
  id: number = 0;
  items!: MenuItem[];
  tabIndex: number = 0;

  inAddMode: boolean = false;
  inEditMode: boolean = false;
  inViewMode: boolean = false;
  isLoading: boolean = false;

  suppliersList: any[] = [];

  cylindersArr = cylinderProperties;

  constructor(
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: Router,
    private api: CylindersReferenceService,
    private modelService: ModelService
  ) {}

  close_modal() {
    this.openModals.emit(false);
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  Init() {
   /*  this.router.queryParams.subscribe((params: any) => { */
      this.id = 0;
      this.tabIndex = this.indexprice; // params.index;
      if (this.edit_asset_id) this.id = this.edit_asset_id;
    /* }); */


    this.buildForm();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Cylinders Price Reference' },
    ];
  }

  //#region Build Form and Get Index
  buildForm() {
    if (this.id == 0) {
      this.model = { id: 0 };
      this.refForm = buildReferenceForm(this.model, this.fb);
      this.inAddMode = true;
    } else {
      if (this.tabIndex == 0) {
        this.inViewMode = true;
      } else {
        this.inEditMode = true;
      }
      this.getbuildReferenceData();
    }
  }

  getbuildReferenceData() {
    this.api.getSingleCylinderPrice(this.id).subscribe((res: any) => {
      this.model = res.data as ReferenceCylindersLOX;
      this.model.supplierName = { suppliername: res.data.supplierName };
      this.refForm = buildReferenceForm(this.model, this.fb);
    });
  }

  changeTabIndex(tab: any) {
    if (tab.index == 1) {
      this.inViewMode = false;
      this.inEditMode = true;
    } else {
      this.inViewMode = true;
      this.inEditMode = false;
    }
  }
  //#endregion

  //#region Supplier
  getSpplier($event: any) {
    return this.modelService
      .getSupplier({ suppliername: $event.query })
      .subscribe((res: any) => {
        this.suppliersList = res.data;
      });
  }
  onSelectSupplier(supplier: any) {
    this.refForm.get('supplierId')?.setValue(supplier.id);
  }
  //#endregion

  //#region Save and Delete
  save() {
    if (this.refForm.invalid) {
      validateForm.validateAllFormFields(this.refForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.isLoading = true;
      let m = this.refForm.value as ReferenceCylindersLOX;
      m.loX2Volume = m.loX1Volume;
      m.liquidNitrogenLarge121LEmpty = m.liquidNitrogenSmall30LEmpty;
      m.liquidNitrogenMedium50LEmpty = m.liquidNitrogenSmall30LEmpty;
      console.log(m);
      if (m.id == 0) {
        //add
        this.api.addCylinderPrice(m).subscribe({
          next: (res) => {
            this.apiResponse(res);
            this.isLoading = false;
          },
          error: (e) => {
            console.error('unable to save ', e);
          },
        });
      } else {
        //update
        this.api.updateCylinderPrice(m).subscribe({
          next: (res) => {
            this.apiResponse(res);
          },
          error: (e) => {
            console.error('unable to save ', e);
          },
        });
      }
    }
  }

  delete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Reference?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteCylinderPrice(this.id).subscribe((res) => {
          this.apiResponse(res);
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'You have cancelled',
        });
      },
    });
  }

  apiResponse(res: any) {
    const message = res.message;
    const sucess = res.isSuccess;
    if (sucess == true) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });
      this.route.navigate(['maintenance/cylinders-reference/price']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }
}
