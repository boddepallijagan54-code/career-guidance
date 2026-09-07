const profileApiUrl = "/api/profile";

/* -----------------------------
   UPDATE EXAM PREP SECTION
-------------------------------- */
function updateExamPrep(details) {
    document.getElementById("exam-main-title").textContent =
        `Main Exam Focus: ${details.main_exam}`;

    document.getElementById("exam-guidance-focus").textContent =
        details.focus || "Guidance will appear here";

    document.getElementById("exam-resource-link").textContent =
        details.resource_link || "";
}

/* -----------------------------
   UPDATE ROADMAP SECTION
-------------------------------- */
function updateRoadmapDetails(details) {
    document.getElementById("roadmap-pathway").textContent =
        details.pathway;

    // Subjects
    const subjectsList = document.getElementById("roadmap-subjects");
    subjectsList.innerHTML = "";

    details.subjects.forEach(subject => {
        const li = document.createElement("li");
        li.textContent = `• ${subject}`;
        subjectsList.appendChild(li);
    });

    // Action Plan
    const actionList = document.getElementById("roadmap-action-plan");
    actionList.innerHTML = "";

    details.action_plan.forEach(action => {
        const li = document.createElement("li");
        li.textContent = `✅ ${action}`;
        actionList.appendChild(li);
    });
}

/* -----------------------------
   MAIN DASHBOARD UPDATE
-------------------------------- */
function updateDashboard(profile) {

    /* HEADER */
    document.getElementById("welcome-message").textContent =
        `Welcome, ${profile.name} (Class ${profile.studentClass})`;

    /* ASSESSMENT STATUS */
    document.getElementById("assessment-status-display").textContent =
        `Status: ${profile.assessmentStatus}`;

    document.getElementById("assessment-cluster-display").textContent =
        `Cluster: ${profile.careerCluster}`;

    /* ROADMAP + EXAM PREP */
    updateRoadmapDetails(profile.roadmapDetails);
    updateExamPrep(profile.examPrepDetails);

    /* START ASSESSMENT BUTTON */
    const assessmentBtn = document.getElementById("start-assessment-btn");

    if (profile.assessmentStatus === "Completed") {
        assessmentBtn.style.display = "none";
    } else {
        assessmentBtn.style.display = "inline-block";
        assessmentBtn.href = "/assessment.html";
    }

    /* CAREER LIBRARY BUTTON */
    const libraryBtn = document.getElementById("library-btn");

    if (profile.assessmentStatus === "Completed") {
        libraryBtn.classList.remove("btn-disabled");
        libraryBtn.href = "/library.html";
        libraryBtn.textContent = "Explore Career Library";
    } else {
        libraryBtn.classList.add("btn-disabled");
        libraryBtn.href = "#";
        libraryBtn.textContent = "Complete Assessment First";
    }

    /* ROADMAP PROGRESS */
    document.getElementById("r-assessment").textContent =
        profile.roadmapProgress.assessment;

    document.getElementById("r-selection").textContent =
        profile.roadmapProgress.career_select;

    document.getElementById("r-subjects").textContent =
        profile.roadmapProgress.subjects_chosen;

    // Apply colors
    for (const key in profile.roadmapProgress) {
        const el = document.getElementById(`r-${key.replace("_", "-")}`);
        if (!el) continue;

        el.className =
            profile.roadmapProgress[key] === "Complete"
                ? "status-complete"
                : "status-incomplete";
    }
}

/* -----------------------------
   LOAD PROFILE (ONLY FETCH)
-------------------------------- */
document.addEventListener("DOMContentLoaded", loadProfile);

function loadProfile() {
    fetch(profileApiUrl)
        .then(res => {
            if (res.status === 401) {
                window.location.href = "/";
                return;
            }
            return res.json();
        })
        .then(data => {
            if (!data) return;
            updateDashboard(data); // ✅ ONLY THIS
        })
        .catch(err => {
            console.error("Profile load error:", err);
            document.getElementById("welcome-message").textContent =
                "profile";
        });
}
