import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto';

@ApiTags('staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @ApiOperation({ summary: '職員一覧取得' })
  @ApiQuery({ name: 'facilityId', required: true, description: '事業所ID' })
  findAll(@Query('facilityId') facilityId: string) {
    return this.staffService.findAll(facilityId);
  }

  @Get('statistics')
  @ApiOperation({ summary: '職員統計情報取得' })
  @ApiQuery({ name: 'facilityId', required: true, description: '事業所ID' })
  getStatistics(@Query('facilityId') facilityId: string) {
    return this.staffService.getStaffStatistics(facilityId);
  }

  @Get('on-duty')
  @ApiOperation({ summary: '出勤職員取得' })
  @ApiQuery({ name: 'facilityId', required: true, description: '事業所ID' })
  @ApiQuery({ name: 'date', required: true, description: '対象日（YYYY-MM-DD）', example: '2024-01-20' })
  getOnDutyStaff(
    @Query('facilityId') facilityId: string,
    @Query('date') date: string,
  ) {
    return this.staffService.getOnDutyStaff(facilityId, new Date(date));
  }

  @Get(':id')
  @ApiOperation({ summary: '職員詳細取得' })
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '職員新規登録' })
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '職員情報更新' })
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '職員削除' })
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
