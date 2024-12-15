/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SparePartsQuantityLookupComponent } from './sparePartsQuantityLookup.component';

describe('SparePartsQuantityLookupComponent', () => {
  let component: SparePartsQuantityLookupComponent;
  let fixture: ComponentFixture<SparePartsQuantityLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparePartsQuantityLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparePartsQuantityLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
