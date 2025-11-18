import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'タスク一覧取得' })
  findAll(
    @Query('facilityId') facilityId: string,
    @Query('status') status?: string,
  ) {
    return this.tasksService.findAll(facilityId, status);
  }

  @Get('kanban')
  @ApiOperation({ summary: 'カンバン形式でタスク取得' })
  getKanban(@Query('facilityId') facilityId: string) {
    return this.tasksService.getKanban(facilityId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'タスク詳細取得' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'タスク新規作成' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'タスク更新' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'タスク削除' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
