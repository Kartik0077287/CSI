/* =========================================
   STUDENT SKILL MANAGEMENT
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
   SKILL STORAGE
========================================= */

function getSkills() {

    const key =
        `skillbridge_skills_${user.id}`;


    const data =
        localStorage.getItem(key);


    return data
        ? JSON.parse(data)
        : [];

}


function saveSkills(skills) {

    const key =
        `skillbridge_skills_${user.id}`;


    localStorage.setItem(
        key,
        JSON.stringify(skills)
    );

}


/* =========================================
   DOM
========================================= */

const skillForm =
    document.getElementById(
        "skillForm"
    );


const skillsList =
    document.getElementById(
        "skillsList"
    );


const emptySkills =
    document.getElementById(
        "emptySkills"
    );


/* =========================================
   RENDER SKILLS
========================================= */

function renderSkills() {

    const skills =
        getSkills();


    skillsList.innerHTML = "";


    /*
     * Empty state
     */

    if (skills.length === 0) {

        emptySkills.style.display =
            "block";

    } else {

        emptySkills.style.display =
            "none";

    }


    /*
     * Create skill elements
     */

    skills.forEach(
        skill => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "skill-item";


            item.innerHTML = `

                <div class="skill-main">

                    <div class="skill-icon">
                        ⚡
                    </div>

                    <div class="skill-info">

                        <h3>
                            ${escapeHTML(skill.name)}
                        </h3>

                        <span>
                            ${escapeHTML(skill.category)}
                        </span>

                    </div>

                </div>


                <div class="skill-meta">

                    <span class="skill-level">
                        ${escapeHTML(skill.level)}
                    </span>

                    <button
                        class="delete-skill"
                        data-id="${skill.id}">

                        ×

                    </button>

                </div>

            `;


            skillsList.appendChild(item);

        }
    );


    updateSummary(skills);

}


/* =========================================
   SUMMARY
========================================= */

function updateSummary(skills) {

    document.getElementById(
        "totalSkills"
    ).textContent =
        skills.length;


    document.getElementById(
        "advancedSkills"
    ).textContent =
        skills.filter(
            skill =>
                skill.level === "Advanced" ||
                skill.level === "Expert"
        ).length;


    document.getElementById(
        "intermediateSkills"
    ).textContent =
        skills.filter(
            skill =>
                skill.level === "Intermediate"
        ).length;


    document.getElementById(
        "beginnerSkills"
    ).textContent =
        skills.filter(
            skill =>
                skill.level === "Beginner"
        ).length;

}


/* =========================================
   ADD SKILL
========================================= */

skillForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document.getElementById(
                "skillName"
            ).value.trim();


        const category =
            document.getElementById(
                "skillCategory"
            ).value;


        const level =
            document.getElementById(
                "skillLevel"
            ).value;


        if (!name) return;


        const skills =
            getSkills();


        /*
         * Prevent duplicates
         */

        const exists =
            skills.some(
                skill =>
                    skill.name.toLowerCase() ===
                    name.toLowerCase()
            );


        const message =
            document.getElementById(
                "skillMessage"
            );


        if (exists) {

            message.textContent =
                "This skill is already in your profile.";

            message.className =
                "form-message error";

            return;

        }


        const newSkill = {

            id:
                "SKILL-" +
                Date.now(),

            name,

            category,

            level,

            createdAt:
                new Date().toISOString()

        };


        skills.push(newSkill);


        saveSkills(skills);


        skillForm.reset();


        message.textContent =
            "Skill added successfully.";

        message.className =
            "form-message success";


        renderSkills();

    }
);


/* =========================================
   DELETE SKILL
========================================= */

skillsList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".delete-skill"
            );


        if (!button) return;


        const skillId =
            button.dataset.id;


        let skills =
            getSkills();


        skills =
            skills.filter(
                skill =>
                    skill.id !== skillId
            );


        saveSkills(skills);


        renderSkills();

    }
);


/* =========================================
   SECURITY
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


/* =========================================
   INITIAL RENDER
========================================= */

renderSkills();