import { Repository, EntityRepository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { TaskStatus } from '../tasks/task-status.enum';
import { GetTasksFilterDto } from '../tasks/dto/get-tasks-filter.dto';
import { User } from '../entities/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    // CREATE TASK LOGIC
    async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
        ): Promise<Task> {
        // desctruct the Create task Dto
        const { title, description } = createTaskDto;
        // instantiate a new task
        const task = new Task();
        // assign it the new details provided.
        task.title = title;
        task.description = description;
        task.status = TaskStatus.CREATED;
        task.user = user;// add on user info.
        // save the new task to database
        await task.save();

        // remove the user info when retutning task
        delete task.user;
        // then retun it
        return task;
    }
    // GET TASKS
    async getTasks(
        getTasksFilterDto: GetTasksFilterDto,
        user: User,
        ): Promise<Task[]> {
        const { status, search } = getTasksFilterDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere(('task.title LIKE :search OR task.description LIKE :search'), { search: `%${search}%` });
        }
        const tasks = await query.getMany();
        return tasks;
    }
}
