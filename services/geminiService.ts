import { GoogleGenAI, Type } from "@google/genai";
import { Project, TeamMember, ProjectPlan, AssessmentQuestion } from "../types";

// Ensure API Key is present
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to sanitize JSON string (Robust Version)
const cleanJsonString = (text: string): string => {
  try {
    // 1. Try to find the first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      return text.substring(firstBrace, lastBrace + 1);
    }
    
    // 2. Fallback: Standard cleanup
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '');
    }
    return clean;
  } catch (e) {
    return text;
  }
};

export const generateAssessmentQuestions = async (
  projectDescription: string,
  projectName: string,
  mode: 'TEAM' | 'SOLO'
): Promise<AssessmentQuestion[]> => {
  if (!apiKey) {
    return [
      {
        id: "mock1",
        text: "What is your experience with similar projects?",
        options: ["Beginner (0-1 yrs)", "Intermediate (2-4 yrs)", "Expert (5+ yrs)", "None"]
      },
      {
        id: "mock2",
        text: "How much time can you commit weekly?",
        options: ["< 5 hours", "5-15 hours", "15-30 hours", "Full time"]
      },
      {
        id: "mock3",
        text: "What is your preferred working style?",
        options: ["Independent/Async", "Collaborative/Pairing", "Mixed", "Managerial"]
      }
    ];
  }

  try {
    const model = 'gemini-3-flash-preview';
    const contextPrompt = mode === 'SOLO' 
      ? "The user is looking to hire a team. Focus questions on culture fit, ambition, and specific technical skills needed for a startup."
      : "The user has an existing team. Focus questions on clarifying current capacity, specific role preference, and working style.";

    const prompt = `
      You are an expert technical project manager.
      For a project named "${projectName}" with description: "${projectDescription}".
      Mode: ${mode} (${contextPrompt})
      
      Generate 3-5 specific multiple-choice screening questions to ask potential team members.
      
      Return a JSON object containing a "questions" array.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["text", "options"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const cleanText = cleanJsonString(text);
    const data = JSON.parse(cleanText);
    return (data.questions || []).map((q: any) => ({
      id: generateId(),
      text: q.text,
      options: q.options
    }));

  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const generateProjectPlan = async (
  project: Project
): Promise<ProjectPlan> => {
  // Use explicit mode instead of member count
  const isEntrepreneurMode = project.mode === 'SOLO';

  // --- MOCK FALLBACK IF NO API KEY ---
  if (!apiKey) {
    return {
      summary: "Mock plan generated (No API Key).",
      roles: [{ 
        title: "Lead Developer", 
        description: "Lead the tech team", 
        recruitmentBlurb: "We are looking for a rockstar dev! 🚀 #hiring",
        isFilled: false
      }],
      tasks: [{ id: "1", title: "Setup Repo", description: "Init git", assignedTo: "Lead Developer", assignmentReason: "Best fit", status: "todo" }],
      milestones: [{ title: "MVP Launch", description: "Launch v1" }]
    };
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    let systemInstruction = "";
    let context = "";

    const techStackContext = project.techStack ? `Preferred Tech Stack: ${project.techStack}` : "Tech Stack: Open to best fit";
    const deadlineContext = project.deadline ? `Target Deadline: ${project.deadline}` : "Deadline: ASAP";

    if (isEntrepreneurMode) {
      // MODE B: SOLO FOUNDER
      systemInstruction = `
        You are an expert HR Strategist and Product Builder (Solo Founder Mode).
        
        GOAL:
        1. Analyze the complexity of the idea.
        2. Recommend the IDEAL team structure (Roles).
        3. For each role, write a "recruitmentBlurb" (Ready-to-post LinkedIn/Twitter job post). It MUST be engaging, include emojis, and sell the vision.
        4. Create a task list for the founder.
        
        IMPORTANT:
        - Generate 3-5 KEY roles.
        - Generate 4-6 high-impact tasks.
      `;
      context = `
        Project: ${project.name}
        Description: ${project.description}
        ${techStackContext}
        ${deadlineContext}
        Current Team: None (Vacant).
      `;
    } else {
      // MODE A: TEAM LEAD (Optimized for Speed)
      systemInstruction = `
        Act as a high-speed Resource Allocator.
        
        GOAL:
        1. Map existing MEMBERS to ROLES based on their SKILLS.
        2. Assign critical MVP TASKS to members.
        3. KEEP IT CONCISE.
        
        CONSTRAINTS:
        - Generate max 5 roles (combine responsibilities if needed).
        - Generate max 6 critical tasks.
        - 'assignmentReason' should be under 10 words.
      `;
      
      // OPTIMIZATION: Compress member info to reduce token count and latency
      const membersInfo = project.members.map(m => {
        // Truncate answers to avoid huge context payloads
        const answersSummary = m.answers.map(a => a.answer).join(', ').substring(0, 150);
        return `ID: ${m.name} | Skills: ${m.skills} | Context: ${answersSummary}`;
      }).join('\n');
      
      context = `
        Project: ${project.name}
        Description: ${project.description}
        ${techStackContext}
        
        MEMBERS:
        ${membersInfo}
      `;
    }

    const prompt = `
      ${systemInstruction}
      
      CONTEXT:
      ${context}

      INSTRUCTIONS:
      Return a JSON object. Ensure 'roles' and 'tasks' arrays are NOT empty.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  recruitmentBlurb: { type: Type.STRING, description: "Mode B only" },
                  assignedMemberId: { type: Type.STRING, description: "Mode A only (Member Name)" },
                  assignmentReason: { type: Type.STRING, description: "Short reason" },
                  isFilled: { type: Type.BOOLEAN, description: "Always false initially" }
                }
              }
            },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  assignedTo: { type: Type.STRING },
                  assignmentReason: { type: Type.STRING, description: "Short reason" },
                  status: { type: Type.STRING, enum: ["todo", "in-progress", "done"] }
                }
              }
            },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  dueDate: { type: Type.STRING }
                }
              }
            },
            summary: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Sanitize JSON before parsing
    const cleanText = cleanJsonString(text);
    let data;
    try {
      data = JSON.parse(cleanText);
    } catch (e) {
      console.error("JSON Parse Error", e);
      throw new Error("Failed to parse AI response");
    }
    
    // Post-process with safe accessors & FALLBACK LOGIC
    let rawTasks = Array.isArray(data.tasks) ? data.tasks : [];
    let rawRoles = Array.isArray(data.roles) ? data.roles : [];
    let rawMilestones = Array.isArray(data.milestones) ? data.milestones : [];
    
    // FALLBACK: If AI returned empty arrays
    if (rawRoles.length === 0) {
      if (isEntrepreneurMode) {
        rawRoles = [
          {
            title: "Full Stack Developer",
            description: "Responsible for building the core MVP.",
            recruitmentBlurb: `Looking for a co-founder/dev to build ${project.name}! 🚀 #startup #hiring`,
            isFilled: false
          },
          {
            title: "Growth Marketer",
            description: "To handle the go-to-market strategy.",
            recruitmentBlurb: `Join ${project.name} as our growth lead! 📈`,
            isFilled: false
          }
        ];
        rawTasks = [
          { title: "Define MVP Scope", description: "List must-have features.", status: "todo" },
          { title: "Setup Landing Page", description: "Collect emails.", status: "todo" }
        ];
      } else {
         // Team Mode Fallback
         rawRoles = [{ title: "Project Lead", description: "Coordinate the team.", assignedMemberId: project.members[0]?.name || "Unassigned" }];
      }
    }

    const tasks = rawTasks.map((t: any) => ({ ...t, id: generateId() }));
    // Ensure roles have isFilled = false
    const roles = rawRoles.map((r: any) => ({ ...r, isFilled: false }));
    
    return {
      summary: data.summary || "Plan generated based on project requirements.",
      roles,
      tasks,
      milestones: rawMilestones
    };

  } catch (error) {
    console.error("Gemini Plan Gen Error:", error);
    // Return a safe fallback object instead of crashing
    return {
      summary: "AI Service temporarily unavailable. Here is a template plan.",
      roles: [
         { title: "Technical Lead", description: "Lead the development.", isFilled: false, recruitmentBlurb: "Hiring Tech Lead!" },
         { title: "Product Designer", description: "Design the UI/UX.", isFilled: false, recruitmentBlurb: "Hiring Designer!" }
      ],
      tasks: [{ id: "err1", title: "Review Project Scope", description: "Manual review required.", assignedTo: "Founder", status: "todo" }],
      milestones: []
    };
  }
};