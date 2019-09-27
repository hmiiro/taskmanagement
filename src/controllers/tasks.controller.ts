import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { GetTasksFilterDto } from '../tasks/dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from '../tasks/pipes/task-status-validation.pipe';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '../tasks/task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    // CREATE A TASK
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User, // pass on user details
        ): Promise<Task> { // : Promise<Task>--setting the return type
        return this.tasksService.createTask(createTaskDto, user);
    }

    // GET TASKS
    @Get()
    getTasks(
        @Query(ValidationPipe) getTasksFilterDto: GetTasksFilterDto,
        @GetUser() user: User, // pass on user details
        ): Promise<Task []> {
            return this.tasksService.getTasks(getTasksFilterDto, user);
    }

    // GET A TASK BY ID
    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User, // pass on user details
        ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    // DELETE A TASK
    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
   }

    // UPDATE A TASK STATUS
    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User,
        ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }
}
