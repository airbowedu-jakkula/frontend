// Step-by-step guidance and document checklists for each US nonimmigrant visa category.

export const GENERAL_STEPS = [
  {
    step: "1",
    title: "Create your official consular scheduling account",
    body: "Register your account on the official US Visa appointment portal for your region (e.g., usvisascheduling.com / ais.usvisa-info.com). Use a single email address per primary applicant.",
  },
  {
    step: "2",
    title: "Complete the online Form DS-160",
    body: "Fill out the DS-160 carefully, provide accurate 5-year social media handle and employment history, upload a compliant photo, and save the 10-character confirmation barcode (e.g., AA00XXXXXX).",
  },
  {
    step: "3",
    title: "Pay the MRV visa application fee",
    body: "Generate the payment Challan or initiate EFT/UPI/Credit Card payment. Keep the receipt and reference number. System verification can take up to 24–48 hours to activate slot calendar.",
  },
  {
    step: "4",
    title: "Schedule Biometrics (VAC/OFC) and Consular Interview",
    body: "Pick your preferred consular post and book two consecutive appointments: Step 1 at the Visa Application Center (VAC) for fingerprints & photo, and Step 2 for the Consular Interview.",
  },
  {
    step: "5",
    title: "Attend Biometrics appointment at VAC",
    body: "Carry your original valid passport, DS-160 confirmation page with barcode, and appointment confirmation letter. Arrive 15 minutes before your scheduled window.",
  },
  {
    step: "6",
    title: "Attend Consular Interview with categorized document binder",
    body: "Arrive at the US Embassy/Consulate with your complete category document checklist. Answer consular questions truthfully, confidently, and concisely.",
  },
  {
    step: "7",
    title: "Track passport return and visa stamping",
    body: "Upon approval, your passport is returned via your chosen courier delivery or premium pickup location within 3 to 7 business days with the visa foil stamped.",
  },
];

export const CATEGORY_PROCEDURES = {
  "B1/B2": {
    label: "B1/B2 — Business, Tourism & Family Visitor Visa",
    subtitle: "Business, Tourism & Medical",
    icon: "✈️",
    tagline: "Short-term temporary visits for business meetings, conferences, tourism, visiting relatives, or medical treatment.",
    image: "/b1-b2-tourism.jpg",
    imageAlt: "Tourists visiting New York landmarks in USA",
    fee: "$185 USD (MRV Fee)",
    validity: "Up to 10 Years (Multiple Entry for most nationalities)",
    steps: [
      {
        title: "Determine your primary purpose of travel",
        body: "B-1 covers business consultations, conferences, and negotiating contracts. B-2 covers tourism, vacations, visiting family/friends, and medical visits. Most applicants receive combined B1/B2.",
      },
      {
        title: "Complete DS-160 with clear travel itinerary",
        body: "List planned travel dates, contact person or hotel in the US, funding source, and 5-year travel & social media history. Ensure details match supporting documents.",
      },
      {
        title: "Pay MRV fee ($185) and check Interview Waiver eligibility",
        body: "If renewing an expired B1/B2 visa within 48 months of expiry with no prior refusals, you may qualify for the Dropbox Interview Waiver.",
      },
      {
        title: "Book VAC Biometrics and Consular Interview slots",
        body: "Select appointment slots for VAC (biometrics) and Consular post. Monitor our live tracker for early cancellation batch releases.",
      },
      {
        title: "Prepare strong evidence of ties to home country (Section 214(b))",
        body: "Every B1/B2 applicant is presumed an intending immigrant under US law until proven otherwise. Prepare solid proof of permanent employment, family ties, and property.",
      },
    ],
    vacChecklist: [
      "Original valid Passport (must be valid for at least 6 months beyond intended stay in the US)",
      "All expired / previous passports containing prior US visas or travel stamps",
      "Form DS-160 Confirmation Page with high-resolution 10-digit CEAC barcode",
      "Official VAC Appointment Confirmation Page (printed copy)",
      "1 Passport-sized photograph (2x2 inches / 51x51 mm, white background, matte/glossy, no eyeglasses) — required if applying for children under 14",
    ],
    interviewChecklist: [
      "Original Passport(s) + DS-160 confirmation page + Consular Appointment confirmation letter",
      "Financial Solvency Proof: Last 6 months bank statements with official bank stamp/seal, fixed deposit certificates, mutual funds, salary accounts",
      "Employment & Leave Proof: Official letter from employer on company letterhead confirming role, tenure, monthly salary, and approved leave dates",
      "Tax Proof: Last 3 years Income Tax Returns (ITR-V) / Form 16 / W-2 equivalents",
      "Travel Itinerary: Day-by-day tentative travel schedule, hotel reservations, and round-trip flight estimates (do not purchase non-refundable tickets prior to visa approval)",
      "Ties to Home Country: Property ownership deeds, business registration documents, family dependency certificates",
      "If Visiting Friends / Relatives: Invitation letter from host, copy of host's US Passport / Green Card / valid Visa & I-94, and host's recent bank statement / Form I-134 (if sponsoring)",
      "If B-1 Business Travel: Official invitation letter from US company/partner, conference registration receipt, and company sponsorship guarantee letter",
    ],
    dropboxChecklist: [
      "Current valid passport + previous passport containing the most recent US B1/B2 visa",
      "DS-160 Confirmation Page with scannable barcode",
      "Dropbox Submission / Appointment Confirmation Letter with UID barcode",
      "Two identical 2x2 inch color photos taken within the last 6 months according to US State Dept specifications (neutral expression, white background, no eyewear)",
      "Photocopy of previous US visa if inside an old passport",
    ],
    consularTips: [
      "Be concise: Answer only what the consular officer asks. Keep answers direct and confident.",
      "Explain your home ties clearly: Speak about your current job, career growth in home country, family responsibilities, and upcoming commitments.",
      "Do not memorize scripted answers: Natural, honest responses are valued most by visa officers.",
    ],
  },

  "F1/F2": {
    label: "F1/F2 — Academic Student & Dependent Visa",
    subtitle: "Undergraduate & Graduate Students",
    icon: "🎓",
    tagline: "For international students enrolled in full-time academic degree programs at SEVP-certified US colleges and universities.",
    image: "/f1-f2-students.jpg",
    imageAlt: "International university students on campus in USA",
    fee: "$185 USD (MRV Fee) + $350 USD (SEVIS I-901 Fee)",
    validity: "Duration of Status (D/S) — covers full program length",
    steps: [
      {
        title: "Secure admission and obtain Form I-20",
        body: "Apply and get accepted by a SEVP-approved school. The university Designated School Official (DSO) will generate and sign your official Form I-20.",
      },
      {
        title: "Pay the mandatory SEVIS I-901 Fee ($350)",
        body: "Pay the fee online at fmjfee.com using your SEVIS ID (starts with N) and print the official receipt. F-2 dependents do not pay a separate SEVIS fee.",
      },
      {
        title: "Complete Form DS-160 with school & SEVIS details",
        body: "Select Student (F-1) as visa class. Accurately enter your SEVIS ID and school address as printed on your I-20.",
      },
      {
        title: "Pay MRV fee ($185) and schedule VAC + Consular Interview",
        body: "F-1 student visa interviews can be scheduled up to 365 days before the program start date listed on Form I-20.",
      },
      {
        title: "Prepare funding evidence for Year 1 tuition & living expenses",
        body: "Consular officers will scrutinize your ability to pay for your education without unauthorized employment in the US.",
      },
    ],
    vacChecklist: [
      "Original valid Passport (valid for at least 6 months beyond program start date)",
      "Form DS-160 Confirmation Page with clear barcode",
      "Official VAC Appointment Confirmation Letter",
      "MRV Visa Fee payment receipt copy",
    ],
    interviewChecklist: [
      "Original Form I-20 signed by University DSO and applicant (page 1 and page 2)",
      "Official SEVIS I-901 Fee payment receipt printed from fmjfee.com",
      "Official University Admission / Acceptance Letter & Scholarship Award letter (if applicable)",
      "Financial Support Documentation: Bank loan sanction letter, bank account statements (last 6 months), sponsor affidavit of support (Form I-134), fixed deposit certificates",
      "Academic Credentials: Original Bachelor's/School Degree certificate, provisional certificate, consolidated mark sheets/transcripts",
      "Standardized Test Score Reports: GRE, GMAT, TOEFL, IELTS, SAT, ACT score cards",
      "Detailed Resume / Curriculum Vitae highlighting education, academic projects, and research work",
      "If F-2 Dependent: Dependent Form I-20, original Marriage Certificate with wedding photos, Child's Birth Certificate, primary F1 student's passport and visa copies",
    ],
    consularTips: [
      "Know your program: Be prepared to explain why you chose this specific university and curriculum over other options.",
      "Explain your post-graduation career plan: Articulate how this degree will help you secure higher-paying positions in your home country.",
      "Understand your finances: Know the exact cost of attendance and who is funding your education.",
    ],
  },

  "H1B/H4": {
    label: "H1B/H4 — Specialty Occupation Work & Dependent Visa",
    subtitle: "Specialty Occupation Professionals",
    icon: "💼",
    tagline: "For professionals in specialty occupations requiring theoretical and practical application of a body of highly specialized knowledge.",
    image: "/h1-h4-work.jpg",
    imageAlt: "Tech and specialty occupation professionals in modern office in USA",
    fee: "$205 USD (MRV Fee)",
    validity: "Up to 3 Years initially, extendable up to 6+ Years with approved I-140",
    steps: [
      {
        title: "Employer files Form I-129 and obtains USCIS approval",
        body: "Your US employer files the petition with USCIS. You must wait for Form I-797 (Notice of Action) Approval Notice before booking consular appointments.",
      },
      {
        title: "Complete DS-160 with Petition Details",
        body: "Select Temporary Worker (H-1B). Enter the I-129 Receipt Number (e.g., WAC, EAC, LIN, IOE) and employer's corporate details.",
      },
      {
        title: "Pay MRV fee ($205) and schedule VAC + Consular Interview",
        body: "Pay the application fee and schedule your Biometrics (VAC) and Consular Interview appointments.",
      },
      {
        title: "Schedule dependent appointments together",
        body: "H-4 spouses and children can be scheduled as dependents under the primary applicant's profile for the same interview slot.",
      },
    ],
    vacChecklist: [
      "Original valid Passport",
      "All previous passports with prior US visas",
      "DS-160 Confirmation Page with clear barcode",
      "Appointment Confirmation Letter",
    ],
    interviewChecklist: [
      "Original Form I-797 (Notice of Action) Approval Notice",
      "Complete copy of Form I-129 petition as filed with USCIS",
      "Certified Labor Condition Application (LCA) Form ETA-9035",
      "Official Employment Verification Letter from petitioning employer stating job title, duties, work location, and annual salary",
      "End-Client Letter & Vendor Agreement (essential if working on a third-party client site or consulting model)",
      "Recent Pay Stubs (last 3 to 6 months) and Form W-2 / Federal Tax Returns (for extensions or transfers)",
      "Educational Degree Certificates, University Transcripts, and Academic Credential Evaluation",
      "State Professional License (if required for the occupation, e.g., healthcare, engineering)",
      "If H-4 Dependent: Original Marriage Certificate, wedding album / photographs, child birth certificates, primary H-1B holder's I-797 approval copy, passport, visa & I-94 copy, recent 3 months pay stubs",
    ],
    consularTips: [
      "Know your employer & client: Clearly describe your daily engineering/specialized duties and client project scope.",
      "Carry complete wage proof: Ensure your salary matches or exceeds the prevailing wage listed on the certified LCA.",
      "Keep original I-797 safe: Consular officers require the approval notice to issue the visa foil.",
    ],
  },

  "L1/L2": {
    label: "L1/L2 — Intra-Company Executive & Manager Transfer",
    subtitle: "Executives & Specialized Knowledge",
    icon: "🏢",
    tagline: "For executives, managers (L-1A), or specialized knowledge personnel (L-1B) transferring to a US branch, affiliate, or subsidiary.",
    image: "/l1-l2-corporate.jpg",
    imageAlt: "Executive corporate business transfer in USA",
    fee: "$205 USD (MRV Fee) + $500 Fraud Prevention Fee (for Blanket petitions)",
    validity: "Up to 7 Years (L-1A Managers) / Up to 5 Years (L-1B Specialized)",
    steps: [
      {
        title: "Confirm qualifying 1-year foreign employment",
        body: "You must have been employed abroad continuously for at least 1 full year within the past 3 years by the qualifying foreign affiliate.",
      },
      {
        title: "Obtain Form I-129S (Blanket L) or Individual I-797 Approval",
        body: "For Blanket L petitions, your company provides Form I-129S (3 copies) and the Blanket I-797 approval. For individual petitions, obtain the USCIS I-797 notice.",
      },
      {
        title: "Complete Form DS-160 and pay MRV fee",
        body: "Enter the petition number and parent/subsidiary organization details accurately.",
      },
      {
        title: "Attend VAC and Consular Interview",
        body: "Bring 3 sets of Form I-129S and fee receipts to the interview window for consular adjudication.",
      },
    ],
    vacChecklist: [
      "Original valid Passport",
      "DS-160 Confirmation Page",
      "VAC Appointment Confirmation Letter",
    ],
    interviewChecklist: [
      "Three (3) original signed copies of Form I-129S (for Blanket L applicants)",
      "Copy of Blanket L-1 Approval Notice Form I-797",
      "Original Form I-797 Approval Notice (for Individual L-1 petitions)",
      "Detailed Company Transfer Letter outlining your executive/managerial authority or specialized knowledge",
      "Proof of 1 continuous year of employment abroad (foreign pay slips, tax returns, employment contract)",
      "US and Foreign Company Organizational Chart showing your reporting structure and direct reports (for L-1A Managers)",
      "If L-2 Dependent: Marriage certificate, birth certificates, primary L1 holder's passport, visa & I-94 copy",
    ],
    consularTips: [
      "For L-1A: Highlight your managerial duties, budget authority, and personnel management rather than technical day-to-day execution.",
      "For L-1B: Clearly explain why your proprietary specialized knowledge is unique to your company and cannot be easily trained to a US worker.",
    ],
  },

  "J1/J2": {
    label: "J1/J2 — Exchange Visitors, Scholars & Physicians",
    subtitle: "Exchange Scholars & Medical Trainees",
    icon: "🔬",
    tagline: "For research scholars, professors, medical trainees, summer work travel participants, and cultural exchange visitors.",
    image: "/j1-j2-scholars.jpg",
    imageAlt: "Exchange scholars and researchers in USA",
    fee: "$185 USD (MRV Fee) + $220 USD (SEVIS Fee)",
    validity: "Duration of Exchange Program listed on Form DS-2019",
    steps: [
      {
        title: "Obtain Form DS-2019 from designated sponsor",
        body: "Your designated exchange sponsor organization issues Certificate of Eligibility Form DS-2019.",
      },
      {
        title: "Pay the SEVIS I-901 Fee ($220)",
        body: "Pay the fee online at fmjfee.com using your SEVIS program number.",
      },
      {
        title: "Complete DS-160 and schedule appointments",
        body: "Fill out Form DS-160, pay the MRV fee, and book your VAC biometrics + consular interview.",
      },
    ],
    vacChecklist: [
      "Original valid Passport",
      "DS-160 Confirmation Page",
      "Appointment Confirmation Letter",
    ],
    interviewChecklist: [
      "Original Form DS-2019 signed by the Responsible Officer (RO/ARO) and applicant",
      "Form DS-7002 (Training / Internship Placement Plan) — required for Trainee and Intern categories",
      "Official SEVIS I-901 Fee payment receipt",
      "Exchange Program Sponsor Acceptance Letter and research proposal summary",
      "Proof of financial support / stipend covering the exchange stay",
      "Proof of intent to return to home country upon program completion (Section 212(e) two-year home country physical presence requirement acknowledgement)",
      "If J-2 Dependent: Dependent DS-2019, marriage certificate, birth certificates",
    ],
    consularTips: [
      "Understand Section 212(e): Be prepared to discuss whether your program is subject to the two-year home residency requirement.",
      "Explain your exchange objectives: Clearly describe your research or training goals.",
    ],
  },

  "C1/D": {
    label: "C1/D — Transit & Airline / Maritime Crew Visa",
    subtitle: "Commercial Aviation & Maritime Crew",
    icon: "⚓",
    tagline: "For commercial flight crew members, cruise ship staff, and maritime vessel crew transiting through or operating in US waters.",
    image: "/c1-d-crew.jpg",
    imageAlt: "Aviation and maritime crew members in USA",
    fee: "$185 USD (MRV Fee)",
    validity: "Up to 5 Years (Multiple Entry)",
    steps: [
      {
        title: "Obtain employment / vessel joining contract",
        body: "Obtain an official letter from your airline, cruise line, or shipping management company confirming your crew status.",
      },
      {
        title: "Complete Form DS-160",
        body: "Select Transit / Crewmember (C1/D) as visa class.",
      },
      {
        title: "Pay MRV fee and schedule appointments",
        body: "C1/D applicants often qualify for expedited consular interview dates.",
      },
    ],
    vacChecklist: [
      "Original valid Passport (valid for at least 6 months)",
      "DS-160 Confirmation Page",
      "VAC Appointment Confirmation Letter",
    ],
    interviewChecklist: [
      "Continuous Discharge Certificate (CDC) / Seafarer's Discharge Book (for maritime crew)",
      "Official Letter of Guarantee / Vessel Joining Letter from shipping employer or airline employer",
      "Valid employment contract stating vessel name, port of entry, joining date, and position",
      "Previous CDC / sea service records and company ID card",
      "DS-160 Confirmation Page + Consular Appointment Letter",
    ],
    consularTips: [
      "Carry your original CDC book: Consular officers verify past sea service and maritime stamps.",
      "Have your vessel details ready: Know the vessel name, US port of entry, and agent contact details.",
    ],
  },

  "M1/M2": {
    label: "M1/M2 — Vocational & Non-Academic Student Visa",
    subtitle: "Flight School & Technical Trades",
    icon: "🛠️",
    tagline: "For international students enrolled in non-academic or vocational programs (flight training, culinary arts, cosmetology, technical trades).",
    image: "/m1-m2-vocational.jpg",
    imageAlt: "Vocational and technical students in USA",
    fee: "$185 USD (MRV Fee) + $350 USD (SEVIS Fee)",
    validity: "Up to 1 Year / Length of vocational program",
    steps: [
      {
        title: "Secure admission into an approved vocational school",
        body: "Obtain Form I-20 (M-1) issued by the SEVP-certified vocational or technical training institution.",
      },
      {
        title: "Pay the SEVIS I-901 Fee ($350)",
        body: "Pay the fee online at fmjfee.com using your SEVIS identification number.",
      },
      {
        title: "Complete Form DS-160 and schedule appointments",
        body: "Fill out Form DS-160, select Student (M-1), and schedule Biometrics (VAC) and Consular Interview slots.",
      },
    ],
    vacChecklist: [
      "Original valid Passport",
      "Form DS-160 Confirmation Page",
      "VAC Appointment Confirmation Letter",
      "MRV Fee Receipt",
    ],
    interviewChecklist: [
      "Original Form I-20 (M-1) signed by the Designated School Official (DSO) and student",
      "Official SEVIS I-901 Fee Payment Receipt",
      "Proof of full financial support covering all tuition and living expenses for the entire duration of the vocational program",
      "Educational certificates, high school diploma, and academic mark sheets",
      "Evidence of intent to depart the US upon completion of vocational training",
      "If M-2 Dependent: Dependent Form I-20 (M-2), marriage certificate, child birth certificates",
    ],
    consularTips: [
      "Explain your vocational goals: Clearly explain why this specialized trade or technical skill will lead to employment in your home country.",
      "Prove upfront funds: M-1 students must demonstrate immediate liquid funds to cover the entire program cost without working.",
    ],
  },

  "O1/O2/O3": {
    label: "O1/O2/O3 — Extraordinary Ability in Science, Arts, Business & Athletics",
    subtitle: "Individuals with Extraordinary Acclaim",
    icon: "⭐",
    tagline: "For individuals who possess extraordinary ability in sciences, arts, education, business, or athletics, or extraordinary achievement in motion picture/television.",
    image: "/j1-j2-scholars.jpg",
    imageAlt: "Extraordinary ability professionals in USA",
    fee: "$205 USD (MRV Fee)",
    validity: "Up to 3 Years initially, extendable in 1-year increments",
    steps: [
      {
        title: "US Employer or Agent files Form I-129 with USCIS",
        body: "Submit extensive evidence of sustained national or international acclaim, peer advisory consultation letters, and wait for Form I-797 approval.",
      },
      {
        title: "Complete DS-160 with approved petition number",
        body: "Enter the I-129 receipt number and petitioner/agent details.",
      },
      {
        title: "Schedule VAC and Consular Interview",
        body: "Book your appointment slots and assemble your comprehensive extraordinary achievements portfolio.",
      },
    ],
    vacChecklist: [
      "Original valid Passport",
      "DS-160 Confirmation Page",
      "Appointment Confirmation Letter",
    ],
    interviewChecklist: [
      "Original Form I-797 (Notice of Action) Approval Notice",
      "Complete copy of Form I-129 petition as filed with USCIS",
      "Written advisory opinion from the appropriate peer group, labor organization, or management organization",
      "Copy of written contract or summary of oral agreement between petitioner and beneficiary",
      "Evidence of extraordinary acclaim: Major international awards, press articles, scholarly citations, high commercial success, critical reviews",
      "Itinerary of events or performances with start and end dates",
      "If O-3 Dependent: Marriage certificate, birth certificates, primary O-1 holder's I-797 copy, passport & visa copy",
    ],
    consularTips: [
      "Be prepared to summarize your acclaim: Concisely articulate your groundbreaking contributions or unique expertise.",
      "Bring your portfolio highlights: Keep key awards, publications, and peer recommendations easily accessible.",
    ],
  },

  "P1/P2/P3": {
    label: "P1/P2/P3 — Athletes, Artists & Entertainment Groups",
    subtitle: "Internationally Recognized Athletes & Artists",
    icon: "🏆",
    tagline: "For internationally recognized athletes (P-1A), entertainment groups (P-1B), reciprocal exchange artists (P-2), and culturally unique performers (P-3).",
    image: "/b1-b2-tourism.jpg",
    imageAlt: "Athletes and entertainment groups in USA",
    fee: "$205 USD (MRV Fee)",
    validity: "Up to 5 Years for individual athletes / Length of event/tour",
    steps: [
      {
        title: "Obtain approved Form I-129 petition from USCIS",
        body: "Your US sponsor/agent files Form I-129 with consultation letters and event itinerary.",
      },
      {
        title: "Complete Form DS-160 and pay MRV fee",
        body: "Select the corresponding P visa classification.",
      },
      {
        title: "Schedule and attend VAC + Consular Interview",
        body: "Bring evidence of international competition rankings or group performance credentials.",
      },
    ],
    vacChecklist: [
      "Original valid Passport",
      "DS-160 Confirmation Page",
      "Appointment Confirmation Letter",
    ],
    interviewChecklist: [
      "Form I-797 Approval Notice",
      "Copy of approved Form I-129 petition",
      "Written consultation from an appropriate labor organization",
      "Event or tournament contract, competition itinerary, and dates",
      "Proof of international ranking, major league participation, or cultural uniqueness",
      "If P-4 Dependent: Marriage certificate, birth certificates, primary P visa holder's documents",
    ],
    consularTips: [
      "Highlight team/event schedule: Show the official tour dates and tournament participation confirmations.",
    ],
  },

  "E1/E2/E3": {
    label: "E1/E2/E3 — Treaty Traders, Investors & Australian Professionals",
    subtitle: "Treaty Traders & Enterprise Investors",
    icon: "📈",
    tagline: "For nationals of treaty countries engaging in substantial trade (E-1), investing substantial capital (E-2), or Australian specialty occupation professionals (E-3).",
    image: "/l1-l2-corporate.jpg",
    imageAlt: "Treaty traders and investors in USA",
    fee: "$315 USD (E-1/E-2) / $205 USD (E-3)",
    validity: "Up to 2 to 5 Years (Renewable indefinitely as long as qualifying)",
    steps: [
      {
        title: "Establish treaty qualification & substantial business enterprise",
        body: "For E-1/E-2, submit the comprehensive enterprise registration package with Form DS-156E. For E-3, obtain certified LCA from US Department of Labor.",
      },
      {
        title: "Complete Form DS-160 and pay fee",
        body: "Select Treaty Trader/Investor (E-1/E-2) or Australian Specialty Worker (E-3).",
      },
      {
        title: "Submit documentation to Consular E-Visa Unit and schedule interview",
        body: "Many consulates pre-screen E-visa company packages prior to the interview date.",
      },
    ],
    vacChecklist: [
      "Original valid Passport (must be a national of a qualifying treaty country)",
      "DS-160 Confirmation Page",
      "Appointment Confirmation Letter",
    ],
    interviewChecklist: [
      "For E-1/E-2: Completed Form DS-156E and full business dossier (business plan, tax returns, bank transfers, proof of substantial funds at risk, commercial leases, payroll records)",
      "For E-3: Certified Labor Condition Application (LCA Form ETA-9035), official job offer letter, and Bachelor's degree evaluation",
      "Company ownership and nationality proof (articles of incorporation, share certificates)",
      "Proof that enterprise is an active, operating commercial business and not marginal",
      "If E Dependents: Marriage certificate, birth certificates (E spouses are authorized to work in the US)",
    ],
    consularTips: [
      "Know your numbers: Be prepared to discuss revenue, investment figures, US job creation, and 5-year projections.",
      "Demonstrate active investment: Show that funds are committed and irrevocably placed at risk.",
    ],
  },

  "K1/K2": {
    label: "K1/K2 — Fiancé(e) of US Citizen & Minor Children",
    subtitle: "Fiancé(e) of U.S. Citizen",
    icon: "💍",
    tagline: "For foreign fiancé(e)s of US citizens traveling to the US to marry within 90 days of admission and adjust to permanent resident status.",
    image: "/statue-of-liberty.jpg",
    imageAlt: "Fiancé visa applicants in USA",
    fee: "$265 USD (MRV Fee)",
    validity: "Single Entry, valid for 6 Months (must marry within 90 days of entry)",
    steps: [
      {
        title: "US Citizen petitioner files Form I-129F with USCIS",
        body: "Submit proof of US citizenship, proof of meeting in person within the past 2 years, and intent to marry within 90 days.",
      },
      {
        title: "Case transfers to National Visa Center (NVC) and US Embassy",
        body: "Once USCIS approves the petition, NVC forwards the file to the consular post in the applicant's country.",
      },
      {
        title: "Complete Form DS-160 and complete authorized Medical Exam",
        body: "Schedule medical examination with an authorized panel physician prior to the interview.",
      },
      {
        title: "Attend Consular Immigrant/K-Visa Interview",
        body: "Present evidence of genuine romantic relationship and financial support.",
      },
    ],
    vacChecklist: [
      "Original valid Passport",
      "DS-160 Confirmation Page",
      "Appointment Confirmation Letter",
    ],
    interviewChecklist: [
      "Original Form I-797 approval notice for Form I-129F",
      "Official Sealed Medical Examination Report from authorized panel physician",
      "Original Birth Certificate and Police Clearance Certificates (from all countries lived in for 6+ months since age 16)",
      "Form I-134 (Affidavit of Support) signed by the US citizen petitioner with recent tax returns, W-2s, and bank statements",
      "Evidence of genuine relationship: Photos together across different dates, chat logs, flight boarding passes, hotel receipts, engagement proof",
      "Single status certificate / divorce decrees / death certificates terminating any prior marriages",
      "If K-2 Child: Original birth certificate, passport, medical exam",
    ],
    consularTips: [
      "Know your fiancé's background: Be familiar with their family, occupation, residential history, and daily life.",
      "Bring chronological relationship evidence: Organize photos and travel tickets by date.",
    ],
  },

  "R1/R2": {
    label: "R1/R2 — Religious Workers & Ministers",
    subtitle: "Ministers & Religious Vocations",
    icon: "⛪",
    tagline: "For ministers and individuals in religious vocations or occupations working for a bona fide non-profit religious organization in the US.",
    image: "/statue-of-liberty.jpg",
    imageAlt: "Religious workers in USA",
    fee: "$205 USD (MRV Fee)",
    validity: "Up to 30 Months initially, extendable up to 5 Years total",
    steps: [
      {
        title: "US Religious Organization files Form I-129 with USCIS",
        body: "Submit proof of 501(c)(3) tax-exempt status, religious denomination membership for at least 2 prior years, and obtain I-797 approval.",
      },
      {
        title: "Complete Form DS-160 and pay MRV fee",
        body: "Select Religious Worker (R-1).",
      },
      {
        title: "Attend VAC and Consular Interview",
        body: "Bring credentials of religious ordination or formal religious training.",
      },
    ],
    vacChecklist: [
      "Original valid Passport",
      "DS-160 Confirmation Page",
      "Appointment Confirmation Letter",
    ],
    interviewChecklist: [
      "Original Form I-797 Approval Notice for Form I-129",
      "IRS 501(c)(3) Determination Letter verifying the petitioning organization's tax-exempt status",
      "Official Letter from the religious denomination confirming 2 years of continuous membership prior to application",
      "Certificate of ordination, formal religious education degrees, or theological diplomas",
      "Detailed explanation of compensation (salary, housing allowance, food, medical insurance) or self-support documentation",
      "If R-2 Dependent: Marriage certificate, child birth certificates, primary R-1 holder's documents",
    ],
    consularTips: [
      "Describe religious duties: Clearly distinguish your religious vocation or ministry role from secular tasks.",
    ],
  },

  "I": {
    label: "I — Foreign Media, Journalists & Press Visa",
    subtitle: "Journalists, Editors & Film Crews",
    icon: "📰",
    tagline: "For representatives of foreign media (journalists, film crews, editors, reporters, broadcasters) traveling for informational or educational news gathering.",
    image: "/b1-b2-tourism.jpg",
    imageAlt: "Foreign media and press journalists in USA",
    fee: "$185 USD (MRV Fee)",
    validity: "Duration of Employment / Press Assignment (Multiple Entry)",
    steps: [
      {
        title: "Obtain foreign media press credentials & assignment contract",
        body: "You must be an essential employee of a foreign news media organization or under contract for journalistic content.",
      },
      {
        title: "Complete Form DS-160",
        body: "Select Foreign Media Representative (I).",
      },
      {
        title: "Schedule and attend VAC + Consular Interview",
        body: "Present press badge, published articles, and official editorial assignment letter.",
      },
    ],
    vacChecklist: [
      "Original valid Passport",
      "DS-160 Confirmation Page",
      "Appointment Confirmation Letter",
    ],
    interviewChecklist: [
      "Official Press Credentials / Press Card issued by a recognized professional journalistic association or government authority",
      "Official Letter of Assignment from foreign employer stating name, title, purpose of US visit, and duration of media project",
      "Copy of employment contract showing journalist / producer / editor role",
      "Portfolio of recently published news articles, video broadcast segments, or journalistic clips",
      "If Dependents: Marriage certificate, birth certificates",
    ],
    consularTips: [
      "Clarify informational nature: Emphasize that the media content is for news, educational, or informational reporting for a foreign audience, not commercial advertising.",
    ],
  },
};

