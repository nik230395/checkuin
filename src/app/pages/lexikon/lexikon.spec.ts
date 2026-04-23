import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lexikon } from './lexikon';

describe('Lexikon', () => {
  let component: Lexikon;
  let fixture: ComponentFixture<Lexikon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lexikon],
    }).compileComponents();

    fixture = TestBed.createComponent(Lexikon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
