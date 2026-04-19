# PayPal Integration API Documentation

## Overview
This document provides comprehensive API documentation for the PayPal integration in the PSVN Point Purchase system.

## Base Configuration
- **Sandbox URL**: `https://api.sandbox.paypal.com`
- **Production URL**: `https://api.paypal.com`
- **Environment**: Controlled by `PAYPAL_MODE` environment variable

## Authentication
All endpoints require authentication using the `@AuthCustom()` decorator.

---

## API Endpoints

### 1. Create PayPal Order

Creates a new PayPal order for point purchase.

**Endpoint:** `POST /points/purchase/paypal/create-order`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "pointId": 1
}
```

**Request Schema:**
```typescript
class PayPalCreateOrderDto {
  pointId: number; // ID of the point package to purchase
}
```

**Response (201 Created):**
```json
{
  "message": "SUCCESS",
  "data": {
    "paypalOrderId": "8XY12345ABC67890D",
    "approvalUrl": "https://www.sandbox.paypal.com/checkoutnow?token=8XY12345ABC67890D",
    "transactionId": "PP_1699876543210_123_1"
  }
}
```

**Response Schema:**
```typescript
interface PayPalOrderResponse {
  message: string;
  data: {
    paypalOrderId: string;    // PayPal order ID for tracking
    approvalUrl: string;      // URL to redirect user for payment
    transactionId: string;    // Internal transaction ID
  };
}
```

**Error Responses:**
- `404 Not Found`: Point package not found
- `500 Internal Server Error`: PayPal order creation failed

---

### 2. Capture PayPal Order

Captures a PayPal order and adds points to user's wallet.

**Endpoint:** `POST /points/purchase/paypal/capture-order`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "paypalOrderId": "8XY12345ABC67890D"
}
```

**Request Schema:**
```typescript
class PayPalCaptureOrderDto {
  paypalOrderId: string; // PayPal order ID to capture
}
```

**Response (200 OK):**
```json
{
  "message": "SUCCESS",
  "data": {
    "transactionId": "PP_1699876543210_123_1",
    "status": "PAID",
    "pointsAdded": 100,
    "paypalPaymentId": "CAPTURE123456789"
  }
}
```

**Response Schema:**
```typescript
interface PayPalCaptureResponse {
  message: string;
  data: {
    transactionId: string;    // Internal transaction ID
    status: string;           // Payment status (PAID)
    pointsAdded: number;      // Points added to wallet
    paypalPaymentId: string;  // PayPal capture ID
  };
}
```

**Error Responses:**
- `404 Not Found`: Purchase record not found
- `400 Bad Request`: Order already captured
- `500 Internal Server Error`: PayPal capture failed

---

### 3. PayPal Webhook Handler

Handles PayPal webhook notifications for payment events.

**Endpoint:** `POST /points/purchase/paypal/webhook`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "WH-2WR32451HC0233532-67976317FL4543714",
  "event_version": "1.0",
  "create_time": "2023-11-13T10:30:00Z",
  "resource_type": "capture",
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "summary": "Payment completed for order",
  "resource": {
    "id": "CAPTURE123456789",
    "status": "COMPLETED",
    "supplementary_data": {
      "related_ids": {
        "order_id": "8XY12345ABC67890D"
      }
    }
  }
}
```

**Supported Event Types:**
- `CHECKOUT.ORDER.APPROVED`: Order approved by user
- `PAYMENT.CAPTURE.COMPLETED`: Payment successfully captured
- `PAYMENT.CAPTURE.DENIED`: Payment capture denied
- `CHECKOUT.ORDER.VOIDED`: Order was voided

**Response (200 OK):**
```json
{
  "message": "Webhook processed successfully"
}
```

---

### 4. Get Purchase History

Retrieves user's point purchase history with pagination.

**Endpoint:** `GET /points/purchase/history`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**
```
GET /points/purchase/history?page=1&limit=10
```

**Response (200 OK):**
```json
{
  "message": "SUCCESS",
  "data": [
    {
      "id": 1,
      "transactionId": "PP_1699876543210_123_1",
      "amount": 9.99,
      "pointsReceived": 100,
      "paymentMethod": "PAYPAL",
      "status": "PAID",
      "paypalOrderId": "8XY12345ABC67890D",
      "paypalPaymentId": "CAPTURE123456789",
      "paidAt": "2023-11-13T10:30:00Z",
      "createdAt": "2023-11-13T10:25:00Z",
      "point": {
        "id": 1,
        "name": "Basic Package",
        "price": 9.99,
        "points": 100
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

## Frontend Integration Examples

### React/JavaScript Example

```javascript
class PayPalService {
  constructor(baseURL, authToken) {
    this.baseURL = baseURL;
    this.authToken = authToken;
  }

  async createOrder(pointId) {
    const response = await fetch(`${this.baseURL}/points/purchase/paypal/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      },
      body: JSON.stringify({ pointId })
    });

    if (!response.ok) {
      throw new Error('Failed to create PayPal order');
    }

    return await response.json();
  }

  async captureOrder(paypalOrderId) {
    const response = await fetch(`${this.baseURL}/points/purchase/paypal/capture-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      },
      body: JSON.stringify({ paypalOrderId })
    });

    if (!response.ok) {
      throw new Error('Failed to capture PayPal order');
    }

    return await response.json();
  }

  async getPurchaseHistory(page = 1, limit = 10) {
    const response = await fetch(
      `${this.baseURL}/points/purchase/history?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get purchase history');
    }

    return await response.json();
  }
}

// Usage Example
const paypalService = new PayPalService('https://api.yourapp.com', 'your-jwt-token');

async function purchasePoints(pointId) {
  try {
    // 1. Create PayPal order
    const orderResult = await paypalService.createOrder(pointId);
    const { paypalOrderId, approvalUrl } = orderResult.data;

    // 2. Redirect to PayPal for approval
    window.location.href = approvalUrl;

    // 3. After user returns from PayPal (handle in return URL)
    // Capture the order
    const captureResult = await paypalService.captureOrder(paypalOrderId);
    
    console.log('Points added:', captureResult.data.pointsAdded);
    
  } catch (error) {
    console.error('Purchase failed:', error.message);
  }
}
```

### Complete Payment Flow

```javascript
// 1. User selects point package and initiates purchase
async function initiatePayment(pointPackage) {
  try {
    const orderData = await paypalService.createOrder(pointPackage.id);
    
    // Store order data for later use
    localStorage.setItem('pendingPayPalOrder', JSON.stringify({
      paypalOrderId: orderData.data.paypalOrderId,
      transactionId: orderData.data.transactionId,
      pointPackage: pointPackage
    }));

    // Redirect to PayPal
    window.location.href = orderData.data.approvalUrl;
    
  } catch (error) {
    showError('Failed to initiate payment: ' + error.message);
  }
}

// 2. Handle return from PayPal (on success page)
async function handlePayPalReturn() {
  const urlParams = new URLSearchParams(window.location.search);
  const paypalOrderId = urlParams.get('token'); // PayPal returns order ID as 'token'
  
  if (!paypalOrderId) {
    showError('Invalid PayPal return');
    return;
  }

  try {
    // Capture the payment
    const captureResult = await paypalService.captureOrder(paypalOrderId);
    
    // Clear stored order data
    localStorage.removeItem('pendingPayPalOrder');
    
    // Show success message
    showSuccess(`Payment successful! ${captureResult.data.pointsAdded} points added to your account.`);
    
    // Redirect to dashboard or refresh wallet
    window.location.href = '/dashboard';
    
  } catch (error) {
    showError('Payment capture failed: ' + error.message);
  }
}

// 3. Handle cancellation (on cancel page)
function handlePayPalCancel() {
  // Clear stored order data
  localStorage.removeItem('pendingPayPalOrder');
  
  showInfo('Payment was cancelled. You can try again anytime.');
  window.location.href = '/points/purchase';
}
```

---

## Error Handling

### Common Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `BAD_REQUEST` | Invalid request parameters |
| 401 | `UNAUTHORIZED` | Authentication required |
| 404 | `NOT_FOUND` | Resource not found |
| 500 | `PAYMENT_FAILED` | PayPal integration error |

### Error Response Format

```json
{
  "statusCode": 404,
  "message": "Point package not found",
  "error": "NOT_FOUND"
}
```

### Handling Errors in Frontend

```javascript
async function handlePayPalError(error, operation) {
  console.error(`PayPal ${operation} error:`, error);
  
  if (error.status === 404) {
    showError('The selected point package is no longer available.');
  } else if (error.status === 400) {
    showError('This payment has already been processed.');
  } else if (error.status === 500) {
    showError('Payment service is temporarily unavailable. Please try again later.');
  } else {
    showError('An unexpected error occurred. Please contact support.');
  }
}
```

---

## Environment Configuration

### Required Environment Variables

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # or 'live' for production
PAYPAL_BASE_URL=https://api.sandbox.paypal.com  # Optional, auto-determined by PAYPAL_MODE

# Application URLs
FRONTEND_URL=https://yourapp.com
```

### PayPal Mode Configuration

- **Sandbox Mode** (`PAYPAL_MODE=sandbox`):
  - Uses PayPal sandbox environment
  - Safe for testing with fake money
  - Base URL: `https://api.sandbox.paypal.com`

- **Live Mode** (`PAYPAL_MODE=live`):
  - Uses PayPal production environment
  - Processes real payments
  - Base URL: `https://api.paypal.com`

---

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **User Validation**: Orders are tied to authenticated user IDs
3. **Webhook Security**: Implement PayPal webhook signature verification
4. **Environment Isolation**: Use sandbox for development/testing
5. **Error Handling**: Don't expose sensitive PayPal credentials in error messages

---

## Testing

### Test Point Packages
Create test point packages in your database:

```sql
INSERT INTO POINT (name, price, points, type, status) VALUES
('Basic Package', 9.99, 100, 'PAY_NOW', 'ACTIVE'),
('Premium Package', 19.99, 250, 'PAY_NOW', 'ACTIVE'),
('Ultimate Package', 49.99, 750, 'PAY_NOW', 'ACTIVE');
```

### PayPal Sandbox Testing
1. Create PayPal developer account
2. Generate sandbox credentials
3. Use test credit card numbers provided by PayPal
4. Test complete payment flows

### API Testing with cURL

```bash
# Create PayPal Order
curl -X POST "http://localhost:3000/points/purchase/paypal/create-order" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"pointId": 1}'

# Capture PayPal Order
curl -X POST "http://localhost:3000/points/purchase/paypal/capture-order" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"paypalOrderId": "8XY12345ABC67890D"}'

# Get Purchase History
curl -X GET "http://localhost:3000/points/purchase/history?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Monitoring and Logging

The system logs important events:
- PayPal order creation
- Payment capture success/failure
- Webhook processing
- Error conditions

Monitor these logs for:
- Failed payments
- Webhook delivery issues
- Authentication problems
- PayPal API errors
