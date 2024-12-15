import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditModelCreationComponent } from './add-edit-model-creation.component';

describe('AddEditModelCreationComponent', () => {
  let component: AddEditModelCreationComponent;
  let fixture: ComponentFixture<AddEditModelCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditModelCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditModelCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
