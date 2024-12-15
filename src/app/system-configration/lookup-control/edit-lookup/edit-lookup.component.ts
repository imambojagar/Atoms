import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  Message,
  MessageService,
  MenuItem,
} from 'primeng/api';
import { TransactionHistory } from '../../../models/transaction-history';
import { LookupService } from '../../../services/lookup.service';

export function getLookupsModel(formValue: any) {
  let model = { ...formValue };
  return model;
}
export function buildLookupValuesForm(formbuilder: FormBuilder) {
  return formbuilder.group({
    id: 0,
    name: [''],
    value: [''],
    lookupType: [''],
  });
}
@Component({
  selector: 'edit-lookup',
  templateUrl: './edit-lookup.component.html',
  styleUrls: ['./edit-lookup.component.scss'],
})
export class EditLookupComponent {

  showmodal: boolean = false;

  transactionHistory!: TransactionHistory
  searchForm!: FormGroup;
  LookupForm!: FormGroup;
  lookups: any[] = [];
  totalRows!: number;

  id!: number;
  name: any;
  value: any;
  isAddMode!: boolean;
  msgs!: Message[];
  items!: MenuItem[];
  lookupValues: any[] = [];
  tabIndex: number = 0;
  createdOn: any;
  modifiedOn: any;
  loading!: boolean;
  displayUpdate: boolean = false;

  serialList: [] = [];
  nameList: [] = [];
  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };
  searchValue: string = '';
  constructor(
    private route: ActivatedRoute,
    private api: LookupService,
    private formbuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {
    this.LookupForm = this.formbuilder.group({
      id: [''],
      name: [''],
      lookupValues: this.formbuilder.array([]),
    });
    this.searchForm = this.formbuilder.group({
      id: null,
      name: null,
      lookupType: null,
    });

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Lookup Control' },
    ];

    //fill lookups

    this.getAllLookups();
  }
  nameFilter(event: any) {
    this.filter.pageNumber = 1;
    console.log('event', event);
    this.filter.name = event.query;
    this.api.getAllLookups({ name: event.query }).subscribe((res) => {
      const data = res.data;
      console.log('asset name list', data);
      this.nameList = data;

      this.cdr.detectChanges();
    });
  }
  getAllLookups() {
    this.api.getAllLookups(this.filter).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.lookups = data;
        this.totalRows = res.totalRows;

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

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    this.getAllLookups();
    this.loading = false;

    this.cdr.detectChanges();
  }

  showUpdateDialog(lookup: any) {
    debugger
    this.displayUpdate = true;
    console.log('lookup', lookup);
    this.id = lookup.id;
    this.name = lookup.name;
    this.value = lookup.lookupType;
    const itemControls = <FormArray>this.LookupForm.controls['lookupValues'];
    this.lookupValues = lookup.lookupValues;
    console.log('lookupValues', this.lookupValues);
    this.transactionHistory = new TransactionHistory();
    Object.assign(this.transactionHistory, lookup);
    for (let index = 0; index < this.lookupValues.length; index++) {
      this.addMoreValues();
      const itemFormGroup = <FormGroup>itemControls.controls[index];
      itemFormGroup.controls['id'].setValue(this.lookupValues[index].id);
      itemFormGroup.controls['name'].setValue(this.lookupValues[index].name);
      itemFormGroup.controls['value'].setValue(this.lookupValues[index].value);
    }

    this.cdr.detectChanges();
  }

  lookupValuesControl() {
    return (<FormArray>this.LookupForm.get('lookupValues')).controls;
  }
  addMoreValues() {
    (this.LookupForm.get('lookupValues') as FormArray).push(
      buildLookupValuesForm(this.formbuilder)
    );
  }
  removeValues(index: number) {

    if ((this.LookupForm.get('lookupValues') as FormArray).length > 1)
      (this.LookupForm.get('lookupValues') as FormArray).removeAt(index);
  }
  onUpdate() {
    let model = getLookupsModel(this.LookupForm.value);
    model.id = this.id;
    model.name = this.name;
    model.lookupType = this.value;
    console.log('model', model);
    this.api.updateLookup(model).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.getAllLookups();
        this.close_modals()
        this.cdr.detectChanges();
        this.LookupForm.reset();
        this.lookupValues = [];
        this.displayUpdate = false;
        const itemControls = <FormArray>(
          this.LookupForm.controls['lookupValues']
        );

        itemControls.clear();
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
  onHide($event: any) {
    this.LookupForm.reset();
    const itemControls = <FormArray>this.LookupForm.controls['lookupValues'];

    itemControls.clear();
  }

  search() {
    this.getAllLookups();
    this.close_modal()
    this.cdr.detectChanges();
  }
  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      id: null,
      name: null,
      lookupType: null,
    };
    this.searchForm.reset();
    this.getAllLookups();
  }

  close_modal() {
    this.showmodal = false;
    this.ngOnInit()
  }

  close_modals() {
    this.displayUpdate = !this.displayUpdate;
    this.ngOnInit()
  }

  openFilterModal() {
    this.showmodal = true
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.lookups = this.lookups.filter((row: any) =>
        Object.values(row).some((val: any) => String(val).toLowerCase().includes(this.searchValue))
      );
    }
    else {
      this.resetGlobalFilter()
    }
    this.cdr.detectChanges();
  }

  resetGlobalFilter() {
    this.searchValue = ''; // Clear the search input
    this.search()
    this.cdr.detectChanges();
  }
}
