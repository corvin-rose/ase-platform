import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ShaderViewerComponent } from "./shader-viewer.component";

describe("ShaderViewerComponent", () => {
  let component: ShaderViewerComponent;
  let fixture: ComponentFixture<ShaderViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShaderViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
