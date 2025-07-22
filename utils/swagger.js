const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'Online Bookstore with Shopping Cart',
        version: '1.0.0',
        description: 'Documentation for the Online Bookstore with Shopping Cart',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/',
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['username', 'password', 'email', 'role'],
                    properties: {
                        _id: { type: 'string', example: '64bd...' },
                        username: { type: 'string', example: 'john_doe' },
                        password: { type: 'string', format: 'password', example: 'securepassword123' },
                        email: {type: 'string', format: 'email', example: 'johndoe@gmail.com'},
                        role: { type: 'string', enum: ['buyer', 'seller'], default: 'buyer', example: 'buyer' },
                    }
                },
                Category: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        _id: { type: 'string', example: '64bd...' },
                        name: { type: 'string', example: 'Electronics' },
                        description: { type: 'string', example: 'All electronic items and gadgets' },
                    }
                },
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
