/* =========================================
   SKILL GAP ANALYSIS
========================================= */


/* =========================================
   AUTHENTICATION
========================================= */

const storedUser =
    localStorage.getItem(
        "skillbridge_current_user"
    );


if (!storedUser) {

    window.location.href =
        "login.html";

}


const user =
    JSON.parse(storedUser);


/* =========================================
   USER DISPLAY
========================================= */

const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`
        .trim();


document.getElementById(
    "headerName"
).textContent =
    fullName || "User";


document.getElementById(
    "profileAvatar"
).textContent =
    (user.firstName || "U")
        .charAt(0)
        .toUpperCase();


/* =========================================
   ROLE REQUIREMENTS
========================================= */


/*
 * Temporary industry requirement dataset.
 *
 * Later this will come from the backend /
 * Industry Skill Requirements module.
 */

const roleRequirements = {

    "software-developer": {

        title:
            "Software Developer",

        description:
            "Measures your readiness for a general software development role.",

        skills: [

            {
                name: "Programming",
                requiredLevel: "Advanced"
            },

            {
                name: "Data Structures",
                requiredLevel: "Intermediate"
            },

            {
                name: "Algorithms",
                requiredLevel: "Intermediate"
            },

            {
                name: "SQL",
                requiredLevel: "Intermediate"
            },

            {
                name: "Git",
                requiredLevel: "Intermediate"
            },

            {
                name: "Problem Solving",
                requiredLevel: "Advanced"
            }

        ]

    },


    "data-analyst": {

        title:
            "Data Analyst",

        description:
            "Measures your readiness for data analysis and business intelligence roles.",

        skills: [

            {
                name: "Python",
                requiredLevel: "Intermediate"
            },

            {
                name: "SQL",
                requiredLevel: "Advanced"
            },

            {
                name: "Excel",
                requiredLevel: "Intermediate"
            },

            {
                name: "Statistics",
                requiredLevel: "Intermediate"
            },

            {
                name: "Data Visualization",
                requiredLevel: "Intermediate"
            },

            {
                name: "Problem Solving",
                requiredLevel: "Intermediate"
            }

        ]

    },


    "ml-engineer": {

        title:
            "ML Engineer",

        description:
            "Measures your readiness for machine learning engineering roles.",

        skills: [

            {
                name: "Python",
                requiredLevel: "Advanced"
            },

            {
                name: "Machine Learning",
                requiredLevel: "Intermediate"
            },

            {
                name: "Statistics",
                requiredLevel: "Intermediate"
            },

            {
                name: "Data Structures",
                requiredLevel: "Intermediate"
            },

            {
                name: "SQL",
                requiredLevel: "Intermediate"
            },

            {
                name: "Git",
                requiredLevel: "Intermediate"
            }

        ]

    },


    "web-developer": {

        title:
            "Web Developer",

        description:
            "Measures your readiness for modern web development roles.",

        skills: [

            {
                name: "HTML",
                requiredLevel: "Intermediate"
            },

            {
                name: "CSS",
                requiredLevel: "Intermediate"
            },

            {
                name: "JavaScript",
                requiredLevel: "Advanced"
            },

            {
                name: "Git",
                requiredLevel: "Intermediate"
            },

            {
                name: "SQL",
                requiredLevel: "Beginner"
            }

        ]

    }

};


/* =========================================
   LEVEL SYSTEM
========================================= */

const levelValue = {

    Beginner: 1,

    Intermediate: 2,

    Advanced: 3,

    Expert: 4

};


/* =========================================
   GET STUDENT SKILLS
========================================= */

function getStudentSkills() {

    const key =
        `skillbridge_skills_${user.id}`;


    const data =
        localStorage.getItem(key);


    return data
        ? JSON.parse(data)
        : [];

}


/* =========================================
   NORMALIZE SKILL
========================================= */

function normalizeSkill(name) {

    return name
        .toLowerCase()
        .trim();

}


/* =========================================
   ROLE BUTTONS
========================================= */

const roleButtons =
    document.querySelectorAll(
        ".target-role"
    );


roleButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            roleButtons.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            button.classList.add(
                "active"
            );


            const role =
                button.dataset.role;


            analyzeRole(role);

        }
    );

});


/* =========================================
   ANALYZE ROLE
========================================= */

function analyzeRole(role) {

    const requirement =
        roleRequirements[role];


    if (!requirement) return;


    const studentSkills =
        getStudentSkills();


    /*
     * Normalize student's skills
     */

    const normalizedStudentSkills =
        studentSkills.map(
            skill => ({

                ...skill,

                normalizedName:
                    normalizeSkill(
                        skill.name
                    )

            })
        );


    let matchedSkills = [];

    let gapSkills = [];


    /*
     * Compare every required skill
     */

    requirement.skills.forEach(
        requiredSkill => {

            const requiredName =
                normalizeSkill(
                    requiredSkill.name
                );


            const studentSkill =
                normalizedStudentSkills.find(
                    skill =>
                        skill.normalizedName ===
                        requiredName
                );


            if (!studentSkill) {

                gapSkills.push({

                    name:
                        requiredSkill.name,

                    category:
                        "Industry Requirement",

                    requiredLevel:
                        requiredSkill.requiredLevel,

                    reason:
                        "Skill not found in your profile."

                });

                return;

            }


            /*
             * Compare proficiency
             */

            const studentLevel =
                levelValue[
                    studentSkill.level
                ] || 0;


            const requiredLevel =
                levelValue[
                    requiredSkill.requiredLevel
                ] || 0;


            if (
                studentLevel >=
                requiredLevel
            ) {

                matchedSkills.push({

                    name:
                        requiredSkill.name,

                    studentLevel:
                        studentSkill.level,

                    requiredLevel:
                        requiredSkill.requiredLevel

                });

            } else {

                gapSkills.push({

                    name:
                        requiredSkill.name,

                    category:
                        "Industry Requirement",

                    requiredLevel:
                        requiredSkill.requiredLevel,

                    studentLevel:
                        studentSkill.level,

                    reason:
                        `Your level is ${studentSkill.level}; required level is ${requiredSkill.requiredLevel}.`

                });

            }

        }
    );


    /*
     * Calculate match percentage
     */

    const totalSkills =
        requirement.skills.length;


    const matchPercentage =
        totalSkills === 0
            ? 0
            : Math.round(
                (
                    matchedSkills.length /
                    totalSkills
                ) * 100
            );


    displayAnalysis({

        requirement,

        matchedSkills,

        gapSkills,

        matchPercentage

    });

}


/* =========================================
   DISPLAY ANALYSIS
========================================= */

function displayAnalysis(data) {

    const {

        requirement,

        matchedSkills,

        gapSkills,

        matchPercentage

    } = data;


    const analysisSection =
        document.getElementById(
            "analysisSection"
        );


    analysisSection.classList.add(
        "visible"
    );


    /*
     * Role
     */

    document.getElementById(
        "roleTitle"
    ).textContent =
        requirement.title;


    /*
     * Description
     */

    let description =
        requirement.description;


    if (matchPercentage >= 80) {

        description +=
            " You have strong alignment with the selected role.";

    } else if (matchPercentage >= 50) {

        description +=
            " You have a good foundation, but some skills need improvement.";

    } else {

        description +=
            " Several important skills need to be developed for this role.";

    }


    document.getElementById(
        "matchDescription"
    ).textContent =
        description;


    /*
     * Score
     */

    document.getElementById(
        "matchScore"
    ).textContent =
        `${matchPercentage}%`;


    /*
     * Counts
     */

    document.getElementById(
        "matchedCount"
    ).textContent =
        matchedSkills.length;


    document.getElementById(
        "gapCount"
    ).textContent =
        gapSkills.length;


    /*
     * Score circle
     */

    const circle =
        document.getElementById(
            "scoreCircle"
        );


    const degree =
        matchPercentage * 3.6;


    circle.style.background =
        `conic-gradient(
            var(--primary) ${degree}deg,
            #e2e8f0 ${degree}deg
        )`;


    /*
     * Render skills
     */

    renderMatchedSkills(
        matchedSkills
    );


    renderGapSkills(
        gapSkills
    );


    renderRecommendations(
        gapSkills
    );

}


/* =========================================
   MATCHED SKILLS
========================================= */

function renderMatchedSkills(skills) {

    const container =
        document.getElementById(
            "matchedSkills"
        );


    container.innerHTML = "";


    if (skills.length === 0) {

        container.innerHTML = `

            <div class="empty-skills">

                <div>⚡</div>

                <p>
                    No required skills matched yet.
                </p>

            </div>

        `;

        return;

    }


    skills.forEach(skill => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "analysis-skill";


        item.innerHTML = `

            <div class="analysis-skill-main">

                <div class="analysis-skill-icon">
                    ✓
                </div>

                <div>

                    <h3>
                        ${escapeHTML(skill.name)}
                    </h3>

                    <span>
                        Your level: ${escapeHTML(skill.studentLevel)}
                    </span>

                </div>

            </div>


            <span class="skill-status match">
                MATCHED
            </span>

        `;


        container.appendChild(item);

    });

}


/* =========================================
   GAP SKILLS
========================================= */

function renderGapSkills(skills) {

    const container =
        document.getElementById(
            "gapSkills"
        );


    container.innerHTML = "";


    if (skills.length === 0) {

        container.innerHTML = `

            <div class="empty-skills">

                <div>🎉</div>

                <p>
                    No skill gaps found for this role.
                </p>

            </div>

        `;

        return;

    }


    skills.forEach(skill => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "analysis-skill";


        const currentLevel =
            skill.studentLevel
                ? `Your level: ${skill.studentLevel}`
                : "Not in your profile";


        item.innerHTML = `

            <div class="analysis-skill-main">

                <div class="analysis-skill-icon">
                    !
                </div>

                <div>

                    <h3>
                        ${escapeHTML(skill.name)}
                    </h3>

                    <span>
                        ${escapeHTML(currentLevel)}
                        · Required:
                        ${escapeHTML(skill.requiredLevel)}
                    </span>

                </div>

            </div>


            <span class="skill-status gap">
                GAP
            </span>

        `;


        container.appendChild(item);

    });

}


/* =========================================
   RECOMMENDATIONS
========================================= */

function renderRecommendations(skills) {

    const container =
        document.getElementById(
            "recommendations"
        );


    container.innerHTML = "";


    if (skills.length === 0) {

        container.innerHTML = `

            <div class="recommendation-item">

                <strong>
                    Maintain your current skill level
                </strong>

                <p>
                    Your skills currently align with
                    all requirements for this role.
                </p>

            </div>

        `;

        return;

    }


    /*
     * Show top three gaps.
     */

    skills
        .slice(0, 3)
        .forEach(skill => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "recommendation-item";


            item.innerHTML = `

                <strong>
                    Improve ${escapeHTML(skill.name)}
                </strong>

                <p>
                    Target proficiency:
                    ${escapeHTML(skill.requiredLevel)}.
                    Focus on practical projects and
                    industry-relevant learning.
                </p>

            `;


            container.appendChild(item);

        });

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   LOGOUT
========================================= */

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "skillbridge_current_user"
            );

            window.location.href =
                "login.html";

        }
    );