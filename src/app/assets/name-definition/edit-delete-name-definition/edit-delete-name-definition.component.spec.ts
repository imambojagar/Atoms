import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteNameDefinitionComponent } from './edit-delete-name-definition.component';

describe('EditDeleteNameDefinitionComponent', () => {
  let component: EditDeleteNameDefinitionComponent;
  let fixture: ComponentFixture<EditDeleteNameDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDeleteNameDefinitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeleteNameDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
