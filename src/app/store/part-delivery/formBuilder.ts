import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
export class partDeliveryFormBuilder {
  public static buildForm(formbuilder: FormBuilder, spareParts: FormGroup) {
    return formbuilder.group({
      id: 0,
      date: ['', Validators.required],
      assetSN: ['', Validators.required],
      bindAssetSN:[''],
      assetNumber: ['', Validators.required],
      bindAssetNumber:[''],
      partNO: [''],
      assetName: [''],
      assetId: 0,
      callId: [null],
      callIdValue: [''],
      poNo: [null],
      poNoValue: null,
      model: [''],
      customerName: [''],
      spareParts: formbuilder.array([spareParts]),
      relatedEmp: [''],
      relatedEmpName: [''],
      statusWorkflow: ['', Validators.required],
      approvalComment: [''],
      statusPermission: ['', Validators.required],
      note: [''],
      storeEmpId:null,
      storeEmpName:null
      
    });
  }
  public static buildSpareParts(formbuilder: FormBuilder, model: any = null) {
    let ctrl = formbuilder.group({
      partNo: [null, Validators.required],
      partName: null,
      description: [''],
      qty: ['', Validators.required],
      installedQty: [''],
      returnedQty: [''],
      expectedDate: [''],
      sparePartStatusId: [''],
    });
    ctrl.controls['description'].disable();

    if (model != null) ctrl.patchValue(model);

    return ctrl;
  }
}
