import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth/logout')
export class LogoutController {
    
}
