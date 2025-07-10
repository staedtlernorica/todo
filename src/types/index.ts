import type { User } from "firebase/auth";
import type { Timestamp } from "firebase/firestore";

export interface NewTaskProps {
  addTask: (task: string, boardType: boardType) => void;
  boardType: boardType;
}

export interface InputChangeEvent {
  target: { value: string };
}

export type boardType = "todo" | "done";

export interface TaskProps {
  index: number;
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
  endRef?: React.RefObject<HTMLDivElement>; // 👈 Add this
};

export type Task = {
  id: string;
  task: string;
  status: boardType;
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
};

export type BoardSlideDirection = "left | right";

export interface SignInProps {
  user: User | null;
  handleGoogleSignIn: () => Promise<void>;
  handleGoogleSignOut: () => Promise<void>;
}
