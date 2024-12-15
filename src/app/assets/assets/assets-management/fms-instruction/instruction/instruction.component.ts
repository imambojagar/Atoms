import { Component } from '@angular/core';
import { AssetFormService } from '../../../asset-form.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../../../../shared/primeng.module';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, PrimengModule],
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.scss']
})

export class InstructionComponent {
  constructor(public assetFormService: AssetFormService) {
  }


}
