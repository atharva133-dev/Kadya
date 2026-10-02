/**
 * Multilingual Translations Dictionary for Kayda Sathi
 * Supports: English (EN), Hindi (HI), Marathi (MR), Gujarati (GU), Bengali (BN), Tamil (TA)
 */

export interface TranslationStrings {
  appName: string;
  appTagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  describeTitle: string;
  describeSubtitle: string;
  describePlaceholder: string;
  typeBtn: string;
  speakBtn: string;
  askLegalAi: string;
  view5Pillars: string;
  commonIssues: string;
  seeAll: string;
  housing: string;
  employment: string;
  consumer: string;
  banking: string;
  cybercrime: string;
  police: string;
  draftsTitle: string;
  draftsSubtitle: string;
  helplineTitle: string;
  helplineSubtitle: string;
  navHome: string;
  navCases: string;
  navGuides: string;
  navProfile: string;
  privacyBadge: string;
  infoBadge: string;
}

export const TRANSLATIONS: Record<string, TranslationStrings> = {
  EN: {
    appName: "Kayda Sathi",
    appTagline: "Your Rights. Your Next Steps.",
    heroHeadline: "Legal guidance for everyday problems",
    heroSubtitle: "Clear, practical steps under Indian law. Know your rights, required documents, and what to do next.",
    describeTitle: "Describe your legal issue",
    describeSubtitle: "Speak or type in simple words. Our Legal AI will identify your rights and next steps.",
    describePlaceholder: "Describe what happened in simple words (e.g. My landlord has not returned my security deposit)...",
    typeBtn: "Type",
    speakBtn: "Speak",
    askLegalAi: "Ask Legal AI",
    view5Pillars: "View 5-Pillar Action Plan",
    commonIssues: "Common Legal Issues",
    seeAll: "See all guides",
    housing: "Housing & Rental",
    employment: "Employment",
    consumer: "Consumer Rights",
    banking: "Banking & Finance",
    cybercrime: "Cybercrime",
    police: "Police & FIR",
    draftsTitle: "Complaint & Notice Drafts",
    draftsSubtitle: "Ready-to-send formal notices pre-filled with statutory sections",
    helplineTitle: "Free Legal Aid & Helplines",
    helplineSubtitle: "Connect with government NALSA clinics and official tribunals",
    navHome: "Home",
    navCases: "My Cases",
    navGuides: "Guides",
    navProfile: "Profile",
    privacyBadge: "Your information is private",
    infoBadge: "Information, not formal advocacy",
  },
  HI: {
    appName: "कायदा साथी",
    appTagline: "आपके अधिकार। आपके सही कदम।",
    heroHeadline: "रोजमर्रा की कानूनी समस्याओं में सही मार्गदर्शन",
    heroSubtitle: "भारतीय कानून के तहत स्पष्ट और व्यावहारिक कदम। अपने अधिकार, जरूरी दस्तावेज और आगे क्या करें जानें।",
    describeTitle: "अपनी कानूनी समस्या बताएं",
    describeSubtitle: "बोलकर या लिखकर बताएं। हमारी लीगल एआई आपके अधिकार और अगले कदम बताएगी।",
    describePlaceholder: "सरल शब्दों में बताएं कि क्या हुआ (जैसे: मकान मालिक सिक्योरिटी डिपॉजिट वापस नहीं कर रहा)...",
    typeBtn: "लिखें",
    speakBtn: "बोलें",
    askLegalAi: "लीगल एआई से पूछें",
    view5Pillars: "5-सूत्रीय कार्ययोजना देखें",
    commonIssues: "सामान्य कानूनी मुद्दे",
    seeAll: "सभी देखें",
    housing: "किराया व आवास",
    employment: "रोजगार व नौकरी",
    consumer: "उपभोक्ता अधिकार",
    banking: "बैंकिंग व ऋण",
    cybercrime: "साइबर अपराध",
    police: "पुलिस व एफआईआर",
    draftsTitle: "कानूनी नोटिस ड्राफ्ट",
    draftsSubtitle: "धाराओं के साथ तैयार औपचारिक नोटिस और शिकायत पत्र",
    helplineTitle: "मुफ्त कानूनी सलाह व हेल्पलाइन",
    helplineSubtitle: "सरकारी नालसा (NALSA) और आधिकारिक सहायता से जुड़ें",
    navHome: "होम",
    navCases: "मेरे केस",
    navGuides: "गाइड",
    navProfile: "प्रोफाइल",
    privacyBadge: "आपकी जानकारी सुरक्षित है",
    infoBadge: "जानकारी कानूनी जागरूकता हेतु है",
  },
  MR: {
    appName: "कायदा साथी",
    appTagline: "तुमचे हक्क. तुमची पुढची पावले.",
    heroHeadline: "दैनंदिन कायदेशीर समस्यांसाठी योग्य मार्गदर्शन",
    heroSubtitle: "भारतीय कायद्यानुसार सोपी आणि स्पष्ट पावले. तुमचे हक्क, आवश्यक कागदपत्रे आणि पुढील कृती जाणून घ्या.",
    describeTitle: "तुमची कायदेशीर समस्या सांगा",
    describeSubtitle: "बोलून किंवा लिहून सांगा. आमची लीगल एआय तुमचे हक्क आणि पुढील कृती सांगेल.",
    describePlaceholder: "साध्या शब्दांत सांगा काय घडले (उदा. घरमालक डिपॉझिट परत करत नाहीये)...",
    typeBtn: "लिहा",
    speakBtn: "बोला",
    askLegalAi: "लीगल एआय ला विचारा",
    view5Pillars: "5-सूत्रीय कृती आराखडा पहा",
    commonIssues: "नेहमीच्या कायदेशीर समस्या",
    seeAll: "सर्व मार्गदर्शक पहा",
    housing: "घर आणि भाडेकरू",
    employment: "नोकरी आणि कामगार",
    consumer: "ग्राहक हक्क",
    banking: "बँकिंग आणि वित्त",
    cybercrime: "सायबर गुन्हे",
    police: "पोलीस आणि एफआयआर",
    draftsTitle: "कायदेशीर नोटीस मसुदा",
    draftsSubtitle: "कलमांसह तयार औपचारिक कायदेशीर नोटिसा आणि अर्ज",
    helplineTitle: "मोफत कायदेशीर मदत आणि हेल्पलाइन",
    helplineSubtitle: "शासकीय नालसा (NALSA) व ग्राहक मंचाशी संपर्क साधा",
    navHome: "मुख्य",
    navCases: "माझे खटले",
    navGuides: "मार्गदर्शक",
    navProfile: "माझी माहिती",
    privacyBadge: "तुमची माहिती खाजगी राहते",
    infoBadge: "कायदेशीर साक्षरतेसाठी माहिती",
  },
  GU: {
    appName: "કાયદા સાથી",
    appTagline: "તમારા અધિકારો. તમારા આગલા પગલાં.",
    heroHeadline: "રોજિંદી કાનૂની સમસ્યાઓ માટે યોગ્ય માર્ગદર્શન",
    heroSubtitle: "ભારતીય કાયદા હેઠળ સરળ અને સ્પષ્ટ પગલાં. તમારા હકો, જરૂરી દસ્તાવેજો અને આગલી કાર્યવાહી જાણો.",
    describeTitle: "તમારી કાનૂની સમસ્યા જણાવો",
    describeSubtitle: "બોલીને અથવા લખીને જણાવો. અમારું લીગલ AI તમારા હકો અને આગલા પગલાં જણાવશે.",
    describePlaceholder: "સરળ શબ્દોમાં જણાવો કે શું બન્યું...",
    typeBtn: "લખો",
    speakBtn: "બોલો",
    askLegalAi: "લીગલ AI ને પૂછો",
    view5Pillars: "5-પગલાંની યોજના જુઓ",
    commonIssues: "સામાન્ય કાનૂની બાબતો",
    seeAll: "બધા માર્ગદર્શિકા જુઓ",
    housing: "ભાડું અને મકાન",
    employment: "નોકરી અને રોજગાર",
    consumer: "ગ્રાહક અધિકાર",
    banking: "બેંકિંગ અને નાણાં",
    cybercrime: "સાયબર ગુના",
    police: "પોલીસ અને FIR",
    draftsTitle: "કાનૂની નોટિસ ડ્રાફ્ટ",
    draftsSubtitle: "કાનૂની કલમો સાથે તૈયાર ઔપચારિક નોટિસ",
    helplineTitle: "મફત કાનૂની સહાય અને હેલ્પલાઇન",
    helplineSubtitle: "સરકારી સહાય અને હેલ્પલાઇન સાથે જોડાઓ",
    navHome: "હોમ",
    navCases: "મારા કેસ",
    navGuides: "ગાઇડ્સ",
    navProfile: "પ્રોફાઇલ",
    privacyBadge: "તમારી માહિતી ખાનગી છે",
    infoBadge: "કાનૂની જાગૃતિ માટે માહિતી",
  },
  BN: {
    appName: "কায়দা সাথী",
    appTagline: "আপনার অধিকার। আপনার পদক্ষেপ।",
    heroHeadline: "নিত্যদিনের আইনি সমস্যার সঠিক দিকনির্দেশনা",
    heroSubtitle: "ভারতীয় আইনের অধীনে স্পষ্ট ও বাস্তবসম্মত পদক্ষেপ। আপনার অধিকার ও প্রয়োজনীয় কাগজপত্র জানুন।",
    describeTitle: "আপনার আইনি সমস্যাটি বলুন",
    describeSubtitle: "কথা বলে বা লিখে জানান। আমাদের লিগ্যাল এআই আপনাকে সঠিক পথ দেখাবে।",
    describePlaceholder: "সহজ ভাষায় বলুন কী ঘটেছে...",
    typeBtn: "লিখুন",
    speakBtn: "বলুন",
    askLegalAi: "লিগ্যাল এআই-কে জিজ্ঞাসা করুন",
    view5Pillars: "৫-দফা অ্যাকশন প্ল্যান দেখুন",
    commonIssues: "সাধারণ আইনি সমস্যা",
    seeAll: "সব দেখুন",
    housing: "বাড়ি ও ভাড়া",
    employment: "চাকরি ও কর্মসংস্থান",
    consumer: "ভোক্তা অধিকার",
    banking: "ব্যাংকিং ও অর্থ",
    cybercrime: "সাইবার অপরাধ",
    police: "পুলিশ ও এফআইআর",
    draftsTitle: "আইনি নোটিশ ড্রাফট",
    draftsSubtitle: "প্রস্তুত আইনি নোটিশ ও অভিযোগের খসড়া",
    helplineTitle: "বিনামূল্যে আইনি সহায়তা ও হেল্পলাইন",
    helplineSubtitle: "সরকারি নালসা (NALSA) ও ট্রাইব্যুনালের সাথে যোগাযোগ",
    navHome: "হোম",
    navCases: "আমার কেস",
    navGuides: "গাইড",
    navProfile: "প্রোফাইল",
    privacyBadge: "আপনার তথ্য সম্পূর্ণ সুরক্ষিত",
    infoBadge: "আইনি সচেতনতার তথ্য",
  },
  TA: {
    appName: "காய்தா சாதி",
    appTagline: "உங்கள் உரிமைகள். உங்கள் அடுத்த கட்டம்.",
    heroHeadline: "அன்றாட சட்டச் சிக்கல்களுக்கான எளிய வழிகாட்டுதல்",
    heroSubtitle: "இந்திய சட்டத்தின் கீழ் எளிய மற்றும் தெளிவான வழிகாட்டுதல். உங்கள் உரிமைகள் மற்றும் ஆவணங்களை அறியவும்.",
    describeTitle: "உங்கள் சட்ட சிக்கலை விவரிக்கவும்",
    describeSubtitle: "பேசி அல்லது தட்டச்சு செய்து உங்கள் பிரச்சனையை சொல்லுங்கள்.",
    describePlaceholder: "எளிய வார்த்தைகளில் என்ன நடந்தது என்று விவரிக்கவும்...",
    typeBtn: "எழுதுக",
    speakBtn: "பேசுக",
    askLegalAi: "லீகல் AI யிடம் கேளுங்கள்",
    view5Pillars: "5-அடுக்கு திட்டத்தை பார்க்க",
    commonIssues: "பொதுவான சட்ட பிரச்சனைகள்",
    seeAll: "அனைத்தையும் பார்க்க",
    housing: "வீடு மற்றும் வாடகை",
    employment: "வேலைவாய்ப்பு",
    consumer: "நுகர்வோர் உரிமைகள்",
    banking: "வங்கி மற்றும் நிதி",
    cybercrime: "சைபர் கிரைம்",
    police: "காவல்துறை மற்றும் FIR",
    draftsTitle: "சட்ட நோட்டீஸ் வரைவு",
    draftsSubtitle: "முன்கூட்டியே தயாரிக்கப்பட்ட சட்ட அறிவிப்புகள்",
    helplineTitle: "இலவச சட்ட உதவி மற்றும் ஹெல்ப்லைன்",
    helplineSubtitle: "அரசு இலவச சட்ட உதவி மையங்கள்",
    navHome: "முகப்பு",
    navCases: "என் வழக்குகள்",
    navGuides: "வழிகாட்டிகள்",
    navProfile: "சுயவிவரம்",
    privacyBadge: "உங்கள் தகவல் பாதுகாப்பானது",
    infoBadge: "சட்ட விழிப்புணர்வு தகவல்",
  },
};

export function getTranslation(languageCode: string = 'EN'): TranslationStrings {
  return TRANSLATIONS[languageCode] || TRANSLATIONS.EN;
}
