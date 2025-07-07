# API Documentation

## Overview
This document provides comprehensive documentation for all public APIs, functions, and components in the project.

## Table of Contents
- [Authentication](#authentication)
- [REST API Endpoints](#rest-api-endpoints)
- [GraphQL API](#graphql-api)
- [WebSocket API](#websocket-api)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [SDK Usage](#sdk-usage)

## Authentication

### API Key Authentication
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     https://api.example.com/v1/endpoint
```

### JWT Token Authentication
```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const response = await fetch('/api/v1/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## REST API Endpoints

### Users API

#### GET /api/v1/users
Retrieve a list of all users.

**Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20, max: 100)
- `search` (optional): Search query for filtering users

**Example Request:**
```bash
curl -X GET "https://api.example.com/v1/users?page=1&limit=10&search=john" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response:**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 50,
      "per_page": 10
    }
  }
}
```

#### POST /api/v1/users
Create a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Example Request:**
```bash
curl -X POST "https://api.example.com/v1/users" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Example Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  }
}
```

#### GET /api/v1/users/{id}
Retrieve a specific user by ID.

**Parameters:**
- `id` (required): User ID

**Example Request:**
```bash
curl -X GET "https://api.example.com/v1/users/1" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### PUT /api/v1/users/{id}
Update an existing user.

**Parameters:**
- `id` (required): User ID

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

#### DELETE /api/v1/users/{id}
Delete a user by ID.

**Parameters:**
- `id` (required): User ID

**Example Request:**
```bash
curl -X DELETE "https://api.example.com/v1/users/1" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## GraphQL API

### Endpoint
```
POST /graphql
```

### Query Examples

#### Get Users
```graphql
query GetUsers($first: Int, $after: String) {
  users(first: $first, after: $after) {
    edges {
      node {
        id
        name
        email
        createdAt
        updatedAt
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

#### Create User
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    user {
      id
      name
      email
      createdAt
    }
    errors {
      field
      message
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
}
```

## WebSocket API

### Connection
```javascript
const ws = new WebSocket('wss://api.example.com/ws');

ws.onopen = function(event) {
  console.log('Connected to WebSocket');
  
  // Send authentication
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'YOUR_JWT_TOKEN'
  }));
};

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

### Message Types

#### Subscribe to User Updates
```javascript
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'user_updates',
  user_id: 123
}));
```

#### Real-time Notifications
```javascript
// Server sends:
{
  "type": "notification",
  "channel": "user_updates",
  "data": {
    "user_id": 123,
    "event": "profile_updated",
    "timestamp": "2023-01-01T00:00:00Z"
  }
}
```

## Response Formats

### Success Response
```json
{
  "status": "success",
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

## Error Handling

### HTTP Status Codes
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Authentication failed
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

### Limits
- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour
- **Burst limit**: 10 requests per minute

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1672531200
```

### Rate Limit Exceeded Response
```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retry_after": 3600
  }
}
```

## SDK Usage

### JavaScript/Node.js SDK
```javascript
const ApiClient = require('@example/api-client');

const client = new ApiClient({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.example.com'
});

// Get users
const users = await client.users.list({
  page: 1,
  limit: 10
});

// Create user
const newUser = await client.users.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword123'
});

// Update user
const updatedUser = await client.users.update(1, {
  name: 'Jane Doe'
});

// Delete user
await client.users.delete(1);
```

### Python SDK
```python
from example_api import ApiClient

client = ApiClient(
    api_key='YOUR_API_KEY',
    base_url='https://api.example.com'
)

# Get users
users = client.users.list(page=1, limit=10)

# Create user
new_user = client.users.create(
    name='John Doe',
    email='john@example.com',
    password='securepassword123'
)

# Update user
updated_user = client.users.update(1, name='Jane Doe')

# Delete user
client.users.delete(1)
```

### cURL Examples
```bash
# Set your API key
export API_KEY="YOUR_API_KEY"

# Get users
curl -H "Authorization: Bearer $API_KEY" \
     https://api.example.com/v1/users

# Create user
curl -X POST \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"securepassword123"}' \
     https://api.example.com/v1/users

# Update user
curl -X PUT \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"name":"Jane Doe"}' \
     https://api.example.com/v1/users/1

# Delete user
curl -X DELETE \
     -H "Authorization: Bearer $API_KEY" \
     https://api.example.com/v1/users/1
```

## Testing

### Unit Tests
```javascript
describe('Users API', () => {
  test('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123'
    };

    const response = await request(app)
      .post('/api/v1/users')
      .send(userData)
      .expect(201);

    expect(response.body.data.user.name).toBe('John Doe');
    expect(response.body.data.user.email).toBe('john@example.com');
  });
});
```

### Integration Tests
```javascript
describe('User Integration Tests', () => {
  let userId;

  beforeEach(async () => {
    // Create test user
    const user = await createTestUser();
    userId = user.id;
  });

  afterEach(async () => {
    // Clean up test user
    await deleteTestUser(userId);
  });

  test('should update user and return updated data', async () => {
    const updateData = { name: 'Updated Name' };

    const response = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send(updateData)
      .expect(200);

    expect(response.body.data.user.name).toBe('Updated Name');
  });
});
```