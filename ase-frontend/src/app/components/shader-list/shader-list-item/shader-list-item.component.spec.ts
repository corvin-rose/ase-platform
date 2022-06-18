import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ShaderListItemComponent } from "./shader-list-item.component";

describe("ShaderListItemComponent", () => {
  let component: ShaderListItemComponent;
  let fixture: ComponentFixture<ShaderListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShaderListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
