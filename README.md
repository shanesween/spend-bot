# Spend-Bot Portfolio Project

**Last Updated**: July 8, 2025

## 📋 Project Overview

**Spend-Bot** is a Next.js-based AI-powered financial assistant that helps users manage and pay invoices through Stripe integration. This portfolio project demonstrates modern web development, AI integration, and payment processing capabilities with **real Stripe Elements integration**.

---

## 🏗️ Technical Architecture

### Frontend Stack

- **Framework**: Next.js 15.3.5 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI**: React 19 with modern hooks
- **Component Library**: shadcn/ui with New York style
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono (Vercel's custom fonts)

### Backend & AI

- **AI Provider**: OpenAI GPT-3.5-turbo
- **Payment Processing**: Stripe API with Elements
- **AI Framework**: LangChain (configured but not yet implemented)
- **Validation**: Zod schema validation

### Development Tools

- **Linting**: ESLint with Next.js config
- **Build Tool**: Turbopack (for development)
- **Package Manager**: Both npm and yarn support

---

## 🔧 Setup Instructions

### Prerequisites

1. **Node.js 18+** and **npm/yarn**
2. **Stripe Account** (free test account)
3. **OpenAI API Key** (optional for AI features)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd spend-bot

# Install dependencies
npm install
# or
yarn install

# Install Stripe client library
npm install @stripe/stripe-js @stripe/react-stripe-js
# or
yarn add @stripe/stripe-js @stripe/react-stripe-js
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Stripe Configuration
# Get these from your Stripe Dashboard: https://dashboard.stripe.com/apikeys

# Secret key for server-side operations (starts with sk_test_ or sk_live_)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Publishable key for client-side operations (starts with pk_test_ or pk_live_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Customer ID for testing - create a customer in Stripe Dashboard
STRIPE_CUSTOMER_ID=cus_your_customer_id_here

# OpenAI API Key (optional for AI features)
OPENAI_API_KEY=your_openai_api_key_here
```

### Stripe Setup

1. **Create a Stripe Account** at [stripe.com](https://stripe.com)
2. **Get API Keys** from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. **Create a Test Customer**:
   - Go to Stripe Dashboard > Customers
   - Click "Add Customer"
   - Save the Customer ID (starts with `cus_`)
4. **Create Test Invoices** (optional):
   - Go to Stripe Dashboard > Invoices
   - Create some test invoices for your customer

### Running the Application

```bash
# Development server
npm run dev
# or
yarn dev

# Open http://localhost:3000
```

### Test the Payment Flow

1. **Start the app** and open the chat interface
2. **Type**: "Pay an invoice"
3. **Select an invoice** to pay
4. **Use the test card**: `4242 4242 4242 4242`
   - Any future expiry date (e.g., 12/28)
   - Any 3-digit CVC (e.g., 123)
   - Any valid postal code
5. **Complete the payment** and see the success message

---

## 🔧 Current Implementation Status

### ✅ Completed Features

1. **Project Foundation**

   - Next.js 15 app with TypeScript setup
   - Modern development environment with Turbopack
   - Proper project structure with src/ organization
   - Environment variable configuration
   - shadcn/ui component library integration

2. **UI Component System**

   - shadcn/ui setup with New York style variant
   - Custom component library in `src/components/ui/`
   - Available components: Button, Card, Input, ScrollArea
   - Chat interface with interactive elements
   - Tailwind CSS v4 with custom dark mode variant

3. **AI Agent System**

   - OpenAI integration with function calling
   - Five core financial functions:
     - `list_unpaid_invoices`: Retrieves open Stripe invoices
     - `pay_invoice`: Processes invoice payments
     - `initiate_payment_flow`: Interactive invoice selection
     - `list_payment_methods`: Shows saved payment methods
     - `setup_payment_method`: Adds new payment methods
   - API endpoint at `/api/agent` for agent interactions

4. **Payment Integration**

   - **Real Stripe Elements**: Secure card input forms
   - **Setup Intents**: For saving payment methods
   - **Payment Method Management**: Add, list, and set defaults
   - **Invoice Payment**: Full payment processing
   - **Error Handling**: Automatic payment method setup when needed

5. **Interactive Chat System**
   - Multi-step conversational flows
   - Invoice selection interface
   - Payment confirmation dialogs
   - Real-time payment method setup
   - Error handling and user guidance

### 🚧 Current State

- **Frontend**: Complete interactive chat interface with Stripe Elements
- **AI Agent**: Advanced multi-step conversation handling
- **Stripe**: Full production-ready integration with test card support
- **Payment Flow**: End-to-end payment processing with error handling

---

## 📁 File Structure

```
spend-bot/
├── src/
│   ├── app/
│   │   ├── api/agent/route.ts     # AI agent API endpoint
│   │   ├── layout.tsx             # Root layout with fonts
│   │   ├── page.tsx               # Homepage with chat interface
│   │   └── globals.css            # Global styles with Tailwind v4
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx         # Button component
│   │   │   ├── card.tsx           # Card component
│   │   │   ├── input.tsx          # Input component
│   │   │   └── scroll-area.tsx    # ScrollArea component
│   │   └── chat/
│   │       ├── index.tsx          # Chat interface component
│   │       ├── Message.tsx        # Message display component
│   │       ├── InvoiceCard.tsx    # Invoice display component
│   │       ├── InvoiceSelectionCard.tsx    # Invoice selection UI
│   │       ├── PaymentConfirmationCard.tsx # Payment confirmation UI
│   │       └── PaymentMethodSetupCard.tsx  # Stripe Elements form
│   ├── lib/
│   │   ├── agent.ts               # AI agent logic
│   │   ├── agent-config.ts        # Agent configuration
│   │   ├── ai-service.ts          # OpenAI service
│   │   ├── functions.ts           # Stripe function implementations
│   │   ├── stripe.ts              # Stripe server configuration
│   │   ├── stripe-client.ts       # Stripe client configuration
│   │   └── utils.ts               # Utility functions
│   ├── hooks/
│   │   └── useChat.ts             # Chat state management
│   ├── constants/
│   │   └── chat.ts                # Chat constants
│   └── types/
│       └── chat.ts                # TypeScript type definitions
├── public/                        # Static assets
├── components.json                # shadcn/ui configuration
├── package.json                   # Dependencies & scripts
└── Configuration files
```

---

## 🎯 Features Demonstration

### AI-Powered Interactions

- **Natural Language**: "Pay an invoice", "Show my payment methods"
- **Multi-step Conversations**: Guided payment flows
- **Error Handling**: Automatic payment method setup
- **Context Awareness**: Remembers conversation state

### Real Stripe Integration

- **Secure Elements**: Real Stripe card input forms
- **Test Card Support**: Full 4242 test card integration
- **Payment Methods**: Save and manage payment methods
- **Invoice Management**: List, select, and pay invoices
- **Setup Intents**: Proper payment method collection

### Modern UI/UX

- **Interactive Chat**: Multi-step conversation flows
- **Real-time Updates**: Loading states and error handling
- **Responsive Design**: Works on all devices
- **Accessibility**: Screen reader friendly

---

## 💡 Technical Highlights

### Strong Points

- **Modern Tech Stack**: Using latest Next.js 15 with App Router
- **Type Safety**: Full TypeScript implementation
- **AI Integration**: Sophisticated function calling with OpenAI
- **Real Payment Processing**: Production-ready Stripe integration
- **Interactive UI**: Multi-step conversational interfaces
- **Security**: Proper Stripe Elements implementation
- **Clean Architecture**: Well-organized code structure
- **Development Experience**: Fast refresh with Turbopack

### Production-Ready Features

- **Error Handling**: Comprehensive error management
- **Payment Security**: PCI-compliant Stripe Elements
- **State Management**: Robust chat state handling
- **API Design**: RESTful endpoints with proper validation
- **Environment Management**: Secure configuration handling

---

## 🚀 Portfolio Value

This project demonstrates:

- **Full-Stack Development**: Next.js + API routes + external services
- **AI/ML Integration**: OpenAI function calling and natural language processing
- **Payment Processing**: Real-world Stripe integration with Elements
- **Modern Web Development**: TypeScript, Tailwind CSS v4, modern React patterns
- **UI Component System**: shadcn/ui with custom interactive components
- **API Design**: RESTful endpoints with proper error handling
- **Security**: PCI-compliant payment processing
- **User Experience**: Multi-step conversational interfaces

---

## 📝 Development Notes

**Current Phase**: Production-ready implementation  
**Estimated Completion**: 95% backend, 90% frontend  
**Key Achievement**: Complete AI-powered payment system with real Stripe integration  
**Next Milestone**: Additional payment features and analytics

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Chat Interface**: Can send messages and receive responses
- [ ] **Invoice Listing**: "Show my unpaid invoices" works
- [ ] **Payment Flow**: "Pay an invoice" → select → confirm → pay
- [ ] **Payment Method Setup**: Add payment method when none exists
- [ ] **Test Card**: 4242 4242 4242 4242 works successfully
- [ ] **Error Handling**: Invalid cards show proper errors
- [ ] **State Management**: Conversation state is maintained

### Test Commands

```bash
# Try these in the chat interface:
"Show my unpaid invoices"
"Pay an invoice"
"Show my payment methods"
"Add a payment method"
"List my invoices"
```

---

## 🎨 UI Component System Setup

### shadcn/ui Integration

This project uses **shadcn/ui** as the component framework, providing a modern, accessible, and customizable component library built on top of Tailwind CSS.

#### Setup Process

1. **Installation**: Added `@shadcn/ui` dependency to the project
2. **Configuration**: Created `components.json` with New York style variant
3. **Component Installation**: Used shadcn/ui CLI to add components:
   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add card
   npx shadcn@latest add input
   npx shadcn@latest add scroll-area
   ```

#### Available Components

- **Button**: Versatile button component with multiple variants
- **Card**: Container component for content organization
- **Input**: Form input component with proper styling
- **ScrollArea**: Custom scrollable area component
- **Chat Interface**: Custom chat component in `src/components/chat/`

#### Design System

- **Style**: New York variant for modern, clean aesthetics
- **Colors**: Slate base color with CSS variables for theming
- **Icons**: Lucide React icon library
- **Dark Mode**: Custom dark variant using Tailwind CSS v4

---

## 🚀 Getting Started

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

### Environment Variables Required

- `OPENAI_API_KEY`: Your OpenAI API key
- `STRIPE_SECRET_KEY`: Your Stripe secret key

---

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
