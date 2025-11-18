import { Module } from '@nestjs/common';
import { IntegrationController } from './integration.controller';
import { ShiftsIntegrationService } from './shifts-integration.service';

@Module({
  controllers: [IntegrationController],
  providers: [ShiftsIntegrationService],
})
export class IntegrationModule {}
