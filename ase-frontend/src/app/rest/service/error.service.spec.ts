import { TestBed } from "@angular/core/testing";
import { MaterialModule } from "../../modules/material/material.module";

import { ErrorService } from "./error.service";

describe("ErrorService", () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
    });
    service = TestBed.inject(ErrorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
