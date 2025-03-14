
export interface TaskItemType{
    title: string;
    description: string;
    deadline?:Date |null;
    priority:"high"|"low"|"completed"|"";
    status:"to-do"|"done"|"on-progress"|"time-out"|"";
    createdAt?:Date|null;
    _id?:string;
    setActiveCard?:(task: TaskItemType | undefined) => void;
};
