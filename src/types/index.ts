export interface NewTaskProps {
  addTask: (task: string, boardType: boardType) => void;
  boardType: boardType;
}

export interface InputChangeEvent {
  target: { value: string };
}

export type boardType = "todo" | "done";

export interface TaskProps {
  task: string;
  taskId: string;
  status: boardType;
  deleteTask: (taskId: string, boardType: boardType) => void;
  updateTaskValue: (
    taskId: string,
    newValue: string,
    boardType: boardType
  ) => void;
  updateTaskStatus: (
    task: string,
    taskId: string,
    boardType: boardType
  ) => void;
}

export type TaskBoardProps = {
  tasks: Task[];
  addTask: (task: string, boardType: boardType) => void;
  deleteTask: (taskId: string, boardType: boardType) => void;
  updateTaskValue: (
    taskId: string,
    newValue: string,
    boardType: boardType
  ) => void;
  updateTaskStatus: (
    task: string,
    taskId: string,
    boardType: boardType
  ) => void;
  boardType: boardType;
};

export type Task = {
  task: string;
  id: string;
  status: boardType;
};
