import { useState, useEffect, useRef, useCallback } from "react";
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

// get cookie for last active board
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
    handleScroll();
    return e;
  }

  // fetch data from Firestore, then fetch from localStorage if the first fails
  // delay of two seconds to give Firebase time to authenticate user and return data

  useEffect(() => {
    let fallbackTimeout: NodeJS.Timeout;

    if (user) {
      // If user is available, fetch from Firestore
      const fetchTasks = async () => {
        try {
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
                createdAt: data.createdAt?.toDate?.() ?? new Date(),
              } as Task;
            })
          );
          setDoneTasks(
            doneSnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                ...data,
                createdAt: data.createdAt?.toDate?.() ?? new Date(),
              } as Task;
            })
          );
        } catch (error) {
          console.error("Failed to fetch from Firestore", error);
        }
      };

      fetchTasks();
    } else {
      // Wait 2 seconds before falling back to localStorage
      fallbackTimeout = setTimeout(() => {
        if (!user) {
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
      }, 2000);
    }

    // Cleanup: clear timeout if user becomes available or component unmounts
    return () => clearTimeout(fallbackTimeout);
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

  // ===============================================================
  // ✅ No unnecessary state updates > prevent unnecessary re-renders
  // ✅ Throttled scroll handler (100ms delay) > reduce CPU usage
  // ✅ passive: true for smooth scrolling > improve mobile scroll performance

  function useThrottledCallback<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    const lastCall = useRef(0);

    return useCallback(
      (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall.current >= delay) {
          lastCall.current = now;
          callback(...args);
        }
      },
      [callback, delay]
    );
  }

  const [hideGradient, setHideGradient] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    const threshold = 10;

    const scrolledNearBottom =
      scrollTop + windowHeight >= fullHeight - threshold;

    setHideGradient((prev) => {
      if (prev !== scrolledNearBottom) {
        return scrolledNearBottom;
      }
      return prev;
    });
  }, []);

  const throttledScroll = useThrottledCallback(handleScroll, 20);

  useEffect(() => {
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [throttledScroll, handleScroll]);

  // sets bottom fade gradient AFTER data has been loaded from firestore
  useEffect(() => {
    // requestAnimationFrame ensures that DOM updates from React are flushed
    // before we read scroll values — making scrollHeight accurate.
    requestAnimationFrame(() => {
      handleScroll();
    });
  }, [todoTasks, doneTasks]);

  // ===============================================================

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
              <Box className="absolute w-full pt-5 pb-35 ">
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
              <Box className="absolute w-full pt-5 pb-35 ">
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

          <Box className="bg-gray-100 fixed mt-5 bottom-7 w-full h-[100px]">
            <Box className="fade-container"></Box>
            <Box
              className={`bottom-gradient ${
                hideGradient ? "hide-gradient" : ""
              }`}
            />

            <NewTask addTask={addTask} boardType={activeBoard} />
            <Box className="z-100 bg-gray-100 p-4 text-center shadow gap-2 bottom-0 flex justify-center">
              <Button
                size="large"
                variant={activeBoard === "todo" ? "contained" : "outlined"}
                onClick={() => handleBoardChange("todo")}
              >
                To Do
              </Button>
              <Button
                size="large"
                variant={activeBoard === "done" ? "contained" : "outlined"}
                onClick={() => handleBoardChange("done")}
              >
                Done
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
