// src/chatbot-configurations.ts

export type FlowStepType = "options" | "input";
export type OptionAction = "OPEN_LINK" | "NONE";

export interface FlowOption {
  text: string;
  botResponse: string;
  nextState: string;
  service?: string;
  action?: OptionAction;
  link?: string;
}

export interface FlowStepOptions {
  question: string;
  type: "options";
  options: FlowOption[];
}

export interface FlowStepInput {
  question: string;
  type: "input";
  inputType: "text" | "email" | "phone" | "company" | string;
  submitOnCompletion?: boolean;
  botResponse?: string;
  nextState?: string;
}

export type FlowStep = FlowStepOptions | FlowStepInput;

export type APIType = "PRODUCT_REQUEST" | "LEAD" | "NONE";

export interface ClientConfiguration {
  brandName: string;
  flow: Record<string, FlowStep>;
  apiUrl?: string;
  apiType?: APIType;
}

export const clientConfigurations: Record<string, ClientConfiguration> = {
  thebotagency: {
    brandName: "PJ Money Power",
    apiUrl: "https://your-backend-domain.com",
    apiType: "LEAD",
    flow: {
      INITIAL: {
        question: "What brings you here today?",
        type: "options",
        options: [
          {
            text: "🏦 Apply for a Business Loan",
            botResponse: "Great! Let’s start with your loan details.",
            nextState: "LOAN_AMOUNT",
            service: "Business Loan",
          },
          {
            text: "💳 Personal Loan Options",
            botResponse: "Sure — personal loans are important!",
            nextState: "LOAN_AMOUNT",
            service: "Personal Loan",
          },
          {
            text: "📈 Investment Opportunities",
            botResponse: "Investment is a smart choice!",
            nextState: "LOAN_AMOUNT",
            service: "Investment",
          },
          {
            text: "❓ Just exploring",
            botResponse: "No worries, feel free to browse!",
            nextState: "END",
          },
        ],
      },

      LOAN_AMOUNT: {
        question: "What loan amount are you looking for?",
        type: "options",
        options: [
          { text: "₹1–5 Lakhs", botResponse: "Noted.", nextState: "LOAN_PURPOSE" },
          { text: "₹5–10 Lakhs", botResponse: "Got it.", nextState: "LOAN_PURPOSE" },
          { text: "₹10–25 Lakhs", botResponse: "Okay.", nextState: "LOAN_PURPOSE" },
          { text: "Above ₹25 Lakhs", botResponse: "Understood.", nextState: "LOAN_PURPOSE" },
        ],
      },

      LOAN_PURPOSE: {
        question: "What’s the primary purpose of your loan?",
        type: "options",
        options: [
          {
            text: "🧵 Textile / Garment Business (Tirupur focus)",
            botResponse: "Textile noted.",
            nextState: "REPAYMENT",
          },
          {
            text: "🏭 Manufacturing / Expansion",
            botResponse: "Manufacturing noted.",
            nextState: "REPAYMENT",
          },
          {
            text: "💻 Tech / Startup Growth",
            botResponse: "Tech startup noted.",
            nextState: "REPAYMENT",
          },
          {
            text: "🏠 Personal Use (Education, Home, Medical)",
            botResponse: "Personal use noted.",
            nextState: "REPAYMENT",
          },
        ],
      },

      REPAYMENT: {
        question: "What repayment duration are you comfortable with?",
        type: "options",
        options: [
          { text: "6–12 Months", botResponse: "6–12 months noted.", nextState: "BUSINESS_STATUS" },
          { text: "12–24 Months", botResponse: "12–24 months noted.", nextState: "BUSINESS_STATUS" },
          { text: "24–36 Months", botResponse: "24–36 months noted.", nextState: "BUSINESS_STATUS" },
          { text: "Flexible / Need Advisor Help", botResponse: "Flexibility noted.", nextState: "BUSINESS_STATUS" },
        ],
      },

      BUSINESS_STATUS: {
        question: "Do you currently run a registered business?",
        type: "options",
        options: [
          {
            text: "✅ Yes, I have GST / Business Registration",
            botResponse: "Great!",
            nextState: "CREDIT_HISTORY",
          },
          {
            text: "🚀 I’m starting soon (startup idea)",
            botResponse: "Good luck!",
            nextState: "CREDIT_HISTORY",
          },
          {
            text: "❌ No, looking for personal loan only",
            botResponse: "Noted.",
            nextState: "CREDIT_HISTORY",
          },
        ],
      },

      CREDIT_HISTORY: {
        question: "How would you describe your credit history?",
        type: "options",
        options: [
          { text: "🌟 Excellent (750+)", botResponse: "Excellent credit!", nextState: "FOLLOW_UP" },
          { text: "👍 Good (650–749)", botResponse: "Good credit.", nextState: "FOLLOW_UP" },
          { text: "🟡 Fair (550–649)", botResponse: "Fair credit.", nextState: "FOLLOW_UP" },
          {
            text: "❓ Not sure / Need help checking",
            botResponse: "We can help check that.",
            nextState: "FOLLOW_UP",
          },
        ],
      },

      FOLLOW_UP: {
        question: "How would you like us to connect with you?",
        type: "options",
        options: [
          {
            text: "📞 Call me",
            botResponse: "Please enter your phone number.",
            nextState: "COLLECT_PHONE",
            action: "NONE",
          },
          {
            text: "📧 Email me",
            botResponse: "Please enter your email address.",
            nextState: "COLLECT_EMAIL",
            action: "NONE",
          },
          {
            text: "📍 Schedule an appointment",
            botResponse: "Please enter your contact details so we can schedule.",
            nextState: "COLLECT_PHONE",
            action: "NONE",
          },
          {
            text: "💬 WhatsApp me",
            botResponse: "Please enter your phone number (use +91).",
            nextState: "COLLECT_PHONE",
            action: "NONE",
          },
        ],
      },

      COLLECT_EMAIL: {
        question: "Enter your email address:",
        type: "input",
        inputType: "email",
        submitOnCompletion: true,
        botResponse: "Thanks — we will contact you via email shortly.",
        nextState: "END",
      },

      COLLECT_PHONE: {
        question: "Enter your phone number:",
        type: "input",
        inputType: "phone",
        submitOnCompletion: true,
        botResponse: "Thanks — we will call/WhatsApp you soon.",
        nextState: "END",
      },

      COLLECT_COMPANY_GS: {
        question: "Please enter your company name:",
        type: "input",
        inputType: "company",
        submitOnCompletion: true,
        botResponse: "Thanks — company recorded.",
        nextState: "END",
      },

      END: { question: "", type: "options", options: [] },
    },
  },

  example_product_client: {
    brandName: "Example Products",
    apiUrl: "https://your-product-api.com",
    apiType: "PRODUCT_REQUEST",
    flow: {
      INITIAL: {
        question: "Which product are you interested in?",
        type: "options",
        options: [
          {
            text: "Product A",
            botResponse: "Nice choice!",
            nextState: "COLLECT_EMAIL",
            service: "Product A",
          },
          {
            text: "Product B",
            botResponse: "Good pick!",
            nextState: "COLLECT_EMAIL",
            service: "Product B",
          },
        ],
      },
      COLLECT_EMAIL: {
        question: "Enter your email to receive product details:",
        type: "input",
        inputType: "email",
        submitOnCompletion: true,
        botResponse: "Thanks — product details are on the way.",
        nextState: "END",
      },
      END: { question: "", type: "options", options: [] },
    },
  },
};
