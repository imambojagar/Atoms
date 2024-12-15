import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotadialogComponent } from './rotadialog.component';

describe('RotadialogComponent', () => {
  let component: RotadialogComponent;
  let fixture: ComponentFixture<RotadialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RotadialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RotadialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
