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
  InputAdornment,
  TableSortLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmDialog from "./components/ConfirmDialog";
import UserForm from "./components/UserForm";
import Modal from "./components/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";

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

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
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

const initialValues = {
  name: "",
  username: "",
  email: "",
};

function App() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE[page]);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [userForEdit, setUserForEdit] = useState(null);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [filteredUser, setFilteredUser] = useState([]);
  const [count, setCount] = useState(1);

  const { data, loading } = useQuery(GET_USERS, {
    onCompleted: (data) => setFilteredUser(data.users.data),
  });

  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      username: Yup.string().required("Username is required"),
      email: Yup.string().required("Email is required").email("Invalid email"),
    }),
    enableReinitialize: true,
    onSubmit: () => {
      createUser({
        variables: {
          input: {
            name: formik.values.name,
            username: formik.values.username,
            email: formik.values.email,
          },
        },
      });
      formik.resetForm();
    },
  });

  if (loading) return <div>Loading...</div>;

  const getNumberOfUsers = (data) => {
    return data.users.data.length;
  };

  const openEditForm = (user) => {
    setUserForEdit(user);
    setOpenModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const closeModal = () => {
    setOpenModal(false);
    setUserForEdit(null);
  };

  const dense = false;
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - data.users.data.length)
      : 0;

  const keys = ["name", "username", "email"];

  const handleSearch = (e) => {
    if (e.target.value.trim() === "") {
      setSearch(e.target.value);
      setFilteredUser(data.users.data);
      setCount(getNumberOfUsers(data.users.data));

      return;
    }
    setSearch(e.target.value);

    const filtered = data.users.data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(search.toLowerCase()))
    );

    setFilteredUser(filtered);
    setPage(0);
    setCount(getNumberOfUsers(filtered));
  };

  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }

    return 0;
  };

  const pagePagination = (data) => {
    return data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  const sortingAndPagination = (data, comparator) => {
    const sorting = stableSort(data, comparator);
    return pagePagination(sorting);
  };

  return (
    <Box ml={2} mr={2}>
      <Box mt={3} mb={3}>
        <TextField
          type="text"
          placeholder="Name…"
          sx={{ marginRight: "2rem" }}
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <TextField
          type="text"
          placeholder="Username"
          sx={{ marginRight: "2rem" }}
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          type="email"
          placeholder="Email"
          sx={{ marginRight: "2rem" }}
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Button variant="contained" onClick={formik.handleSubmit}>
          Create User
        </Button>
      </Box>
      <Box>
        <TextField
          sx={{
            width: "30%",
            backgroundColor: "#F0F0F0",
            marginTop: "1rem",
            marginBottom: "1rem",
            border: "none",
          }}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          placeholder="Search by Name or Email"
          variant="standard"
          onChange={handleSearch}
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#D3D3D3" }}>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sortDirection={orderBy === column.id ? order : false}
              >
                {column.disableSorting ? (
                  column.label
                ) : (
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => {
                      handleSortRequest(column.id);
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortingAndPagination(
            filteredUser,
            getComparator(order, orderBy)
          ).map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell sx={{ textAlign: "right" }}>
                <TableEditSelect IconComponent={MoreVertIcon}>
                  <EditMenuItem onClick={() => openEditForm(user)}>
                    <Typography>Edit User</Typography>
                    <Box>
                      <EditIcon />
                    </Box>
                  </EditMenuItem>
                  <DeleteMenuItem
                    onClick={() =>
                      setConfirmDialog({
                        isOpen: true,
                        title: "Are you sure?",
                        subTitle: "You can't undo this",
                        onConfirm: () =>
                          deleteUser(
                            { variables: { id: user.id } },
                            setConfirmDialog({
                              isOpen: false,
                            })
                          ),
                      })
                    }
                  >
                    <Typography>Delete User</Typography>
                    <Box>
                      <DeleteOutlineRoundedIcon />
                    </Box>
                  </DeleteMenuItem>
                </TableEditSelect>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow
              style={{
                height: (dense ? 33 : 84) * emptyRows,
              }}
            >
              <TableCell colSpan={6} />
            </TableRow>
          )}
          <TableRow sx={{ backgroundColor: "#D3D3D3" }}>
            <TablePagination
              page={page}
              rowsPerPageOptions={PAGE_SIZE}
              rowsPerPage={rowsPerPage}
              count={count}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableBody>
      </Table>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <UserForm
          setOpenModal={setOpenModal}
          userForEdit={userForEdit}
          updateUser={updateUser}
          data={data}
          closeModal={closeModal}
          formik={formik}
        />
      </Modal>
    </Box>
  );
}

export default App;
