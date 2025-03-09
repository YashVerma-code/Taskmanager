import { TaskItemType } from "./TaskItem";

export interface TaskListProps{
    header:"to-do"|"done"|"on-progress"|"Expired-Task"|"";
    taskItems:TaskItemType[];
    onClose?:()=>void;
}