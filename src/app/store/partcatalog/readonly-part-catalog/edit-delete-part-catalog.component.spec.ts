import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeletePartCatalogComponent } from './edit-delete-part-catalog.component';

describe('EditDeleteNameDefinitionComponent', () => {
  let component: EditDeletePartCatalogComponent;
  let fixture: ComponentFixture<EditDeletePartCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDeletePartCatalogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeletePartCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
