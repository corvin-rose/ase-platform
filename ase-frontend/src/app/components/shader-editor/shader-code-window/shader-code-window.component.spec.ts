import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ShaderCodeWindowComponent } from "./shader-code-window.component";

describe("ShaderCodeWindowComponent", () => {
  let component: ShaderCodeWindowComponent;
  let fixture: ComponentFixture<ShaderCodeWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShaderCodeWindowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderCodeWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
