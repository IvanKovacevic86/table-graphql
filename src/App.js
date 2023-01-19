import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const columns = [
  { label: "NAME", id: "name" },
  { label: "USERNAME", id: "username" },
  { label: "EMAIL", id: "email" },
  { label: "", id: "actions" },
];

function App() {
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
          <TableRow>
            <TableCell>fdgg</TableCell>
            <TableCell>dfdf</TableCell>
            <TableCell>fdfdf</TableCell>
            <TableCell>ddfd</TableCell>
            <TableCell>ddfd</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default App;
