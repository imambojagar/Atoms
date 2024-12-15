import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssetFormService } from '../../asset-form.service';
import { PrimengModule } from '../../../../shared/primeng.module';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, PrimengModule],
  selector: 'app-warranty-info',
  templateUrl: './warranty-info.component.html',
  styleUrls: ['./warranty-info.component.scss']
})
export class WarrantyInfoComponent {

  constructor(public assetFormService: AssetFormService) {


    }
    ngOnInit(): void {

    }

  }
