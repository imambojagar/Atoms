import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNameDefinitionComponent } from './view-name-definition.component';

describe('ViewNameDefinitionComponent', () => {
  let component: ViewNameDefinitionComponent;
  let fixture: ComponentFixture<ViewNameDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNameDefinitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNameDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
