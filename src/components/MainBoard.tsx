import { useState, useEffect, useRef } from "react";
import TaskBoard from "./TaskBoard";
import { Box, Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import type { Task, boardType } from "../types";
import Slide from "@mui/material/Slide";
import NewTask from "./NewTask";
import SignIn from "./SignIn";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  db,
  onAuthStateChanged,
  getRedirectResult,
  GoogleAuthProvider,
} from "../config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";

const META = JSON.parse(
  localStorage.getItem("meta") ?? JSON.stringify({ lastActiveBoard: "todo" })
);

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    if (part !== undefined) {
      return part.split(";").shift();
    }
  }
  return null;
}

const LAST_ACTIVE_BOARD = getCookie("lastActiveBoard");

// check cookie for activeBoard, if none set cookie to 'todo'
// set activeBoard to cookie value
// every time the board changes, write to cookie

export default function MainBoard() {
  const [user, setUser] = useState<import("firebase/auth").User | null>(null);
  const [todoTasks, setTodoTasks] = useState([] as Task[]);
  const [doneTasks, setDoneTasks] = useState([] as Task[]);
  const [activeBoard, setActiveBoard] = useState<boardType>(
    // META.lastActiveBoard || "todo"
    (LAST_ACTIVE_BOARD as boardType) || "todo"
  );

  function handleBoardChange(e: boardType): boardType {
    setActiveBoard(e);
    const date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `lastActiveBoard=${e}; expires=${date.toUTCString()}; path=/`;
    return e;
  }

  const fadeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        const todoSnapshot = await getDocs(
          collection(db, "users", user.uid, "todo")
        );
        const doneSnapshot = await getDocs(
          collection(db, "users", user.uid, "done")
        );
        setTodoTasks(
          todoSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              ...data,
              createdAt: data.createdAt?.toDate?.() ?? new Date(), // fallback for missing timestamp
            } as Task;
          })
        );
        setDoneTasks(
          doneSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              ...data,
              createdAt: data.createdAt?.toDate?.() ?? new Date(), // fallback for missing timestamp
            } as Task;
          })
        );
      };
      fetchTasks();
    } else if (!user) {
      const TODO_LIST = JSON.parse(
        localStorage.getItem("todo_list") ?? JSON.stringify([])
      ).map((t: { createdAt: string | number | Date }) => ({
        ...t,
        createdAt: new Date(t.createdAt),
      }));
      const DONE_LIST = JSON.parse(
        localStorage.getItem("done_list") ?? JSON.stringify([])
      ).map((t: { createdAt: string | number | Date }) => ({
        ...t,
        createdAt: new Date(t.createdAt),
      }));
      setTodoTasks(TODO_LIST);
      setDoneTasks(DONE_LIST);
    }
  }, [user]);

  const addTask = async (
    task: string,
    boardType: boardType,
    taskId?: string
  ) => {
    const now = new Date();
    const newTask: Task = {
      task,
      status: boardType,
      id: taskId || uuidv4(),
      createdAt: now, // stays a Date in the app state
    };

    // Update local state
    if (boardType === "todo") {
      const updated = [...todoTasks, newTask];
      setTodoTasks(updated);

      // Save to localStorage with ISO string for serialization
      const serialized = updated.map((task) => ({
        ...task,
        createdAt:
          task.createdAt instanceof Date
            ? task.createdAt.toISOString()
            : task.createdAt.toDate().toISOString(), // Timestamp -> Date
      }));
      localStorage.setItem("todo_list", JSON.stringify(serialized));
    } else {
      const updated = [...doneTasks, newTask];
      setDoneTasks(updated);

      const serialized = updated.map((task) => ({
        ...task,
        createdAt:
          task.createdAt instanceof Date
            ? task.createdAt.toISOString()
            : task.createdAt.toDate().toISOString(),
      }));
      localStorage.setItem("done_list", JSON.stringify(serialized));
    }

    // Save to Firestore with Firestore's Timestamp
    if (user) {
      const taskRef = doc(db, "users", user.uid, boardType, newTask.id);
      await setDoc(taskRef, {
        ...newTask,
        createdAt: Timestamp.fromDate(now),
      });
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

  const setTaskValue = async (
    taskSetter: React.Dispatch<React.SetStateAction<Task[]>>,
    tasks: Task[],
    taskId: string,
    newValue: string,
    storageKey: string
  ) => {
    const newList = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, task: newValue };
      }
      return task;
    });
    taskSetter(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));

    // Update Firestore
    if (user) {
      const boardType = storageKey === "todo_list" ? "todo" : "done";
      const taskRef = doc(db, "users", user.uid, boardType, taskId);
      await updateDoc(taskRef, { task: newValue });
    }
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

    if (user) {
      // Delete from Firestore
      const taskRef = doc(db, "users", user.uid, boardType, taskId);
      await deleteDoc(taskRef);
    }
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

  // Intersection Observer effect to remove/add fade container class
  useEffect(() => {
    const sentinel = document.getElementById("scroll-sentinel");
    const fadeContainer = fadeRef.current;

    if (!sentinel || !fadeContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fadeContainer.classList.remove("more-entries-fade-container");
          } else {
            fadeContainer.classList.add("more-entries-fade-container");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -20px 0px",
        threshold: 1,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Box>
        <SignIn
          user={user}
          handleGoogleSignIn={handleGoogleSignIn}
          handleGoogleSignOut={handleGoogleSignOut}
        />
        <Box className="flex flex-col justify-between h-screen relative">
          <Box>
            <Slide
              direction="right"
              in={activeBoard === "todo"}
              timeout={boardSlideTiming}
              mountOnEnter
              unmountOnExit
            >
              <Box className="absolute w-full pt-5 pb-35">
                <TaskBoard
                  tasks={todoTasks}
                  boardType="todo"
                  deleteTask={deleteTask}
                  updateTaskValue={updateTaskValue}
                  updateTaskStatus={updateTaskStatus}
                  addTask={addTask}
                />
              </Box>
            </Slide>
            <Slide
              direction="left"
              in={activeBoard === "done"}
              timeout={boardSlideTiming}
              mountOnEnter
              unmountOnExit
            >
              <Box className="absolute w-full pt-5 pb-35">
                <TaskBoard
                  tasks={doneTasks}
                  boardType="done"
                  deleteTask={deleteTask}
                  updateTaskValue={updateTaskValue}
                  updateTaskStatus={updateTaskStatus}
                  addTask={addTask}
                />
              </Box>
            </Slide>
          </Box>

          <Box
            ref={fadeRef}
            className="bg-gray-100 more-entries-fade-container fixed mt-5 bottom-8 w-full h-[100px]"
          >
            <NewTask addTask={addTask} boardType={activeBoard} />
            <Box className="bg-gray-100 p-3.5 text-center shadow gap-2 bottom-0 flex justify-center">
              <Button
                variant={activeBoard === "todo" ? "contained" : "outlined"}
                onClick={() => handleBoardChange("todo")}
              >
                To Do
              </Button>
              <Button
                variant={activeBoard === "done" ? "contained" : "outlined"}
                onClick={() => handleBoardChange("done")}
              >
                Done
              </Button>
            </Box>
          </Box>

          {/* Sentinel div for intersection observer */}
          <Box id="scroll-sentinel" className="h-[1px] w-full" />
        </Box>
      </Box>
    </>
  );
}
