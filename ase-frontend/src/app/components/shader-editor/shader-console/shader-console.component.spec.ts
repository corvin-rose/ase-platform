import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShaderConsoleComponent } from './shader-console.component';

describe('ShaderConsoleComponent', () => {
  let component: ShaderConsoleComponent;
  let fixture: ComponentFixture<ShaderConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShaderConsoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShaderConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
