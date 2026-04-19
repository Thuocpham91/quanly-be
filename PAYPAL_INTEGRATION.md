# PayPal Point Purchase Integration

This document describes the PayPal integration for purchasing points in the PSVN system.

## Overview

The PayPal integration allows users to purchase point packages using PayPal as a payment method. The system handles the complete payment flow including order creation, payment capture, and automatic point addition to user wallets.

## Features

- **PayPal Order Creation**: Create PayPal orders for point purchases
- **Payment Capture**: Capture payments and add points to user wallets
- **Webhook Support**: Handle PayPal webhooks for payment verification
- **Transaction Tracking**: Complete audit trail of all point purchases
- **Idempotency**: Prevent duplicate payments with transaction IDs
- **Purchase History**: Users can view their point purchase history

## API Endpoints

### 1. Create PayPal Order
```
POST /points/purchase/paypal/create-order
```

**Request Body:**
```json
{
  "pointId": 1
}
```

**Response:**
```json
{
  "message": "SUCCESS",
  "data": {
    "paypalOrderId": "8XY12345678901234",
    "approvalUrl": "https://www.sandbox.paypal.com/checkoutnow?token=8XY12345678901234",
    "transactionId": "PP_1641234567890_123_1"
  }
}
```

### 2. Capture PayPal Order
```
POST /points/purchase/paypal/capture-order
```

**Request Body:**
```json
{
  "paypalOrderId": "8XY12345678901234",
  "transactionId": "PP_1641234567890_123_1"
}
```

**Response:**
```json
{
  "message": "SUCCESS",
  "data": {
    "transactionId": "PP_1641234567890_123_1",
    "status": "PAID",
    "pointsAdded": 1000,
    "paypalPaymentId": "CAPTURE123456789"
  }
}
```

### 3. PayPal Webhook Handler
```
POST /points/purchase/paypal/webhook
```

**Request Body:**
```json
{
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "resource": {
    "id": "CAPTURE123456789",
    "supplementary_data": {
      "related_ids": {
        "order_id": "8XY12345678901234"
      }
    }
  },
  "id": "WH-EVENT123456789"
}
```

### 4. Purchase History
```
GET /points/purchase/history?page=1&limit=10
```

**Response:**
```json
{
  "message": "SUCCESS",
  "data": [
    {
      "id": 1,
      "transactionId": "PP_1641234567890_123_1",
      "userId": 123,
      "pointId": 1,
      "amount": 9.99,
      "pointsReceived": 1000,
      "paymentMethod": "PAYPAL",
      "status": "PAID",
      "paypalOrderId": "8XY12345678901234",
      "paypalPaymentId": "CAPTURE123456789",
      "paidAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:25:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## Database Schema

### PointPurchase Entity

```sql
CREATE TABLE POINT_PURCHASE (
    id SERIAL PRIMARY KEY,
    transactionId VARCHAR(50) UNIQUE NOT NULL,
    userId INTEGER NOT NULL,
    pointId INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    pointsReceived INTEGER NOT NULL,
    paymentMethod VARCHAR(20) DEFAULT 'PAYPAL',
    status VARCHAR(20) DEFAULT 'PENDING',
    paypalOrderId VARCHAR(200),
    paypalPaymentId VARCHAR(200),
    paypalResponse TEXT,
    paidAt TIMESTAMP,
    failureReason VARCHAR(500),
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),
    createdBy VARCHAR(50),
    updatedBy VARCHAR(50),
    deletedAt TIMESTAMP,
    deletedBy VARCHAR(50),
    FOREIGN KEY (pointId) REFERENCES POINT(id)
);
```

## Configuration

### Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_BASE_URL=https://api.sandbox.paypal.com  # Use https://api.paypal.com for production
```

### PayPal Developer Setup

1. **Create PayPal Developer Account**
   - Go to https://developer.paypal.com/
   - Create a developer account or log in

2. **Create Application**
   - Navigate to "My Apps & Credentials"
   - Click "Create App"
   - Choose "Default Application" and select your business account
   - Select "Merchant" as the account type

3. **Get Credentials**
   - Copy the Client ID and Client Secret
   - Add them to your environment variables

4. **Configure Webhooks**
   - Go to your app settings
   - Add webhook endpoint: `https://your-domain.com/points/purchase/paypal/webhook`
   - Subscribe to these events:
     - `CHECKOUT.ORDER.APPROVED`
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `CHECKOUT.ORDER.VOIDED`

## Payment Flow

### 1. Frontend Flow
```javascript
// 1. Create PayPal order
const response = await fetch('/points/purchase/paypal/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ pointId: 1 })
});

const { data } = await response.json();
const { paypalOrderId, approvalUrl, transactionId } = data;

// 2. Redirect user to PayPal
window.location.href = approvalUrl;

// 3. After user approves payment, capture the order
const captureResponse = await fetch('/points/purchase/paypal/capture-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    paypalOrderId 
  })
});

const captureResult = await captureResponse.json();
// Points are now added to user's wallet
```

### 2. Backend Flow

1. **Order Creation**
   - Validate point package exists
   - Generate unique transaction ID
   - Create PayPal order via API
   - Save pending purchase record
   - Return approval URL to frontend

2. **Payment Capture**
   - Validate transaction exists and is pending
   - Capture payment via PayPal API
   - Update purchase record as PAID
   - Add points to user wallet
   - Return success response

3. **Webhook Processing**
   - Verify webhook authenticity (recommended)
   - Process payment events
   - Update purchase records
   - Add points for completed payments
   - Handle failed payments

## Error Handling

### Common Error Codes

- `PAYMENT_FAILED`: PayPal API error or payment processing failure
- `NOT_FOUND`: Point package or purchase record not found
- `BAD_REQUEST`: Invalid request data or order already processed

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Order already captured",
  "error": "BAD_REQUEST"
}
```

## Security Considerations

1. **Webhook Verification**: Implement PayPal webhook signature verification
2. **Idempotency**: Use unique transaction IDs to prevent duplicate processing
3. **Input Validation**: Validate all input parameters
4. **Rate Limiting**: Implement rate limiting on payment endpoints
5. **Logging**: Log all payment transactions for audit purposes

## Testing

### Sandbox Testing

1. Use PayPal sandbox credentials
2. Test with sandbox buyer accounts
3. Verify webhook delivery in PayPal developer dashboard

### Test Cases

- [ ] Successful payment flow
- [ ] Payment cancellation
- [ ] Payment failure
- [ ] Duplicate order capture
- [ ] Webhook processing
- [ ] Invalid point package
- [ ] Network failures

## Monitoring

### Key Metrics

- Payment success rate
- Average payment processing time
- Failed payment reasons
- Webhook delivery success

### Logging

The system logs the following events:
- PayPal order creation
- Payment capture attempts
- Webhook processing
- Error conditions

## Troubleshooting

### Common Issues

1. **PayPal API Errors**
   - Check credentials are correct
   - Verify sandbox vs production URLs
   - Check PayPal API status

2. **Webhook Not Received**
   - Verify webhook URL is accessible
   - Check PayPal webhook configuration
   - Review webhook event subscriptions

3. **Points Not Added**
   - Check payment capture was successful
   - Verify wallet service is working
   - Review transaction logs

### Debug Steps

1. Check application logs
2. Verify PayPal developer dashboard
3. Test webhook endpoint manually
4. Validate database records
