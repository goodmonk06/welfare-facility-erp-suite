import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto';

@ApiTags('staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @ApiOperation({ summary: '職員一覧取得' })
  findAll(@Query('facilityId') facilityId: string) {
    return this.staffService.findAll(facilityId);
  }

  @Get('on-duty')
  @ApiOperation({ summary: '出勤職員取得' })
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
