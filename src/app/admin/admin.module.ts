import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { routing } from './admin.routes';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { MdCardModule } from '@angular2-material/card';
import { MdButtonModule } from '@angular2-material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdCardModule.forRoot(),
    MdButtonModule.forRoot(),
    routing
  ],
  declarations: [AdminComponent, LoginComponent],
  providers: [AuthGuardService, AuthService]
})
export class AdminModule { }
