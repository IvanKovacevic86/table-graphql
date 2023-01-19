import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQuery, gql } from "@apollo/client";

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

const columns = [
  { label: "NAME", id: "name" },
  { label: "USERNAME", id: "username" },
  { label: "EMAIL", id: "email" },
  { label: "", id: "actions" },
];

function App() {
  const { data, loading } = useQuery(GET_USERS);

  if (loading) return <div>Loading...</div>;

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
          {data.users.data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default App;
