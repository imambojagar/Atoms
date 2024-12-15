import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasRoomSearchComponent } from './gas-room-search.component';

describe('GasRoomSearchComponent', () => {
  let component: GasRoomSearchComponent;
  let fixture: ComponentFixture<GasRoomSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GasRoomSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GasRoomSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
