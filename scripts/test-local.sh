#!/bin/bash

echo "🧪 Running local tests for email validator package..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run tests
echo "🧪 Running unit tests..."
npm test

# Run tests with coverage
echo "📊 Running tests with coverage..."
npm run test -- --coverage

# Build the package
echo "🏗️  Building package..."
npm run build

# Test the built package
echo "📋 Testing built package..."
node -e "
const validator = require('./dist/index.js');
console.log('✅ Package loads successfully');
console.log('Format validation:', validator.EmailValidator.validateFormat('test@example.com'));
"

echo "✅ All local tests completed successfully!"
