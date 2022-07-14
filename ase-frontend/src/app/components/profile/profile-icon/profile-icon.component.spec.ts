import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "../../../modules/material/material.module";
import { User } from "../../../rest/model/user";
import { Auth, AuthService } from "../../../rest/service/auth.service";

import { ProfileIconComponent } from "./profile-icon.component";

describe("ProfileIconComponent", () => {
  let component: ProfileIconComponent;
  let compiled: HTMLElement;
  let fixture: ComponentFixture<ProfileIconComponent>;

  const testUser: User = {
    firstName: "Test",
    lastName: "User",
  };

  beforeEach(() => {
    Auth.user = testUser;
  });

  function prepareAuthStatus(status: boolean): void {
    let mockAuthService: jasmine.SpyObj<AuthService> = jasmine.createSpyObj(
      "AuthService",
      ["isUserLoggedIn"]
    );
    mockAuthService.isUserLoggedIn.and.returnValue(status);

    TestBed.configureTestingModule({
      declarations: [ProfileIconComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileIconComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  }

  it("should create", () => {
    prepareAuthStatus(false);
    expect(component).toBeTruthy();
  });

  it("should not display user icon if logged out", () => {
    prepareAuthStatus(false);
    expect(compiled.querySelector(".profile-icon .name")).toBeFalsy();
  });

  it("should display user icon if logged in", () => {
    prepareAuthStatus(true);
    expect(compiled.querySelector(".profile-icon .name")).toBeTruthy();
  });

  it("should display first letters of user", () => {
    prepareAuthStatus(true);
    expect(compiled.querySelector(".profile-icon .name")?.textContent).toBe(
      "TU"
    );
  });
});
