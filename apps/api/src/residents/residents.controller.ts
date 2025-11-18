import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResidentsService } from './residents.service';
import { CreateResidentDto, UpdateResidentDto } from './dto';

@ApiTags('residents')
@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  @Get()
  @ApiOperation({ summary: '利用者一覧取得' })
  @ApiResponse({ status: 200, description: '利用者一覧' })
  findAll(@Query('facilityId') facilityId: string) {
    return this.residentsService.findAll(facilityId);
  }

  @Get('stats')
  @ApiOperation({ summary: '利用者統計取得' })
  @ApiResponse({ status: 200, description: '利用者統計情報' })
  getStats(@Query('facilityId') facilityId: string) {
    return this.residentsService.getStats(facilityId);
  }

  @Get(':id')
  @ApiOperation({ summary: '利用者詳細取得' })
  @ApiResponse({ status: 200, description: '利用者詳細' })
  findOne(@Param('id') id: string) {
    return this.residentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '利用者新規登録' })
  @ApiResponse({ status: 201, description: '利用者登録完了' })
  create(@Body() createResidentDto: CreateResidentDto) {
    return this.residentsService.create(createResidentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '利用者情報更新' })
  @ApiResponse({ status: 200, description: '利用者更新完了' })
  update(@Param('id') id: string, @Body() updateResidentDto: UpdateResidentDto) {
    return this.residentsService.update(id, updateResidentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '利用者削除' })
  @ApiResponse({ status: 200, description: '利用者削除完了' })
  remove(@Param('id') id: string) {
    return this.residentsService.remove(id);
  }
}
