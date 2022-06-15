import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShaderListComponent } from './components/shader-list/shader-list.component';
import { ShaderEditorComponent } from './components/shader-editor/shader-editor.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

const routes: Routes = [
  { path: '', component: ShaderListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'shader/new', component: ShaderEditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
