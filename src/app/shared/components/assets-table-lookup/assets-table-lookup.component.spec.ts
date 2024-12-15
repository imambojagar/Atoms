import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsTableLookupComponent } from './assets-table-lookup.component';

describe('AssetsTableLookupComponent', () => {
  let component: AssetsTableLookupComponent;
  let fixture: ComponentFixture<AssetsTableLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsTableLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsTableLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
