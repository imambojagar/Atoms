import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { sparePartTransactionType } from '../../../shared/enums/sparePartTransaction';
import { commonHelpers } from '../../../shared/helpers/commonHelpers';
/* import { sparePartTransactionType } from 'src/app/shared/ENUMS/sparePartTransaction';
import { commonHelpers } from 'src/app/shared/helpers/commonHelpers'; */

export class sparePartTransactionForm {
  public static buildPartsForm(formbuilder: FormBuilder): FormGroup {
    return formbuilder.group({
      partCatalogNumId: ['', Validators.required],
      partCatalogName: [''],
      description: [''],
      quantity: ['', Validators.required],
      storeId: null,
      storeName: [''],
      callId: [''],
      poNo: [''],
    });
  }

  public static buildForm(
    type: sparePartTransactionType,
    formBuild: FormBuilder,
    transactionDetails: any
  ): any {
    return formBuild.group({
      transactionDetails: transactionDetails
        ? formBuild.array([transactionDetails])
        : formBuild.array([]),
      title: [commonHelpers.generateUniqSerial(), Validators.required],
      type: [type, Validators.required],
      statusId: ['', Validators.required],
      reserved: ['', Validators.required],
      date: ['', Validators.required],
      supplierId: [''],
      supplierIdBind: ['', Validators.required],
      supplierName: [''],
      receivedBy: [''],
      numOfPacking: ['', Validators.required],
      customerId: ['', Validators.required],
      customerName: [''],
      invoiceNum: ['', Validators.required],
      callId: [''],
      callIdName: [''],
      poNo: [''],
      assetSN: [''],
      assetNumber: [''],
      assetId: [''],
      assetName: [''],
      purchaseOrderId: [''],
      purchaseOrderNo: [''],
      callRequestId: [''],
      callNo: [''],
      assetSerialNumberAutoComplete: [],
      assetNumberAutoComplete: [],
    });
  }

  public static getModel(formValue: any) {
    let modelInstance = { ...formValue };
    // Clone Sub Liusts
    modelInstance.transactionDetails = [...formValue.transactionDetails];
    (<any[]>modelInstance.transactionDetails).forEach((a) => {
      if (Object.keys(a.partCatalogNumId).length > 0)
        a.partCatalogNumId = a.partCatalogNumId.id;
      if (Object.keys(a.storeId).length > 0) a.storeId = a.storeId.id;
    });
    console.log('formValue.supplierId', formValue.supplierId);
    modelInstance.supplierId = formValue.supplierId;
    if (typeof modelInstance.customerId != 'number')
      modelInstance.customerId = formValue.customerId.id;
    return modelInstance;
  }
}
