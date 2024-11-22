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

export default function OfferList({ offerList, farmerContract }) {
  const handleApproveStock = (state, offerId) => async () => {
    if (state !== "Created") {
      alert("Transaction state has to be Created first!");
      return;
    }
    try {
      await farmerContract.approvedStockReceived(offerId);
      alert(`Stock approved successfully! Offer ID: ${offerId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to approve stock");
    }
  };

  const handleRejectStock = (state, offerId) => async () => {
    if (state !== "Created") {
      alert("Transaction state has to be Created first!");
      return;
    }
    try {
      await farmerContract.rejectStock(offerId);
      alert(`Stock rejected successfully! Offer ID: ${offerId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to reject stock");
    }
  };

  const handleClearStock = (state, offerId) => async () => {
    if (state !== "Completed" && state !== "Rejected") {
      alert("Transaction state has to be Completed or Rejected first!");
      return;
    }
    try {
      await farmerContract.clear(offerId);
      alert(`Stock cleared successfully! Offer ID: ${offerId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to clear stock");
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
              <StyledTableCell>OFFER ID</StyledTableCell>
              <StyledTableCell>PRODUCT NAME</StyledTableCell>
              <StyledTableCell>QUANTITY</StyledTableCell>
              <StyledTableCell>PRICE</StyledTableCell>
              <StyledTableCell>STATE</StyledTableCell>
              {/* <StyledTableCell /> */}
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {offerList.map((row, index) => (
              <TableRow key={index}>
                <StyledTableCell title={row.offerId}>
                  {row.offerId.substring(0, 15)}...
                  <CopyToClipboard text={row.offerId}>
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
                <StyledTableCell>{row.state}</StyledTableCell>
                {/* <StyledTableCell align="center" width={192}></StyledTableCell> */}
                <StyledTableCell align="center">
                  <BaseButton
                    text="Approve Stock"
                    color="green"
                    handleClick={handleApproveStock(row.state, row.offerId)}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <BaseButton
                    text="Reject Stock"
                    color="red"
                    handleClick={handleRejectStock(row.state, row.offerId)}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <BaseButton
                    text="Clear"
                    color="orange"
                    handleClick={handleClearStock(row.state, row.offerId)}
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
