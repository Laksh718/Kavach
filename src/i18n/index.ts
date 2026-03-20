import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const enCommon = {
  brand: 'KAVACH',
  tagline: 'Income Protection for Gig Workers',
  buttons: {
    startProtection: 'Start Protection — ₹350/week',
    seeHowItWorks: 'See how it works ↓',
    openDashboard: 'Open My Dashboard →',
    protectIncome: 'Protect My Income →',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    pause: 'Pause Policy',
    cancel: 'Cancel Policy',
    upgrade: 'Upgrade Plan',
    download: 'Download',
    tryAgain: 'Try Again',
  },
  status: {
    active: 'Active',
    paused: 'Paused',
    lapsed: 'Lapsed',
    processing: 'Processing',
    completed: 'Completed',
    verified: 'Verified',
    pending: 'Pending',
    failed: 'Failed',
  },
  labels: {
    weeklyPremium: 'Weekly Premium',
    coverage: 'Coverage',
    payout: 'Payout',
    earnings: 'Earnings',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    zone: 'Zone',
    city: 'City',
    policy: 'Policy',
    plan: 'Plan',
    score: 'Score',
  },
  nav: {
    home: 'Home',
    policy: 'My Policy',
    payouts: 'Payouts',
    zoneMap: 'Zone Map',
    trustKarma: 'TrustKarma',
    settings: 'Settings',
  },
}

const hiCommon = {
  brand: 'कवच',
  tagline: 'गिग वर्कर्स के लिए आय सुरक्षा',
  buttons: {
    startProtection: 'सुरक्षा शुरू करें — ₹350/सप्ताह',
    seeHowItWorks: 'देखें यह कैसे काम करता है ↓',
    openDashboard: 'डैशबोर्ड खोलें →',
    protectIncome: 'मेरी आय सुरक्षित करें →',
    getStarted: 'शुरू करें',
    learnMore: 'और जानें',
    back: 'वापस',
    next: 'आगे',
    submit: 'जमा करें',
    pause: 'पॉलिसी रोकें',
    cancel: 'पॉलिसी रद्द करें',
    upgrade: 'अपग्रेड करें',
    download: 'डाउनलोड',
    tryAgain: 'पुनः प्रयास करें',
  },
  status: {
    active: 'सक्रिय',
    paused: 'रुका हुआ',
    lapsed: 'समाप्त',
    processing: 'प्रक्रिया में',
    completed: 'पूर्ण',
    verified: 'सत्यापित',
    pending: 'लंबित',
    failed: 'विफल',
  },
  labels: {
    weeklyPremium: 'साप्ताहिक प्रीमियम',
    coverage: 'कवरेज',
    payout: 'भुगतान',
    earnings: 'कमाई',
    today: 'आज',
    thisWeek: 'इस सप्ताह',
    thisMonth: 'इस महीने',
    zone: 'क्षेत्र',
    city: 'शहर',
    policy: 'पॉलिसी',
    plan: 'योजना',
    score: 'स्कोर',
  },
  nav: {
    home: 'होम',
    policy: 'मेरी पॉलिसी',
    payouts: 'भुगतान',
    zoneMap: 'ज़ोन मैप',
    trustKarma: 'ट्रस्ट कर्मा',
    settings: 'सेटिंग्स',
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      hi: { common: hiCommon },
    },
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
