import React from "react";
import { Button, Box, Menu, MenuItem } from "@mui/material";
import type { SignInProps } from "../types";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

export default function SignIn({
  user,
  handleGoogleSignIn,
  handleGoogleSignOut,
}: SignInProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(user);

  return (
    <Box className="self-end flex gap-1 mr-1 md:mr-5 md:gap-5">
      {user ? (
        <>
          <Button>
            <img
              className="w-9 h-9 rounded-full hover:cursor-pointer"
              src={user.photoURL ?? undefined}
              onClick={handleClick}
              alt="User Avatar"
            />
          </Button>

          <Menu
            // style the border of the menu
            // menu should have 2px gap from avatar
            // hovering over logout button should change bg to grey
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": "basic-button",
              },
            }}
          >
            {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem> */}
            <MenuItem onClick={handleGoogleSignOut}>
              <Button startIcon={<LogoutIcon></LogoutIcon>}>Logout</Button>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          variant="contained"
          onClick={() => {
            handleClose();
            handleGoogleSignIn();
          }}
          startIcon={<LoginIcon />}
        >
          Login
        </Button>
      )}
    </Box>
  );
}
