import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { PrimengModule } from '../../../shared/primeng.module';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupplierModel } from '../../../models/supplier-model';
import { SupplierPersons } from '../../../models/supplierPersons';
import { Attachments } from '../../../models/attachment-model';
import {
  ConfirmationService,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';
import { SupplierService } from '../../../services/supplier.service';
import { Router } from '@angular/router';
import validateForm from '../../../shared/helpers/validateForm';
import { AdressModel } from '../../../models/address-model';
import { FaxModel } from '../../../models/fax-model';
import { TelephoneModel } from '../../../models/telephone-model';
import { Lookup } from '../../../shared/enums/lookup';
import { AttachmentsComponent } from '../../../shared/components/attachments/attachments.component';

@Component({
  selector: 'app-add-supplier',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AttachmentsComponent,
  ],
  templateUrl: './add-supplier.component.html',
  styleUrl: './add-supplier.component.scss',
})
export class AddSupplierComponent implements OnInit {
  @Input('showmodal') showAddModal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('supplier_id') supplier_id: any;
  @Input('supplier_index') supplier_index: any;

  addSupplierForm!: FormGroup;
  supplierPersonsForm!: FormGroup;
  attachmentForm!: FormGroup;
  supplierModel: SupplierModel = new SupplierModel();
  supplierPersonsModel!: SupplierPersons[];
  attachmentModel!: Attachments[];
  msgs!: Message[];
  isSubmitted = false;
  uploadedFiles: any[] = [];
  items!: MenuItem[];
  addrButton: string = '';
  faxButton: string = '';
  teleButton: string = '';
  btnClick: any;
  inputField: any;
  statusList: [] = [];
  roleList: [] = [];
  cityList: [] = [];
  multiple: boolean = true;
  fileToUpload: File | null = null;
  fileList: File[] = [];
  fileName!: string;
  codes: any[] = [];
  codeName: any[] = [];
  codeList: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private formbuilder: FormBuilder,
    // private authService: AuthService,
    private api: SupplierService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.addSupplierForm = this.formbuilder.group({
      suppliername: ['', Validators.required],
      website: [''],
      //name: [''],
      email: ['', Validators.email],
      //code: [''],
      suppStatusId: [''],
      cityId: [''],
      person: [''],
      comment: [''],
      zipcode: [''],
      contact: [''],
      suppOracleCode: [''],
      attachments: this.formbuilder.array([
        (this.attachmentForm = this.formbuilder.group({
          attachmentName: [''],
          attachmentURL: [''],
          supplierId: [''],
          id: [''],
        })),
      ]),
      suppPersons: this.formbuilder.array([
        (this.supplierPersonsForm = this.formbuilder.group({
          supplierId: [''],
          personName: [''],
          personRoleId: [''],
          contact: [''],
          externalEngCode: [''],
          email: ['', Validators.email],
        })),
      ]),
      addresses: this.formbuilder.array([this.formbuilder.control('')]),
      faxes: this.formbuilder.array([this.formbuilder.control('')]),
      telephones: this.formbuilder.array([this.formbuilder.control('')]),
      suppTCodes: this.formbuilder.array([]),
    });

    this.getCodes();
    this.getStatus();
    this.getCity();
    this.getRoles();
    // this.items = [
    //   { label: 'Home', routerLink: ['/'] },
    //   { label: 'Add Supplier' },
    // ];
  }

  getCodes() {
    this.api.getLookups({ queryParams: 407 }).subscribe((res) => {
      this.codeList = res.data;
      for (let i = 0; i < this.codeList.length; i++) {
        (this.addSupplierForm.get('suppTCodes') as FormArray).push(
          this.formbuilder.group({
            id: 0,
            supplierId: 0,
            codeTypeId: [this.codeList[i].id],
            codeValue: [''],
          })
        );

        this.codeName.push(this.codeList[i].name);
      }
      this.cdr.detectChanges();
    });
  }
  suppTCodesControl() {
    return (<FormArray>this.addSupplierForm.get('suppTCodes')).controls;
  }
  handleFileInput(files: any) {
    console.log('files event', files.currentFiles);
    this.fileList = files.currentFiles[0];
    console.log('this.fileList', this.fileList);
    this.api.uploadFiles(this.fileList).subscribe((res) => {
      const data = res.data;
      this.attachmentForm.value.attachmentName = data[0];
      console.log(
        'this.attachmentForm.value.attachmentName',
        this.attachmentForm.value.attachmentName
      );
      const sucess = res.isSuccess;
      const message = res.message;
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

  //address Array

  addressControl() {
    return (<FormArray>this.addSupplierForm.get('addresses')).controls;
  }
  addAddr() {
    const control = new FormControl('');
    this.addressControl().push(control);
  }
  addMoreAddress() {
    (this.addSupplierForm.get('addresses') as FormArray).push(
      this.formbuilder.control('')
    );
  }
  removeAddress(index: number) {
    (this.addSupplierForm.get('addresses') as FormArray).removeAt(index);
  }

  //fax array
  faxControl() {
    return (<FormArray>this.addSupplierForm.get('faxes')).controls;
  }
  addFax() {
    const control = new FormControl('');
    this.faxControl().push(control);
  }
  addMoreFax() {
    (this.addSupplierForm.get('faxes') as FormArray).push(
      this.formbuilder.control('')
    );
  }
  removeFax(index: number) {
    (this.addSupplierForm.get('faxes') as FormArray).removeAt(index);
  }

  //telephone array
  telephoneControl() {
    return (<FormArray>this.addSupplierForm.get('telephones')).controls;
  }
  addTele() {
    const control = new FormControl('');
    this.telephoneControl().push(control);
  }
  addMoreTelephone() {
    (this.addSupplierForm.get('telephones') as FormArray).push(
      this.formbuilder.control('')
    );
  }
  removeTelephone(index: number) {
    (this.addSupplierForm.get('telephones') as FormArray).removeAt(index);
  }

  personsControl() {
    return (<FormArray>this.addSupplierForm.get('suppPersons')).controls;
  }
  removePerson(index: number) {
    (this.addSupplierForm.get('suppPersons') as FormArray).removeAt(index);
  }
  addMorePersons() {
    (this.addSupplierForm.get('suppPersons') as FormArray).push(
      this.formbuilder.group({
        supplierId: [''],
        personName: [''],
        personRoleId: [''],
        contact: [''],
        externalEngCode: [''],
        email: ['', Validators.email],
      })
    );
  }

  getStatus() {
    this.api.getLookups({ queryParams: 35 }).subscribe((res) => {
      this.statusList = res.data;
      this.cdr.detectChanges();
    });
  }

  getRoles() {
    this.api.getLookups({ queryParams: 36 }).subscribe((res) => {
      this.roleList = res.data;
      this.cdr.detectChanges();
    });
  }

  getCity() {
    this.api.getLookups({ queryParams: 11 }).subscribe((res) => {
      this.cityList = res.data;
      this.cdr.detectChanges();
    });
  }

  changeStatus(event: any) {
    this.addSupplierForm.value.suppStatusId = event.value;
  }

  changeRole(event: any, index: number) {
    const personArray = <FormArray>this.addSupplierForm.controls['suppPersons'];
    const itemFormGroup = <FormGroup>personArray.controls[index];
    itemFormGroup.controls['personRoleId'].setValue(event.value);

    // this.supplierPersonsForm.value.personRoleId=event.value;
  }

  changeCity(event: any) {
    this.addSupplierForm.value.cityId = event.value;
  }

  //submit form
  addSupplierSubmit() {
    console.log('form values:', this.addSupplierForm.value);
    console.log('persons form values:', this.addSupplierForm.value.suppPersons);
    console.log('this.supplierPersonsModel', this.supplierPersonsModel);
    if (this.addSupplierForm.invalid) {
      validateForm.validateAllFormFields(this.addSupplierForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.supplierModel.suppliername = this.addSupplierForm.value.suppliername;
      this.supplierModel.website = this.addSupplierForm.value.website;
      this.supplierModel.email = this.addSupplierForm.value.email;
      this.supplierModel.suppStatusId = this.addSupplierForm.value.suppStatusId;
      this.supplierModel.person = this.addSupplierForm.value.person;
      this.supplierModel.cityId = this.addSupplierForm.value.cityId;
      this.supplierModel.comment = this.addSupplierForm.value.comment;
      this.supplierModel.contact = this.addSupplierForm.value.contact;
      this.supplierModel.zipcode = this.addSupplierForm.value.zipcode;
      this.supplierModel.suppOracleCode =
        this.addSupplierForm.value.suppOracleCode;
      this.supplierModel.suppTCodes = this.addSupplierForm.value.suppTCodes;

      //this.supplierModel.suppPersons.push(this.supplierPersonsModel);
      //this.supplierModel.suppPersons=this.addSupplierForm.value.suppPersons;

      if (!this.supplierModel.suppPersons) {
        this.supplierModel.suppPersons = [];
      }
      (this.addSupplierForm.get('suppPersons') as FormArray).controls.forEach(
        (element) => {
          let person = new SupplierPersons();
          person.supplierId = this.supplierModel.id;
          person.contact = element.value.contact;
          person.email = element.value.email;
          person.externalEngCode = element.value.externalEngCode;
          person.personName = element.value.personName;
          person.personRoleId = element.value.personRoleId;

          this.supplierModel.suppPersons.push(person);
        }
      );

      if (!this.supplierModel.addresses) {
        this.supplierModel.addresses = [];
      }
      (this.addSupplierForm.get('addresses') as FormArray).controls.forEach(
        (element) => {
          let adress = new AdressModel();
          adress.supplierId = this.supplierModel.id;
          adress.address = element.value;

          this.supplierModel.addresses.push(adress);
        }
      );

      if (!this.supplierModel.faxes) {
        this.supplierModel.faxes = [];
      }
      (this.addSupplierForm.get('faxes') as FormArray).controls.forEach(
        (element) => {
          let fax = new FaxModel();
          fax.supplierId = this.supplierModel.id;
          fax.fax = element.value;

          this.supplierModel.faxes.push(fax);
        }
      );

      if (!this.supplierModel.telephones) {
        this.supplierModel.telephones = [];
      }
      (this.addSupplierForm.get('telephones') as FormArray).controls.forEach(
        (element) => {
          let tele = new TelephoneModel();
          tele.supplierId = this.supplierModel.id;
          tele.telephone = element.value;

          this.supplierModel.telephones.push(tele);
        }
      );

      if (!this.supplierModel.attachments) {
        this.supplierModel.attachments = [];
      }
      (this.addSupplierForm.get('attachments') as FormArray).controls.forEach(
        (element) => {
          let attach = new Attachments();
          attach.supplierId = this.supplierModel.id;
          attach.attachmentName = this.attachmentForm.value.attachmentName;
          attach.attachmentURL = null;
          console.log('attach', attach);
          this.supplierModel.attachments.push(attach);
        }
      );

      console.log('supplier model :', this.supplierModel);
      this.api.postSupplier(this.supplierModel).subscribe((res) => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
          this.addSupplierForm.reset();
          this.close_add_modal();
          // this.router.navigate(['/reference-table/supplier']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
          if (message == 'Name is duplicated!') {
            this.supplierModel = new SupplierModel();
            console.log('this.supplierModel', this.supplierModel);
            validateForm.validateAllFormFields(this.addSupplierForm);
          }
        }
        this.cdr.detectChanges();
      });
    }
  }
  ready(event: any) {
    console.log('attach', event);
    this.attachmentForm.value.attachmentName = event[0];
  }

  //bind lookup and
  getAndBindLookup(lookup: Lookup, targetProp: (a: any) => void) {
    this.api
      .getLookups({ queryParams: lookup })
      .subscribe((res) => targetProp(res.data));
  }

  cancel() {
    this.addSupplierForm.reset();
  }

  close_add_modal() {
    this.addSupplierForm.reset();
    this.openModals.emit(false);
  }
}
