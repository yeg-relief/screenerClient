import { Injectable } from '@angular/core';
import { UserFacingProgram } from '../shared/models';

@Injectable()
export class ProgramsServiceService {
    private programs: {[key: string]: UserFacingProgram} = {};

    public addPrograms(newPrograms: UserFacingProgram[]) {
        newPrograms.forEach(p => this.programs[p.guid] = p);
    }

    public getProgram(guid: string): Promise<UserFacingProgram> {
        return new Promise( (resolve, reject) => {
            if (this.programs[guid]) {
                resolve(this.programs[guid]);
            } else {
                reject(guid);
            }
        })
    }
}
