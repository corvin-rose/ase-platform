import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    let theme = localStorage.getItem('theme');

    if (theme && theme == 'dark') {
      document.body.classList.add('dark');
    }
  }
}
