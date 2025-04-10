# Mini Wallet API Postman Collection

This repository contains a Postman collection and environment for testing the Mini Wallet API.

## Files

- `mini-wallet.postman_collection.json`: The Postman collection containing all API endpoints
- `mini-wallet.postman_environment.json`: The Postman environment with variables

## Setup Instructions

1. **Import the Collection and Environment**

   - Open Postman
   - Click on "Import" in the top left corner
   - Select both the collection and environment JSON files
   - Click "Import"

2. **Set Up the Environment**

   - In the top right corner, select the "Mini Wallet Environment" from the dropdown
   - Click on the eye icon to view/edit environment variables
   - Update the following variables:
     - `baseUrl`: The base URL of your API (default: http://localhost:3000)
     - `token`: Leave empty initially, will be populated after login
     - `walletId`: Leave empty initially, will be populated after wallet creation
     - `receiverWalletId`: Leave empty initially, will be populated with another wallet ID
     - `transactionId`: Leave empty initially, will be populated after transaction creation
     - `reference`: Leave empty initially, will be populated with transaction reference

3. **Testing Flow**

   a. **Authentication**

   - Use the "Register" endpoint to create a new user
   - Use the "Login" endpoint to get an access token
   - Copy the token from the response and update the `token` variable in the environment

   b. **Wallet Operations**

   - Use the "Get Wallet" endpoint to retrieve your wallet
   - Copy the wallet ID from the response and update the `walletId` variable
   - Test funding, transfers, and withdrawals using the respective endpoints

   c. **Transaction Operations**

   - Use the "Get Wallet Transactions" endpoint to view transactions
   - Test transaction filtering with date ranges and pagination
   - Use the "Get Transaction Stats" endpoint to view transaction statistics

## Endpoints Overview

### Authentication

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login to get access token

### User

- `GET /user/profile`: Get user profile
- `PATCH /user/profile`: Update user profile

### Wallet

- `GET /wallet`: Get current user's wallet
- `GET /wallet/:id`: Get wallet by ID
- `POST /wallet/fund`: Fund a wallet
- `POST /wallet/transfer`: Transfer money between wallets
- `POST /wallet/withdraw`: Withdraw money from a wallet
- `GET /wallet/:id/transactions`: Get wallet transactions with filtering

### Transactions

- `GET /transactions/:id`: Get transaction by ID
- `GET /transactions/reference/:reference`: Get transaction by reference
- `GET /transactions/stats/:walletId`: Get transaction statistics
- `GET /transactions/recent/:walletId`: Get recent transactions

## Testing Tips

1. **Authentication Flow**

   - Always start with registration and login
   - Update the token variable after login
   - The token is required for all other endpoints

2. **Wallet Testing**

   - Create at least two wallets to test transfers
   - Fund one wallet before testing transfers
   - Test insufficient funds scenarios

3. **Transaction Testing**

   - Create various transactions (funding, transfers, withdrawals)
   - Test date filtering with different date ranges
   - Test pagination with different page sizes

4. **Error Handling**
   - Test invalid inputs (negative amounts, invalid IDs)
   - Test insufficient funds scenarios
   - Test with expired or invalid tokens

## Troubleshooting

- If you get a 401 Unauthorized error, check if your token is valid and properly set in the environment
- If you get a 404 Not Found error, check if the IDs in your requests are correct
- If you get a 400 Bad Request error, check the request body format and values
