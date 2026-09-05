/* =========================================
   INDUSTRY DASHBOARD
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
   CHECK ROLE
========================================= */

if (
    user.role &&
    user.role !== "industry"
) {

    window.location.href =
        "dashboard.html";

}


/* =========================================
   USER INFORMATION
========================================= */

const companyName =
    user.companyName ||
    user.organization ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Industry";


document.getElementById(
    "headerName"
).textContent =
    companyName;


document.getElementById(
    "profileAvatar"
).textContent =
    companyName
        .charAt(0)
        .toUpperCase();


/* =========================================
   OPPORTUNITY STORAGE
========================================= */

function getOpportunities() {

    const data =
        localStorage.getItem(
            "skillbridge_opportunities"
        );


    if (!data) {

        return [];

    }


    return JSON.parse(data);

}


/* =========================================
   FILTER COMPANY OPPORTUNITIES
========================================= */

function getMyOpportunities() {

    const opportunities =
        getOpportunities();


    return opportunities.filter(
        opportunity =>
            opportunity.industryId ===
            user.id
    );

}


/* =========================================
   UPDATE STATISTICS
========================================= */

function updateStatistics() {

    const opportunities =
        getMyOpportunities();


    const active =
        opportunities.filter(
            opportunity =>
                opportunity.status === "active"
        );


    const totalApplicants =
        opportunities.reduce(
            (
                total,
                opportunity
            ) =>
                total +
                (
                    opportunity.applicants?.length ||
                    0
                ),
            0
        );


    const skills = [];


    opportunities.forEach(
        opportunity => {

            if (
                opportunity.requiredSkills
            ) {

                opportunity.requiredSkills
                    .forEach(skill => {

                        const exists =
                            skills.some(
                                item =>
                                    item.name.toLowerCase() ===
                                    skill.name.toLowerCase()
                            );


                        if (!exists) {

                            skills.push(skill);

                        }

                    });

            }

        }
    );


    const shortlisted =
        opportunities.reduce(
            (
                total,
                opportunity
            ) =>
                total +
                (
                    opportunity.shortlisted?.length ||
                    0
                ),
            0
        );


    document.getElementById(
        "activeOpportunities"
    ).textContent =
        active.length;


    document.getElementById(
        "totalApplicants"
    ).textContent =
        totalApplicants;


    document.getElementById(
        "skillsDefined"
    ).textContent =
        skills.length;


    document.getElementById(
        "shortlistedCandidates"
    ).textContent =
        shortlisted;

}


/* =========================================
   RENDER RECENT OPPORTUNITIES
========================================= */

function renderRecentOpportunities() {

    const container =
        document.getElementById(
            "recentOpportunities"
        );


    const empty =
        document.getElementById(
            "emptyOpportunities"
        );


    const opportunities =
        getMyOpportunities();


    container.innerHTML = "";


    if (
        opportunities.length === 0
    ) {

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";


    /*
     * Newest first
     */

    const recent =
        [...opportunities]
            .sort(
                (
                    a,
                    b
                ) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )
            .slice(0, 5);


    recent.forEach(
        opportunity => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "recent-opportunity";


            const typeIcon =
                opportunity.type ===
                "internship"
                    ? "🎓"
                    : "💼";


            const applicantCount =
                opportunity.applicants?.length ||
                0;


            item.innerHTML = `

                <div class="opportunity-main">

                    <div class="opportunity-icon">
                        ${typeIcon}
                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(
                                opportunity.title
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                opportunity.type
                            )}
                            ·
                            ${escapeHTML(
                                opportunity.location ||
                                "Not specified"
                            )}
                        </p>

                    </div>

                </div>


                <div class="opportunity-meta">

                    <span class="opportunity-applicants">

                        ${applicantCount}
                        Applicant${applicantCount === 1 ? "" : "s"}

                    </span>


                    <span class="opportunity-status">

                        ${escapeHTML(
                            opportunity.status ||
                            "active"
                        ).toUpperCase()}

                    </span>

                </div>

            `;


            container.appendChild(item);

        }
    );

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


/* =========================================
   INITIALIZE
========================================= */

updateStatistics();

renderRecentOpportunities();