import { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { Transaction } from "../constant/transaction";

export function BuySellModal({
  selectedProduct,
  clearSelectedProduct,
  handleQuantityChange,
}) {
  const textFieldRef = useRef();
  const bgColor =
    selectedProduct.type === Transaction.Sell ? "bg-green" : "bg-red";

  return (
    <div className="flex flex-col w-full h-full bg-cream rounded-lg border-[3px] border-pink p-8 justify-between">
      <CloseIcon
        onClick={clearSelectedProduct}
        sx={{ color: "#B5363A", fontSize: 40 }}
      />
      <div className="flex flex-col items-center font-laomn space-y-2">
        <div className="flex flex-row text-4xl">
          <p>Item:&nbsp;</p>
          <p className="font-bold">{selectedProduct.productName}</p>
        </div>
        <p className="text-3xl">Price: {selectedProduct.price} Baht/kg</p>
      </div>
      <div className="flex flex-row items-center justify-around font-laomn text-3xl">
        <p className="">Quantity:&nbsp;</p>
        <TextField
          type="number"
          inputRef={textFieldRef}
          sx={{
            m: 1,
            width: "15ch",
            backgroundColor: "white",
            height: "50px",
            "& .MuiInputBase-root": {
              height: "100%",
              fontSize: 20,
              fontFamily: "Lalezar, sans-serif",
              padding: "8px 12px",
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">kg</InputAdornment>
              ),
            },
          }}
        />
        <button
          onClick={() => {
            const quantity = parseInt(textFieldRef.current.value, 10);
            if (quantity) {
              handleQuantityChange(quantity);
            }
          }}
          className={`text-lg font-lalezar font-bold text-cream ${bgColor} px-4 py-2 rounded-md hover:shadow-md`}
        >
          {selectedProduct.type}
        </button>
      </div>
    </div>
  );
}
