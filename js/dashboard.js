/* =========================================
   SKILLBRIDGE DASHBOARD
========================================= */


/* =========================================
   GET CURRENT USER
========================================= */

const currentUserData =
    localStorage.getItem(
        "skillbridge_current_user"
    );


/*
 * If there is no logged-in user,
 * send them back to login.
 */

if (!currentUserData) {

    window.location.href =
        "login.html";

}


/* =========================================
   PARSE USER
========================================= */

const currentUser =
    JSON.parse(currentUserData);


/* =========================================
   USER INFORMATION
========================================= */

const firstName =
    currentUser.firstName || "User";

const lastName =
    currentUser.lastName || "";

const fullName =
    `${firstName} ${lastName}`.trim();

const role =
    currentUser.role;


/* =========================================
   DOM ELEMENTS
========================================= */

const welcomeName =
    document.getElementById(
        "welcomeName"
    );

const headerName =
    document.getElementById(
        "headerName"
    );

const headerRole =
    document.getElementById(
        "headerRole"
    );

const sidebarRole =
    document.getElementById(
        "sidebarRole"
    );

const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );

const welcomeDescription =
    document.getElementById(
        "welcomeDescription"
    );


/* =========================================
   DISPLAY USER
========================================= */

if (welcomeName) {

    welcomeName.textContent =
        firstName;

}


if (headerName) {

    headerName.textContent =
        fullName;

}


if (profileAvatar) {

    profileAvatar.textContent =
        firstName.charAt(0).toUpperCase();

}


if (headerRole) {

    headerRole.textContent =
        formatRole(role);

}


if (sidebarRole) {

    sidebarRole.textContent =
        formatRole(role);

}


/* =========================================
   ROLE FORMATTER
========================================= */

function formatRole(role) {

    const roles = {

        student: "Student",

        academia: "Academia / Faculty",

        industry: "Industry",

        admin: "Administrator"

    };

    return roles[role] || "User";

}


/* =========================================
   ROLE DESCRIPTION
========================================= */

const descriptions = {

    student:
        "Track your skills, discover opportunities and build your career.",

    academia:
        "Manage student skills and strengthen your institution's industry connections.",

    industry:
        "Find skilled talent and build meaningful connections with academia.",

    admin:
        "Manage and monitor the SkillBridge ecosystem."

};


if (welcomeDescription) {

    welcomeDescription.textContent =
        descriptions[role] ||
        "Here's what's happening on SkillBridge today.";

}


/* =========================================
   SHOW CORRECT DASHBOARD
========================================= */

const dashboards = {

    student:
        "studentDashboard",

    academia:
        "academiaDashboard",

    industry:
        "industryDashboard",

    admin:
        "adminDashboard"

};


const navigation = {

    student:
        "studentNavigation",

    academia:
        "academiaNavigation",

    industry:
        "industryNavigation",

    admin:
        "adminNavigation"

};


/* Hide every dashboard */

document
    .querySelectorAll(".role-dashboard")
    .forEach(section => {

        section.style.display = "none";

    });


/* Hide every role navigation */

document
    .querySelectorAll(".role-navigation")
    .forEach(nav => {

        nav.style.display = "none";

    });


/* Show selected dashboard */

const activeDashboard =
    document.getElementById(
        dashboards[role]
    );


if (activeDashboard) {

    activeDashboard.style.display =
        "block";

}


/* Show selected navigation */

const activeNavigation =
    document.getElementById(
        navigation[role]
    );


if (activeNavigation) {

    activeNavigation.style.display =
        "block";

}


/* =========================================
   LOGOUT
========================================= */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "skillbridge_current_user"
            );

            window.location.href =
                "login.html";

        }
    );

}


/* =========================================
   MOBILE SIDEBAR
========================================= */

const menuButton =
    document.getElementById(
        "menuButton"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );


if (menuButton && sidebar) {

    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "mobile-open"
            );

        }
    );

}