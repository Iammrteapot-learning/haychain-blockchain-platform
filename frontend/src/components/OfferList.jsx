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
  const handleReceiveMoney = (state, offerId) => async () => {
    if (state !== "Received") {
      alert("Transaction state has to be Received first!");
      return;
    }
    try {
      await farmerContract.receiveMoney(offerId);
      alert(`Money received successfully! Offer ID: ${offerId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to receive money");
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
                <StyledTableCell align="center" width={360}>
                  <BaseButton
                    text="Receive Money"
                    color="green"
                    handleClick={handleReceiveMoney(row.state, row.offerId)}
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
