import { Component } from '@angular/core';
import { PrimengModule } from '../../primeng.module';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent {

}
