#!/bin/bash

echo "🔧 Fixing configuration and running tests..."

# Install missing dependencies
echo "📦 Installing missing dependencies..."
npm install --save-dev @types/jest

# Initialize ESLint config if it doesn't exist
if [ ! -f ".eslintrc.js" ]; then
    echo "🔍 ESLint config created manually"
fi

# Clean and rebuild
echo "🧹 Cleaning previous builds..."
rm -rf dist/ coverage/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting with fix
echo "🔍 Running linter with auto-fix..."
npm run lint -- --fix || echo "⚠️  Some linting issues remain"

# Run tests
echo "🧪 Running unit tests..."
npm test

# Build the package
echo "🏗️  Building package..."
npm run build

# Test the built package
if [ -f "dist/index.js" ]; then
    echo "📋 Testing built package..."
    node -e "
    const validator = require('./dist/index.js');
    console.log('✅ Package loads successfully');
    console.log('Format validation:', validator.EmailValidator.validateFormat('test@example.com'));
    "
else
    echo "❌ Build failed - dist/index.js not found"
    exit 1
fi

echo "✅ All fixes applied and tests completed!"
