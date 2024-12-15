import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
export class commonHelpers {
    static generateUniqSerial(): string {  
        return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, (c) => {  
            const r = Math.floor(Math.random() * 16);  
            return r.toString(16);  
      });  
    }
    
    static markAsRequired(props: string[], frm: FormGroup)
    {
        props.forEach(a => frm.controls[a].addValidators(Validators.required));
    }
}