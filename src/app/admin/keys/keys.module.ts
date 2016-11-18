import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeysComponent } from './keys.component';
import { KeysOverviewComponent } from './overview/overview.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { KeyRouteGuard } from './route-guard.service';
import { KeyDetailComponent } from './detail/detail.component';
import { KeyEditComponent } from './edit/key-edit.component';
import { KeyOverviewControlsComponent } from './overview/key-overview-controls/key-overview-controls.component';
import { AdminCoreModule } from '../core/admin-core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KeyEditService } from './edit/service';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    AdminCoreModule,
    MaterialModule.forRoot(),
  ],
  declarations: [
    KeysComponent,
    KeysOverviewComponent,
    KeyDetailComponent,
    KeyEditComponent,
    KeyOverviewControlsComponent
  ],
  providers: [
    KeyRouteGuard,
    KeyEditService
  ]
})
export class KeysModule { }
