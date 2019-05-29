import { NgModule, ModuleWithProviders } from '@angular/core';

import { SpellCheckerService } from '../services/spellchecker.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@NgModule({
    declarations: [
        // Pipes.
        // Directives.
        // Components.
    ],
    exports: [
        // Pipes.
        // Directives.
        // Components.
    ],
    imports: [
    ],
    providers: [
    ]
})
// Consider registering providers using a forRoot() method
// when the module exports components, directives or pipes that require sharing the same providers instances.
// Consider registering providers also using a forChild() method
// when they requires new providers instances or different providers in child modules.
export class SpellCheckerModule {

    /**
     * Use in AppModule: new instance of SpellCheckerService.
     */
    public static forRoot(): ModuleWithProviders<SpellCheckerModule> {
        return {
            ngModule: SpellCheckerModule,
            providers: [SpellCheckerService]
        };
    }

    /**
     * Use in features modules with lazy loading: new instance of SpellCheckerService.
     */
    public static forChild(): ModuleWithProviders<SpellCheckerModule> {
        return {
            ngModule: SpellCheckerModule,
            providers: [SpellCheckerService]
        };
    }

}
