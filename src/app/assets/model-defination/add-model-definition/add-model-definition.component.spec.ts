import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModelDefinitionComponent } from './add-model-definition.component';

describe('AddModelDefinitionComponent', () => {
  let component: AddModelDefinitionComponent;
  let fixture: ComponentFixture<AddModelDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModelDefinitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddModelDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
