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
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { BaseButton } from "./BaseButton";

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

export default function OrderList({ orderList }) {
  const handleCancelOrder = (state, orderId) => () => {
    if (state !== "Created") {
      alert("You can't cancel order if state is not Created!");
      return;
    }
    alert(`Order is cancelling! Order ID: ${orderId}`);
  };

  const handleReceiveOrder = (state, orderId) => () => {
    if (state !== "InTransit") {
      alert("Order state has to be InTransit first!");
      return;
    }
    alert(
      `You have confirmed the delivery of this order! Order ID: ${orderId}`
    );
  };

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
              <StyledTableCell>ORDER ID</StyledTableCell>
              <StyledTableCell>PRODUCT NAME</StyledTableCell>
              <StyledTableCell>QUANTITY</StyledTableCell>
              <StyledTableCell>PRICE</StyledTableCell>
              <StyledTableCell>STATE</StyledTableCell>
              <StyledTableCell />
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {orderList.map((row, index) => (
              <TableRow key={index}>
                <StyledTableCell title={row.orderId}>
                  {row.orderId.substring(0, 15)}...
                  <CopyToClipboard text={row.orderId}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        marginLeft: "8px",
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </button>
                  </CopyToClipboard>
                </StyledTableCell>
                <StyledTableCell>{row.productName}</StyledTableCell>
                <StyledTableCell>{row.quantity}</StyledTableCell>
                <StyledTableCell>{row.price} /kg</StyledTableCell>
                <StyledTableCell>{row.orderState}</StyledTableCell>
                <StyledTableCell align="center">
                  <BaseButton
                    text="Cancel"
                    color="red"
                    handleClick={handleCancelOrder(row.orderState, row.orderId)}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <BaseButton
                    text="Order Received"
                    color="green"
                    handleClick={handleReceiveOrder(
                      row.orderState,
                      row.orderId
                    )}
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
