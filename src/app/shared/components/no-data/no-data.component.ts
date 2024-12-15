import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'no-data',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss',
})
export class NoDataComponent implements OnInit {
  @Input() noDataText: string = 'No Data Found';
  constructor() {}

  ngOnInit(): void {}
}
