import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibleDropdownComponent } from './bible-dropdown.component';

describe('BibleDropdownComponent', () => {
  let component: BibleDropdownComponent;
  let fixture: ComponentFixture<BibleDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibleDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
