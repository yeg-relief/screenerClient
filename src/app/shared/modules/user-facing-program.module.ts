import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserFacingProgramComponent } from
    '../components/program/user-facing-program/user-facing-program.component';
import { MaterialModule } from '@angular/material';
import { ProgramRowComponent } from
    '../components/program/user-facing-program/program-row/program-row.component'
import { DetailModalComponent } from '../components/program/detail-modal/detail-modal.component';
import { ProgramModalService } from '../components/program-modal.service';
@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,

    ],
    declarations: [
        UserFacingProgramComponent,
        ProgramRowComponent,
        DetailModalComponent,
    ],
    providers: [
        ProgramModalService
    ],
    exports: [
        UserFacingProgramComponent,
        ProgramRowComponent,
    ],
    entryComponents: [
        DetailModalComponent
    ]
})
export class UserFacingProgramModule {};
