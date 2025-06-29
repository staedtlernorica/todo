import { useState, useEffect } from "react";
import TaskBoard from "./TaskBoard";
import { Box, Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import type { Task, boardType } from "../types";
import Slide from "@mui/material/Slide";
// import { loginWithGoogle } from "../auth/googleSignIn";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  db,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  // setPersistence,
  // browserLocalPersistence,
} from "../config/firebase";
import SignIn from "./SignIn";

const TODO_LIST = JSON.parse(
  localStorage.getItem("todo_list") ?? JSON.stringify([])
);
const DONE_LIST = JSON.parse(
  localStorage.getItem("done_list") ?? JSON.stringify([])
);

const META = JSON.parse(
  localStorage.getItem("meta") ?? JSON.stringify({ lastActiveBoard: "todo" })
);

// =====================================================
const FIREBASE_DATA = [];
import { collection, addDoc } from "firebase/firestore";
// =====================================================

export default function MainBoard() {
  const [todoTasks, setTodoTasks] = useState(TODO_LIST);
  const [doneTasks, setDoneTasks] = useState(DONE_LIST);
  const [activeBoard, setActiveBoard] = useState(
    META.lastActiveBoard || "todo"
  );

  const addTask = (task: string, boardType: boardType, taskId?: string) => {
    const newTask = {
      task: task,
      status: boardType,
      id: taskId || uuidv4(),
    };
    if (boardType === "todo") {
      setTodoTasks([...todoTasks, newTask]);
      localStorage.setItem(
        "todo_list",
        JSON.stringify([...todoTasks, newTask])
      );
    } else {
      setDoneTasks([...doneTasks, newTask]);
      localStorage.setItem(
        "done_list",
        JSON.stringify([...doneTasks, newTask])
      );
    }
  };

  const updateTaskValue = (
    taskId: string,
    newValue: string,
    boardType: boardType
  ) => {
    if (boardType === "todo") {
      setTaskValue(setTodoTasks, todoTasks, taskId, newValue, "todo_list");
    } else {
      setTaskValue(setDoneTasks, doneTasks, taskId, newValue, "done_list");
    }
  };

  const setTaskValue = (
    taskSetter: React.Dispatch<React.SetStateAction<Task[]>>,
    tasks: Task[],
    taskId: string,
    newValue: string,
    storageKey: string
  ) => {
    const newList = tasks.map((task: Task) => {
      if (task.id === taskId) {
        return { ...task, task: newValue };
      }
      return task;
    });
    taskSetter(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
  };

  const updateTaskStatus = (
    task: string,
    taskId: string,
    newBoardType: boardType
  ) => {
    if (newBoardType === "todo") {
      addTask(task, newBoardType, taskId);
      deleteTask(taskId, "done");
    } else {
      addTask(task, newBoardType, taskId);
      deleteTask(taskId, "todo");
    }
  };

  const deleteTask = (taskId: string, boardType: boardType) => {
    if (boardType === "todo") {
      const updatedTasks: Task[] = todoTasks.filter(
        (task: Task) => task.id !== taskId
      );
      setTodoTasks(updatedTasks);
      localStorage.setItem("todo_list", JSON.stringify(updatedTasks));
    } else {
      const updatedTasks: Task[] = doneTasks.filter(
        (task: Task) => task.id !== taskId
      );
      setDoneTasks(updatedTasks);
      localStorage.setItem("done_list", JSON.stringify(updatedTasks));
    }
  };

  const boardSlideTiming = 300;

  const [user, setUser] = useState<import("firebase/auth").User | null>(null);

  // signInWithRedirect(auth, provider);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log("Signed in successfully with Google");
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  // checking authentication state between page reloads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ?? null);
      console.log("Auth state changed:", user);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          setUser(result.user);

          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;

          console.log("Redirect Sign-in Successful", result.user, token);
        }
      })
      .catch((error) => {
        console.error("Redirect result error:", error);
      });
  }, []);

  return (
    <>
      <Box className="flex flex-col h-screen justify-between pt-1 md:pt-5">
        <SignIn
          user={user}
          handleGoogleSignIn={handleGoogleSignIn}
          handleGoogleSignOut={handleGoogleSignOut}
        ></SignIn>
        <Box sx={{ position: "relative", height: "100%" }}>
          <Slide
            direction="right"
            in={activeBoard === "todo"}
            timeout={boardSlideTiming}
            mountOnEnter
            unmountOnExit
            // easing={{
            //   enter: "cubic-bezier(0, 1.5, .8, 1)",
            //   exit: "linear",
            // }}
          >
            <div style={{ position: "absolute", width: "100%" }}>
              <TaskBoard
                tasks={todoTasks}
                boardType="todo"
                deleteTask={deleteTask}
                updateTaskValue={updateTaskValue}
                updateTaskStatus={updateTaskStatus}
                addTask={addTask}
              />
            </div>
          </Slide>
          <Slide
            direction="left"
            in={activeBoard === "done"}
            timeout={boardSlideTiming}
            mountOnEnter
            unmountOnExit
            // easing={{
            //   enter: "cubic-bezier(0, 1.5, .8, 1)",
            //   exit: "linear",
            // }}
          >
            <div style={{ position: "absolute", width: "100%" }}>
              <TaskBoard
                tasks={doneTasks}
                boardType="done"
                deleteTask={deleteTask}
                updateTaskValue={updateTaskValue}
                updateTaskStatus={updateTaskStatus}
                addTask={addTask}
              />
            </div>
          </Slide>
        </Box>
        <Box
          // className="fixed relative bottom-0 flex justify-center items-center mt-0 gap-2 p-4 bg-gray-100"
          className="fixed bottom-0 left-0 w-full bg-gray-200 p-4 text-center shadow gap-2 flex justify-center"
        >
          <Button
            variant={activeBoard === "todo" ? "contained" : "outlined"}
            onClick={() => setActiveBoard("todo")}
          >
            To Do
          </Button>
          <Button
            variant={activeBoard === "done" ? "contained" : "outlined"}
            onClick={() => setActiveBoard("done")}
          >
            Done
          </Button>
        </Box>
      </Box>
    </>
  );
}
