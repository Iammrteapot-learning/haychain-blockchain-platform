import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(() => ({
  [`&:nth-of-type(1)`]: {
    fontWeight: 900,
    padding: "24px 0 24px 40px",
  },
  [`&:nth-of-type(2), &:nth-of-type(3), &:nth-of-type(4)`]: {
    textAlign: "center",
    color: "#637381",
  },
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F9FAFB",
    color: "#111928",
    fontSize: 20,
    fontFamily: "Lalezar, sans-serif",
    fontWeight: 900,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
    fontFamily: "'Laomn', serif",
  },
}));

export default function OfferList({ offerList }) {
  return (
    <Paper
      sx={{
        width: "60%",
        overflow: "hidden",
        margin: "10px",
        borderRadius: "12px",
      }}
    >
      <TableContainer sx={{ maxHeight: "450px", overflowY: "auto" }}>
        <Table stickyheader="true">
          <TableHead stickyheader="true">
            <TableRow>
              <StyledTableCell>OFFER ID</StyledTableCell>
              <StyledTableCell>PRODUCT NAME</StyledTableCell>
              <StyledTableCell>QUANTITY</StyledTableCell>
              <StyledTableCell>PRICE</StyledTableCell>
              <StyledTableCell>STATE</StyledTableCell>
              <StyledTableCell />
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {offerList.map((row, index) => (
              <TableRow key={index}>
                <StyledTableCell>{row.offerId}</StyledTableCell>
                <StyledTableCell>{row.productName}</StyledTableCell>
                <StyledTableCell>{row.quantity}</StyledTableCell>
                <StyledTableCell>{row.price} /kg</StyledTableCell>
                <StyledTableCell>{row.state}</StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
