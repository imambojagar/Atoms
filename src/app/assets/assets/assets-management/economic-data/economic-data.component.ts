import { Component } from '@angular/core';
import { AssetFormService } from '../../asset-form.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../../../shared/primeng.module';
/* import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModelDefinitionModel } from 'src/app/data/models/model-definition-model';
import { LookupService } from 'src/app/data/service/lookup.service';
import { ModelService } from 'src/app/data/service/model-definition.service';
import { AssetFormService } from '../../asset-form.service'; */

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, PrimengModule],
  selector: 'app-economic-data',
  templateUrl: './economic-data.component.html',
  styleUrls: ['./economic-data.component.scss']
})
export class EconomicDataComponent {

  constructor(public assetFormService:AssetFormService
  ) {

  }
  ngOnInit(): void {

  }

}
