import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { InvoicepoService } from '../../../services/invoicepo.service';
import { EmployeeService } from '../../../services/employee.service';
import { PartCatalogService } from '../../../store/partcatalog/part-catalog.service';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import validateForm from '../../../shared/helpers/validateForm';

/* import { CallRequestService } from 'src/app/data/service/call-request.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { SiteContactsService } from 'src/app/data/service/site-contacts.service';
import { SupplierService } from 'src/app/data/service/supplier.service';
import { InvoicepoService } from 'src/app/data/service/invoicepo.service';
import { PurchaseOrderService } from 'src/app/data/service/purchase-order.service';
import validateForm from 'src/app/shared/helpers/validateForm';
import { PartCatalogService } from 'src/app/modules/store/partcatalog/part-catalog.service'; */


@Component({
  selector: 'app-invoice-in-po-management',
  templateUrl: './invoice-in-po-management.component.html',
  styleUrls: ['./invoice-in-po-management.component.scss']

})
export class InvoiceInPoManagementComponent implements OnInit {

  isAddMode: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  url!: string
  poId: any;
  items!: MenuItem[];
  invoiceInfoForm!: FormGroup;
  id: any;
  Invoice_No: any;
  siteId: any;
  sparePartsAutocomplete: any[] = [];
  partNos: any[] = []
  quotationTypes: any[] = []
  purchaseOrder: any;

  constructor(private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private partCatalogService: PartCatalogService,
    public invoiceinpoService: InvoicepoService,
    private poservice: PurchaseOrderService


  ) { }


  ngOnInit(): void {
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Create Invoice' }
    ];

    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.poId = params['poId'];
    });

    this.invoiceInfoForm = this.formbuilder.group({
      invoiceNO: [{ value: "shams", disabled: true }],
      poNumber: [{ value: null, disabled: true }],
      call: [{ value: null, disabled: true }],
      asset: [{ value: null, disabled: true }],
      site: [{ value: null, disabled: true }],
      quotationId: [{ value: null, disabled: true }],
      cashCollected: [null, Validators.required],
      invoiceIssueDate: [null, Validators.required],
      spareForm: this.formbuilder.array([]),
      total: [0],
      residual: [0],
      invoicePaid: [null],
      salesPerson: [null],
      finder: [null],
      deliveredBy: [null],
      siteInArabic: [null],
      invoiceTotal: [null],
      invoicetotalinletters: [null],
      parts: this.formbuilder.array([]),

    })
    this.checkMode()

    if (!this.isViewMode) {
      this.addspareForm()
      this.addpartsForm()
    }

    else {
      this.invoiceInfoForm.disable()
    }
    if(this.isAddMode)
    this.getPoInfo(this.poId == undefined ? 0 : this.poId);
    else
    this.getPOInvoice(this.id);
    this.invoiceinpoService.getLookups();


  }
  checkMode() {

    this.isViewMode = false
    this.isEditMode = false
    this.isAddMode = false
    this.url = this.router.url;
    if (this.id)
      if (this.url.includes('view')) {
        this.isViewMode = true
      }
      else
        this.isEditMode = true
    else
      this.isAddMode = true

  }
  getPoInfo(poId: number) {
    this.poservice.getPurcahseOrder(poId).subscribe((res: any) => {
      if (res.data == null) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Purchase Order does not exist',
          life: 3000,
        });
        setTimeout(() => {
          // this.router.navigate(['main/maintenance/purchase-order/management-purchaseorder']);
        }, 3000);
      }
      else {
        // this.invoiceInfoForm.patchValue({ site: res.data.asset.site.custName });
        // this.invoiceInfoForm.patchValue({ siteInArabic: res.data.asset.site.custName });
        this.purchaseOrder = {
          "id": res.data.id,
          "qutationNo": res.data.quotationId,
          "callNo": res.data.callNo,
          "assetNumber": res.data.assetNo,
          "site": null
        }
        this.invoiceInfoForm.patchValue({ call: res.data.callNo });
        this.invoiceInfoForm.patchValue({ asset: res.data.asset?.assetNo });
        this.invoiceInfoForm.patchValue({ poNumber: res.data.purchaseOrderNo });
        this.invoiceInfoForm.patchValue({ quotationId: res.data.quotationNo });
        this.invoiceInfoForm.patchValue({ asset: res.data.asset?.site?.custName });
        if(res.data.purchaseOrderSpareParts.length>0)
        this.setExistingSpareParts(res.data.purchaseOrderSpareParts)
      }

    });
  }
  setExistingSpareParts(purchaseOrderSpareParts: any[]) {

    purchaseOrderSpareParts.forEach((p, index) => {
      this.spareForm.push(
        this.formbuilder.group({
          id: p.id,
          partNo: p.partCatalogItem?.partNo?.id,
          requestedQty: p.qtyRequest,
          qtyReceived: p.qtyReceied,
          partName: p.partCatalogItem?.partName,
          unitPrice: p.unitpPrice,
          currency: p.currency
        }))


      // (this.invoiceInfoForm.get('spareForm') as FormArray).at(index).get('partId')?.setValue({ partNo: p.sparePart.partNo, id: p.sparePart.id })
    });
  }
  getPOInvoice(id: any) {

    this.invoiceinpoService.getInvoice(id).subscribe(res => {
      if (res.isSuccess) {
        this.invoiceInfoForm.patchValue(res.data)
        this.invoiceInfoForm.patchValue({ call: res.data.purchaseOrder.callNo });
        this.invoiceInfoForm.patchValue({ asset: res.data.purchaseOrder.asset?.assetNo });
        this.invoiceInfoForm.patchValue({ poNumber: res.data.purchaseOrder.purchaseOrderNo });
        this.invoiceInfoForm.patchValue({ quotationId: res.data.purchaseOrder.quotationNo });
        this.invoiceInfoForm.patchValue({ asset: res.data.purchaseOrder.asset?.site?.custName });
       this.invoiceInfoForm.patchValue({ invoiceIssueDate:new Date( res.data.invoiceIssueDate) });


       this.setExistingSpareParts(res.data.callInvoiceSpareParts)


      }
    }
    )
  }

  onSelectSparePart(event: any) {

    var dto = {
      id: 0,
      partNo: event.query,
      partName: ''

    }
    this.partCatalogService.GetPartAutoComplete(dto).subscribe((data) => {
      this.sparePartsAutocomplete = data.data;
    });
  }

  bindSparePart(event: any, index: number) {
    (this.invoiceInfoForm.get('spareForm') as FormArray).at(index).get('partName')?.setValue(event.partName);
    (this.invoiceInfoForm.get('spareForm') as FormArray).at(index).get('partId')?.setValue(event.id);

  }
  clearSparePart(index: number) {
    (this.invoiceInfoForm.get('spareForm') as FormArray).at(index).get('partName')?.setValue('');
    (this.invoiceInfoForm.get('spareForm') as FormArray).at(index).get('partId')?.setValue(0);
  }

  get spareForm(): FormArray {
    return this.invoiceInfoForm.get("spareForm") as FormArray
  }

  newspareForm(): FormGroup {
    return this.formbuilder.group({
      id: [0],
      partNo: [null],
      requestedQty: [null],
      qtyReceived: [null],
      partName: [null],
      unitPrice: [null],
      currency: [null]
    })
  }

  addspareForm() {
    this.spareForm.push(this.newspareForm());
  }

  removespareForm(i: number) {
    this.spareForm.removeAt(i);
  }

  get partsForm(): FormArray {
    return this.invoiceInfoForm.get("parts") as FormArray
  }

  newpartsForm(): FormGroup {
    return this.formbuilder.group({
      partDescription: [null],
      recievedQty: [null],
      unitPrice: [null],

    })
  }

  addpartsForm() {
    this.partsForm.push(this.newpartsForm());
  }

  removepartsForm(i: number) {
    this.partsForm.removeAt(i);
  }

  changeGuotationTypes(event: any) {
    this.invoiceInfoForm.value.QuotationTypeId = event.value;
  }
  save() {
    if (this.invoiceInfoForm.invalid) {
      validateForm.validateAllFormFields(this.invoiceInfoForm);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Fill Required Data', life: 3000 });
    }
    else {
      let finalData: any = {};
      Object.assign(finalData, this.invoiceInfoForm.getRawValue(),
      );
      finalData.callInvoiceSpareParts = []
      this.spareForm.controls.forEach(element => {
        if (this.spareForm.length != 0) {
          let part: any = {
            id: element.value.id,
            PartCatalogItem: {
              id: element.value?.partNo.id,
              partName: element.value?.description
            },
            recievedQty: element.value.recievedQty
          };


          finalData.callInvoiceSpareParts.push(part);
        }
      });
      finalData.purchaseOrder = this.purchaseOrder
      if (this.id == undefined || this.id == 0) {
        this.invoiceinpoService.saveInvoice(finalData).subscribe(res => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            // this.addCustomerForm.reset();
            this.router.navigate(['main/general-reports/invoice-report']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }

        })
      }
      else {
        this.invoiceinpoService.updateInvoice(finalData).subscribe(res => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            // this.addCustomerForm.reset();
            this.router.navigate(['main/general-reports/invoice-report']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }

        })
      }

    }
  }
  delete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Invoice PO?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.invoiceinpoService.deleteInvoice(this.id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.router.navigate(['/general-reports/invoice-report']);
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
  }
}
