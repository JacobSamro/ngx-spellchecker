import { Component, OnInit } from '@angular/core';


import { SpellCheckerService } from '../../../src/ngx-spellchecker';
import { Dictionary } from '../../../src/services/dictionary';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SpellCheckerService]
})
export class AppComponent implements OnInit {

  logs = ''
  output = ''
  fileURL = "https://raw.githubusercontent.com/JacobSamro/ngx-spellchecker/master/dict/normalized_en-US.dic"

  constructor(private spellCheckerService: SpellCheckerService, private httpClient: HttpClient) {

  }

  ngOnInit() {

    this.logs += "Downloading Dictionary\n"

    this.httpClient.get(this.fileURL, { responseType: 'text' }).subscribe((res: any) => {


      this.logs += "Initializing Dictionary\n"

      let dictionary = this.spellCheckerService.getDictionary(res)

      this.logs += "Dictionary Initialized\n"

      this.output += "<br/>The spelling of test is " + (dictionary.spellCheck("test"))
      this.output += "<br/>The spelling of apple is " + (dictionary.spellCheck("apple"))
      this.output += "<br/>The spelling of tommotto is " + (dictionary.spellCheck("tommotto"))
      this.output += "<br/>The spelling of yellow is " + (dictionary.spellCheck("yellow"))

    })


  }

}
