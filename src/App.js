import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useQuery, gql } from "@apollo/client";
import { useState } from "react";

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

const PAGE_SIZE = [5, 10, 20];

const columns = [
  { label: "NAME", id: "name" },
  { label: "USERNAME", id: "username" },
  { label: "EMAIL", id: "email" },
];

function App() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE[page]);
  const { data, loading } = useQuery(GET_USERS);

  if (loading) return <div>Loading...</div>;

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

  return (
    <div className="App">
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
    </div>
  );
}

export default App;
