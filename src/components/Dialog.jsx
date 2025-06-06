import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogBox = ({ open, close, onDelete }) => {
  return (
    <Dialog
      open={open}
      slots={{
        transition: Transition,
      }}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button color="error" onClick={() => { onDelete(); close(); }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogBox;
