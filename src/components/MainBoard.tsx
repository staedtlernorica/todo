import { useState, useEffect } from "react";
import TaskBoard from "./TaskBoard";
import { Box, Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import type { Task, boardType } from "../types";
import Slide from "@mui/material/Slide";
import NewTask from "./NewTask";
// import { loginWithGoogle } from "../auth/googleSignIn";
import SignIn from "./SignIn";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  db,
  onAuthStateChanged,
  // signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  // setPersistence,
  // browserLocalPersistence,
} from "../config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";

// get data from localStorage
// const TODO_LIST = JSON.parse(
//   localStorage.getItem("todo_list") ?? JSON.stringify([])
// );
// const DONE_LIST = JSON.parse(
//   localStorage.getItem("done_list") ?? JSON.stringify([])
// );

const META = JSON.parse(
  localStorage.getItem("meta") ?? JSON.stringify({ lastActiveBoard: "todo" })
);

export default function MainBoard() {
  const [user, setUser] = useState<import("firebase/auth").User | null>(null);
  const [todoTasks, setTodoTasks] = useState([] as Task[]);
  const [doneTasks, setDoneTasks] = useState([] as Task[]);
  const [activeBoard, setActiveBoard] = useState(
    META.lastActiveBoard || "todo"
  );

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      const todoSnapshot = await getDocs(
        collection(db, "users", user.uid, "todo")
      );
      const doneSnapshot = await getDocs(
        collection(db, "users", user.uid, "done")
      );

      setTodoTasks(todoSnapshot.docs.map((doc) => doc.data() as Task));
      setDoneTasks(doneSnapshot.docs.map((doc) => doc.data() as Task));
    };

    fetchTasks();
  }, [user]);

  const addTask = async (
    task: string,
    boardType: boardType,
    taskId?: string
  ) => {
    if (!user) return;

    const newTask = {
      task: task,
      status: boardType,
      id: taskId || uuidv4(),
    };

    // Update local state
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

    // Write to Firestore
    const taskRef = doc(db, "users", user.uid, boardType, newTask.id);
    await setDoc(taskRef, newTask);
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

  const setTaskValue = async (
    taskSetter: React.Dispatch<React.SetStateAction<Task[]>>,
    tasks: Task[],
    taskId: string,
    newValue: string,
    storageKey: string
  ) => {
    if (!user) return;

    const newList = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, task: newValue };
      }
      return task;
    });

    taskSetter(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));

    // Update Firestore
    const boardType = storageKey === "todo_list" ? "todo" : "done";
    const taskRef = doc(db, "users", user.uid, boardType, taskId);
    await updateDoc(taskRef, { task: newValue });
  };

  const updateTaskStatus = async (
    task: string,
    taskId: string,
    newBoardType: boardType
  ) => {
    await addTask(task, newBoardType, taskId);
    await deleteTask(taskId, newBoardType === "todo" ? "done" : "todo");
  };

  const deleteTask = async (taskId: string, boardType: boardType) => {
    if (!user) return;

    // Update local state
    if (boardType === "todo") {
      const updatedTasks = todoTasks.filter((task) => task.id !== taskId);
      setTodoTasks(updatedTasks);
      localStorage.setItem("todo_list", JSON.stringify(updatedTasks));
    } else {
      const updatedTasks = doneTasks.filter((task) => task.id !== taskId);
      setDoneTasks(updatedTasks);
      localStorage.setItem("done_list", JSON.stringify(updatedTasks));
    }

    // Delete from Firestore
    const taskRef = doc(db, "users", user.uid, boardType, taskId);
    await deleteDoc(taskRef);
  };

  const boardSlideTiming = 300;

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
      <Box>
        <SignIn
          user={user}
          handleGoogleSignIn={handleGoogleSignIn}
          handleGoogleSignOut={handleGoogleSignOut}
        ></SignIn>
        <Box className="flex flex-col h-screen justify-between pt-1 md:pt-5">
          <Box className=" h-full">
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
              <div className="absolute w-full">
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
              <div className="absolute w-full">
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
          <Box className="fixed bottom-0 w-full">
            <NewTask addTask={addTask} boardType={activeBoard}></NewTask>
            <Box
              // className="fixed relative bottom-0 flex justify-center items-center mt-0 gap-2 p-4 bg-gray-100"
              // className="fixed bottom-0 left-0 w-full bg-gray-200 p-3.5 text-center shadow gap-2 flex justify-center"
              className="z-10 w-full bg-gray-100 p-3.5 text-center shadow gap-2 bottom-0 flex justify-center"
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
              {/* <SignIn
              user={user}
              handleGoogleSignIn={handleGoogleSignIn}
              handleGoogleSignOut={handleGoogleSignOut}
              ></SignIn> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
