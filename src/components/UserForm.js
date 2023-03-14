import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";

const UserForm = (props) => {
  const { formik, closeModal } = props;

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item>
          <TextField
            type="text"
            name="name"
            label="Name"
            sx={{ width: "100%", margin: "8px" }}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            type="text"
            name="username"
            label="UserName"
            sx={{ width: "100%", margin: "8px" }}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            type="email"
            name="email"
            label="Email"
            sx={{ width: "100%", margin: "8px" }}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
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
