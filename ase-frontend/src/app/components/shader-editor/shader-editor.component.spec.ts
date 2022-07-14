import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ActivatedRoute, Params } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { MaterialModule } from "../../modules/material/material.module";

import { ShaderEditorComponent } from "./shader-editor.component";

describe("ShaderEditorComponent", () => {
  let component: ShaderEditorComponent;
  let compiled: HTMLElement;
  let fixture: ComponentFixture<ShaderEditorComponent>;

  let url: string[];
  let params: Subject<Params>;

  beforeEach(() => {
    params = new Subject<Params>();
  });

  function configureRoute(route: string[]): void {
    TestBed.configureTestingModule({
      declarations: [ShaderEditorComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { url: route, params: params } },
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderEditorComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  }

  it("should create", () => {
    configureRoute([]);
    expect(component).toBeTruthy();
  });

  it("should display create button if shader doesnt exists", fakeAsync(() => {
    configureRoute(["shader", "new"]);
    fixture.detectChanges();

    params.next({ id: "00000000-0000-0000-0000-000000000000" });
    tick();

    expect(compiled.querySelector("#create-container")).toBeTruthy();
  }));

  it("should display settings, delete and save button if shader exists", fakeAsync(() => {
    configureRoute([]);
    fixture.detectChanges();

    params.next({ id: "00000000-0000-0000-0000-000000000000" });
    tick();

    expect(compiled.querySelector("#edit-container")).toBeTruthy();
  }));
});
