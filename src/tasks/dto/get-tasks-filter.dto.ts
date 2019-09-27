import { TaskStatus } from '../task-status.enum';
import { IsOptional, IsNotEmpty, IsIn } from 'class-validator';

export class GetTasksFilterDto {
    @IsOptional()
    @IsIn([TaskStatus.CREATED, TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, TaskStatus.CLOSED])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}
