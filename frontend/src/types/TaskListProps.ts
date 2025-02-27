import { TaskItemType } from "./TaskItem";

export interface TaskListProps{
    header:"to-do"|"done"|"on-progress"|"";
    taskItems:TaskItemType[];
}