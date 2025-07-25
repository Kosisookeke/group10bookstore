# Group 10 Bookstore

A Node.js application for an online bookstore with user authentication, book management, shopping cart functionality, and more.

## Features

- User authentication (register, login)
- Role-based access control (buyer, seller)
- Book management (create, read, update, delete)
- Category management
- Shopping cart functionality
- API documentation with Swagger

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Swagger for API documentation

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kosisookeke/group10bookstore.git
   cd group10bookstore
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Documentation

The API documentation is available at `/api-docs` when the server is running.

## Testing

The project includes a comprehensive test suite using Jest. To run the tests:

```bash
npm test
```

For more information about the testing approach and available test commands, see the [testing documentation](./__tests__/README.md).

## Project Structure

- `controllers/`: Contains the business logic for handling requests
- `models/`: Defines the data models and database schemas
- `routes/`: Defines the API endpoints
- `middlewares/`: Contains middleware functions for authentication, error handling, etc.
- `utils/`: Contains utility functions
- `__tests__/`: Contains test files

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a pull request

## License

This project is licensed under the ISC License.