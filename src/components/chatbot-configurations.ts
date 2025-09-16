export interface FlowOption {
  text: string;
  botResponse: string;
  nextState: string;
}

export interface FlowStep {
  question: string;       // <-- added this
  type: 'options';
  options: FlowOption[];
}

export interface ClientConfiguration {
  brandName: string;
  flow: Record<string, FlowStep>;
}

export const clientConfigurations: Record<string, ClientConfiguration> = {
  thebotagency: {
    brandName: 'PJ Money Power',  // <-- changed this
    flow: {
      INITIAL: {
        question: 'What brings you here today?',
        type: 'options',
        options: [
          { text: '🏦 Apply for a Business Loan', botResponse: 'Great! Let’s start with your loan details.', nextState: 'LOAN_AMOUNT' },
          { text: '💳 Personal Loan Options', botResponse: 'Sure, personal loans are important!', nextState: 'LOAN_AMOUNT' },
          { text: '📈 Investment Opportunities', botResponse: 'Investment is a smart choice!', nextState: 'LOAN_AMOUNT' },
          { text: '❓ Just exploring', botResponse: 'No worries, feel free to browse!', nextState: 'END' }
        ]
      },

      LOAN_AMOUNT: {
        question: 'What loan amount are you looking for?',
        type: 'options',
        options: [
          { text: '₹1–5 Lakhs', botResponse: 'Noted.', nextState: 'LOAN_PURPOSE' },
          { text: '₹5–10 Lakhs', botResponse: 'Got it.', nextState: 'LOAN_PURPOSE' },
          { text: '₹10–25 Lakhs', botResponse: 'Okay.', nextState: 'LOAN_PURPOSE' },
          { text: 'Above ₹25 Lakhs', botResponse: 'Understood.', nextState: 'LOAN_PURPOSE' }
        ]
      },

      LOAN_PURPOSE: {
        question: 'What’s the primary purpose of your loan?',
        type: 'options',
        options: [
          { text: '🧵 Textile / Garment Business (Tirupur focus)', botResponse: 'Textile noted.', nextState: 'REPAYMENT' },
          { text: '🏭 Manufacturing / Expansion', botResponse: 'Manufacturing noted.', nextState: 'REPAYMENT' },
          { text: '💻 Tech / Startup Growth', botResponse: 'Tech startup noted.', nextState: 'REPAYMENT' },
          { text: '🏠 Personal Use (Education, Home, Medical)', botResponse: 'Personal use noted.', nextState: 'REPAYMENT' }
        ]
      },

      REPAYMENT: {
        question: 'What repayment duration are you comfortable with?',
        type: 'options',
        options: [
          { text: '6–12 Months', botResponse: '6–12 months noted.', nextState: 'BUSINESS_STATUS' },
          { text: '12–24 Months', botResponse: '12–24 months noted.', nextState: 'BUSINESS_STATUS' },
          { text: '24–36 Months', botResponse: '24–36 months noted.', nextState: 'BUSINESS_STATUS' },
          { text: 'Flexible / Need Advisor Help', botResponse: 'Flexibility noted.', nextState: 'BUSINESS_STATUS' }
        ]
      },

      BUSINESS_STATUS: {
        question: 'Do you currently run a registered business?',
        type: 'options',
        options: [
          { text: '✅ Yes, I have GST / Business Registration', botResponse: 'Great!', nextState: 'CREDIT_HISTORY' },
          { text: '🚀 I’m starting soon (startup idea)', botResponse: 'Good luck!', nextState: 'CREDIT_HISTORY' },
          { text: '❌ No, looking for personal loan only', botResponse: 'Noted.', nextState: 'CREDIT_HISTORY' }
        ]
      },

      CREDIT_HISTORY: {
        question: 'How would you describe your credit history?',
        type: 'options',
        options: [
          { text: '🌟 Excellent (750+)', botResponse: 'Excellent credit!', nextState: 'FOLLOW_UP' },
          { text: '👍 Good (650–749)', botResponse: 'Good credit.', nextState: 'FOLLOW_UP' },
          { text: '🟡 Fair (550–649)', botResponse: 'Fair credit.', nextState: 'FOLLOW_UP' },
          { text: '❓ Not sure / Need help checking', botResponse: 'We can help check that.', nextState: 'FOLLOW_UP' }
        ]
      },

      FOLLOW_UP: {
        question: 'How would you like us to connect with you?',
        type: 'options',
        options: [
          { text: '📞 Call me', botResponse: 'Call +91 9944264799', nextState: 'END' },
          { text: '💬 WhatsApp me', botResponse: 'WhatsApp +91 9944264799.', nextState: 'END' },
          { text: '📧 Email me', botResponse: 'email info@pjmoneypower.com.', nextState: 'END' },
          { text: '📍 Schedule an appointment', botResponse: 'Appointment scheduled.', nextState: 'END' }
        ]
      },

      END: {
        question: '',
        type: 'options',
        options: []
      }
    }
  }
};
