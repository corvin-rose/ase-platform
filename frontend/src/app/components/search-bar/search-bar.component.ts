import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.css"],
})
export class SearchBarComponent implements OnInit {
  @Input() searchValue: string = "";

  constructor(private router: Router) {}

  ngOnInit(): void {
    let params = window.location.href.split("/");
    let search = params[params.indexOf("search") + 1];
    if (params.indexOf("search") !== -1 && search !== undefined) {
      this.searchValue = search;
    }
  }

  onSubmit(): void {
    this.router.navigate(["/search", this.searchValue]);
  }
}
