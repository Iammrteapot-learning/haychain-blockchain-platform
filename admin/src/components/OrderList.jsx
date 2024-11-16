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

export default function OrderList({ orderList, customerContract }) {
  const handleCancelOrder = (state, orderId) => async () => {
    if (state !== "Created") {
      alert("Transaction state has to be Created first!");
      return;
    }
    try {
      await customerContract.cancelOrder(orderId);
      alert(`Order cancelled successfully! Order ID: ${orderId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order");
    }
  };

  const handleAcceptOrder = (state, orderId) => async () => {
    if (state !== "Created") {
      alert("Transaction state has to be Created first!");
      return;
    }
    try {
      await customerContract.acceptOrder(orderId);
      alert(`Order accepted successfully! Order ID: ${orderId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to accept order");
    }
  };

  const handleDeliver = (state, orderId) => async () => {
    if (state !== "Accepted") {
      alert("Transaction state has to be Accepted first!");
      return;
    }
    try {
      await customerContract.deliver(orderId);
      alert(`Order delivered successfully! Order ID: ${orderId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to deliver order");
    }
  };

  const handleClear = (state, orderId) => async () => {
    if (state !== "Rejected" && state !== "Completed") {
      alert("Transaction state has to be Rejected or Completed first!");
      return;
    }
    try {
      await customerContract.clear(orderId);
      alert(`Order cleared successfully! Order ID: ${orderId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to clear order");
    }
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
                    text="Cancel Order"
                    color="red"
                    handleClick={handleCancelOrder(row.orderState, row.orderId)}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <BaseButton
                    text="Accept Order"
                    color="green"
                    handleClick={handleAcceptOrder(row.orderState, row.orderId)}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <BaseButton
                    text="Deliver"
                    color="darkblue"
                    handleClick={handleDeliver(row.orderState, row.orderId)}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <BaseButton
                    text="Clear"
                    color="black"
                    handleClick={handleClear(row.orderState, row.orderId)}
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
