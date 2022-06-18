import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ShaderCreateDialogComponent } from "./shader-create-dialog.component";

describe("ShaderCreateDialogComponent", () => {
  let component: ShaderCreateDialogComponent;
  let fixture: ComponentFixture<ShaderCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShaderCreateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
