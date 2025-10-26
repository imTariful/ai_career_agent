import { GoogleGenAI, Type } from "@google/genai";
import type { UserProfile, JobRecommendation, SkillGap, LearningPath, ResumeFeedback, LearningPathStep, GeneratedResume, LiveJob, DreamCompanyRoadmap } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseJsonResponse = <T,>(text: string, attempt: number = 0): T => {
    try {
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText) as T;
    } catch (e) {
        console.error("JSON parsing failed on attempt", attempt, ":", e);
        console.error("Raw text:", text);
        if (attempt < 2) { // Retry logic
             // A simple attempt to fix common issues, like trailing commas
            let fixedText = text.replace(/,\s*([}\]])/g, '$1');
            return parseJsonResponse(fixedText, attempt + 1);
        }
        throw new Error("Failed to parse JSON response from Gemini API after multiple attempts.");
    }
};

export const getJobRecommendations = async (profile: UserProfile): Promise<JobRecommendation[]> => {
    const prompt = `You are an expert AI Career Coach. Based on the following user profile, recommend 5 suitable job roles. For each role, provide a brief description (2-3 sentences) explaining why it's a good fit, and list the top 5 key skills required.

    User Profile:
    - Experience: ${profile.experience}
    - Skills: ${profile.skills}
    - Goals: ${profile.goals}

    Return the response as a JSON array of objects. Each object should have the following structure: { "title": "Job Title", "description": "Why it's a good fit.", "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"] }. Do not include any introductory text, just the raw JSON array.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        skills: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["title", "description", "skills"]
                }
            }
        }
    });

    return parseJsonResponse<JobRecommendation[]>(response.text);
};

export const getSkillGapAnalysis = async (userSkills: string[], job: JobRecommendation): Promise<SkillGap> => {
    const prompt = `You are an expert AI Career Coach. Compare the user's skills with the skills required for a target job role. Identify which skills the user already has (strengths) and which skills are missing (gaps).

    - User's Skills: ${userSkills.join(', ')}
    - Target Job: ${job.title}
    - Target Job Required Skills: ${job.skills.join(', ')}

    Provide a concise analysis. Return the response as a JSON object with the following structure: { "strengths": ["Skill 1", "Skill 2"], "gaps": ["Skill 3", "Skill 4"] }. Do not include any explanatory text, just the raw JSON object.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    gaps: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["strengths", "gaps"]
            }
        }
    });
    
    return parseJsonResponse<SkillGap>(response.text);
};

export const getLearningPath = async (targetRole: string, userSkills: string[], skillsToLearn: string[]): Promise<LearningPath> => {
    const prompt = `You are an expert AI Career Coach. Create a structured, step-by-step 3-month learning plan to help a user acquire the necessary skills for a target job role. The user already has some skills, so focus on bridging the gaps.

    - Target Role: ${targetRole}
    - User's Current Skills: ${userSkills.join(', ')}
    - Skills to Learn: ${skillsToLearn.join(', ')}

    The plan should be broken down into 3 monthly steps. For each step, provide a title, a detailed description of the tasks, and suggest one or two specific, high-quality online resources (e.g., a well-known course on Coursera, a popular YouTube channel, or official documentation).

    Return the response as a JSON array of objects. Each object should have the following structure: { "month": number, "title": "Focus for this month", "description": "Detailed tasks and goals.", "resources": [{ "name": "Resource Name", "url": "https://example.com" }] }. Do not include any introductory text, just the raw JSON array.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        month: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        resources: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    url: { type: Type.STRING }
                                },
                                required: ["name", "url"]
                            }
                        }
                    },
                    required: ["month", "title", "description", "resources"]
                }
            }
        }
    });
    
    return parseJsonResponse<LearningPath>(response.text);
};


export const getResumeFeedback = async (resumeText: string, targetRole: string): Promise<ResumeFeedback> => {
    const prompt = `You are an expert AI Career Coach and professional resume writer. Analyze the following resume text for a user targeting a '${targetRole}' position. Provide actionable feedback in four distinct areas:
    1.  **Overall Impression:** A brief, 1-2 sentence summary of the resume's strengths and weaknesses.
    2.  **Actionable Suggestions:** A bulleted list of 3-5 specific, high-impact improvements on the *content* (e.g., 'Quantify achievements in the Experience section with metrics like percentage growth or revenue saved.').
    3.  **Formatting & Structure Analysis**: A bulleted list of 2-4 suggestions on how to improve the layout and readability, such as using bullet points more effectively, ensuring consistent date formatting, or using clearer section headings.
    4.  **Rewritten Summary:** A rewritten, compelling professional summary (2-4 sentences) that is tailored for the target role and optimized with relevant keywords.

    Resume Text:
    ---
    ${resumeText}
    ---

    Return the response as a single JSON object with the keys "impression", "suggestions" (as an array of strings), "formattingFeedback" (as an array of strings), and "rewrittenSummary". Do not include any other text, just the raw JSON object.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    impression: { type: Type.STRING },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    formattingFeedback: { type: Type.ARRAY, items: { type: Type.STRING } },
                    rewrittenSummary: { type: Type.STRING }
                },
                required: ["impression", "suggestions", "formattingFeedback", "rewrittenSummary"]
            }
        }
    });
    
    return parseJsonResponse<ResumeFeedback>(response.text);
};

export const getAIAssessment = async (
    targetRole: string,
    learningPath: LearningPath,
    completedSteps: number[]
): Promise<string> => {
    const fullCompletedSteps = learningPath.filter(step => completedSteps.includes(step.month));
    const pendingSteps = learningPath.filter(step => !completedSteps.includes(step.month));

    const prompt = `You are an expert AI Career Coach, providing motivational and actionable feedback. A user is on a learning path to become a "${targetRole}".

    Here is their full learning plan:
    ${JSON.stringify(learningPath, null, 2)}

    They have marked the following steps as COMPLETED:
    ${JSON.stringify(fullCompletedSteps, null, 2)}

    These steps are PENDING:
    ${JSON.stringify(pendingSteps, null, 2)}

    Based on this progress, provide a concise, encouraging, and helpful assessment in a single paragraph.
    - Acknowledge their hard work and completed steps.
    - Offer encouragement to tackle the next steps.
    - If they seem ahead or behind, offer advice. For instance, if they've completed Month 2's goal but not Month 1's, gently guide them back.
    - Keep the tone positive and supportive.
    - Return the response as a single string of text. Do not wrap it in JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text;
};

export const getInterviewQuestions = async (jobTitle: string): Promise<string[]> => {
    const prompt = `You are an expert AI hiring manager and interview coach. Generate 5 diverse interview questions for a '${jobTitle}' role.
Ensure a mix of question types and difficulties to thoroughly vet a candidate. Include a variety of the following if applicable to the role:

1.  A classic behavioral question (e.g., "Tell me about a time you had a conflict with a coworker.").
2.  A technical or problem-solving challenge (e.g., "How would you approach designing a system for...?" or a small coding problem).
3.  A situational or role-playing scenario (e.g., "Imagine a key project you're leading is suddenly behind schedule. What are the first three steps you take?").
4.  A question about career growth, motivation, or leadership style (e.g., "What are you looking for in your next role that you aren't getting in your current one?").
5.  A question that tests creativity or strategic thinking (e.g., "What's a common industry practice you disagree with and why?").

Return the response as a simple JSON array of 5 strings. Do not include any introductory text, just the raw JSON array.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });

    return parseJsonResponse<string[]>(response.text);
};

export const getAnswerFeedback = async (question: string, answer: string, jobTitle: string): Promise<string> => {
    const prompt = `You are an expert AI interview coach. The user is practicing for a '${jobTitle}' interview.
    Here is the question they were asked, and their answer.

    Question:
    "${question}"

    User's Answer:
    "${answer}"

    Provide constructive feedback on their answer. Analyze its structure, clarity, and content. Suggest specific improvements using the STAR method (Situation, Task, Action, Result) if applicable for behavioral questions. Keep the feedback concise (2-3 paragraphs), actionable, and encouraging. Return the feedback as a single string of text. Do not wrap it in JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text;
};

export const generateResume = async (profile: UserProfile, targetJob: JobRecommendation): Promise<GeneratedResume> => {
    const prompt = `You are an expert ATS-friendly resume writer. Generate a complete, one-page professional resume for a user based on their profile and target job. The resume should be highly polished, professional, and optimized for Applicant Tracking Systems.

    User Profile:
    - Experience: ${profile.experience}
    - Skills: ${profile.skills}
    - Goals: ${profile.goals}

    Target Job:
    - Title: ${targetJob.title}
    - Description: ${targetJob.description}
    - Required Skills: ${targetJob.skills.join(', ')}

    Instructions:
    1.  **Contact Info:** Use placeholders like "Your Name", "your.email@example.com", etc.
    2.  **Professional Summary:** Write a compelling, 3-4 sentence summary tailored to the target job, highlighting the user's key strengths from their profile.
    3.  **Skills Section:** Categorize the user's skills into "Technical" and "Soft" skills.
    4.  **Work Experience:** Based on the user's provided experience, create detailed entries. For each role, invent 3-4 bullet points of specific, quantified achievements (e.g., "Increased efficiency by 15%...", "Managed a team of 5...", "Led a project that generated $50k in revenue..."). The achievements should align with the target job's requirements.
    5.  **Education:** Format the user's education clearly.

    Return the response as a single, well-structured JSON object. Do not include any introductory text, just the raw JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    email: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    linkedin: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    skills: {
                        type: Type.OBJECT,
                        properties: {
                            technical: { type: Type.ARRAY, items: { type: Type.STRING } },
                            soft: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["technical", "soft"]
                    },
                    experience: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                role: { type: Type.STRING },
                                company: { type: Type.STRING },
                                duration: { type: Type.STRING },
                                points: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ["role", "company", "duration", "points"]
                        }
                    },
                    education: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                degree: { type: Type.STRING },
                                university: { type: Type.STRING },
                                duration: { type: Type.STRING }
                            },
                            required: ["degree", "university", "duration"]
                        }
                    }
                },
                required: ["name", "email", "phone", "linkedin", "summary", "skills", "experience", "education"]
            }
        }
    });

    return parseJsonResponse<GeneratedResume>(response.text);
};

export const findLiveJobs = async (jobTitle: string, userGoals: string): Promise<LiveJob[]> => {
    const searchPrompt = `Using your search tool, find up to 5 recent, live job postings for a "${jobTitle}" role. The user's career goals are: "${userGoals}". Prioritize jobs that align with these goals (e.g., remote, specific location, industry). For each job, list its title, company, location, and the direct URL.`;

    // Step 1: Perform the grounded search
    const searchResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: searchPrompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    // Step 2: Extract structured JSON from the search result
    const extractionPrompt = `From the following text, extract a clean JSON array of job objects. Each object must have "title", "company", "location", and "url" properties. If no jobs are found or the text is irrelevant, return an empty array.

    Text:
    ---
    ${searchResponse.text}
    ---`;

    const extractionResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Flash is efficient for extraction
        contents: extractionPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        company: { type: Type.STRING },
                        location: { type: Type.STRING },
                        url: { type: Type.STRING },
                    },
                    required: ["title", "company", "location", "url"],
                }
            }
        }
    });
    
    return parseJsonResponse<LiveJob[]>(extractionResponse.text);
};


export const generateCoverLetter = async (profile: UserProfile, resume: GeneratedResume, job: LiveJob): Promise<string> => {
    const prompt = `You are an expert AI Career Coach specializing in writing compelling cover letters. Based on the user's profile, their generated resume, and the specific job they are applying for, write a professional and personalized cover letter.

    **Instructions:**
    - The letter should be concise (3-4 paragraphs).
    - It must directly address the company (${job.company}) and the role (${job.title}).
    - Highlight the user's most relevant skills and experiences from their resume and profile. Connect them directly to the needs of the job.
    - Show genuine interest in the company.
    - Conclude with a strong call to action.
    - Use the user's name ("${resume.name}") to sign off.

    **User Profile:**
    - Experience: ${profile.experience}
    - Skills: ${profile.skills}
    - Goals: ${profile.goals}

    **User's Resume Summary:**
    ${resume.summary}

    **Target Job:**
    - Title: ${job.title}
    - Company: ${job.company}
    - Location: ${job.location}

    Return the complete cover letter as a single string of text, formatted with newlines for paragraphs. Do not wrap it in JSON or any other format.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });

    return response.text;
};

export const getDreamCompanyRoadmap = async (profile: UserProfile, companyName: string): Promise<DreamCompanyRoadmap> => {
    const prompt = `You are an expert AI Career Strategist, creating a comprehensive guide for a beginner aiming to land a job at their dream company: "${companyName}". 
    Based on their profile, generate a complete, actionable, and encouraging roadmap.

    **User Profile:**
    - Experience: ${profile.experience}
    - Skills: ${profile.skills}
    - Goals: ${profile.goals}

    **Instructions:**
    Generate a detailed plan with the following sections:
    1.  **beginnerIntroduction:** A motivational, 2-3 paragraph introduction for a beginner. Explain that while the path is challenging, it's achievable with dedication. Give a high-level overview of the strategy (skill-building, networking, tailoring applications).
    2.  **companyProfile:** A brief overview of the company's culture, values, and what they look for in candidates.
    3.  **targetRoles:** Suggest 2-3 specific, realistic entry-level or junior roles at the company that align with the user's profile. For each, provide a short 'reasoning'.
    4.  **skillsRoadmap:** Identify 3-5 key skills the user must develop. For each skill:
        - Explain the 'reasoning' (why it's crucial for this company).
        - Provide a rich, categorized list of 'resources'. This should be an object containing lists for: 'videoCourses', 'youtubeTutorials', 'books', and 'articlesAndPdfs'. Find 1-2 high-quality, real resources for each category.
    5.  **networkingStrategy:** Provide a list of 3-4 actionable steps for networking.
    6.  **opportunities:** Suggest 1-2 potential internship or entry-level roles to watch for, including a placeholder URL.
    7.  **resumeTips:** Give a list of 3-4 specific tips for tailoring their resume to this company.

    Return the response as a single, well-structured JSON object. Do not include any introductory text, just the raw JSON.`;

    const resourceSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: { name: { type: Type.STRING }, url: { type: Type.STRING } },
            required: ["name", "url"],
        }
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    companyName: { type: Type.STRING },
                    companyProfile: { type: Type.STRING },
                    beginnerIntroduction: { type: Type.STRING },
                    targetRoles: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { title: { type: Type.STRING }, reasoning: { type: Type.STRING } },
                            required: ["title", "reasoning"],
                        }
                    },
                    skillsRoadmap: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                skill: { type: Type.STRING },
                                reasoning: { type: Type.STRING },
                                resources: {
                                    type: Type.OBJECT,
                                    properties: {
                                        videoCourses: resourceSchema,
                                        youtubeTutorials: resourceSchema,
                                        books: resourceSchema,
                                        articlesAndPdfs: resourceSchema,
                                    },
                                    required: ["videoCourses", "youtubeTutorials", "books", "articlesAndPdfs"],
                                }
                            },
                            required: ["skill", "reasoning", "resources"],
                        }
                    },
                    networkingStrategy: { type: Type.ARRAY, items: { type: Type.STRING } },
                    opportunities: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { title: { type: Type.STRING }, url: { type: Type.STRING } },
                            required: ["title", "url"],
                        }
                    },
                    resumeTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["companyName", "companyProfile", "beginnerIntroduction", "targetRoles", "skillsRoadmap", "networkingStrategy", "opportunities", "resumeTips"],
            }
        }
    });

    return parseJsonResponse<DreamCompanyRoadmap>(response.text);
};