
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';



export function getMsgNotifyModel(formValue: any) {
  let model = { ...formValue };
  return model;
}

export function buildForm(formbuilder: FormBuilder) {

  return formbuilder.group({
    id: 0,
    name: null,
    title: null,
    text: null,
    code:null,
    translations: formbuilder.array([]),
  });

}
