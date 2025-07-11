This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🤖 AI Assistant Features

This project includes an **AI-powered workflow assistant** that helps you manage n8n workflows through natural language conversation.

### Current Status: ✅ **Working in Demo Mode**

The AI Assistant is fully functional and visible in the dashboard at `/dashboard`. It currently runs in **demo mode** with:

- ✅ Interactive chat interface
- ✅ Quick action buttons for common tasks  
- ✅ Rule-based command processing
- ✅ Integration with workflow management APIs
- ✅ Error handling and fallback responses

### 🚀 Enable Full AI Capabilities

To unlock advanced AI features, set up the DeepSeek API:

1. Get an API key from [DeepSeek Platform](https://platform.deepseek.com/)
2. Create a `.env.local` file in the project root:

```bash
# AI Assistant Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

3. Restart the development server

**Enhanced features with API key:**
- 🧠 Advanced natural language understanding
- 🎯 Intelligent command parsing
- 💬 Contextual AI responses
- 🔧 Smart workflow suggestions

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

🎯 **Visit the Dashboard**: Navigate to `/dashboard` to interact with your AI Assistant!

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📋 Project Structure

- `/dashboard` - Main dashboard with AI Assistant
- `/workflows` - Workflow management interface  
- `/templates` - Browse workflow templates
- `/executions` - View workflow execution history
- `/integrations` - Available service integrations

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
