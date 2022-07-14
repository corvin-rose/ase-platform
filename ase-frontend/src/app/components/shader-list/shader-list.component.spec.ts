import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "../../modules/material/material.module";

import { ShaderListComponent } from "./shader-list.component";

describe("ShaderListComponent", () => {
  let component: ShaderListComponent;
  let fixture: ComponentFixture<ShaderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShaderListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
