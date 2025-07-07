# Function Documentation

## Overview
This document provides comprehensive documentation for all public functions, methods, and utilities in the project.

## Table of Contents
- [Utility Functions](#utility-functions)
- [Data Processing Functions](#data-processing-functions)
- [Authentication Functions](#authentication-functions)
- [Validation Functions](#validation-functions)
- [Database Functions](#database-functions)
- [HTTP Client Functions](#http-client-functions)
- [Error Handling Functions](#error-handling-functions)
- [Testing Utilities](#testing-utilities)

## Utility Functions

### `formatDate(date, format)`
Formats a date object or string into a specified format.

**Parameters:**
- `date` (Date|string): The date to format
- `format` (string): The desired format string (e.g., 'YYYY-MM-DD', 'DD/MM/YYYY')

**Returns:** `string` - The formatted date string

**Example:**
```javascript
const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
};

// Usage
const formatted = formatDate(new Date(), 'DD/MM/YYYY');
console.log(formatted); // "07/01/2023"

const isoDate = formatDate('2023-01-07');
console.log(isoDate); // "2023-01-07"
```

### `debounce(func, delay)`
Creates a debounced version of a function that delays invoking until after wait milliseconds have elapsed since the last time it was invoked.

**Parameters:**
- `func` (Function): The function to debounce
- `delay` (number): The number of milliseconds to delay

**Returns:** `Function` - The debounced function

**Example:**
```javascript
const debounce = (func, delay) => {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Usage
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
  // Perform search operation
}, 300);

// This will only execute once after 300ms
debouncedSearch('test');
debouncedSearch('test query');
debouncedSearch('test query final');
```

### `generateId(prefix)`
Generates a unique identifier with an optional prefix.

**Parameters:**
- `prefix` (string, optional): Prefix for the generated ID

**Returns:** `string` - A unique identifier

**Example:**
```javascript
const generateId = (prefix = '') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
};

// Usage
const userId = generateId('user');
console.log(userId); // "user_1672531200000_k8j3h2g1f"

const sessionId = generateId();
console.log(sessionId); // "1672531200000_k8j3h2g1f"
```

## Data Processing Functions

### `arrayToObject(array, keyField)`
Converts an array of objects to an object indexed by a specified key field.

**Parameters:**
- `array` (Array): The array of objects to convert
- `keyField` (string): The field name to use as the object key

**Returns:** `Object` - Object indexed by the specified key field

**Example:**
```javascript
const arrayToObject = (array, keyField) => {
  return array.reduce((acc, item) => {
    acc[item[keyField]] = item;
    return acc;
  }, {});
};

// Usage
const users = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
];

const usersById = arrayToObject(users, 'id');
console.log(usersById);
// {
//   1: { id: 1, name: 'John', email: 'john@example.com' },
//   2: { id: 2, name: 'Jane', email: 'jane@example.com' }
// }
```

### `groupBy(array, keyFunc)`
Groups array elements by a key function.

**Parameters:**
- `array` (Array): The array to group
- `keyFunc` (Function): Function that returns the grouping key

**Returns:** `Object` - Object with grouped arrays

**Example:**
```javascript
const groupBy = (array, keyFunc) => {
  return array.reduce((acc, item) => {
    const key = keyFunc(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};

// Usage
const orders = [
  { id: 1, status: 'pending', amount: 100 },
  { id: 2, status: 'completed', amount: 200 },
  { id: 3, status: 'pending', amount: 150 }
];

const ordersByStatus = groupBy(orders, order => order.status);
console.log(ordersByStatus);
// {
//   pending: [
//     { id: 1, status: 'pending', amount: 100 },
//     { id: 3, status: 'pending', amount: 150 }
//   ],
//   completed: [
//     { id: 2, status: 'completed', amount: 200 }
//   ]
// }
```

### `filterByDateRange(array, dateField, startDate, endDate)`
Filters an array of objects by a date range.

**Parameters:**
- `array` (Array): The array to filter
- `dateField` (string): The field name containing the date
- `startDate` (Date|string): The start date of the range
- `endDate` (Date|string): The end date of the range

**Returns:** `Array` - Filtered array

**Example:**
```javascript
const filterByDateRange = (array, dateField, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return array.filter(item => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= start && itemDate <= end;
  });
};

// Usage
const transactions = [
  { id: 1, amount: 100, date: '2023-01-01' },
  { id: 2, amount: 200, date: '2023-01-15' },
  { id: 3, amount: 150, date: '2023-02-01' }
];

const januaryTransactions = filterByDateRange(
  transactions,
  'date',
  '2023-01-01',
  '2023-01-31'
);
console.log(januaryTransactions);
// [
//   { id: 1, amount: 100, date: '2023-01-01' },
//   { id: 2, amount: 200, date: '2023-01-15' }
// ]
```

## Authentication Functions

### `hashPassword(password, saltRounds)`
Hashes a password using bcrypt with specified salt rounds.

**Parameters:**
- `password` (string): The password to hash
- `saltRounds` (number, optional): Number of salt rounds (default: 10)

**Returns:** `Promise<string>` - The hashed password

**Example:**
```javascript
const bcrypt = require('bcrypt');

const hashPassword = async (password, saltRounds = 10) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};

// Usage
const hashedPassword = await hashPassword('mySecurePassword123');
console.log(hashedPassword); // "$2b$10$..."
```

### `verifyPassword(password, hashedPassword)`
Verifies a password against a hashed password.

**Parameters:**
- `password` (string): The plain text password
- `hashedPassword` (string): The hashed password to compare against

**Returns:** `Promise<boolean>` - Whether the password matches

**Example:**
```javascript
const verifyPassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Password verification failed');
  }
};

// Usage
const isValid = await verifyPassword('mySecurePassword123', hashedPassword);
console.log(isValid); // true or false
```

### `generateJWT(payload, secretKey, expiresIn)`
Generates a JSON Web Token with the given payload.

**Parameters:**
- `payload` (Object): The data to encode in the token
- `secretKey` (string): The secret key for signing
- `expiresIn` (string, optional): Token expiration time (default: '1h')

**Returns:** `string` - The generated JWT token

**Example:**
```javascript
const jwt = require('jsonwebtoken');

const generateJWT = (payload, secretKey, expiresIn = '1h') => {
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    throw new Error('JWT generation failed');
  }
};

// Usage
const token = generateJWT(
  { userId: 123, email: 'user@example.com' },
  'your-secret-key',
  '24h'
);
console.log(token); // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Validation Functions

### `validateEmail(email)`
Validates an email address format.

**Parameters:**
- `email` (string): The email address to validate

**Returns:** `boolean` - Whether the email is valid

**Example:**
```javascript
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Usage
console.log(validateEmail('user@example.com')); // true
console.log(validateEmail('invalid-email')); // false
```

### `validatePassword(password, options)`
Validates a password against specified criteria.

**Parameters:**
- `password` (string): The password to validate
- `options` (Object): Validation options

**Returns:** `Object` - Validation result with `isValid` and `errors` properties

**Example:**
```javascript
const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = options;

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Usage
const result = validatePassword('weakpass');
console.log(result);
// {
//   isValid: false,
//   errors: [
//     'Password must be at least 8 characters long',
//     'Password must contain at least one uppercase letter',
//     'Password must contain at least one number',
//     'Password must contain at least one special character'
//   ]
// }
```

### `sanitizeInput(input, options)`
Sanitizes user input to prevent XSS attacks.

**Parameters:**
- `input` (string): The input to sanitize
- `options` (Object): Sanitization options

**Returns:** `string` - The sanitized input

**Example:**
```javascript
const sanitizeInput = (input, options = {}) => {
  const {
    allowHtml = false,
    maxLength = 1000,
    removeScripts = true
  } = options;

  let sanitized = input.substring(0, maxLength);

  if (removeScripts) {
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  if (!allowHtml) {
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  return sanitized.trim();
};

// Usage
const userInput = '<script>alert("XSS")</script>Hello World';
const sanitized = sanitizeInput(userInput);
console.log(sanitized); // "Hello World"
```

## Database Functions

### `connectToDatabase(connectionString)`
Establishes a connection to the database.

**Parameters:**
- `connectionString` (string): The database connection string

**Returns:** `Promise<Connection>` - The database connection

**Example:**
```javascript
const { Pool } = require('pg');

let pool;

const connectToDatabase = async (connectionString) => {
  try {
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    await pool.connect();
    console.log('Connected to database');
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

// Usage
const db = await connectToDatabase(process.env.DATABASE_URL);
```

### `executeQuery(query, params)`
Executes a parameterized database query.

**Parameters:**
- `query` (string): The SQL query to execute
- `params` (Array, optional): Query parameters

**Returns:** `Promise<Object>` - Query result

**Example:**
```javascript
const executeQuery = async (query, params = []) => {
  try {
    const result = await pool.query(query, params);
    return result;
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  }
};

// Usage
const users = await executeQuery(
  'SELECT * FROM users WHERE email = $1',
  ['user@example.com']
);
```

### `transaction(callback)`
Executes multiple queries within a database transaction.

**Parameters:**
- `callback` (Function): Function containing the transaction logic

**Returns:** `Promise<any>` - The callback result

**Example:**
```javascript
const transaction = async (callback) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Usage
const result = await transaction(async (client) => {
  const user = await client.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', ['John', 'john@example.com']);
  await client.query('INSERT INTO user_profiles (user_id, bio) VALUES ($1, $2)', [user.rows[0].id, 'User bio']);
  return user.rows[0];
});
```

## HTTP Client Functions

### `httpGet(url, options)`
Makes an HTTP GET request.

**Parameters:**
- `url` (string): The URL to request
- `options` (Object, optional): Request options

**Returns:** `Promise<Object>` - The response data

**Example:**
```javascript
const httpGet = async (url, options = {}) => {
  const {
    headers = {},
    timeout = 5000,
    retries = 3
  } = options;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};

// Usage
const data = await httpGet('https://api.example.com/users', {
  headers: {
    'Authorization': 'Bearer token123'
  }
});
```

### `httpPost(url, data, options)`
Makes an HTTP POST request.

**Parameters:**
- `url` (string): The URL to request
- `data` (Object): The data to send
- `options` (Object, optional): Request options

**Returns:** `Promise<Object>` - The response data

**Example:**
```javascript
const httpPost = async (url, data, options = {}) => {
  const {
    headers = {},
    timeout = 5000
  } = options;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(data),
      timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
};

// Usage
const newUser = await httpPost('https://api.example.com/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

## Error Handling Functions

### `createError(message, statusCode, code)`
Creates a structured error object.

**Parameters:**
- `message` (string): Error message
- `statusCode` (number, optional): HTTP status code
- `code` (string, optional): Error code

**Returns:** `Error` - Structured error object

**Example:**
```javascript
const createError = (message, statusCode = 500, code = 'INTERNAL_ERROR') => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.timestamp = new Date().toISOString();
  return error;
};

// Usage
throw createError('User not found', 404, 'USER_NOT_FOUND');
```

### `handleError(error, context)`
Handles and logs errors with context.

**Parameters:**
- `error` (Error): The error to handle
- `context` (Object, optional): Additional context information

**Returns:** `Object` - Formatted error response

**Example:**
```javascript
const handleError = (error, context = {}) => {
  const errorResponse = {
    message: error.message,
    statusCode: error.statusCode || 500,
    code: error.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    context
  };

  console.error('Error occurred:', errorResponse);

  // Log to external service in production
  if (process.env.NODE_ENV === 'production') {
    // logToExternalService(errorResponse);
  }

  return errorResponse;
};

// Usage
try {
  // Some operation
} catch (error) {
  const errorResponse = handleError(error, { userId: 123, action: 'updateProfile' });
  res.status(errorResponse.statusCode).json(errorResponse);
}
```

## Testing Utilities

### `createMockData(schema, count)`
Creates mock data for testing.

**Parameters:**
- `schema` (Object): The data schema
- `count` (number, optional): Number of records to create

**Returns:** `Array` - Array of mock data objects

**Example:**
```javascript
const createMockData = (schema, count = 1) => {
  const mockData = [];

  for (let i = 0; i < count; i++) {
    const record = {};
    
    for (const [key, config] of Object.entries(schema)) {
      switch (config.type) {
        case 'id':
          record[key] = i + 1;
          break;
        case 'string':
          record[key] = config.value || `${key}_${i + 1}`;
          break;
        case 'email':
          record[key] = `user${i + 1}@example.com`;
          break;
        case 'number':
          record[key] = config.min ? 
            Math.floor(Math.random() * (config.max - config.min + 1)) + config.min :
            Math.floor(Math.random() * 100);
          break;
        case 'boolean':
          record[key] = Math.random() > 0.5;
          break;
        case 'date':
          record[key] = new Date().toISOString();
          break;
      }
    }
    
    mockData.push(record);
  }

  return count === 1 ? mockData[0] : mockData;
};

// Usage
const userSchema = {
  id: { type: 'id' },
  name: { type: 'string' },
  email: { type: 'email' },
  age: { type: 'number', min: 18, max: 65 },
  active: { type: 'boolean' },
  created_at: { type: 'date' }
};

const mockUsers = createMockData(userSchema, 5);
console.log(mockUsers);
```

### `waitFor(conditionFn, timeout)`
Waits for a condition to be true within a timeout.

**Parameters:**
- `conditionFn` (Function): Function that returns a boolean
- `timeout` (number, optional): Timeout in milliseconds (default: 5000)

**Returns:** `Promise<boolean>` - Whether the condition was met

**Example:**
```javascript
const waitFor = async (conditionFn, timeout = 5000) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await conditionFn()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return false;
};

// Usage
const elementExists = await waitFor(() => {
  return document.querySelector('#my-element') !== null;
}, 3000);

if (elementExists) {
  console.log('Element found');
} else {
  console.log('Element not found within timeout');
}
```