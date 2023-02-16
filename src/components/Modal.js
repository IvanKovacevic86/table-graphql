import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

const Modal = (props) => {
  const { children, openModal } = props;
  return (
    <Dialog open={openModal}>
      <DialogTitle variant="h6">Edit User</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
