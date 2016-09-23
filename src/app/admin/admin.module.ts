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
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SidenavSectionComponent }from './components/sidenav/sidenav-section/sidenav-section.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdCardModule.forRoot(),
    MdButtonModule.forRoot(),
    routing
  ],
  declarations: [
    AdminComponent,
    LoginComponent,
    SidenavSectionComponent,
    SidenavComponent
  ],
  providers: [AuthGuardService, AuthService, MasterScreenerDataService]
})
export class AdminModule { }
