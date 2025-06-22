#!/bin/bash

echo "🚀 Publishing email validator package to NPM..."

# Check if user is logged in to npm
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ You are not logged in to NPM. Please run 'npm login' first."
    exit 1
fi

# Run tests first
echo "🧪 Running tests before publishing..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Aborting publish."
    exit 1
fi

# Build the package
echo "🏗️  Building package..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Aborting publish."
    exit 1
fi

# Check package contents
echo "📦 Checking package contents..."
npm pack --dry-run

# Publish to NPM
echo "🚀 Publishing to NPM..."
npm publish

if [ $? -eq 0 ]; then
    echo "✅ Package published successfully!"
    echo "📋 You can now install it with: npm install robust-email-validator"
else
    echo "❌ Publish failed. Please check the error messages above."
    exit 1
fi
