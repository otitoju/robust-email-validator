# Contributing to Robust Email Validator

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. Fork the repository
2. Clone your fork: \`git clone https://github.com/otitoju/robust-email-validator.git\`
3. Install dependencies: \`npm install\`
4. Create a branch: \`git checkout -b feature/your-feature-name\`
5. Make your changes
6. Run tests: \`npm test\`
7. Commit your changes: \`git commit -m "Add your feature"\`
8. Push to your fork: \`git push origin feature/your-feature-name\`
9. Create a Pull Request

## 🎯 Ways to Contribute

### 🐛 Bug Reports
- Use the bug report template
- Include reproduction steps
- Provide environment details
- Add relevant error messages

### ✨ Feature Requests
- Use the feature request template
- Explain the use case
- Provide examples if possible
- Consider backward compatibility

### 📝 Documentation
- Fix typos and grammar
- Add examples
- Improve clarity
- Update outdated information

### 🧪 Tests
- Add test cases for new features
- Improve test coverage
- Add edge case tests
- Performance tests

### 🔧 Code Improvements
- Performance optimizations
- Code refactoring
- TypeScript improvements
- Browser compatibility

## 📋 Development Guidelines

### Code Style
- Use TypeScript
- Follow existing code style
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Testing
- Write tests for new features
- Maintain test coverage above 90%
- Test both Node.js and browser environments
- Include edge cases

### Commits
- Use conventional commit messages
- Keep commits atomic
- Write clear commit messages
- Reference issues when applicable

### Pull Requests
- Fill out the PR template
- Link related issues
- Add screenshots for UI changes
- Ensure CI passes
- Request reviews from maintainers

## 🏗️ Project Structure

\`\`\`
robust-email-validator/
├── src/                    # Source code
│   ├── validators/         # Validation modules
│   ├── types.ts           # TypeScript definitions
│   └── index.ts           # Main entry point
├── __tests__/             # Test files
├── examples/              # Usage examples
├── scripts/               # Build and utility scripts
└── docs/                  # Documentation
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
\`\`\`

## 📦 Building

\`\`\`bash
# Build the package
npm run build

# Test the built package
node -e "console.log(require('./dist'))"
\`\`\`

## 🔄 Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create a git tag
4. Push to GitHub
5. GitHub Actions will publish to NPM

## 📞 Getting Help

- 💬 [GitHub Discussions](https://github.com/otitoju/robust-email-validator/discussions)
- 🐛 [GitHub Issues](https://github.com/otitoju/robust-email-validator/issues)
- 📧 Email: your.email@example.com

## 📜 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🙏 Recognition

Contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Given credit in documentation

Thank you for making this project better! 🎉
