# Welcome to HayChain Market Place!

HayChain is a blockchain-based web application designed for agriculture product processing. Key features include tracking agricultural products from individual farms and selling them at market prices. Additionally, HayChain facilitates faster automated payments, ensuring timely and secure transactions for farmers.

## Usage and Deployments

The HayChain application is already deployed on an EC2 instance and can be accessed [here](http://ec2-54-254-88-202.ap-southeast-1.compute.amazonaws.com/).

All smart contracts for the application are deployed on the Sepolia testnet. To interact with the application, you can obtain free SepoliaETH from any [Ethereum Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) to fund your transactions.

## Smart Contracts

The application utilizes three primary smart contracts:

1. **Stock Contract:**  
   Acts as a public database for the application, storing information about products, their quantities, selling prices, and purchase prices.

2. **Farm Contract:**  
   Handles interactions with users who want to sell their products through the HayChain platform.

3. **Customer Contract:**  
   Manages interactions with users who wish to buy products from HayChain.

## Getting Started

Follow these steps to set up the project locally:

1. Install the dependencies:  
   ```bash
   npm install
   ```

2. Start the development server:  
   ```bash
   npm run dev
   ```

The application will then run on your local machine.
