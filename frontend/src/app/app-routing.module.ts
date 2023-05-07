import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShaderListComponent } from './components/shader-list/shader-list.component';
import { ShaderEditorComponent } from './components/shader-editor/shader-editor.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ShaderViewerComponent } from './components/shader-viewer/shader-viewer.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AuthGuard } from './guards/auth-guard';
import { ShaderGuard } from './guards/shader-guard';
import { LeavePageGuard } from './guards/leave-page-guard';
import { PasswordResetComponent } from './components/auth/password-reset/password-reset.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: ShaderListComponent },
  {
    path: 'search/:query',
    canActivate: [AuthGuard],
    component: ShaderListComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'password/reset', component: PasswordResetComponent },
  { path: 'password/reset/token/:token', component: PasswordResetComponent },
  {
    path: 'shader/new',
    canActivate: [AuthGuard],
    canDeactivate: [LeavePageGuard],
    component: ShaderEditorComponent,
  },
  {
    path: 'shader/:id',
    // canActivate: [AuthGuard],  // disabled because users should share their shaders
    component: ShaderViewerComponent,
  },
  {
    path: 'shader/:id/edit',
    canActivate: [AuthGuard, ShaderGuard],
    canDeactivate: [LeavePageGuard],
    component: ShaderEditorComponent,
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: ProfileComponent,
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: SettingsComponent,
  },
  { path: '**', canActivate: [AuthGuard], component: ShaderListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
