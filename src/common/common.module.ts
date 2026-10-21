import { Global, Module } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from './uuid/token.js';
@Global()
@Module({
    providers: [
        {
            provide: UUID,
            useFactory: () => uuidv4,
        },
    ],
    exports: [UUID],
})
export class CommonModule {
}
