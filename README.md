
# 🧭 AI Career Coach

**An intelligent, AI-powered assistant that guides users from career exploration to job application readiness.**

This application is a comprehensive, end-to-end career development tool. It leverages the powerful reasoning capabilities of the Google Gemini API to provide a personalized and interactive experience. Users can discover their ideal career path, identify and bridge skill gaps, generate professional application materials, and even prepare for interviews—all within a single, seamless interface.

## ✨ Features

This application is packed with features designed to support every stage of the career journey:

-   **Personalized Career Exploration**
    -   **AI-Powered Job Recommendations**: Input your experience, skills, and goals to receive 5 tailored job recommendations, complete with detailed descriptions and key skill requirements.
    -   **Strategic Dream Company Roadmap**: Go beyond general advice. Target a specific company and receive a detailed strategic roadmap, including:
        -   Cultural insights and values.
        -   AI-suggested roles that fit your profile.
        -   A comprehensive skills plan with curated learning resources (courses, videos, books).
        -   Actionable networking strategies and resume tailoring tips.

-   **Skill Development & Progress Tracking**
    -   **In-Depth Skill Gap Analysis**: Select a recommended job to see a clear breakdown of your current strengths versus the skills you need to develop.
    -   **Interactive Learning Path**: Generate a step-by-step, multi-month learning plan with curated resources to efficiently acquire the necessary skills for your target role.
    -   **Progress Tracking & AI Assessment**: Visually track your learning progress. Mark steps as complete and receive motivational, personalized feedback from your AI coach.

-   **Application Material Generation**
    -   **ATS-Friendly Resume Generator**: Create a complete, professional, one-page resume tailored to your target job. The output is optimized for Applicant Tracking Systems (ATS) to maximize your chances of getting noticed.
    -   **Personalized Cover Letter Generator**: Generate a compelling cover letter for a specific live job posting, using your profile and newly generated resume as context.

-   **Job Hunting & Interview Preparation**
    -   **Live Job Search**: Find real-time job postings for a specific role, pulled from across the web using Google Search grounding.
    -   **AI-Powered Interview Practice**: Get a list of diverse, role-specific interview questions (behavioral, technical, situational) and receive expert AI feedback on your answers.
    -   **Instant Resume Feedback**: Already have a resume? Paste it in to get an AI-powered analysis of its content, structure, and formatting, plus a rewritten professional summary.

-   **Seamless User Experience**
    -   **Persistent Sessions**: Your profile, learning path, and progress are automatically saved in your browser, allowing you to close the app and pick up right where you left off.
    -   **Intuitive, Step-by-Step UI**: The application is designed as a guided journey, with each step logically flowing into the next.

## 🚶‍♂️ The User Journey: A Step-by-Step Walkthrough

The application is designed to feel like a guided session with a real career coach.

1.  **Build Your Profile**: The journey begins by creating a professional profile. The user inputs their work experience, existing skills, and long-term career goals.
2.  **Choose Your Path**: The user is presented with two powerful options:
    -   **Get General Recommendations**: Ideal for exploration. The AI analyzes the profile and suggests five fitting career paths.
    -   **Target a Dream Company**: For users with a specific goal. The AI generates a deep, strategic roadmap for landing a job at that company.
3.  **Analyze & Plan**:
    -   If on the "General" path, the user selects a job, analyzes their skill gaps, and generates a personalized learning path to bridge them.
    -   The "Dream Company" path directly provides a detailed skills and networking plan.
4.  **Learn & Grow**: The user follows their interactive learning path, marking off completed steps and getting AI feedback on their progress.
5.  **Prepare Application Materials**: Once confident in their skills, the user generates a tailored, ATS-friendly resume.
6.  **Find Opportunities**: The user can now search for live job openings for their target role.
7.  **Apply with Confidence**: For a promising job opening, the user generates a personalized cover letter.
8.  **Ace the Interview**: Finally, the user enters the Interview Prep module to practice with AI-generated questions and receive feedback, ensuring they are ready for the real thing.

## 🏛️ Architecture & Technical Details

This is a client-side, single-page application (SPA) built with React. It operates without a traditional backend server.

-   **State Management**: All application state is managed within the main `App.tsx` component using React Hooks (`useState`, `useEffect`, `useCallback`). The state is passed down to child components via props.
-   **Gemini API Integration**: All AI-powered logic is handled by making direct calls to the Google Gemini API from the browser. The `services/geminiService.ts` file acts as a dedicated layer for all API interactions, encapsulating the prompt engineering and response parsing logic.
-   **Local Persistence**: The user's entire session (profile, selected job, learning path, progress, generated resume) is saved to the browser's `localStorage`. This allows for a seamless experience, enabling users to return and continue their journey without losing their data.
-   **No Database**: The application is self-contained and does not require a database or backend infrastructure, simplifying deployment and maintenance.

## 🧠 AI Prompt Engineering

The quality of this application relies on sophisticated prompt engineering. We treat the Gemini model as a specialized expert in different contexts.

-   **Role-Based Prompting**: Each API call begins by assigning a role to the AI (e.g., "You are an expert AI Career Coach," "You are an expert ATS-friendly resume writer," "You are an expert AI hiring manager"). This sets the context and significantly improves the quality and tone of the response.
-   **Structured JSON Output**: For most features, we instruct Gemini to return a response in a specific JSON format. We provide the exact schema in the prompt and use the `responseMimeType: "application/json"` and `responseSchema` configurations. This allows for reliable, structured data that can be easily parsed and rendered in the UI, avoiding the fragility of parsing natural language.
-   **Two-Step Grounded Search**: For the "Find Live Jobs" feature, a two-step process ensures reliability.
    1.  **Search**: A prompt uses the `googleSearch` tool to find relevant information from the web.
    2.  **Extract**: The unstructured text from the search result is then fed into a second, simpler model (`gemini-2.5-flash`) with a strict JSON schema to reliably extract the job data. This separation of concerns is more robust than asking for grounded results and JSON in a single step.
-   **Chain-of-Thought & Contextual Data**: For features like the Cover Letter Generator, the prompt includes all relevant context—the user's profile, the summary from their generated resume, and the details of the target job. This "chain of thought" allows the AI to make logical connections and produce a highly personalized and relevant output.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://reactjs.org/) (with Hooks) & [TypeScript](https://www.typescriptlang.org/) for a modern, type-safe user interface.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for rapid, utility-first styling.
-   **AI/LLM**: [Google Gemini API](https://ai.google.dev/docs)
    -   `gemini-2.5-pro`: Used for complex reasoning, planning, and generation tasks (e.g., creating the learning path, generating a resume, dream company roadmap).
    -   `gemini-2.5-flash`: Used for faster, less complex tasks (e.g., skill gap analysis, extracting JSON from text).
-   **Dependencies**: All dependencies are loaded via an `importmap` from a CDN, ensuring a lightweight and portable setup.

## ⚙️ Setup & Running the Application

This application is designed to run in a web-based development environment that provides the necessary files and an environment variable for the API key.

### API Key Configuration

The application requires a Google Gemini API key to function. The key **must** be provided as an environment variable named `API_KEY`. The application code (`services/geminiService.ts`) reads this key directly from `process.env.API_KEY`.

## 📂 Project Structure

The project is organized into logical directories and components for maintainability and clarity.

```
.
├── components/
│   ├── common/              # Reusable UI components (Card, Header, Pill, etc.)
│   ├── CoverLetterGeneratorView.tsx # Renders the generated cover letter.
│   ├── DreamCompanyView.tsx     # Displays the detailed strategic company roadmap.
│   ├── InterviewPrepView.tsx    # The interactive mock interview interface.
│   ├── JobSearchModal.tsx       # Modal for displaying live job search results.
│   ├── LearningPathView.tsx     # Displays the interactive learning plan and progress.
│   ├── ProfileInput.tsx         # The initial form for user data entry.
│   ├── Recommendations.tsx      # Displays the top 5 AI-generated job roles.
│   ├── ResumeFeedbackView.tsx   # Shows feedback for a pasted resume.
│   ├── ResumeGeneratorView.tsx  # Displays the fully generated, ATS-friendly resume.
│   └── SkillGapAnalysis.tsx     # Shows strengths and skill gaps for a target role.
├── services/
│   └── geminiService.ts     # The core logic file. Encapsulates all prompts and interactions with the Gemini API.
├── App.tsx                  # The main application component. Manages all state, orchestrates API calls, and handles view routing.
├── index.html               # The main HTML entry point for the application.
├── index.tsx                # The root entry point for the React application.
├── types.ts                 # Contains all TypeScript type definitions and enums for the entire application.
└── README.md                # This file.
```
