import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css'],
})
export class ThemeToggleComponent implements OnInit {
  darkMode: boolean = false;

  constructor() {}

  ngOnInit(): void {
    let theme = localStorage.getItem('theme');
    this.darkMode = theme == 'dark';
  }

  toggleTheme() {
    const monaco: typeof import('monaco-editor') = (window as any).monaco;
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    if (this.darkMode) {
      document.body.classList.add('dark');
      monaco.editor.setTheme('glsl-dark');
    } else {
      document.body.classList.remove('dark');
      monaco.editor.setTheme('glsl-light');
    }
  }
}
