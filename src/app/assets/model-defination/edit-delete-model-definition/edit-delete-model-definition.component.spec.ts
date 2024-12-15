import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteModelDefinitionComponent } from './edit-delete-model-definition.component';

describe('EditDeleteModelDefinitionComponent', () => {
  let component: EditDeleteModelDefinitionComponent;
  let fixture: ComponentFixture<EditDeleteModelDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDeleteModelDefinitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDeleteModelDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
