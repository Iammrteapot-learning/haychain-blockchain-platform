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
import { BuySellButton } from "./BuySellButton";
import { Transaction } from "../constant/transaction";

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

export function Marketplace({
  productList,
  setSelectedProduct,
  setIsSelectedProduct,
}) {
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
              <StyledTableCell>PRODUCT</StyledTableCell>
              <StyledTableCell>BUYING</StyledTableCell>
              <StyledTableCell>SELLING</StyledTableCell>
              <StyledTableCell>AMOUNT</StyledTableCell>
              <StyledTableCell />
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {productList.map((row, index) => (
              <TableRow key={index}>
                <StyledTableCell>{row.product}</StyledTableCell>
                <StyledTableCell>{row.buying} /kg</StyledTableCell>
                <StyledTableCell>{row.selling} /kg</StyledTableCell>
                <StyledTableCell>{row.amount}</StyledTableCell>
                <StyledTableCell align="center">
                  <BuySellButton
                    type={Transaction.Sell}
                    onClickButton={() => {
                      setIsSelectedProduct(true);
                      setSelectedProduct((prev) => ({
                        ...prev,
                        productName: row.product,
                        price: row.selling,
                        type: Transaction.Sell,
                      }));
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <BuySellButton
                    type={Transaction.Buy}
                    onClickButton={() => {
                      setIsSelectedProduct(true);
                      setSelectedProduct((prev) => ({
                        ...prev,
                        productName: row.product,
                        price: row.buying,
                        type: Transaction.Buy,
                      }));
                    }}
                  />
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
