import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { routing } from './admin.routes';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { MasterScreenerDataService } from './master-screener/master-screener-data.service';
import { LoginComponent } from './login/login.component';
import { MdCardModule } from '@angular2-material/card';
import { MdButtonModule } from '@angular2-material/button';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    MdCardModule.forRoot(),
    MdButtonModule.forRoot(),
    routing
  ],
  declarations: [
    AdminComponent,
    LoginComponent,
  ],
  providers: [AuthGuardService, AuthService, MasterScreenerDataService]
})
export class AdminModule { }
