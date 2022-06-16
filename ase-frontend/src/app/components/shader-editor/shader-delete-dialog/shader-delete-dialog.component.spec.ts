import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShaderDeleteDialogComponent } from './shader-delete-dialog.component';

describe('ShaderDeleteDialogComponent', () => {
  let component: ShaderDeleteDialogComponent;
  let fixture: ComponentFixture<ShaderDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShaderDeleteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShaderDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
