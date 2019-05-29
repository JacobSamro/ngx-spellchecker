import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'

import { Dictionary } from './dictionary'

@Injectable()
export class SpellCheckerService {

    dictionaryURL = "https://raw.githubusercontent.com/JacobSamro/ngx-spellchecker/master/dict/normalized_en-US.dic"

    getDictionary(dictionary: any) {
        return new Dictionary(dictionary.split('\n'))
    }

}
