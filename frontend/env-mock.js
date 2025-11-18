// frontend/env-mock.js

// This file mocks import.meta.env for Jest's Node environment
// The CI/CD process needs to set the environment variable VITE_API_URL
// using the Node standard (process.env) instead of import.meta.env.
// This is the simplest way to get the variable into your service files during testing.

module.exports = { 
    VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:8000'
};