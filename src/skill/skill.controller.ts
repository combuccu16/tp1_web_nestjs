import { Controller } from '@nestjs/common';
import { SkillService } from './skill.service.js';

@Controller('skills')
export class SkillController {
    constructor(private readonly skillService: SkillService) { }
}
