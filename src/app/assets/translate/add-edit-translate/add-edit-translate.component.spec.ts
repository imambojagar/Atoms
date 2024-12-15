import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTranslateComponent } from './add-edit-translate.component';

describe('AddEditTranslateComponent', () => {
  let component: AddEditTranslateComponent;
  let fixture: ComponentFixture<AddEditTranslateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTranslateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
