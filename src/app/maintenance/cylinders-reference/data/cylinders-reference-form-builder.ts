import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReferenceCylindersLOX } from './cylinders-reference.model';

export function buildReferenceForm(
  model: ReferenceCylindersLOX,
  fb: FormBuilder
) {
  let frm: FormGroup = fb.group({
    id: 0,
    siteId: [],
    siteName: [],

    supplierId: [],
    supplierName: [],

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

    nitricoxidE11PPM: [],
    nitricoxidE25PPM: [],

    loX1Volume: [],
    loX2Volume: [],
  });

  frm.patchValue(model);
  return frm;
}
