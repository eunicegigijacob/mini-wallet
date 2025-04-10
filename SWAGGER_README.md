# Mini Wallet API Swagger Documentation

This repository contains a Swagger/OpenAPI specification for the Mini Wallet API.

## Files

- `swagger.yaml`: The OpenAPI specification file for the Mini Wallet API

## Using the Swagger Documentation

### Option 1: Swagger UI

1. **Install Swagger UI locally**

   - Clone the [Swagger UI repository](https://github.com/swagger-api/swagger-ui)
   - Or use the online version at [Swagger Editor](https://editor.swagger.io/)

2. **Load the specification**

   - Open Swagger UI
   - Click on "File" > "Import file" and select the `swagger.yaml` file
   - Or paste the contents of `swagger.yaml` into the Swagger Editor

3. **Explore the API**
   - Browse through the endpoints organized by tags (Authentication, User, Wallet, Transactions)
   - Click on an endpoint to expand it and see details
   - Use the "Try it out" button to test the API directly from the UI

### Option 2: Integrate with NestJS

If you're using NestJS for your API, you can integrate Swagger directly:

1. **Install the required packages**

   ```bash
   npm install @nestjs/swagger swagger-ui-express
   ```

2. **Configure Swagger in your main.ts file**

   ```typescript
   import { NestFactory } from '@nestjs/core';
   import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
   import { AppModule } from './app.module';

   async function bootstrap() {
     const app = await NestFactory.create(AppModule);

     const config = new DocumentBuilder()
       .setTitle('Mini Wallet API')
       .setDescription('API for managing a mini wallet application')
       .setVersion('1.0')
       .addBearerAuth()
       .build();

     const document = SwaggerModule.createDocument(app, config);
     SwaggerModule.setup('api', app, document);

     await app.listen(3000);
   }
   bootstrap();
   ```

3. **Access the Swagger UI**
   - Start your application
   - Navigate to `http://localhost:3000/api` in your browser

### Option 3: Use with Postman

1. **Import the OpenAPI specification into Postman**

   - Open Postman
   - Click on "Import" in the top left corner
   - Select "Link" and paste the URL to your `swagger.yaml` file
   - Or select "File" and choose the `swagger.yaml` file
   - Click "Import"

2. **Use the imported collection**
   - Postman will create a collection based on the OpenAPI specification
   - You can now use this collection to test your API

## API Overview

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

## Testing Flow

1. **Authentication**

   - Register a new user using the `/auth/register` endpoint
   - Login using the `/auth/login` endpoint to get an access token
   - Use this token for all subsequent requests

2. **Wallet Operations**

   - Get your wallet using the `/wallet` endpoint
   - Fund your wallet using the `/wallet/fund` endpoint
   - Transfer money to another wallet using the `/wallet/transfer` endpoint
   - Withdraw money using the `/wallet/withdraw` endpoint

3. **Transaction Operations**
   - View your transactions using the `/wallet/:id/transactions` endpoint
   - Get transaction statistics using the `/transactions/stats/:walletId` endpoint
   - View recent transactions using the `/transactions/recent/:walletId` endpoint

## Security

All endpoints except `/auth/register` and `/auth/login` require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## Error Handling

The API returns standard HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict

Error responses include a JSON object with the following structure:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Error type"
}
```
