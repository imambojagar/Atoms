import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SupplierModel } from '../../../models/supplier-model';
import { SupplierPersons } from '../../../models/supplierPersons';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../../services/supplier.service';
import { AdressModel } from '../../../models/address-model';
import { FaxModel } from '../../../models/fax-model';
import { TelephoneModel } from '../../../models/telephone-model';
import validateForm from '../../../shared/helpers/validateForm';
import { Attachments } from '../../../models/attachment-model';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { AttachmentsComponent } from '../../../shared/components/attachments/attachments.component';

@Component({
  selector: 'app-edit-delete-supplier',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AttachmentsComponent,
  ],
  templateUrl: './edit-delete-supplier.component.html',
  styleUrl: './edit-delete-supplier.component.scss',
})
export class EditDeleteSupplierComponent implements OnChanges {
  @Input('showmodal') showEditModal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('supplier_id') supplier_id: any;
  @Input('supplier_index') supplier_index: any;

  linkDialog: boolean = false;

  supplierForm!: FormGroup;
  attachmentForm!: FormGroup;
  formArray!: FormArray;
  supplierPersonsForm!: FormGroup;
  supplierModel: SupplierModel = new SupplierModel();
  supplierPersonsModel: SupplierPersons = new SupplierPersons();
  msgs!: Message[];
  items!: MenuItem[];
  uploadedFiles: any[] = [];
  fileName = '';
  tabIndex: number = 0;
  addrButton: string = '';
  faxButton: string = '';
  teleButton: string = '';
  statusList: [] = [];
  roleList: [] = [];
  cityList: [] = [];
  disabled: boolean = true;
  createdOn!: any;
  modifiedOn!: any;
  fileList: File[] = [];
  addr: any;
  fax: any;
  telephone: any;
  persons: any;
  attachments: any;
  addImg!: boolean;
  codes: any[] = [];
  codeNames: string[] = [];
  attachmentName: any[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    // private authService: AuthService,
    private route: Router,
    private formbuilder: FormBuilder,
    private api: SupplierService,
    private messageService: MessageService,

    private confirmationService: ConfirmationService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  Init(): void {
    this.supplierForm = this.formbuilder.group({
      suppliername: ['', Validators.required],
      website: [''],
      name: [''],
      email: ['', Validators.email],
      code: [''],
      suppStatusId: [''],
      suppStatusName: [''],
      cityId: [''],
      cityName: [''],
      person: [''],
      comment: [''],
      zipcode: [''],
      contact: [''],
      suppOracleCode: [''],
      attachments: this.formbuilder.array([]),
      suppPersons: this.formbuilder.array([]),
      addresses: this.formbuilder.array([]),
      faxes: this.formbuilder.array([]),
      telephones: this.formbuilder.array([]),
      suppTCodes: this.formbuilder.array([]),
    });

    // this.router.queryParams.subscribe((params: any) => {
    //   this.supplierModel.id = params.data;

    this.supplierModel.id = this.supplier_id;
    this.tabIndex = this.supplier_index;

    console.log('this.supplierModel.id', this.supplierModel.id);
    this.tabIndex = this.supplier_index;
    if (this.supplierModel.id) {
      this.api.getSingleSupplier(this.supplierModel.id).subscribe((res) => {
        const data = res.data;
        console.log('data', data);
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.supplierForm.controls['suppliername'].setValue(
            data.suppliername
          );
          this.supplierForm.controls['website'].setValue(data.website);
          this.supplierForm.controls['name'].setValue(data.name);
          this.supplierForm.controls['email'].setValue(data.email);
          this.supplierForm.controls['code'].setValue(data.code);
          this.supplierForm.controls['person'].setValue(data.person);
          this.supplierForm.controls['suppStatusId'].setValue(
            data.suppStatusId
          );
          this.supplierForm.controls['suppOracleCode'].setValue(
            data.suppOracleCode
          );
          this.supplierForm.controls['cityId'].setValue(data.cityId);
          this.supplierForm.controls['comment'].setValue(data.comment);
          this.supplierForm.controls['zipcode'].setValue(data.zipcode);
          this.supplierForm.controls['contact'].setValue(data.contact);
          this.supplierForm.controls['cityName'].setValue(data.cityName);
          this.createdOn = data.createdOn;
          this.modifiedOn = data.modifiedOn;
          this.supplierForm.controls['suppStatusName'].setValue(
            data.suppStatusName
          );
          this.addr = data.addresses;
          this.fax = data.faxes;
          this.telephone = data.telephones;
          this.persons = data.suppPersons;
          this.attachments = data.attachments;
          if (this.attachments.length == 0) {
            this.attachmentName = [];
          } else {
            this.attachmentName[0] = this.attachments[0].attachmentName;
            console.log('this.attachmentName', this.attachmentName);
          }

          if (data.addresses.length == 0) {
            this.addMoreAddress();
          }
          if (data.telephones.length == 0) {
            this.addMoreTelephone();
          }
          if (data.faxes.length == 0) {
            this.addMoreFax();
          }
          if (data.suppPersons.length == 0) {
            this.addMorePersons();
          }

          this.setExsitingAddress(this.addr);
          this.setExsitingFax(this.fax);
          this.setExsitingTelephone(this.telephone);
          this.setExsitingPersons(this.persons);
          this.setExsitingAttachment(this.attachments);
          let codes = data.suppTCodes;
          this.getCodes(codes, data.id);
          this.cdr.detectChanges();
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

    // });
    // this.items = [
    //   { label: 'Home', routerLink: ['/'] },
    //   { label: 'View Supplier' },
    // ];

    this.getStatus();
    this.getRoles();
    this.getCity();
  }

  getCodes(code: any, supplierId: number) {
    this.api.getLookups({ queryParams: 407 }).subscribe((res) => {
      this.codes = res.data;
      console.log('this.codes', this.codes);
      let suppTCodes = this.supplierForm.get('suppTCodes') as FormArray;
      for (let i = 0; i < this.codes.length; i++) {
        const codeValue = code[i]?.codeValue ?? '';
        const formGroup = this.formbuilder.group({
          id: code[i]?.id ?? 0,
          supplierId: supplierId,
          codeTypeId: [this.codes[i].id],
          codeValue: [codeValue],
        });
        suppTCodes.push(formGroup);
        this.codeNames.push(this.codes[i].name);
      }
    });
  }
  suppTCodesControl() {
    return (<FormArray>this.supplierForm.get('suppTCodes')).controls;
  }

  setExsitingPersons(persons: SupplierPersons[]) {
    persons.forEach((p) => {
      (this.supplierForm.get('suppPersons') as FormArray).push(
        this.formbuilder.group({
          personName: p.personName,
          personRoleId: p.personRoleId,
          contact: p.contact,
          externalEngCode: p.externalEngCode,
          email: p.email,
          id: p.id,
          supplierId: p.supplierId,
        })
      );
    });
  }

  setExsitingAttachment(attachs: Attachments[]) {
    attachs.forEach((a) => {
      (this.supplierForm.get('attachments') as FormArray).push(
        this.formbuilder.group({
          attachmentName: a.attachmentName,
          attachmentURL: a.attachmentURL,
          id: a.id,
          supplierId: a.supplierId,
        })
      );
    });
  }

  setExsitingAddress(addresses: AdressModel[]) {
    addresses.forEach((p) => {
      (this.supplierForm.get('addresses') as FormArray).push(
        this.formbuilder.group({
          address: p.address,
          id: p.id,
          supplierId: p.supplierId,
        })
      );
    });
  }

  setExsitingFax(faxes: FaxModel[]) {
    console.log('in function setExsitingAddress');
    faxes.forEach((f) => {
      (this.supplierForm.get('faxes') as FormArray).push(
        this.formbuilder.group({
          fax: f.fax,
          id: f.id,
          supplierId: f.supplierId,
        })
      );
    });
  }
  setExsitingTelephone(tele: TelephoneModel[]) {
    console.log('in function setExsitingAddress');
    tele.forEach((t) => {
      (this.supplierForm.get('telephones') as FormArray).push(
        this.formbuilder.group({
          telephone: t.telephone,
          id: t.id,
          supplierId: t.supplierId,
        })
      );
    });
  }

  updateSupplier() {
    if (this.supplierForm.invalid) {
      validateForm.validateAllFormFields(this.supplierForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.supplierModel.suppliername = this.supplierForm.value.suppliername;
      this.supplierModel.website = this.supplierForm.value.website;
      this.supplierModel.name = this.supplierForm.value.name;
      this.supplierModel.person = this.supplierForm.value.person;
      this.supplierModel.email = this.supplierForm.value.email;
      this.supplierModel.code = this.supplierForm.value.code;
      this.supplierModel.suppStatusId = this.supplierForm.value.suppStatusId;
      this.supplierModel.cityId = this.supplierForm.value.cityId;
      this.supplierModel.comment = this.supplierForm.value.comment;
      this.supplierModel.zipcode = this.supplierForm.value.zipcode;
      this.supplierModel.contact = this.supplierForm.value.contact;
      this.supplierModel.suppOracleCode =
        this.supplierForm.value.suppOracleCode;
      this.supplierModel.suppTCodes = this.supplierForm.value.suppTCodes;

      if (!this.supplierModel.suppPersons) {
        this.supplierModel.suppPersons = [];
      }
      (this.supplierForm.get('suppPersons') as FormArray).controls.forEach(
        (element) => {
          if (
            element.value.email == null &&
            element.value.contact == null &&
            element.value.externalEngCode == null &&
            element.value.personName == null &&
            element.value.personRoleId == null
          ) {
          } else {
            let person = new SupplierPersons();
            person.supplierId = element.value.supplierId;
            person.contact = element.value.contact;
            person.email = element.value.email;
            person.externalEngCode = element.value.externalEngCode;
            person.personName = element.value.personName;
            person.personRoleId = element.value.personRoleId;
            person.id = element.value.id;
            console.log('person model', person);
            this.supplierModel.suppPersons.push(person);
          }
        }
      );

      if (!this.supplierModel.addresses) {
        this.supplierModel.addresses = [];
      }
      (this.supplierForm.get('addresses') as FormArray).controls.forEach(
        (element) => {
          if (element.value.address == null) {
          } else {
            let adress = new AdressModel();
            adress.supplierId = element.value.supplierId;
            adress.address = element.value.address;
            adress.id = element.value.id;
            console.log('adress', element);
            this.supplierModel.addresses.push(adress);
          }
        }
      );

      if (!this.supplierModel.faxes) {
        this.supplierModel.faxes = [];
      }
      (this.supplierForm.get('faxes') as FormArray).controls.forEach(
        (element) => {
          if (element.value.fax == null) {
          } else {
            console.log('fax element', element);
            let fax = new FaxModel();
            fax.supplierId = element.value.supplierId;
            fax.fax = element.value.fax;
            fax.id = element.value.id;
            console.log('fax', fax);
            this.supplierModel.faxes.push(fax);
          }
        }
      );

      if (!this.supplierModel.telephones) {
        this.supplierModel.telephones = [];
      }
      (this.supplierForm.get('telephones') as FormArray).controls.forEach(
        (element) => {
          if (element.value.telephone == null) {
          } else {
            let tele = new TelephoneModel();
            tele.supplierId = element.value.supplierId;
            tele.telephone = element.value.telephone;
            tele.id = element.value.id;
            console.log('tele', tele);
            this.supplierModel.telephones.push(tele);
          }
        }
      );

      console.log('supplierModel to api', this.supplierModel);
      this.api.updateSupplier(this.supplierModel).subscribe((res) => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
          this.supplierModel.suppPersons = [];
          this.supplierModel.addresses = [];
          this.supplierModel.faxes = [];
          this.supplierModel.telephones = [];
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
          if (message == 'Name is duplicated!') {
            this.supplierModel.suppPersons = [];
            this.supplierModel.addresses = [];
            this.supplierModel.faxes = [];
            this.supplierModel.telephones = [];
            console.log('this.supplierModel', this.supplierModel);
            validateForm.validateAllFormFields(this.supplierForm);
          }
        }
      });
    }
  }

  //address Array
  addressControls() {
    return (<FormArray>this.supplierForm.get('addresses')).controls;
  }
  addMoreAddress() {
    (this.supplierForm.get('addresses') as FormArray).push(
      this.formbuilder.group(new AdressModel())
    );
  }
  removeAddress(index: number) {
    (this.supplierForm.get('addresses') as FormArray).removeAt(index);
  }

  //fax array
  faxControl() {
    return (<FormArray>this.supplierForm.get('faxes')).controls;
  }
  addMoreFax() {
    (this.supplierForm.get('faxes') as FormArray).push(
      this.formbuilder.group(new FaxModel())
    );
  }
  removeFax(index: number) {
    (this.supplierForm.get('faxes') as FormArray).removeAt(index);
  }

  //telephone array
  telephoneControl() {
    return (<FormArray>this.supplierForm.get('telephones')).controls;
  }
  addMoreTelephone() {
    (this.supplierForm.get('telephones') as FormArray).push(
      this.formbuilder.group(new TelephoneModel())
    );
  }
  removeTelephone(index: number) {
    (this.supplierForm.get('telephones') as FormArray).removeAt(index);
  }

  personsControl() {
    return (<FormArray>this.supplierForm.get('suppPersons')).controls;
  }
  removePerson(index: number) {
    (this.supplierForm.get('suppPersons') as FormArray).removeAt(index);
  }
  addMorePersons() {
    (this.supplierForm.get('suppPersons') as FormArray).push(
      this.formbuilder.group(new SupplierPersons())
    );
  }
  attachControl() {
    return (<FormArray>this.supplierForm.get('attachments')).controls;
  }
  removeAttachment(index: number) {
    this.addImg = true;
    (this.supplierForm.get('attachments') as FormArray).removeAt(index);
  }
  addMoreAttachment() {
    console.log('inside button');
    (this.supplierForm.get('attachments') as FormArray).push(
      this.formbuilder.group(new Attachments())
    );
    this.addImg = false;
  }
  handleFileInput(files: any) {
    console.log('files event', files.currentFiles);
    this.fileList = files.currentFiles[0];
    console.log('this.fileList', this.fileList);
    this.api.uploadFiles(this.fileList).subscribe((res) => {
      const data = res.data;
      this.attachments[0].attachmentName = data[0];
      this.attachments[0].attachmentURL = null;
      this.supplierModel.attachments.push(this.attachments[0]);
      console.log('this.attachmentForm.value.attachmentName', this.attachments);
      console.log(
        'this.supplierModel.attachments',
        this.supplierModel.attachments
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

  getStatus() {
    this.api.getLookups({ queryParams: 35 }).subscribe((res) => {
      this.statusList = res.data;
    });
  }

  getRoles() {
    this.api.getLookups({ queryParams: 36 }).subscribe((res) => {
      this.roleList = res.data;
    });
  }

  getCity() {
    this.api.getLookups({ queryParams: 11 }).subscribe((res) => {
      this.cityList = res.data;
    });
  }

  changeStatus(event: any) {
    this.supplierForm.value.suppStatusId = event.value;
  }

  changeRole(event: any, index: number) {
    const personArray = <FormArray>this.supplierForm.controls['suppPersons'];
    const itemFormGroup = <FormGroup>personArray.controls[index];
    itemFormGroup.controls['personRoleId'].setValue(event.value);

    //this.supplierPersonsForm.value.personRoleId = event.value;
  }

  changeCity(event: any) {
    this.supplierForm.value.cityId = event.value;
  }

  deleteSupplier() {
    this.router.queryParams.subscribe((params: any) => {
      this.supplierModel.id = params.data;
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this supplier?',
        header: 'Confirm',
        rejectButtonStyleClass: 'p-button-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.deleteSupplier(this.supplierModel.id).subscribe((res) => {
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });
              this.close_edit_modal();
              // this.route.navigate(['/reference-table/supplier']);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 3000,
              });
            }
          });
        },
        reject: (type: any) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              this.messageService.add({
                severity: 'warn',
                summary: 'Cancelled',
                detail: 'You have cancelled',
              });
              break;
            case ConfirmEventType.CANCEL:
              this.messageService.add({
                severity: 'warn',
                summary: 'Cancelled',
                detail: 'You have cancelled',
              });
              break;
          }
        },
      });
    });
  }

  ready(event: any) {
    console.log('attach', event);
    // this.attachmentForm.value.attachmentName=event[0];
    if (!this.supplierModel.attachments) {
      this.supplierModel.attachments = [];
    }
    (this.supplierForm.get('attachments') as FormArray).controls.forEach(
      (element) => {
        let attach = new Attachments();
        attach.supplierId = this.supplierModel.id;
        attach.attachmentName = event[0];
        attach.attachmentURL = null;
        console.log('attach', attach);
        this.supplierModel.attachments.push(attach);
      }
    );
    this.supplierModel.attachments.push();
  }

  handleChange() {
    if (this.supplierModel.id) {
      this.api.getSingleSupplier(this.supplierModel.id).subscribe((res) => {
        const data = res.data;
        this.supplierForm.controls['suppliername'].setValue(data.suppliername);
        this.supplierForm.controls['website'].setValue(data.website);
        this.supplierForm.controls['name'].setValue(data.name);
        this.supplierForm.controls['email'].setValue(data.email);
        this.supplierForm.controls['code'].setValue(data.code);
        this.supplierForm.controls['suppStatusId'].setValue(data.suppStatusId);
        this.supplierForm.controls['suppOracleCode'].setValue(
          data.suppOracleCode
        );
        this.supplierForm.controls['cityId'].setValue(data.cityId);
        this.supplierForm.controls['person'].setValue(data.person);
        this.supplierForm.controls['comment'].setValue(data.comment);
        this.supplierForm.controls['zipcode'].setValue(data.zipcode);
        this.supplierForm.controls['contact'].setValue(data.contact);
        this.supplierForm.controls['cityName'].setValue(data.cityName);
        this.supplierForm.controls['suppStatusName'].setValue(
          data.suppStatusName
        );
        this.persons = data.suppPersons;
        this.addr = data.addresses;
        this.fax = data.faxes;
        this.telephone = data.telephones;
        this.createdOn = data.createdOn;
        this.modifiedOn = data.modifiedOn;
        // this.supplierForm.patchValue(data);
      });
    }
  }

  close_edit_modal() {
    this.supplierForm.reset();
    this.openModals.emit(false);
  }

  onBack() {
    this.close_edit_modal();
  }
}
