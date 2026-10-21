import { Inject, Injectable } from '@nestjs/common';
import { UUID } from '../common/uuid/token.js';
@Injectable()
export class TestInjectionService {
    constructor(
    @Inject(UUID)
    private readonly uuid: () => string) { }
    generateId(): string {
        return this.uuid();
    }
}
