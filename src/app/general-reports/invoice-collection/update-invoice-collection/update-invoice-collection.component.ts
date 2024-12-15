import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import { asset, InvoiceCollectionModel } from '../../../models/invoice-collection-model';
import { InvoiceService } from '../../../services/invoice.service';
import { EmployeeService } from '../../../services/employee.service';
import { dateHelper } from '../../../shared/helpers/dateHelper';
/* import {
  asset,
  InvoiceCollectionModel,
} from 'src/app/data/models/invoice-collection-model';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { InvoiceService } from 'src/app/data/service/invoice.service';
import { dateHelper } from 'src/app/shared/helpers/dateHelper';
import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

@Component({
  selector: 'app-update-invoice-collection',
  templateUrl: './update-invoice-collection.component.html',
  styleUrls: ['./update-invoice-collection.component.scss'],
})
export class UpdateInvoiceCollectionComponent {

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Input('queryData') queryData: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  transactionHistory!: TransactionHistory
  linkDialog: boolean = false;

  invoiceCollectionForm!: FormGroup;
  invoiceCollectionModel: InvoiceCollectionModel = new InvoiceCollectionModel();
  msgs!: Message[];
  items!: MenuItem[];
  fileName = '';
  tabIndex: number = 0;
  requestedByList: [] = [];
  disabled: boolean = true;
  createdOn!: any;
  modifiedOn!: any;
  fileList: File[] = [];

  assetNameList = [];
  sitesList = [];

  invoicePaid = [
    { name: 'None', id: null },
    { name: 'Yes', id: true },
    { name: 'No', id: false },
  ];

  requestedEmp = [];
  months: any[] = [];

  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private formbuilder: FormBuilder,
    private messageService: MessageService,
    private api: InvoiceService,
    private empServices: EmployeeService
  ) {}

  close_modal() {
    this.openModals.emit(false);
  }
  
  ngOnInit(): void {
    this.setForm();
    this.setFormValues();
    this.getLookups();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Invoice Contract' },
    ];
  }

  updateInvoice() {
    dateHelper.reverseDateFilds(this.invoiceCollectionForm.value, [
      'expectedDate',
      'actualDate',
    ]);

    this.invoiceCollectionModel.id = this.invoiceCollectionForm.value.id;
    this.invoiceCollectionModel.expectedDate =
      this.invoiceCollectionForm.value.expectedDate;

    this.invoiceCollectionModel.actualDate =
      this.invoiceCollectionForm.value.actualDate;

    this.invoiceCollectionModel.isPaid =
      this.invoiceCollectionForm.value.isPaid;
    this.invoiceCollectionModel.contractNumber =
      this.invoiceCollectionForm.value.contractNumber;
    this.invoiceCollectionModel.amount =
      this.invoiceCollectionForm.value.amount;
    this.invoiceCollectionModel.editedPrice =
      this.invoiceCollectionForm.value.editedPrice;
    this.invoiceCollectionModel.visitCost =
      this.invoiceCollectionForm.value.visitCost;
    this.invoiceCollectionModel.paymentMethod =
      this.invoiceCollectionForm.value.paymentMethod;
    this.invoiceCollectionModel.numberOfEmergencyVisits =
      this.invoiceCollectionForm.value.numberOfEmergencyVisits;
    this.invoiceCollectionModel.userId =
      this.invoiceCollectionForm.value.userId;
    this.invoiceCollectionModel.salesTax =
      this.invoiceCollectionForm.value.salesTax;
    this.invoiceCollectionModel.taxAts =
      this.invoiceCollectionForm.value.taxAts;
    this.invoiceCollectionModel.delayFine =
      this.invoiceCollectionForm.value.delayFine;
    this.invoiceCollectionModel.checkNumber =
      this.invoiceCollectionForm.value.checkNumber;
    this.invoiceCollectionModel.salesOrderNumber =
      this.invoiceCollectionForm.value.salesOrderNumber;
    this.invoiceCollectionModel.deductionInsurance =
      this.invoiceCollectionForm.value.deductionInsurance;
    this.invoiceCollectionModel.deductionTaxes =
      this.invoiceCollectionForm.value.deductionTaxes;
    this.invoiceCollectionModel.deductions =
      this.invoiceCollectionForm.value.deductions;

    console.log('invoiceCollectionModel to api', this.invoiceCollectionModel);
    this.api.updateInvoice(this.invoiceCollectionModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.route.navigate(['general-reports/invoice-collection']);
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

  getLookups() {
    this.empServices.searchRoles({ fixedName: 'r-6' }).subscribe((res) => {
      let id = res.data[0].id;
      this.empServices.getEmployeeByRole([id]).subscribe((res) => {
        this.requestedEmp = res;
      });
    });

    Array(12)
      .fill(0)
      .map((x, i) => {
        this.months.push({ label: `${i + 1} Month`, value: i + 1 });
      });
    this.months.unshift({ label: 'None', value: null });
  }

  setForm() {
    this.invoiceCollectionForm = this.formbuilder.group({
      id: [],
      asset: [asset],
      expectedDate: [],
      actualDate: [],
      expectedDateView: [],
      actualDateView: [],
      isPaid: [],
      contractNumber: [],
      amount: [],
      editedPrice: [],
      visitCost: [],
      paymentMethod: [],
      numberOfEmergencyVisits: [],
      userId: [],
      userName: [],
      salesTax: [],
      taxAts: [],
      delayFine: [],
      checkNumber: [],
      salesOrderNumber: [],
      deductionInsurance: [],
      deductionTaxes: [],
      deductions: [],
    });
  }

  paymentMethod!: string;
  setFormValues() {
    this.router.queryParams.subscribe((params: any) => {
      this.invoiceCollectionModel.id = params.data;
      this.tabIndex = params.index;
      this.api
        .getSingleInvoice(this.invoiceCollectionModel.id)
        .subscribe((res) => {
          const data = res.data;
          this.transactionHistory=new TransactionHistory();
          Object.assign( this.transactionHistory,res.data);
          console.log('invoice data', this.invoiceCollectionModel);

          if (data.actualDate == null) {
          } else {
            this.invoiceCollectionForm.controls['actualDateView'].setValue(
              new Date(data.actualDate).toDateString()
            );
          }
          dateHelper.parseDateFilds(data, ['expectedDate', 'actualDate']);
          console.log('data', data);
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.invoiceCollectionForm.controls['id'].setValue(data.id);
            this.invoiceCollectionForm.controls['isPaid'].setValue(data.isPaid);
            this.invoiceCollectionForm.controls['expectedDate'].setValue(
              data.expectedDate
            );
            if (data.actualDate == null) {
            } else {
              this.invoiceCollectionForm.controls['actualDate'].setValue(
                data.actualDate
              );
            }

            this.invoiceCollectionForm.controls['expectedDateView'].setValue(
              data.expectedDate
            );

            this.invoiceCollectionForm.controls['amount'].setValue(data.amount);
            this.invoiceCollectionForm.controls['asset'].setValue(data.asset);
            this.invoiceCollectionForm.controls['userName'].setValue(
              data.userName
            );

            this.assetNameList =
              this.invoiceCollectionForm.controls['asset'].value.assetName;
            this.sitesList =
              this.invoiceCollectionForm.controls['asset'].value.customerName;

            this.invoiceCollectionForm.controls['editedPrice'].setValue(
              data.editedPrice
            );

            this.invoiceCollectionForm.controls['visitCost'].setValue(
              data.visitCost
            );

            this.invoiceCollectionForm.controls['paymentMethod'].setValue(
              data.paymentMethod
            );
            this.paymentMethod = data.paymentMethod;

            this.invoiceCollectionForm.controls[
              'numberOfEmergencyVisits'
            ].setValue(data.numberOfEmergencyVisits);
            this.invoiceCollectionForm.controls['contractNumber'].setValue(
              data.contractNumber
            );
            // this.invoiceCollectionForm.controls['assets'].setValue(data.assets);
            this.invoiceCollectionForm.controls['salesTax'].setValue(
              data.salesTax
            );
            this.invoiceCollectionForm.controls['taxAts'].setValue(data.taxAts);

            this.invoiceCollectionForm.controls['delayFine'].setValue(
              data.delayFine
            );

            this.invoiceCollectionForm.controls['checkNumber'].setValue(
              data.checkNumber
            );

            this.invoiceCollectionForm.controls['salesOrderNumber'].setValue(
              data.salesOrderNumber
            );
            this.invoiceCollectionForm.controls['userId'].setValue(data.userId);
            this.invoiceCollectionForm.controls['deductionInsurance'].setValue(
              data.deductionInsurance
            );
            this.invoiceCollectionForm.controls['deductionTaxes'].setValue(
              data.deductionTaxes
            );
            this.invoiceCollectionForm.controls['deductions'].setValue(
              data.deductions
            );
            this.createdOn = data.createdOn;
            this.modifiedOn = data.modifiedOn;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
        });
    });
  }
}
