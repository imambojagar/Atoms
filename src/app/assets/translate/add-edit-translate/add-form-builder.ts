
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

function checkIfDefault(obj: any): boolean {
  let isValid = true;
  Object.keys(obj).forEach(key => {
    if ((key == 'id' || key == 'visitId') && obj[key] == '') { obj[key] = 0; }
    if (typeof obj[key] === 'string' && obj[key] != '') isValid = false;
    if (typeof obj[key] === 'number' && obj[key] != 0) isValid = false;
  });
  return isValid;
}

function clone(model: any, obj: any, props: string[]) {
  props.forEach((k: string) => {
    model[k] = [...obj[k]].filter(o => !checkIfDefault(o));
  });
}

export function getTransModel(formValue: any) {
  let model = { ...formValue };
  return model;
}

export function buildForm(formbuilder: FormBuilder) {

  return formbuilder.group({
    id: 0,
    word: ['',Validators.required],
    translations: formbuilder.array([]),
  });

}
