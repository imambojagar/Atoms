import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  MessageService,
  ConfirmationService,
  Message,
  MenuItem,
  SelectItem,
} from 'primeng/api';
import { NameDefinitionModel } from '../../../models/name-definition-model';
import { ApiService } from '../../../services/name-definition.service';
import validateForm from '../../../shared/helpers/validateForm';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { TrPipe } from '../../../shared/pipes/tr.pipe';

/* import { NameDefinitionModel } from 'src/app/data/models/name-definition-model';
import { AuthService } from 'src/app/data/service/auth.service';
import { ApiService } from 'src/app/data/service/name-definition.service';
import validateForm from 'src/app/shared/helpers/validateForm'; */

@Component({
  standalone: true,
  selector: 'add-name-definition',
  templateUrl: './add-name-definition.component.html',
  imports: [CommonModule, FormsModule, PrimengModule, ReactiveFormsModule, TrPipe, TranslateModule],
  styleUrls: ['./add-name-definition.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class AddNameDefinitionComponent implements OnInit {

  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('edit_asset_id') edit_asset_id: number = 0;

  PAGE_TITLE: 'name-definition' = "name-definition";
  addNameForm!: FormGroup;
  isSubmitted = false;
  nameDefinitionModel: NameDefinitionModel = new NameDefinitionModel();

  msgs!: Message[];
  items!: MenuItem[];

  //Dropdown Lists
  businessOptions: [] = [];
  riskOptions: [] = [];
  classOptions: [] = [];
  categoriesOptions: [] = [];
  modilityOptions: [] = [];
  subModilityOptions: [] = [];
  functionOptions: [] = [];
  typeAssetOptions: [] = [];
  equipmentList: any[] = [];
  umdnsOptions: SelectItem[] = [];
  lifeSpanOptions: SelectItem[] = [];
  complexOptions: SelectItem[] = [];

  codes: any[] = [];
  codeName: any[] = [];

  constructor(
    private formbuilder: FormBuilder,
    /* private authService: AuthService, */
    private api: ApiService,
    private router: Router,
    private messageService: MessageService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService
  ) {
    translateService.onLangChange.subscribe((x) => {
      translateService
        .get(['Home', 'Add Asset Nomenclature'])
        .subscribe((translations) => {
          this.items = [
            { label: translations['Home'], routerLink: ['/'] },
            { label: translations['Add Asset Nomenclature'] },
          ];
        });
    });

    console.log("edit id", this.edit_asset_id);
  }

  ngOnInit(): void {
    this.addNameForm = this.formbuilder.group({
      assetname: ['', Validators.required],
      altassetname: [''],
      umdns: [''],
      umdnsId: [''],
      assetrisk: [''],
      complex: [''],
      classfication: [''],
      category: [''],
      business: [''],
      modility: [''],
      submodility: [''],
      functionclass: [''],
      typeasset: [''],
      lifespan: [''],
      assetndcode: [''],
      functionclassId: ['CE'],
      classficationId: [''],
      assetriskId: [''],
      businessId: [''],
      categoryId: [''],
      typeassetId: [''],
      modilityId: [''],
      submodilityId: [''],
      oraclename: [''],
      oracleCodes: this.formbuilder.array([]),
      essentialEquipement: [''],
    });
    this.addNameForm.value.business = null;

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Add Asset Nomenclature' },
    ];

    //get all dropdows
    this.getCodes();
    this.getAssetRisk();
    this.getBusinessCritical();
    this.getCategories();
    this.getClassification();
    this.getFunction();
    this.getModility();
    this.getTypeAsset();
    this.getEquipment();

    //fill compelxity options
    Array(10)
      .fill(0)
      .map((x, i) => {
        this.complexOptions.push({ label: `${i + 1}`, value: i + 1 });
      });

    //fill UMDNS options
  }

  getCodes() {
    this.api.getLookups({ queryParams: 408 }).subscribe((res: any) => {
      this.codes = res.data;
      console.log('codes', this.codes);
      for (let i = 0; i < this.codes.length; i++) {
        (this.addNameForm.get('oracleCodes') as FormArray).push(
          this.formbuilder.group({
            id: 0,
            assetNDId: 0,
            codeTypeId: [this.codes[i].id],
            codeValue: [''],
          })
        );

        this.codeName.push(this.codes[i].name);
      }
    });
  }

  getEquipment() {
    let equipmentObj = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];
    this.equipmentList = equipmentObj;
  }
  oracleCodesControl() {
    return (<FormArray>this.addNameForm.get('oracleCodes')).controls;
  }

  getAssetRisk() {
    this.api.getLookups({ queryParams: 21 }).subscribe((res: any) => {
      this.riskOptions = res.data;
    });
  }

  getBusinessCritical() {
    this.api.getLookups({ queryParams: 22 }).subscribe((res: any) => {
      this.businessOptions = res.data;
    });
  }

  getCategories() {
    this.api.getLookups({ queryParams: 23 }).subscribe((res: any) => {
      this.categoriesOptions = res.data;
    });
  }

  getClassification() {
    this.api.getLookups({ queryParams: 24 }).subscribe((res: any) => {
      this.classOptions = res.data;
    });
  }
  getFunction() {
    this.api.getLookups({ queryParams: 25 }).subscribe((res: any) => {
      this.functionOptions = res.data;
    });
  }
  getModility() {
    this.api.getLookups({ queryParams: 26 }).subscribe((res: any) => {
      this.modilityOptions = res.data;
    });
  }

  getTypeAsset() {
    this.api.getLookups({ queryParams: 28 }).subscribe((res: any) => {
      this.typeAssetOptions = res.data;
    });
  }

  onSelectRisk(event: any) {
    this.addNameForm.value.assetriskId = event.value;
  }
  onSelectBusiness(event: any) {
    this.addNameForm.value.businessId = event.value;
  }
  onSelectCategories(event: any) {
    this.addNameForm.value.categoryId = event.value;
  }
  onSelectClassification(event: any) {
    this.addNameForm.value.classficationId = event.value;
  }
  onSelectFunction(event: any) {
    this.addNameForm.value.functionclassId = event.value;
  }
  onSelectModility(event: any) {
    this.addNameForm.value.modilityId = event.value;
  }

  onSelectTypeAsset(event: any) {
    this.addNameForm.value.typeassetId = event.value;
  }
  onSelectComplex(event: any) {
    this.addNameForm.value.complex = event.value;
  }
  onSelectEquipment(event: any) {
    this.addNameForm.value.essentialEquipement = event.value;
  }

  addNameSubmit() {
    console.log(this.addNameForm.value);
    this.isSubmitted = true;
    if (this.addNameForm.invalid) {
      validateForm.validateAllFormFields(this.addNameForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.nameDefinitionModel.assetname = this.addNameForm.value.assetname;
      this.nameDefinitionModel.complex = this.addNameForm.value.complex;
      this.nameDefinitionModel.lifespan = this.addNameForm.value.lifespan;
      this.nameDefinitionModel.umdns = this.addNameForm.value.umdns;
      this.nameDefinitionModel.assetriskId = this.addNameForm.value.assetriskId;
      this.nameDefinitionModel.businessId = this.addNameForm.value.businessId;
      this.nameDefinitionModel.categoryId = this.addNameForm.value.categoryId;
      this.nameDefinitionModel.classficationId =
        this.addNameForm.value.classficationId;
      this.nameDefinitionModel.functionclassId =
        this.addNameForm.value.functionclassId;
      this.nameDefinitionModel.modilityId = this.addNameForm.value.modilityId;
      this.nameDefinitionModel.submodility = this.addNameForm.value.submodility;
      this.nameDefinitionModel.typeassetId = this.addNameForm.value.typeassetId;
      this.nameDefinitionModel.oracleCodes = this.addNameForm.value.oracleCodes;
      this.nameDefinitionModel.oraclename = this.addNameForm.value.oraclename;
      this.nameDefinitionModel.essentialEquipement =
        this.addNameForm.value.essentialEquipement;
      this.api.postNameDefinition(this.nameDefinitionModel).subscribe({
        next: (res: any) => {
          console.log('API response:', res);
          const message = res.message;
          const success = res.isSuccess;

          if (success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            // this.addNameForm.reset(); // Uncomment if needed
            // this.router.navigate(['/systemsettings/name-definition']); // Uncomment if navigation is required
            this.close_modal();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
        },
        error: (err: any) => {
          console.error('API error:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An unexpected error occurred. Please try again later.',
            life: 3000,
          });
        },
      });
    }
  }

  close_modal() {
    this.ngOnInit()
    // this.addNameForm.reset();
    this.openModals.emit(false);
  }
}
