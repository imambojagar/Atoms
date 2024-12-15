import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRotaComponent } from './add-edit-rota.component';

describe('AddEditRotaComponent', () => {
  let component: AddEditRotaComponent;
  let fixture: ComponentFixture<AddEditRotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditRotaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditRotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
