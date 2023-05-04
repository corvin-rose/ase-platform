import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ShaderLeaveDialogComponent } from "./shader-leave-dialog.component";

describe("ShaderLeaveDialogComponent", () => {
  let component: ShaderLeaveDialogComponent;
  let fixture: ComponentFixture<ShaderLeaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShaderLeaveDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderLeaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
