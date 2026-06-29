# 🎓 Campus Hub

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Backend-yellow?style=for-the-badge&logo=firebase)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

Campus Hub is a modern, AI-integrated web application designed to connect students, manage campus events, and streamline university communication. Built with performance and scalability in mind, it leverages a serverless architecture to deliver a seamless user experience.

## ✨ Key Features

*   **⚡ Serverless Architecture:** Built on Next.js 15 with App Router for lightning-fast Server-Side Rendering (SSR) and optimal SEO.
*   **🤖 AI Integration:** Integrated with Google Genkit to provide intelligent features and dynamic user interactions.
*   **🔒 Secure Backend:** Utilizes Firebase Firestore with custom security rules (`firestore.rules`) for safe, real-time NoSQL data management.
*   **🎨 Premium UI/UX:** Styled with Tailwind CSS and Radix UI components, ensuring a beautiful, responsive, and fully accessible (a11y) design.
*   **✅ Robust Validation:** Implements React Hook Form and Zod for strict, type-safe client-side data validation.

## 🛠️ Tech Stack

**Frontend:**
*   Next.js 15
*   React 19
*   TypeScript
*   Tailwind CSS
*   Radix UI
*   Lucide React (Icons)
*   Recharts (Data Visualization)

**Backend & Services:**
*   Firebase (Firestore & Authentication)
*   Google Genkit (AI Orchestration)
*   Next.js Server Actions (API layer)

## 🚀 Getting Started

### Prerequisites
Before running this project, ensure you have the following installed:
*   [Node.js](https://nodejs.org/en/) (v20 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/campus-hub.git
    cd campus-hub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your Firebase and Google API keys:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    
    # Required for Google Genkit AI features
    GOOGLE_GENAI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📂 Project Structure

```text
campus-hub/
├── src/
│   ├── ai/            # Google Genkit configuration and AI logic
│   ├── app/           # Next.js App Router (Pages & API routes)
│   ├── components/    # Reusable Radix UI & generic React components
│   ├── firebase/      # Firebase initialization and helper functions
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utility functions (e.g., Tailwind class merging)
├── public/            # Static assets (images, fonts, etc.)
├── firestore.rules    # Firebase backend security rules
├── tailwind.config.ts # Tailwind CSS configuration
└── package.json       # Project dependencies and scripts
