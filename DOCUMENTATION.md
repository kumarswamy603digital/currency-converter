# Currency Converter - Developer Documentation

## Project Overview

A modern, real-time currency converter web application built with React and TypeScript. The application allows users to convert amounts between different currencies using live exchange rates from the Frankfurter API.

### Key Features

- **Real-time Exchange Rates**: Fetches live currency exchange rates from the Frankfurter API
- **Multi-Currency Support**: Supports all major currencies available through the Frankfurter API
- **Currency Swapping**: One-click swap between source and target currencies
- **Flag Emoji Display**: Visual currency identification using flag emojis
- **Input Validation**: Validates amount input and prevents invalid conversions
- **Error Handling**: Displays user-friendly error messages for API failures
- **Loading States**: Provides visual feedback during API requests
- **TypeScript**: Full type safety throughout the application
- **Comprehensive Testing**: Unit tests for components, utilities, and API functions

## Technical Stack

### Core Technologies

- **React 18.3.1**: UI library for building the user interface
- **TypeScript 5.6.2**: Type-safe JavaScript for enhanced developer experience
- **Vite 5.4.8**: Fast build tool and development server

### Testing

- **Vitest 4.0.5**: Fast unit testing framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **happy-dom**: Lightweight DOM implementation for testing

### API

- **Frankfurter API**: Free, open-source currency exchange rate API
  - Endpoint: `https://api.frankfurter.app`

### Build Tools

- **@vitejs/plugin-react**: Vite plugin for React support

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:

   ```bash
   cd currency-converter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

This will install all required dependencies listed in `package.json`.

### Development

**Run the development server**:

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or the port specified in your environment configuration). The page will automatically reload when you make changes to the source files.

### Building for Production

**Create a production build**:

```bash
npm run build
```

This command:

1. Compiles TypeScript (`tsc -b`)
2. Bundles and optimizes the application using Vite
3. Outputs the production-ready files to the `dist/` directory

**Preview the production build**:

```bash
npm run preview
```

This serves the production build locally for testing before deployment.

### Testing

**Run tests in watch mode**:

```bash
npm test
```

**Run tests once**:

```bash
npm run test:run
```

**Run tests with UI**:

```bash
npm run test:ui
```

**Generate test coverage report**:

```bash
npm run coverage
```

## Usage Guide

### Basic Steps

1. **Enter Amount**: Type a numeric amount in the input field. The amount must be a positive number.

2. **Select Source Currency**: Choose the currency you want to convert from using the "From" dropdown.

3. **Select Target Currency**: Choose the currency you want to convert to using the "To" dropdown.

4. **Get Exchange Rate**: Click the "Get Exchange Rate" button to fetch the latest exchange rate and see the converted amount.

5. **Swap Currencies** (Optional): Click the swap button (⇄) between the currency selectors to quickly reverse the conversion direction.

### Application Flow

1. On initial load, the application fetches available currencies from the Frankfurter API
2. Default currencies are set (USD and NPR by default, or first available currencies)
3. When the user clicks "Get Exchange Rate", the app:
   - Validates the input amount
   - Fetches the latest exchange rate from the API
   - Calculates and displays the converted amount
4. Results are cleared automatically when the amount or currency selections change

### Component Structure

- **App.tsx**: Main application component managing state and business logic
- **AmountInput**: Handles numeric amount input with validation
- **CurrencySelect**: Dropdown selector for choosing currencies
- **SwapButton**: Button to swap source and target currencies
- **Result**: Displays the conversion result with formatted output

### API Integration

The application uses the Frankfurter API for:

- **Currency List**: `GET https://api.frankfurter.app/currencies`
- **Exchange Rates**: `GET https://api.frankfurter.app/latest?amount={amount}&from={from}&to={to}`

### Error Handling

The application handles various error scenarios:

- Network failures
- Invalid API responses
- Invalid currency codes
- Invalid amount inputs

Error messages are displayed to the user in a user-friendly format.
