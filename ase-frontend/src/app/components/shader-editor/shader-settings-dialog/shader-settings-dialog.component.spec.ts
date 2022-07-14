import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "../../../modules/material/material.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { ShaderSettingsDialogComponent } from "./shader-settings-dialog.component";

describe("ShaderSettingsDialogComponent", () => {
  let component: ShaderSettingsDialogComponent;
  let fixture: ComponentFixture<ShaderSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShaderSettingsDialogComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
