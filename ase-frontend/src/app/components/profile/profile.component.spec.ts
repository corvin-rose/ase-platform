import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { User } from "../../rest/model/user";
import { Auth } from "../../rest/service/auth.service";
import { LikeService } from "../../rest/service/like.service";

import { ProfileComponent } from "./profile.component";
import { MaterialModule } from "../../modules/material/material.module";

describe("ProfileComponent", () => {
  let component: ProfileComponent;
  let compiled: HTMLElement;
  let fixture: ComponentFixture<ProfileComponent>;

  const testUser: User = {
    firstName: "Test",
    lastName: "User",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [HttpClientTestingModule, MaterialModule],
      providers: [LikeService],
    }).compileComponents();

    Auth.user = testUser;

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display user", () => {
    expect(compiled.querySelector("#name")?.textContent).toBe("Test User");
    expect(compiled.querySelector("#profile-icon")?.textContent).toBe("TU");
  });
});
