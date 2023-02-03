import {
  Box,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  styled,
  Typography,
} from "@mui/material";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditIcon from "@mui/icons-material/Edit";

const GET_USERS = gql`
  query {
    users {
      data {
        id
        name
        username
        email
      }
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      username
      email
    }
  }
`;

const PAGE_SIZE = [5, 10, 20];

const columns = [
  { label: "NAME", id: "name" },
  { label: "USERNAME", id: "username" },
  { label: "EMAIL", id: "email" },
  { label: "", id: "actions" },
];

const EditMenuItem = styled(MenuItem)({
  "&.MuiMenuItem-root": {
    color: "blue",
    margin: "5px",
    justifyContent: "space-between",
    "&:hover": {
      backgroundColor: "#90caf9",
    },
  },
});

const DeleteMenuItem = styled(MenuItem)({
  "&.MuiMenuItem-root": {
    color: "red",
    margin: "5px",
    justifyContent: "space-between",
    "&:hover": {
      backgroundColor: "#ff8a65",
    },
  },
});

const TableEditSelect = styled(Select)({
  "& .MuiSelect-select:focus": {
    backgroundColor: "transparent !important",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiSelect-select": {
    padding: "14px",
  },
});

const initialValue = {
  name: "",
  username: "",
  email: "",
};

function App() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE[page]);
  const [values, setValues] = useState(initialValue);

  const { data, loading } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER_MUTATION);

  if (loading) return <div>Loading...</div>;

  const handleInputChange = (event) => {
    event.preventDefault();

    const { name, value } = event.target;

    setValues((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const recordsAfterPaging = (data) => {
    return data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  let name;
  let username;
  let email;

  return (
    <Box>
      <Box mt={3} mb={3}>
        <TextField
          type="text"
          placeholder="Name…"
          sx={{ marginRight: "2rem" }}
          name="name"
          value={values.name}
          onChange={handleInputChange}
        />
        <TextField
          type="text"
          placeholder="Username"
          sx={{ marginRight: "2rem" }}
          name="username"
          value={values.username}
          onChange={handleInputChange}
        />
        <TextField
          type="email"
          placeholder="Email"
          sx={{ marginRight: "2rem" }}
          name="email"
          value={values.email}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          onClick={() => {
            createUser({
              variables: {
                input: {
                  name,
                  username,
                  email,
                },
              },
            });
          }}
        >
          Create User
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#D3D3D3" }}>
            {columns.map((column) => (
              <TableCell key={column.id}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {recordsAfterPaging(data.users.data).map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell sx={{ textAlign: "right" }}>
                <TableEditSelect IconComponent={MoreVertIcon}>
                  <EditMenuItem>
                    <Typography>Edit User</Typography>
                    <Box>
                      <EditIcon />
                    </Box>
                  </EditMenuItem>
                  <DeleteMenuItem>
                    <Typography>Delete User</Typography>
                    <Box>
                      <DeleteOutlineRoundedIcon />
                    </Box>
                  </DeleteMenuItem>
                </TableEditSelect>
              </TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ backgroundColor: "#D3D3D3" }}>
            <TablePagination
              page={page}
              rowsPerPageOptions={PAGE_SIZE}
              rowsPerPage={rowsPerPage}
              count={data.users.data.length}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}

export default App;
