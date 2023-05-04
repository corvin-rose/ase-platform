import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ProfileIconComponent } from './components/profile/profile-icon/profile-icon.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ShaderListComponent } from './components/shader-list/shader-list.component';
import { ShaderListItemComponent } from './components/shader-list/shader-list-item/shader-list-item.component';
import { ShaderEditorComponent } from './components/shader-editor/shader-editor.component';
import { ShaderRendererComponent } from './components/shader-editor/shader-renderer/shader-renderer.component';
import { ShaderCodeWindowComponent } from './components/shader-editor/shader-code-window/shader-code-window.component';
import { ShaderConsoleComponent } from './components/shader-editor/shader-console/shader-console.component';
import { ShaderCreateDialogComponent } from './components/shader-editor/shader-create-dialog/shader-create-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HttpInterceptorService } from './rest/service/http-interceptor.service';
import { ShaderViewerComponent } from './components/shader-viewer/shader-viewer.component';
import { ShaderDeleteDialogComponent } from './components/shader-editor/shader-delete-dialog/shader-delete-dialog.component';
import { ShaderSettingsDialogComponent } from './components/shader-editor/shader-settings-dialog/shader-settings-dialog.component';
import { AuthGuard } from './guards/auth-guard';
import { ShaderGuard } from './guards/shader-guard';
import { LeavePageGuard } from './guards/leave-page-guard';
import { ShaderLeaveDialogComponent } from './components/shader-editor/shader-leave-dialog/shader-leave-dialog.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ThemeToggleComponent } from './components/settings/theme-toggle/theme-toggle.component';

import { onMonacoLoad } from './components/shader-editor/shader-code-window/monaco.config';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets',
  defaultOptions: { scrollBeyondLastLine: false },
  onMonacoLoad,
};

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
    ShaderConsoleComponent,
    ShaderCreateDialogComponent,
    LoginComponent,
    RegisterComponent,
    ShaderViewerComponent,
    ShaderDeleteDialogComponent,
    ShaderSettingsDialogComponent,
    ShaderLeaveDialogComponent,
    SettingsComponent,
    ProfileComponent,
    ThemeToggleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    MonacoEditorModule.forRoot(monacoConfig),
    HttpClientModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthGuard,
    ShaderGuard,
    LeavePageGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
