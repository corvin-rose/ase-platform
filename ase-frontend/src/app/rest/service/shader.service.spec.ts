import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { ShaderService } from "./shader.service";

describe("ShaderService", () => {
  let service: ShaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ShaderService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
