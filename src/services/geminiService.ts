/**
 * Gemini Legal Agent Service for Kayda Sathi
 * Converts Gemini into a structured Legal Agent that outputs clean, validated
 * schema without raw markdown symbols (**, //, ##, *).
 */
import { analyzeLegalQueryWithGemini } from '../data/legalData';
import { GeminiLegalAnalysis, GeminiAgentResponse } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

// Ordered by reliability — gemini-3.5-flash confirmed working
const MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Strips all raw markdown artifacts (**, *, ##, //, _, `) 
 * so the output is 100% clean plain-text for UI cards and audio
 */
export function cleanMarkdownText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\*\*(.*?)\*\*/g, '$1')       // **bold** -> bold
    .replace(/\*(.*?)\*/g, '$1')           // *italic* -> italic
    .replace(/^#{1,6}\s+/gm, '')           // ### headers -> text
    .replace(/\/\//g, '')                  // // slashes -> empty
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1')   // __underline__ -> underline
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')   // `code` -> text
    .replace(/^[*\-+]\s+/gm, '')           // bullet points -> text
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')    // [link text](url) -> link text
    .trim();
}

/**
 * Matches template ID based on query context
 */
function matchDraftTemplateId(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('rent') || lower.includes('deposit') || lower.includes('landlord') || lower.includes('flat') || lower.includes('tenant')) {
    return 'draft-rental-deposit';
  }
  if (lower.includes('salary') || lower.includes('employ') || lower.includes('job') || lower.includes('wages') || lower.includes('relieving')) {
    return 'draft-unpaid-salary';
  }
  if (lower.includes('cyber') || lower.includes('upi') || lower.includes('fraud') || lower.includes('scam') || lower.includes('phishing')) {
    return 'draft-cyber-fraud';
  }
  if (lower.includes('police') || lower.includes('fir') || lower.includes('theft') || lower.includes('harass') || lower.includes('station')) {
    return 'draft-police-fir';
  }
  return 'draft-consumer-refund';
}

async function callGeminiModel(
  model: string,
  promptText: string,
  jsonMode: boolean = false
): Promise<string | null> {
  try {
    const url = `${ENDPOINT}/${model}:generateContent?key=${API_KEY}`;
    const bodyPayload: any = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1200,
      },
    };

    if (jsonMode) {
      bodyPayload.generationConfig.responseMimeType = 'application/json';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 0) {
        console.log(`[KaydaSathi Agent] Response from ${model} ✓`);
        return text;
      }
    } else {
      console.warn(`[KaydaSathi Agent] ${model} returned HTTP ${response.status}`);
    }
  } catch (err) {
    console.warn(`[KaydaSathi Agent] ${model} fetch error:`, err);
  }
  return null;
}

/**
 * Structured Legal Agent
 * Returns structured JSON with clean summary, rights, action steps, authority, and draft info.
 * Never outputs raw asterisks (**) or slashes (//).
 */
export async function askGeminiLegalAgent(
  prompt: string,
  userLanguage: string = 'English'
): Promise<GeminiAgentResponse> {
  const languageDirective = userLanguage && userLanguage.toLowerCase() !== 'english'
    ? `All textual values in the JSON MUST be written in ${userLanguage} (in native script, e.g. Devanagari for Hindi/Marathi).`
    : `All textual values in the JSON must be written in clear, simple everyday English.`;

  const agentPrompt = `You are "Kayda Sathi Legal Agent", an autonomous legal AI specialized in Indian Law.
Analyze this citizen's dispute: "${prompt}"

CRITICAL INSTRUCTION:
Do NOT output any markdown symbols like "**", "*", "##", or "//" inside any string.
You MUST reply strictly with a single valid JSON object following this exact schema:
{
  "summary": "1-2 sentences summarizing the dispute and the citizen's legal position in clear, simple terms without any asterisks or formatting symbols.",
  "identifiedIssue": "The specific legal dispute domain (e.g. Unlawful Retention of Security Deposit, Defective Product Refund, Unpaid Salary)",
  "confidenceScore": 95,
  "coreRights": [
    "First core right under relevant Indian statute (e.g. Under Model Tenancy Act, deposit must be refunded within 30 days)",
    "Second core right under Indian Law"
  ],
  "actionSteps": [
    "Step 1: Immediate action (e.g. Send a formal written notice giving 15 days deadline)",
    "Step 2: Evidence collection and documentation step",
    "Step 3: Official grievance filing step"
  ],
  "requiredDocuments": [
    "First proof or document needed",
    "Second document needed",
    "Third document needed"
  ],
  "authority": {
    "name": "Exact official forum or government authority (e.g. District Consumer Disputes Redressal Commission / e-Daakhil)",
    "helpline": "Official helpline number or portal (e.g. 1915 / consumerhelpline.gov.in)"
  },
  "recommendedDraftTitle": "Name of legal notice draft template (e.g. Security Deposit Refund Demand Notice)"
}

${languageDirective}
Return ONLY the raw JSON object.`;

  // Attempt 1: Try models with JSON mode
  let rawJsonText: string | null = null;
  for (const model of MODELS) {
    rawJsonText = await callGeminiModel(model, agentPrompt, true);
    if (rawJsonText) break;
  }

  // Attempt 2: If JSON mode failed, try standard call
  if (!rawJsonText) {
    await delay(1000);
    for (const model of MODELS.slice(0, 2)) {
      rawJsonText = await callGeminiModel(model, agentPrompt, false);
      if (rawJsonText) break;
    }
  }

  // Parse JSON
  if (rawJsonText) {
    try {
      const jsonStart = rawJsonText.indexOf('{');
      const jsonEnd = rawJsonText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = rawJsonText.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonStr);

        return {
          summary: cleanMarkdownText(parsed.summary || ''),
          identifiedIssue: cleanMarkdownText(parsed.identifiedIssue || 'Legal Guidance'),
          confidenceScore: Number(parsed.confidenceScore) || 92,
          coreRights: Array.isArray(parsed.coreRights)
            ? parsed.coreRights.map(cleanMarkdownText).filter(Boolean)
            : [],
          actionSteps: Array.isArray(parsed.actionSteps)
            ? parsed.actionSteps.map(cleanMarkdownText).filter(Boolean)
            : [],
          requiredDocuments: Array.isArray(parsed.requiredDocuments)
            ? parsed.requiredDocuments.map(cleanMarkdownText).filter(Boolean)
            : [],
          authority: {
            name: cleanMarkdownText(parsed.authority?.name || 'Concerned District Dispute Forum'),
            helpline: cleanMarkdownText(parsed.authority?.helpline || '1915 / NALSA 15100'),
            portal: cleanMarkdownText(parsed.authority?.portal || 'Official Government Portal'),
          },
          recommendedDraftTitle: cleanMarkdownText(parsed.recommendedDraftTitle || 'Formal Legal Notice'),
          draftTemplateId: matchDraftTemplateId(parsed.identifiedIssue || prompt),
        };
      }
    } catch (e) {
      console.warn('[KaydaSathi Agent] JSON parsing error:', e);
    }
  }

  // Fallback to statutory RAG engine
  console.warn('[KaydaSathi Agent] Using statutory RAG fallback');
  const localAnalysis: GeminiLegalAnalysis = analyzeLegalQueryWithGemini(prompt);
  return {
    summary: cleanMarkdownText(localAnalysis.summaryInPlainLanguage),
    identifiedIssue: cleanMarkdownText(localAnalysis.identifiedIssue),
    confidenceScore: localAnalysis.confidenceScore,
    coreRights: localAnalysis.rightsAndRemedies.map(cleanMarkdownText),
    actionSteps: localAnalysis.suggestedNextSteps.map(cleanMarkdownText),
    requiredDocuments: localAnalysis.requiredDocuments.map(cleanMarkdownText),
    authority: {
      name: cleanMarkdownText(localAnalysis.appropriateAuthority.name),
      helpline: cleanMarkdownText(localAnalysis.appropriateAuthority.helpline),
      portal: cleanMarkdownText(localAnalysis.appropriateAuthority.portal),
    },
    recommendedDraftTitle: 'Formal Complaint / Legal Notice',
    draftTemplateId: localAnalysis.draftTemplateId,
  };
}

/**
 * Backward compatibility wrapper that returns a clean plain text summary
 */
export async function askGeminiLegalAssistant(
  prompt: string,
  contextCategory: string = 'Indian Law',
  userLanguage: string = 'English'
): Promise<string> {
  const agentResponse = await askGeminiLegalAgent(prompt, userLanguage);
  return agentResponse.summary;
}

/**
 * Voice-Optimized Gemini Legal Guidance
 * Produces crisp, conversational, spoken-friendly guidance with ZERO asterisks or slashes
 */
export async function askGeminiVoiceAssistant(
  spokenQuery: string,
  userLanguage: string = 'English'
): Promise<string> {
  const agentResponse = await askGeminiLegalAgent(spokenQuery, userLanguage);
  
  const rightsSnippet = agentResponse.coreRights[0] ? ` Your legal right: ${agentResponse.coreRights[0]}.` : '';
  const stepSnippet = agentResponse.actionSteps[0] ? ` Next step: ${agentResponse.actionSteps[0]}.` : '';
  const authoritySnippet = agentResponse.authority.helpline ? ` You can contact ${agentResponse.authority.name} at helpline ${agentResponse.authority.helpline}.` : '';

  return cleanMarkdownText(`${agentResponse.summary}${rightsSnippet}${stepSnippet}${authoritySnippet}`);
}
