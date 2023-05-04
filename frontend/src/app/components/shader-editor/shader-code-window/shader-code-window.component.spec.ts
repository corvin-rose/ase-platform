import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "../../../modules/material/material.module";

import { ShaderCodeWindowComponent } from "./shader-code-window.component";

describe("ShaderCodeWindowComponent", () => {
  let component: ShaderCodeWindowComponent;
  let fixture: ComponentFixture<ShaderCodeWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShaderCodeWindowComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderCodeWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
