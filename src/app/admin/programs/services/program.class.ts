import { ApplicationFacingProgram, ProgramCondition, ProgramQuery } from '../../models'
import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl } from '@angular/forms';
import { UserProgram } from './user-program.class';
import { ProgramQueryClass } from './program-query.class';

export class Program {
  application: ProgramQueryClass[];
  user: UserProgram;
  guid: string;
  form: FormGroup;
  data: ApplicationFacingProgram;

  constructor(opts, fb: FormBuilder){

    const queries = opts.application ? opts.application : [];
    const user = opts.user ? {...opts.user} : {
      guid: 'new',
      title: '',
      details: '',
      externalLink: '',
      created: 0,
      tags: []
    };

    this.guid = opts.guid ? opts.guid : 'new';

    this.user = new UserProgram(user, fb);
    this.application = queries.map(q => new ProgramQueryClass(q, fb));

    this.data = {
      user: user,
      application: queries,
      guid: this.guid
    };

    this._initForm(fb);

  }

  private _initForm(fb: FormBuilder) {
    const queries = this.application.map(q => q.form);
    this.form = fb.group({
      guid: new FormControl(this.guid, Validators.required),
      user: this.user._form,
      application: new FormControl(queries)
    });
  }

  validator(programGroup: AbstractControl): {[key: string]: any} {
    return null;
  }

  updateQuery(id: string, update: ProgramQueryClass){
    const targetQuery = this.application.find(q => q.data.id === update.data.id)
    if (targetQuery !== undefined) {
      targetQuery.form.setValue(update.form.value);
      targetQuery.commit();
    }
  }

}

