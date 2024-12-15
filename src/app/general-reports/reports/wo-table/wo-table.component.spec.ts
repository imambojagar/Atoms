import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoTableComponent } from './wo-table.component';

describe('WoTableComponent', () => {
  let component: WoTableComponent;
  let fixture: ComponentFixture<WoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WoTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
