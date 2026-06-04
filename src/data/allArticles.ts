export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  commentText: string;
  date: string;
  approved: boolean;
}

export interface NewsArticle {
  id: string;
  category: 'business' | 'sports' | 'education' | 'entertainment' | 'politics';
  headline: string;
  subheading?: string;
  snippet: string;
  content: string; // Dynamic rich content paragraphs split by \n
  byline: string;
  date: string;
  location: string;
  readTime: string;
  image: string;
  imageCaption?: string;
  videoUrl?: string; // Optional embedded video dummy link or YouTube
  isBreaking?: boolean;
  isHero?: boolean;
  isDraft?: boolean;
  views: number;
  tags?: string[];
  metaTitle?: string;
  metaDesc?: string;
}

export interface StockTicker {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

export interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: string;
  status: 'LIVE' | 'FT' | 'UPCOMING';
  league: string;
}

export interface ScholarshipOpportunity {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  category: string;
}

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "arn-biz-naira",
    category: "business",
    headline: "Naira Rebounds as Central Bank Releases Foreign Exchange Backlog",
    subheading: "Apex banks fresh dollar injects trigger strong convergence in parallel market segments.",
    snippet: "In an unexpected boost to manufacturing circles, the Naira yesterday registered robust gains against major Western currencies at physical clearing chambers.",
    content: "The Central Bank of Nigeria has cleared a substantial portion of the verified foreign exchange backlog, injecting an additional $450m into retail inter-bank operations.\nThis decisive policy movement has triggered a rapid stabilization trend in Lagos, Port Harcourt, and Abuja commercial desks, narrowing the parallel market margin to under 3%.\nLocal manufacturers, who have long complained about foreign input procurement bottlenecks, expressed severe optimism. Industry unions call on the central bank to sustain exchange liquidity throughout the fiscal quarters of 2026.",
    byline: "Segun Adesina, Financial Desk",
    date: "May 28, 2026",
    location: "LAGOS",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=800&h=500",
    imageCaption: "Forex currency notes undergoing official ledger logging at the Interbank Exchange Station.",
    isHero: true,
    isBreaking: true,
    views: 14205,
    tags: ["Naira", "Central Bank", "Economy", "Forex"],
    metaTitle: "Naira Gains Strength Following Backlog Clearance",
    metaDesc: "The Naira recorded major rebounds after the Central Bank cleared FX backlogs, strengthening the local manufacturing environment."
  },
  {
    id: "arn-biz-shagamu",
    category: "business",
    headline: "Shagamu Special Hub Records ₦230B Capital Commitments",
    subheading: "West African industrial giants establish logistics hubs along the Lagos-Ibadan expressway corridors.",
    snippet: "Investors capitalize on high-capacity fiber trunks and dedicated gas pipelines to construct modular factories.",
    content: "A consortium of agricultural exporters and chemical producers yesterday finalized leaseholds for over 200 hectares inside the newly designated Shagamu Special Industrial Hub.\nBacked by private credit lines and state tax credits, the zone offers uninterruptible primary gas feeds and sovereign security grids. The local district chairman stated that this massive injection will yield over 18,000 artisan and administrative jobs over the coming eighteen months.\nConstruction equipment is already on site grading Access Road A, with the first manufacturing lines projected to go live by mid-2027.",
    byline: "Amina Yusuf, Industrial Correspondent",
    date: "May 27, 2026",
    location: "SHAGAMU",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=400",
    imageCaption: "Technicians configuring fiber optics inside Shagamu power substation.",
    views: 8412,
    tags: ["Investment", "Industry", "Jobs", "Lagos Expressway"]
  },
  {
    id: "arn-sports-osimhen",
    category: "sports",
    headline: "Osimhen Grabs Dominant Hat-Trick as Super Eagles Secure Qualifier Crown",
    subheading: "Nigeria downs Angola 3-0 in high-intensity Port Harcourt football masterclass.",
    snippet: "The striker cemented clinical dominance yesterday, firing Super Eagles to the peak of the African qualifications ledger.",
    content: "The Super Eagles of Nigeria delivered a masterclass at the packed Adokiye Amiesimaka Stadium yesterday, dismantling a resilient Angolan defense in a definitive 3-0 qualification routing.\nVictor Osimhen claims all the headlines with an clinical hat-trick, converting three majestic tactical supplies from the wings. The newly modified high-pressing formation constructed by Coach Finidi completely overwhelmed the tourists.\nSuper Eagles secure total qualifications with two match fixtures to spare, setting standard continental titles in their crosshairs.",
    byline: "Chinedu Okechukwu, Lead Sports Reporter",
    date: "May 28, 2026",
    location: "PORT HARCOURT",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800&h=500",
    imageCaption: "Osimhen celebrating with team members amidst packed stadium crowds.",
    isHero: false,
    views: 24905,
    tags: ["Super Eagles", "Osimhen", "Football", "Qualifiers"]
  },
  {
    id: "arn-sports-hoop",
    category: "sports",
    headline: "Kano Pillars Extend Basketball Streak to Nine Wins",
    subheading: "Commanding 89-74 victory over Rivers Hoopers seals dominance in national league circles.",
    snippet: "The Kano giant leveraged physical paint plays and sublime point transfers to claim a clear victory in Abuja.",
    content: "Kano Pillars displayed immense physical basketball yesterday, securing their ninth continuous victory of the season against Rivers Hoopers inside the Abuja Indoor Sports Dome.\nThe MVP registered 24 points and 11 rebounds with rapid fast breaks that caught the Hoopers transit defense flat. Rivers Hoopers tried to respond with three-pointers in the third quarter but fell short under heavy defensive blocks under the post.",
    byline: "Segun Odegbami Jnr, Court-side Reporter",
    date: "May 27, 2026",
    location: "ABUJA",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600&h=400",
    imageCaption: "Point guard transitioning past defenders in Abuja Indoor Complex.",
    views: 6520,
    tags: ["Kano Pillars", "Basketball", "NBBF", "Rivers Hoopers"]
  },
  {
    id: "arn-edu-jamb",
    category: "education",
    headline: "JAMB Releases 2026 UTME Results with Record Tech Scores",
    subheading: "Registrar reports smooth execution across 740 computerized test centers nationwide.",
    snippet: "Over 1.8m secondary graduates receive instant mobile scores, highlighting significant improvements in digital delivery infrastructure.",
    content: "The Joint Admissions and Matriculation Board yesterday activated the central score registry for the 2026 Unified Tertiary Matriculation Examination.\nProf. Ishaq Oloyede stated that standard computerized networks registered over 99.8% uptime during the two-week exam window, representing a monumental leap in regional administrative tech. Secondary students can access scores instantly via SMS or secure portal codes.\nThe board reported that several candidates achieved remarkable scores in science-based matching fields, matching global tech metrics.",
    byline: "Amina Yusuf, Education Correspondent",
    date: "May 28, 2026",
    location: "ABUJA",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800&h=500",
    imageCaption: "Candidates actively entering database credentials at local CBT centers.",
    views: 18210,
    tags: ["JAMB", "UTME", "Education", "Students"]
  },
  {
    id: "arn-edu-scholars",
    category: "education",
    headline: "LND Grant Board Announces ₦5B University Scholars Pool",
    subheading: "Eligible students in public science departments can apply for full-tuition allowances.",
    snippet: "The foundation expands grants to target green energy research, computer engineering, and medical biochemistry majors.",
    content: "To support local industrialization, the LND Sovereign Foundation has expanded its tertiary academic grant programs by launching a fresh ₦5 Billion scholarship pool.\nOver 4,500 students in chosen federal and state universities will receive full tuition, books, and living stipends. Application portals are free from structural fee charges and close in August.\nPreference will be matching applicants demonstrating original research proposals on climate-smart farming solutions and modular mini-grid configurations.",
    byline: "Folake Balogun, Academic Desk",
    date: "May 26, 2026",
    location: "ENUGU",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600&h=400",
    imageCaption: "Award winners receiving certificates at tertiary innovation assemblies.",
    views: 11984,
    tags: ["Scholarships", "Tertiary Fund", "Science Grant"]
  },
  {
    id: "arn-ent-lagos-beat",
    category: "entertainment",
    headline: "Burna Boys Africa-Odyssey Tour Grosses ₦4B in London Stadium",
    subheading: "Grammy winner packing 80,000 capacity arena in premium indigenous high-life performance.",
    snippet: "Afrobeats icon delivers deep cultural melodies backed by standard Yoruba talking-drum orchestrations.",
    content: "The global concert industry witnessed magnificent Afrobeats pageantry yesterday as Burna Boy pulled off a sold-out showcase at the London Stadium, drawing over 80,000 fans.\nWith a set list utilizing modern electronic instrumentation integrated with pure pre-colonial high-life rhythms, the artist solidified his position as Nigeria’s top global export.\nTade Adekola, our correspondent in London, reports that multi-camera broadcasts streamed globally, capturing the stunning choreography and physical designs of the set.",
    byline: "Blessing Okoye, Culture & Arts Writer",
    date: "May 28, 2026",
    location: "LONDON",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800&h=500",
    imageCaption: "Burna Boy conducting stadium vocals during cultural concerts yesterday.",
    views: 31204,
    tags: ["Burna Boy", "Afrobeats", "Music", "London Arena"]
  },
  {
    id: "arn-ent-epic-kingdom",
    category: "entertainment",
    headline: "Pre-Colonial Epic 'The Kingdom of Dust' Dominates Streaming Charts",
    subheading: "Indigenous period drama sets streaming records across the UK, USA, and Canada.",
    snippet: "Cinematic enthusiasts celebrate the highly accurate historical reconstruction of historical West African kingdoms.",
    content: "The historical period thriller *The Kingdom of Dust* has secured top positions on global video-on-demand networks, making it the most-watched Nollywood release in foreign markets.\nShot entirely in Enugu and Oyo State forests with state-of-the-art cinematic equipment, critics praise the production for skipping standard CGI in favor of real, hand-carved pre-colonial cityscapes and artisan weapons.\nIndustry authorities say this will inspire substantial institutional financing lines into historical film archives across the continent.",
    byline: "Blessing Okoye, Movie Critic",
    date: "May 27, 2026",
    location: "LAGOS",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600&h=400",
    imageCaption: "Scenic period shoot showing actors dressed in cultural fabrics on set.",
    views: 29402,
    tags: ["Nollywood", "Epic Drama", "The Kingdom of Dust"]
  },
  {
    id: "arn-pol-fct-metro",
    category: "politics",
    headline: "Abuja Metro Rail Project Concludes Technical Certifications Trial",
    subheading: "Ministry of Transportation flags off test commutes with high-capacity hybrid engines.",
    snippet: "The public transportation scheme is expected to alleviate transit congestion for over 450,000 daily commuters.",
    content: "Abuja, the Federal Capital Territory, is about to witness an transit revolution. Officials concluded test runs on standard rail tracks connecting the central district to suburban outposts.\nThe railway represents a major collaborative victory with international engineering teams, utilizing modern dual-power locomotives that adapt to hybrid battery and grid grids.\nCommuters are celebrating the upcoming launch, expecting transport rates to drop significantly for low-income brackets.",
    byline: "Chinedu Okechukwu, Regional News Desk",
    date: "May 25, 2026",
    location: "ABUJA",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=600&h=400",
    imageCaption: "Hybrid locomotive arriving at Abuja central depot.",
    views: 13500,
    tags: ["Abuja Metro", "Transit", "Infrastructure", "FCT"]
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: "com-1",
    articleId: "arn-biz-naira",
    authorName: "Kunle Solaja",
    commentText: "Excellent news! Our raw material clearance bills should finally reduce if the banks match rates properly.",
    date: "May 28, 2026",
    approved: true
  },
  {
    id: "com-2",
    articleId: "arn-biz-naira",
    authorName: "Ekene Nwachukwu",
    commentText: "Let us watch and check if the CBN maintains FX matching pipelines consistently over the month.",
    date: "May 28, 2026",
    approved: true
  },
  {
    id: "com-3",
    articleId: "arn-sports-osimhen",
    authorName: "Coach Joe",
    commentText: "Osimhen has proven he is currently in the conversation for global elite level players. Fantastic goals!",
    date: "May 28, 2026",
    approved: true
  },
  {
    id: "com-4",
    articleId: "arn-sports-osimhen",
    authorName: "Ngozi Obi",
    commentText: "Wait till we meet Morocco in the next fixture, then we will really test this high-pressing setup.",
    date: "May 28, 2026",
    approved: false
  }
];

export const STOCKS_DATA: StockTicker[] = [
  { symbol: "NGXASI", name: "NGX All-Share", price: "98,140.23", change: "+1.24%", isPositive: true },
  { symbol: "MTNN", name: "MTN Nigeria PLC", price: "₦245.00", change: "-0.50%", isPositive: false },
  { symbol: "ZENITHBANK", name: "Zenith Bank PLC", price: "₦38.45", change: "+2.85%", isPositive: true },
  { symbol: "DANGSUGAR", name: "Dangote Sugar PLC", price: "₦54.00", change: "+4.10%", isPositive: true },
  { symbol: "GTCO", name: "Guaranty Trust Holding", price: "₦42.10", change: "-1.15%", isPositive: false },
  { symbol: "BUACEMENT", name: "BUA Cement PLC", price: "₦98.50", change: "+0.00%", isPositive: true }
];

export const LIVE_MATCHES: LiveMatch[] = [
  { id: "m1", homeTeam: "Super Eagles", awayTeam: "Angola", homeScore: 3, awayScore: 0, minute: "90+", status: "FT", league: "AFCON Qualifiers" },
  { id: "m2", homeTeam: "Enyimba FC", awayTeam: "Kano Pillars", homeScore: 1, awayScore: 1, minute: "62", status: "LIVE", league: "NPFL" },
  { id: "m3", homeTeam: "Remo Stars", awayTeam: "Kwara United", homeScore: 2, awayScore: 0, minute: "84", status: "LIVE", league: "NPFL" },
  { id: "m4", homeTeam: "Chelsea", awayTeam: "Man United", homeScore: 0, awayScore: 0, minute: "UPCOMING", status: "UPCOMING", league: "English Premier League" }
];

export const SCHOLARSHIPS: ScholarshipOpportunity[] = [
  { id: "s1", title: "LND Sovereign Science Grant", provider: "LND Sovereign Foundation", amount: "₦1,200,000 per session + stipend", deadline: "Aug 15, 2026", category: "STEM" },
  { id: "s2", title: "MTN Foundation Scholarship Scheme", provider: "MTN Nigeria", amount: "₦200,000 annually", deadline: "Jul 30, 2026", category: "Technology" },
  { id: "s3", title: "Shell Niger Delta Postgraduate Grant", provider: "SPDC Joint Venture", amount: "Full tuition + UK Logistics allowance", deadline: "Jun 12, 2026", category: "Postgraduate" },
  { id: "s4", title: "Federal Government Bilateral Education Agreement", provider: "Ministry of Education", amount: "Fully funded international tuition", deadline: "Jul 10, 2026", category: "International studies" }
];

export const STATIC_CATEGORIES = ["politics", "business", "sports", "education", "entertainment"];
