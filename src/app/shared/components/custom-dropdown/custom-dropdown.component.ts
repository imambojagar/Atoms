import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  host: {ngSkipHydration: 'true'},
  standalone: true,
  imports: [],
  templateUrl: './custom-dropdown.component.html',
  styleUrl: './custom-dropdown.component.scss'
})
export class CustomDropdownComponent implements OnInit {
  @Input() listitems: any = [];
  @Input() dropdownText: string = '';
  @Output() selectItems: EventEmitter<any> = new EventEmitter<any>();
  dropdownitems: any;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const nativeElement = this.elementRef.nativeElement;
     this.dropdownitems = nativeElement.querySelector(
      '.custom-dropdown-container'
    );
    const customdropdown = nativeElement.querySelector(
      '.custom-table-dropdown'
    );

    customdropdown.addEventListener('click', () => {
      this.dropdownitems.classList.toggle('active');
    });
  }

  selectItem(id: any) {
    this.selectItems.emit(id);
    this.dropdownitems.classList.toggle('active');
  }

}
