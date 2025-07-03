# kmock930.github.io
My Personal Website: [kmock930-github-io.vercel.app](https://kmock930-github-io.vercel.app/)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 🔐 Security Features

This project includes a comprehensive secure communication layer with:

- **HTTPS Implementation**: Force HTTPS in production with security headers
- **Input Validation & Sanitization**: Comprehensive client and server-side validation
- **API Security**: Secure API client with authentication and rate limiting
- **Error Handling**: Secure error responses without information leakage
- **XSS Prevention**: Input sanitization and output encoding
- **CSRF Protection**: Request validation and token management
- **Authentication**: JWT-based authentication with token refresh

### Security Documentation

- 📖 [Complete Security Guide](./docs/SECURITY.md) - Comprehensive security documentation
- 🔧 [Security Utilities](./src/lib/) - Reusable security utilities
- 📋 [Example Components](./src/app/examples/) - Secure component implementations
- 🧪 [Security Tests](./tests/security.test.js) - Comprehensive security testing

### Quick Security Setup

```bash
# Install dependencies
npm install

# Run security tests
npm test -- security.test.js

# Check for vulnerabilities
npm audit
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Then, run npm run build to build your application.
After getting the npm build, run npx serve ./out, to create/update index.html for deployment.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
