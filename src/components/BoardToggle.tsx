import { Box, Button } from "@mui/material";
import type { boardType } from "../types";

export interface BoardToggleProps {
  activeBoard: boardType;
  onBoardChange: (board: boardType) => void;
}

export default function BoardToggle({
  activeBoard,
  onBoardChange,
}: BoardToggleProps) {
  return (
    <Box className="z-100 bg-gray-100 p-5 text-center gap-2 bottom-0 flex justify-center">
      <Button
        size="large"
        variant={activeBoard === "todo" ? "contained" : "outlined"}
        onClick={() => onBoardChange("todo")}
      >
        To Do
      </Button>
      <Button
        size="large"
        variant={activeBoard === "done" ? "contained" : "outlined"}
        onClick={() => onBoardChange("done")}
      >
        Done
      </Button>
    </Box>
  );
}
