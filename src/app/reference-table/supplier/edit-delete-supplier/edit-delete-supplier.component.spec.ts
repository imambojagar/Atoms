import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteSupplierComponent } from './edit-delete-supplier.component';

describe('EditDeleteSupplierComponent', () => {
  let component: EditDeleteSupplierComponent;
  let fixture: ComponentFixture<EditDeleteSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDeleteSupplierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDeleteSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
