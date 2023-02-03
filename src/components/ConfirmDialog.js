import {
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Button,
} from "@mui/material";
import React from "react";

export default function ConfirmDialog(props) {
  const { confirmDialog, setConfirmDialog } = props;

  return (
    <Dialog open={confirmDialog.isOpen}>
      <DialogContent>
        <Typography variant="h6">{confirmDialog.title}</Typography>
        <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setConfirmDialog({ isOpen: false });
          }}
        >
          No
        </Button>
        <Button onClick={confirmDialog.onConfirm}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
