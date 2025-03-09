export interface TaskSummaryCardProps {
    icon: string;
    title: string;
    count: number | string;
    total?: number; // Optional total value for fractions
    color: string; // Background color for the icon
    onClickEvent?:()=>void;
    onClose?:()=>void;
  }