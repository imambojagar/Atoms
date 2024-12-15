import { FormBuilder, FormGroup } from '@angular/forms';
import { CutomCard } from './models';

export function buildCardForm(model: CutomCard, fb: FormBuilder) {
  let frm: FormGroup = fb.group({
    id: 0,
    name: [],
    code: [],
    width: [],
    height: [],
    margin: [],
    margin_Left: [],
    margin_Right: [],
    margin_Top: [],
    margin_Bottom: [],
    translations: fb.array([]),
    contents: fb.array([]),
    color: [],
    selectedLabelCategory: [],
  });

  frm.patchValue(model);
  return frm;
}
