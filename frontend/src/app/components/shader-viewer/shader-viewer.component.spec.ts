import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable } from "rxjs";
import { MaterialModule } from "../../modules/material/material.module";
import { Shader } from "../../rest/model/shader";
import { User } from "../../rest/model/user";
import { Auth, AuthService } from "../../rest/service/auth.service";
import { ShaderService } from "../../rest/service/shader.service";

import { ShaderViewerComponent } from "./shader-viewer.component";

describe("ShaderViewerComponent", () => {
  let component: ShaderViewerComponent;
  let compiled: HTMLElement;
  let fixture: ComponentFixture<ShaderViewerComponent>;

  const testUser: User = {
    id: "00000000-0000-0000-0000-000000000000",
    firstName: "Test",
    lastName: "User",
  };

  const testShader: Shader = {
    authorId: "00000000-0000-0000-0000-000000000000",
    shaderCode: "void main() {}",
    title: "Test",
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
    let mockShaderService: jasmine.SpyObj<ShaderService> = jasmine.createSpyObj(
      "ShaderService",
      ["getShaderById"]
    );
    mockShaderService.getShaderById.and.returnValue(
      new Observable<Shader>((obs) => {
        obs.next(testShader);
      })
    );

    TestBed.configureTestingModule({
      declarations: [ShaderViewerComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        status
          ? { provide: ShaderService, useValue: mockShaderService }
          : ShaderService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: status ? { id: testUser.id } : {} } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderViewerComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  }

  it("should create", () => {
    prepareAuthStatus(false);
    expect(component).toBeTruthy();
  });

  it("should display edit button if user has permissions", () => {
    prepareAuthStatus(true);
    expect(compiled.querySelector("#edit-btn")).toBeTruthy();
  });

  it("should hide edit button if user doesnt has permissions", () => {
    prepareAuthStatus(false);
    expect(compiled.querySelector("#edit-btn")).toBeFalsy();
  });
});
