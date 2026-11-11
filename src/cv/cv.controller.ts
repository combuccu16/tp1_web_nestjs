import { Controller } from '@nestjs/common';
import { CvService } from './cv.service.js';

@Controller('cvs')
export class CvController {
    constructor(private readonly cvService: CvService) { }
}
