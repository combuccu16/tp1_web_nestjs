import { Global, Module } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from './uuid/token.js';

/**
 * SharedModule available everywhere.
 *
 * The `uuid` library is provided through a CUSTOM PROVIDER:
 *
 * - useFactory  -> the factory function is CALLED to produce the value.
 *                  Here we return the uuidv4 generator itself, so every
 *                  consumer can request a fresh id whenever it needs one.
 * - useValue    -> would inject a fixed, pre-built object (no laziness).
 * - useClass    -> would bind the token to a class as a provider.
 *
 * useFactory is the right fit because we want a function that generates
 * a NEW id on each call, with the wiring decided at bootstrap time.
 */
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
export class CommonModule {}
