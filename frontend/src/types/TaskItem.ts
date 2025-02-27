
export interface TaskItemType{
    title: string;
    description: string;
    deadline?:Date |null;
    priority:"high"|"low"|"completed"|"";
    status:"to-do"|"done"|"on-progress"|"time-out"|"";
};
