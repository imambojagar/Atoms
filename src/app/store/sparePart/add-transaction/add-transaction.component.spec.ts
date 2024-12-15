import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNameDefinitionComponent } from './add-name-definition.component';

describe('AddNameDefinitionComponent', () => {
  let component: AddNameDefinitionComponent;
  let fixture: ComponentFixture<AddNameDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNameDefinitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNameDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
