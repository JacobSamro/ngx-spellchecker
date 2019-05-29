import { inject, TestBed } from '@angular/core/testing';

import { SpellCheckerService } from './../../ngx-spellchecker';
import { Dictionary } from '../../src/services/dictionary';

describe('SpellCheckerService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
        SpellCheckerService,
      ]
    });
  });

  it('should say the word `test` is true',
    inject([SpellCheckerService],
      (spellcheckerService: SpellCheckerService) => {
        let dictionary: Dictionary = spellcheckerService.getDictionary('test\ntomatto')


        expect(dictionary.spellCheck("testx")).toEqual(false);
        expect(dictionary.spellCheck("test")).toEqual(true);
        expect(dictionary.spellCheck("tomatto")).toEqual(true);


      })
  );

});