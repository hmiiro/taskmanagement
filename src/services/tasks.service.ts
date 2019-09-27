import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { GetTasksFilterDto } from '../tasks/dto/get-tasks-filter.dto';
import { TaskRepository } from '../repository/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '../tasks/task-status.enum';
import { User } from '../entities/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {

    }

    // GET TASKS
   async getTasks(
       getTasksFilterDto: GetTasksFilterDto,
       user: User,
       ): Promise<Task []> {
        return this.taskRepository.getTasks(getTasksFilterDto, user);
    }

    // GET TASK BY ID
    async getTaskById(id: number, user: User): Promise<Task> {
        const foundTask = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        if (!foundTask) {
            throw new NotFoundException(`Task with ID ${id} not found!`);
        }
        return foundTask;
    }

    // CREATE TASK
    async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
        ): Promise<Task> { // : Task--setting the return type
        return this.taskRepository.createTask(createTaskDto, user);
    }

    // UPDATE TASK STATUS
    async updateTaskStatus(
        id: number,
        status: TaskStatus,
        user: User,
        ): Promise<Task> {
        const task = await this.getTaskById(id, user);
        // change status of local task object
        task.status = status;
        // save the updated object to db
        task.save();
        return task;
    }
    // DELETE TASK
    async deleteTask(id: number, user: User): Promise<void> {
        // Get task and delete it in same call
        const deletedTask = await this.taskRepository.delete({ id, userId: user.id });

        if (deletedTask.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found!`);
        }
    }
}
