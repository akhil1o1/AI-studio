This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Deliverables Achieved

-  ✅ All core functionality is implemented. Users upload an image + style + prompt and the mock API returns a response with a dummy image URL after 3 seconds of delay. The image is shown in the preview with the original image. There is a draggable splitter/slider to preview both images side by side.

-  ✅ Up to the last 5 successful image generations are saved in localStorage and shown as recent history in the app sidebar. On clicking it, the original image is shown in the preview.

-  ✅ Errors and loading states are managed using loaders and toasts appropriately.

-  ✅ The app is built with shadcn components which come with good accessibility features. The app is navigable using keyboard controls.

-  ✅ Unit tests are implemented for utility functions and integration tests for general overall functionality of the application.

-  ✅ PWA functionality is implemented with manifest version and is installable as an app on desktop and mobile devices.

-  ✅ AI-usage documentation is attached in the repo with some screenshots of agentic usage and screenshots provided as reference to Copilot.

## Design Strategy

### Design System

This project leverages **shadcn/ui** components as the foundation for a consistent and accessible design system:

-  **Modern Component Library** - Pre-built, customizable React components
-  **Tailwind CSS Integration** - Utility-first styling with design tokens
-  **Accessibility-First** - Built-in ARIA support and keyboard navigation
-  **Dark/Light Mode** - Seamless theme switching capabilities

### Design Inspiration

The overall UI design draws inspiration from leading AI image generation tools:

-  **SORA (OpenAI)** - Clean, minimalist interface with focus on content creation
-  **Adobe AI Studio** - Professional tool aesthetics with intuitive workflow design
-  **ChatGPT Interface** - Familiar dock-style input patterns for user comfort

### Key Design Principles

-  **Simplicity** - Uncluttered interface focusing on core functionality
-  **Professional Aesthetics** - Clean, modern design suitable for creative workflows
-  **Intuitive Interaction** - Familiar patterns from established AI tools
-  **Responsive Design** - Optimized for both desktop and mobile experiences

## Testing

This project includes comprehensive integration tests built with Jest and React Testing Library.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (automatically re-run when files change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The test suite covers:

-  **History Management** - localStorage operations and data persistence
-  **Core User Interactions** - form validation, file uploads, loading states
-  **Component Rendering** - UI component functionality and user workflows

Current test results:

-  ✅ Test Suites: 2 passed
-  ✅ Tests: 10 passed
-  ⏱️ Execution Time: ~5s

