import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "../../../modules/material/material.module";

import { ShaderListItemComponent } from "./shader-list-item.component";

describe("ShaderListItemComponent", () => {
  let component: ShaderListItemComponent;
  let fixture: ComponentFixture<ShaderListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShaderListItemComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
