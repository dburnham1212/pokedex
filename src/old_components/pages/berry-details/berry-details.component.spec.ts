import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BerryDetailsComponent } from './berry-details.component';

describe('BerryDetailsComponent', () => {
  let component: BerryDetailsComponent;
  let fixture: ComponentFixture<BerryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BerryDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BerryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
