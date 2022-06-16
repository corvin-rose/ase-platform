import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShaderSettingsDialogComponent } from './shader-settings-dialog.component';

describe('ShaderSettingsDialogComponent', () => {
  let component: ShaderSettingsDialogComponent;
  let fixture: ComponentFixture<ShaderSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShaderSettingsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShaderSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
