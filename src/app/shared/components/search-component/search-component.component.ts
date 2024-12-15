import { Component, Output, EventEmitter } from '@angular/core';
import { TrPipe } from '../../pipes/tr.pipe';

@Component({
  standalone: true,
  selector: 'app-search-component',
  templateUrl: './search-component.component.html',
  styleUrls: ['./search-component.component.scss'], providers: [TrPipe]
})
export class SearchComponentComponent {

  @Output() OnSearch: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnReset: EventEmitter<void> = new EventEmitter<void>();

  constructor() {

  }

  Search() {
    this.OnSearch.next();
  }

  Reset() {
    this.OnReset.next();
  }

}
