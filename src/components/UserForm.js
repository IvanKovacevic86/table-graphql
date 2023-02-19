import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect } from "react";

const UserForm = (props) => {
  const {
    userForEdit,
    setValues,
    values,
    handleInputChange,
    updateUser,
    closeModal,
  } = props;

  useEffect(() => {
    if (userForEdit !== null) setValues({ ...userForEdit });
  }, [userForEdit, setValues]);

  const handleSubmit = (event) => {
    event.preventDefault();

    updateUser({
      variables: {
        id: values.id,
        input: {
          name: values.name,
          username: values.username,
          email: values.email,
        },
      },
    });
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item>
          <TextField
            type="text"
            name="name"
            label="Name"
            sx={{ width: "100%", margin: "8px" }}
            value={values.name}
            onChange={handleInputChange}
          />
          <TextField
            type="text"
            name="username"
            label="UserName"
            sx={{ width: "100%", margin: "8px" }}
            value={values.username}
            onChange={handleInputChange}
          />
          <TextField
            type="email"
            name="email"
            label="Email"
            sx={{ width: "100%", margin: "8px" }}
            value={values.email}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item>
          <Box>
            <Button
              type="submit"
              variant="contained"
              sx={{ margin: "4px", textTransform: "none" }}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ margin: "4px", textTransform: "none" }}
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm;
