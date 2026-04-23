import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomChecker } from './symptom-checker';

describe('SymptomChecker', () => {
  let component: SymptomChecker;
  let fixture: ComponentFixture<SymptomChecker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymptomChecker],
    }).compileComponents();

    fixture = TestBed.createComponent(SymptomChecker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
