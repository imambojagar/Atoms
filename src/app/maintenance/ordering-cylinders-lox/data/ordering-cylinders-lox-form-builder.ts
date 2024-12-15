import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderingCylindersLOX } from './ordering-cylinders-lox.model';
const userId = localStorage.getItem('userId');
const userName = localStorage.getItem('userName');
export function buildOrderForm(
  control: any,
  model: OrderingCylindersLOX,
  fb: FormBuilder
) {
  let frm: FormGroup = fb.group({
    id: 0,
    userId: [userId, Validators.required],
    userName: [userName],
    customerId: [, Validators.required],
    customerName: [],
    date: [],

    backUpStatusId: [],
    backUpStatusName: [],
    nextBackUpStatusId: [],
    nextBackUpStatusName: [],

    prNumber: [],
    poNumber: [],
    invoiceNumber: [],
    deliveryDate: [],

    pcdSubmissionDate: [],
    prfAttachment: [],
    prfApproved: false,
    prfDate: [],

    contactNumber: [],

    supplierId: [, Validators.required],
    supplierName: [],
    suppliersMails: fb.array(control),

    isCylinder: true,

    invoiceFrom: [],
    invoiceTo: [],
  });

  frm.patchValue(model);
  return frm;
}

export function buildBackupForm(model: OrderingCylindersLOX, fb: FormBuilder) {
  let frm: FormGroup = fb.group({
    o2KTypeEmpty: [],
    o2MTypeEmpty: [],
    o2ETypeEmpty: [],
    o2DTypeEmpty: [],
    makTypeEmpty: [],
    maeTypeEmpty: [],
    n2OKTypeEmpty: 0,
    n2OETypeEmpty: [],
    cO2KTypeEmpty: [],
    cO2ETypeEmpty: [],
    mixtureMTypeEmpty: [],
    n2KTypeEmpty: [],
    pftMixEmpty: [],
    pftHeliumEmpty: [],
    liquidNitrogenLarge121LEmpty: [],
    liquidNitrogenMedium50LEmpty: [],
    liquidNitrogenSmall30LEmpty: [],

    o2KTypeEmptyRecieved: [],
    o2MTypeEmptyRecieved: [],
    o2ETypeEmptyRecieved: [],
    o2DTypeEmptyRecieved: [],
    makTypeEmptyRecieved: [],
    maeTypeEmptyRecieved: [],
    n2OKTypeEmptyRecieved: [],
    n2OETypeEmptyRecieved: [],
    cO2KTypeEmptyRecieved: [],
    cO2ETypeEmptyRecieved: [],
    mixtureMTypeEmptyRecieved: [],
    n2KTypeEmptyRecieved: [],
    pftMixEmptyRecieved: [],
    pftHeliumEmptyRecieved: [],
    liquidNitrogenLarge121LEmptyRecieved: [],
    liquidNitrogenMedium50LEmptyRecieved: [],
    liquidNitrogenSmall30LEmptyRecieved: [],
    nitricoxidE11PPM: [],
    nitricoxidE25PPM: [],
    nitricoxidE11PPMRecieved: [],
    nitricoxidE25PPMRecieved: [],
  });

  frm.patchValue(model);
  return frm;
}
export function buildLOXForm(model: OrderingCylindersLOX, fb: FormBuilder) {
  let frm: FormGroup = fb.group({
    lox1VolumeRq: [],
    lox2VolumeRq: [],
    loX1Volume: [],
    loX2Volume: [],
  });

  frm.patchValue(model);
  return frm;
}
export function buildAttachForm(model: OrderingCylindersLOX, fb: FormBuilder) {
  let frm: FormGroup = fb.group({
    attachmentUrl: [],
    prAttachment: [],
    poAttachment: [],
    invoiceAttachment: [],
  });
  frm.patchValue(model);
  return frm;
}
