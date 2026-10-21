import { Inject, Injectable } from '@nestjs/common';
import { UUID } from '../common/uuid/token.js';

/**
 * Small service used to prove that the uuid custom provider of the
 * CommonModule can be injected anywhere in the application.
 */
@Injectable()
export class TestInjectionService {
	// The injection token declared in CommonModule's provider definition.
	constructor(
		@Inject(UUID)
		private readonly uuid: () => string,
	) {}

	generateId(): string {
		return this.uuid();
	}
}
