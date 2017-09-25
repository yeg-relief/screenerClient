import { Component, OnInit } from '@angular/core';
import { ProgramsServiceService } from "../../../../user/programs-service.service";
import { ActivatedRoute } from "@angular/router";
import { UserFacingProgram } from "../../../models/program";

@Component({
    selector: 'app-program-detail',
    templateUrl: './program-detail.component.html',
    styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {
    program: Promise<UserFacingProgram | string>;
    guid: string;
    error = '';

    constructor(
        private programService: ProgramsServiceService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        const guid = this.route.snapshot.paramMap['params']['guid'];
        if (guid) {
            this.program =
                this.programService.getProgram(guid)
                    .then(program => {
                        program.detailLinks = program.detailLinks || [];
                        return program;
                    })
                    .catch(_ => {
                        this.error = 'Can not retrieve program.';
                        return undefined;
                    });


        }
    }
}
