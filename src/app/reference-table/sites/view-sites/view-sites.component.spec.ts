import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSitesComponent } from './view-sites.component';

describe('ViewSitesComponent', () => {
  let component: ViewSitesComponent;
  let fixture: ComponentFixture<ViewSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSitesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
