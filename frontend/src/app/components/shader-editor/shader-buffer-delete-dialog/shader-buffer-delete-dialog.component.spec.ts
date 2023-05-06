import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShaderBufferDeleteDialogComponent } from './shader-buffer-delete-dialog.component';

describe('ShaderBufferDeleteDialogComponent', () => {
  let component: ShaderBufferDeleteDialogComponent;
  let fixture: ComponentFixture<ShaderBufferDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShaderBufferDeleteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShaderBufferDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
