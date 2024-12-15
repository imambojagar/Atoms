import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GatePassModel } from './gate-pass.model';

export function buildGassPassForm(model: GatePassModel, fb: FormBuilder) {
  let frm: FormGroup = fb.group({
    id: 0,
    company: [],
    site: [],
    edd: [],
    acknowledgment: [],
    demoRequestId: [],
    gatePassStatusId: [],
    isConfirmed: false,
    finalEddDate:[]
  });

  frm.patchValue(model);
  return frm;
}
