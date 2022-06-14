import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { HttpClientModule } from '@angular/common/http';

import { ProfileIconComponent } from './components/profile/profile-icon/profile-icon.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ShaderListComponent } from './components/shader-list/shader-list.component';
import { ShaderListItemComponent } from './components/shader-list/shader-list-item/shader-list-item.component';
import { ShaderEditorComponent } from './components/shader-editor/shader-editor.component';
import { ShaderRendererComponent } from './components/shader-editor/shader-renderer/shader-renderer.component';
import { ShaderCodeWindowComponent } from './components/shader-editor/shader-code-window/shader-code-window.component';
import { ShaderConsoleComponent } from './components/shader-editor/shader-console/shader-console.component';


@NgModule({
  declarations: [
    AppComponent,
    ProfileIconComponent,
    SearchBarComponent,
    ShaderListComponent,
    ShaderListItemComponent,
    ShaderEditorComponent,
    ShaderRendererComponent,
    ShaderCodeWindowComponent,
    ShaderConsoleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    MonacoEditorModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
