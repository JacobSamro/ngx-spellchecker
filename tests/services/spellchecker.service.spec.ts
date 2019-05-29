import { inject, TestBed } from '@angular/core/testing';

import { SpellCheckerService } from './../../ngx-spellchecker';
import { Dictionary } from '../../src/services/dictionary';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SpellCheckerService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        SpellCheckerService,
      ]
    });
  });

  it('should say the word `test` is true',
    inject([SpellCheckerService],
      (spellcheckerService: SpellCheckerService) => {
        spellcheckerService.getDictionary("")
          .then((dictionary: Dictionary) => {

            console.log(dictionary)

            expect(dictionary.spellCheck("testx")).toEqual(true);

          })

      })
  );

});