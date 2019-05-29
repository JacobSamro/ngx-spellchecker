import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

import { Dictionary } from './dictionary'

@Injectable()
export class SpellCheckerService {

    dictionaryURL = "https://raw.githubusercontent.com/JacobSamro/ngx-spellchecker/master/dict/normalized_en-US.dic"

    constructor(private httpClient: HttpClient) {

    }

    /**
     * Create a dictionary from a file, which might be either a .dic or a .zip file.
     *
     * @param {string} fileURL The name of the file from which read the word list.
     */
    getDictionary(fileURL: string): Promise<Dictionary> {

        if (!fileURL) {
            fileURL = this.dictionaryURL
        }

        return new Promise((resolve, reject) => {

            this.getFile(fileURL).subscribe((res: any) => {

                console.log("res")

                var dictionary = new Dictionary(res.split('\n'));
                resolve(dictionary);

            }, (err) => {
                console.log("err", err)
                reject(err)
            })
        })

    }

    /**
     * Create a dictionary from a .dic file.
     *
     * @param {string} url The path of the file.
     */
    getFile(url: string): Observable<File> {
        return this.httpClient.get<File>(url);
    }



}
