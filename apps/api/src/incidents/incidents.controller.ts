import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto, UpdateIncidentDto } from './dto';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  @ApiOperation({ summary: 'インシデント一覧取得' })
  findAll(@Query('facilityId') facilityId: string) {
    return this.incidentsService.findAll(facilityId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'インシデント統計取得' })
  getStats(
    @Query('facilityId') facilityId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.incidentsService.getStats(
      facilityId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'インシデント詳細取得' })
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'インシデント新規登録' })
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'インシデント更新' })
  update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentsService.update(id, updateIncidentDto);
  }
}
