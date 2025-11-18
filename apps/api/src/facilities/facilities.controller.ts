import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto, UpdateFacilityDto } from './dto';

@ApiTags('facilities')
@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Get()
  @ApiOperation({ summary: '事業所一覧取得' })
  @ApiResponse({ status: 200, description: '事業所一覧' })
  findAll() {
    return this.facilitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '事業所詳細取得' })
  @ApiResponse({ status: 200, description: '事業所詳細' })
  @ApiResponse({ status: 404, description: '事業所が見つかりません' })
  findOne(@Param('id') id: string) {
    return this.facilitiesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '事業所新規登録' })
  @ApiResponse({ status: 201, description: '事業所登録完了' })
  create(@Body() createFacilityDto: CreateFacilityDto) {
    return this.facilitiesService.create(createFacilityDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '事業所情報更新' })
  @ApiResponse({ status: 200, description: '事業所更新完了' })
  @ApiResponse({ status: 404, description: '事業所が見つかりません' })
  update(@Param('id') id: string, @Body() updateFacilityDto: UpdateFacilityDto) {
    return this.facilitiesService.update(id, updateFacilityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '事業所削除' })
  @ApiResponse({ status: 200, description: '事業所削除完了' })
  @ApiResponse({ status: 404, description: '事業所が見つかりません' })
  remove(@Param('id') id: string) {
    return this.facilitiesService.remove(id);
  }
}
