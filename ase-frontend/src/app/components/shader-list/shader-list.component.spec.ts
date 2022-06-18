import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ShaderListComponent } from "./shader-list.component";

describe("ShaderListComponent", () => {
  let component: ShaderListComponent;
  let fixture: ComponentFixture<ShaderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShaderListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
