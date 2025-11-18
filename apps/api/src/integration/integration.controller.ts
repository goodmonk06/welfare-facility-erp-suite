import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShiftsIntegrationService } from './shifts-integration.service';
import { ImportShiftsDto } from './dto';

@ApiTags('integration')
@Controller('integration')
export class IntegrationController {
  constructor(
    private readonly shiftsIntegrationService: ShiftsIntegrationService,
  ) {}

  @Post('shifts/import')
  @ApiOperation({
    summary: 'シフトデータインポート',
    description: 'shift-scheduler-v3からのシフトデータをインポート',
  })
  @ApiResponse({ status: 201, description: 'インポート成功' })
  @ApiResponse({ status: 400, description: 'データ形式エラー' })
  async importShifts(@Body() importShiftsDto: ImportShiftsDto) {
    return this.shiftsIntegrationService.importShifts(importShiftsDto);
  }
}
