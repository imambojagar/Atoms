import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
/* import { ModelDefinitionModel } from 'src/app/data/models/model-definition-model';
import { LookupService } from 'src/app/data/service/lookup.service';
import { ModelService } from 'src/app/data/service/model-definition.service'; */
import { AssetFormService } from '../../asset-form.service';
import { PrimengModule } from '../../../../shared/primeng.module';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, PrimengModule],
  selector: 'app-location-and-category',
  templateUrl: './location-and-category.component.html',
  styleUrls: ['./location-and-category.component.scss']
})
export class LocationAndCategoryComponent {
  // Location_Category !: FormGroup;
  // Assets_Buildings: any[] = [];
  // Assets_Floors: any[] = [];
  // Departments: any[] = [];
  // Sites: any[] = [];
  // Technical_Departments: any[] = [];
  // Rooms: any[] = []
  // Labels: any[] = []
  // Generics: any[] = []
  // Sub_Departments: any[] = []
  constructor( public assetFormService:AssetFormService
  ) {

  }
  ngOnInit(): void {
    // this.Location_Category  = this.formbuilder.group({
    //   Site: [null, Validators.required],
    //   Assets_Building: [null],
    //   Assets_Floor: [null],
    //   Department: [null],
    //   Sub_Department: [null],
    //   Room: [null],
    //   Label: [null],
    //   Generic: [null],
    //   Technical_Department:[null],
    // })
    this.loadLookups()
    // this.assetFormService.getDepartments()
  }


  loadLookups() {}
  search(event: any) {
    let body = {
      assetName: event.query
    }

  }
}
