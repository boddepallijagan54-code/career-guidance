/**************************************************
 * LOAD ENV VARIABLES
 **************************************************/
require("dotenv").config();

/**************************************************
 * IMPORTS
 **************************************************/
const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

/**************************************************
 * OPENROUTER (CHATBOT)
 **************************************************/
const aiClient = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
});

/**************************************************
 * DATA
 **************************************************/
const CAREER_ROADMAPS = {
    "Science & Technology (STEM)": {
        pathway: "Focus on JEE/NEET preparation and strong STEM fundamentals.",
        subjects: ["Mathematics", "Physics", "Computer Science / Biology"],
        college_focus: "Engineering, Medicine, Research",
        action_plan: ["Prepare JEE/NEET", "Practice numericals", "Build projects"]
    },
    "Humanities & Creative Arts": {
        pathway: "Develop language, creativity, and analytical skills.",
        subjects: ["History", "Literature", "Psychology"],
        college_focus: "Law, Design, Media",
        action_plan: ["Portfolio building", "Debates", "Entrance exams"]
    },
    "Commerce & Business Studies": {
        pathway: "Build foundation in finance, business and economics.",
        subjects: ["Accountancy", "Economics", "Business Studies"],
        college_focus: "BBA, B.Com, Finance",
        action_plan: ["Learn basics of finance", "Internships"]
    },
    "Not Assessed": {
        pathway: "Please complete the assessment.",
        subjects: ["N/A"],
        college_focus: "N/A",
        action_plan: ["Complete assessment"]
    },
    "Undecided Pathway": {
        pathway: "Explore multiple fields.",
        subjects: ["Math", "English"],
        college_focus: "General programs",
        action_plan: ["Career exploration"]
    }
};

const CAREER_LIBRARY = {
    "Science & Technology (STEM)": [
        { title: "Software Engineer", detail: "Build software systems." },
        { title: "Data Scientist", detail: "Analyze data." },
        { title: "Mechanical Engineer", detail: "Design machines, engines, and mechanical systems." },
        { title: "Civil Engineer", detail: "Plan and construct infrastructure like roads and bridges." },
        { title: "Electrical Engineer", detail: "Work on electrical systems and power distribution." },
        { title: "Doctor (MBBS)", detail: "Diagnose and treat patients." },
        { title: "Biotechnologist", detail: "Research and develop biological innovations." },
        { title: "Cybersecurity Analyst", detail: "Protect systems and networks from cyber threats." },
        { title: "AI/ML Engineer", detail: "Develop artificial intelligence models and systems." },
        { title: "Architect", detail: "Design buildings and structural layouts." }
    ],
    "Humanities & Creative Arts": [
        { title: "Journalist", detail: "News reporting." },
        { title: "Designer", detail: "Creative design." },
        { title: "Psychologist", detail: "Study human behavior and mental health." },
        { title: "Lawyer", detail: "Provide legal advice and represent clients." },
        { title: "Civil Services Officer", detail: "Work in government administration." },
        { title: "Content Writer", detail: "Write articles, blogs, and marketing content." },
        { title: "Filmmaker", detail: "Create movies and digital media content." },
        { title: "Graphic Designer", detail: "Design branding, posters, and digital visuals." },
        { title: "Historian", detail: "Research and study historical events." },
        { title: "Social Worker", detail: "Support communities and social causes." }
    ],
    "Commerce & Business Studies": [
        { title: "Accountant", detail: "Financial records." },
        { title: "Marketing Manager", detail: "Marketing strategies." },
        { title: "Chartered Accountant (CA)", detail: "Handle taxation, auditing, and corporate finance." },
        { title: "Investment Banker", detail: "Manage investments and financial portfolios." },
        { title: "Entrepreneur", detail: "Start and manage a business." },
        { title: "Business Analyst", detail: "Analyze business data and improve processes." },
        { title: "Human Resource Manager", detail: "Manage recruitment and employee relations." },
        { title: "Financial Analyst", detail: "Study financial data to guide investment decisions." },
        { title: "Supply Chain Manager", detail: "Oversee logistics and product distribution." },
        { title: "Digital Marketing Specialist", detail: "Promote brands using online marketing tools." }
    ],
    "Not Assessed": [],
    "Undecided Pathway": []
};

const EVENT_CALENDAR = [

    // STEM Events
    { date: "Nov 15", title: "Tech Careers Panel", location: "Online", cluster_focus: "STEM" },
    { date: "Jan 10", title: "STEM Deep Dive", location: "Science Block", cluster_focus: "STEM" },
    { date: "Feb 20", title: "JEE Preparation Strategy Session", location: "Room 204", cluster_focus: "STEM" },
    { date: "Mar 05", title: "NEET Exam Guidance Seminar", location: "Auditorium", cluster_focus: "STEM" },
    { date: "Apr 12", title: "Robotics & AI Workshop", location: "Computer Lab", cluster_focus: "STEM" },
    { date: "May 08", title: "Engineering College Counselling Session", location: "Online", cluster_focus: "STEM" },

    // Humanities & Creative Arts Events
    { date: "Nov 25", title: "Creative Writing Workshop", location: "Library Hall", cluster_focus: "Humanities" },
    { date: "Dec 18", title: "Careers in Journalism", location: "Seminar Hall", cluster_focus: "Humanities" },
    { date: "Jan 22", title: "CLAT Preparation Session", location: "Room 101", cluster_focus: "Humanities" },
    { date: "Feb 14", title: "Psychology Career Talk", location: "Online", cluster_focus: "Humanities" },
    { date: "Mar 30", title: "Film & Media Production Workshop", location: "Media Lab", cluster_focus: "Humanities" },

    // Commerce & Business Events
    { date: "Dec 05", title: "University Application Workshop", location: "Auditorium", cluster_focus: "All" },
    { date: "Jan 18", title: "CA & CMA Career Guidance", location: "Room 305", cluster_focus: "Commerce" },
    { date: "Feb 25", title: "Entrepreneurship Bootcamp", location: "Business Block", cluster_focus: "Commerce" },
    { date: "Mar 15", title: "Stock Market & Investment Basics", location: "Online", cluster_focus: "Commerce" },
    { date: "Apr 20", title: "Digital Marketing Masterclass", location: "Computer Lab", cluster_focus: "Commerce" },

    // General Events
    { date: "May 10", title: "Scholarship & Financial Aid Seminar", location: "Auditorium", cluster_focus: "All" },
    { date: "Jun 02", title: "Career Counseling One-on-One", location: "Counseling Room", cluster_focus: "All" }

];

const EXAM_PREP_GUIDANCE = {
    "Science & Technology (STEM)": {
        main_exam: "JEE / NEET",
        focus: "Physics, Chemistry, Math/Biology",
        secondary_exams: ["BITSAT", "VITEEE","SRMJEEE", "KCET", "COMEDK"]
    },
    "Humanities & Creative Arts": {
        main_exam: "CLAT / CUET",
        focus: "Reading, Legal Aptitude",
        secondary_exams: ["SET","AILET", "LSAT India", "NID Entrance", "NIFT Entrance"]
    },
    "Commerce & Business Studies": {
        main_exam: "BBA / IPM",
        focus: "Quantitative Aptitude",
        secondary_exams: ["CA Foundation","CMA Foundation", "CS Foundation", "NPAT", "CUET (Commerce)"]
    },
    "Not Assessed": {
        main_exam: "General Aptitude",
        focus: "Complete assessment",
        secondary_exams: []
    },
    "Undecided Pathway": {
        main_exam: "General",
        focus: "Explore skills",
        secondary_exams: []
    }
};

/**************************************************
 * IN-MEMORY STUDENT PROFILE (FIXED)
 **************************************************/
const studentProfile = {
    isAuthenticated: false,
    name: "N/A",
    email: "N/A",
    studentClass: "N/A",

    assessmentStatus: "Pending",
    careerCluster: "Not Assessed",

    roadmapDetails: CAREER_ROADMAPS["Not Assessed"],
    examPrepDetails: EXAM_PREP_GUIDANCE["Not Assessed"],

    roadmapProgress: {
        assessment: "Incomplete",
        career_select: "Incomplete",
        subjects_chosen: "Incomplete"
    }
};

/**************************************************
 * MIDDLEWARE
 **************************************************/
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**************************************************
 * ROUTES (FIXED)
 **************************************************/
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/register", (req, res) => {
    const { name, email, studentClass } = req.body;

    studentProfile.name = name;
    studentProfile.email = email;
    studentProfile.studentClass = studentClass;
    studentProfile.isAuthenticated = true;

    res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
    if (!studentProfile.isAuthenticated) return res.redirect("/");
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/assessment", (req, res) => {
    if (!studentProfile.isAuthenticated) return res.redirect("/");
    res.sendFile(path.join(__dirname, "public", "assessment.html"));
});

/**************************************************
 * API ROUTES
 **************************************************/
app.get("/api/profile", (req, res) => {
    if (!studentProfile.isAuthenticated)
        return res.status(401).json({ error: "Unauthorized" });

    res.json(studentProfile);
});

app.post("/api/complete-assessment", (req, res) => {
    if (!studentProfile.isAuthenticated)
        return res.status(401).json({ error: "Unauthorized" });

    const { careerCluster } = req.body;

    studentProfile.careerCluster = careerCluster;
    studentProfile.assessmentStatus = "Completed";
    studentProfile.roadmapDetails = CAREER_ROADMAPS[careerCluster];
    studentProfile.examPrepDetails = EXAM_PREP_GUIDANCE[careerCluster];

    // ✅ IMPORTANT FIX
    studentProfile.roadmapProgress.assessment = "Complete";
    studentProfile.roadmapProgress.career_select = "Complete";
    studentProfile.roadmapProgress.subjects_chosen = "Incomplete";

    res.json({ success: true, careerCluster });
});

app.get("/api/careers", (req, res) => {
    if (!studentProfile.isAuthenticated)
        return res.status(401).json({ error: "Unauthorized" });

    res.json({
        cluster: studentProfile.careerCluster,
        careers: CAREER_LIBRARY[studentProfile.careerCluster] || []
    });
});

app.get("/api/events", (req, res) => {
    if (!studentProfile.isAuthenticated)
        return res.status(401).json({ error: "Unauthorized" });

    res.json({ events: EVENT_CALENDAR });
});

app.get("/api/secondary-exams", (req, res) => {
    if (!studentProfile.isAuthenticated)
        return res.status(401).json({ error: "Unauthorized" });

    res.json({
        cluster: studentProfile.careerCluster,
        secondary_exams:
            EXAM_PREP_GUIDANCE[studentProfile.careerCluster]?.secondary_exams || []
    });
});

/**************************************************
 * CHATBOT
 **************************************************/
app.post("/api/ai-guidance", async (req, res) => {
    if (!studentProfile.isAuthenticated)
        return res.status(401).json({ error: "Unauthorized" });

    try {
        const completion = await aiClient.chat.completions.create({
            model: "inclusionai/ling-3.0-flash-sante:free",
            messages: [
                { role: "system", content: "You are an Indian student career guidance assistant." },
                { role: "user", content: req.body.question }
            ]
        });

        res.json({
            answer: completion.choices[0].message.content
        });
    } catch (err) {
        res.status(500).json({ error: "AI service error" });
    }
});

/**************************************************
 * START SERVER
 **************************************************/
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
