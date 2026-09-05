/* =========================================
   STUDENT PROFILE
========================================= */


/* Get logged-in user */

const storedUser =
    localStorage.getItem(
        "skillbridge_current_user"
    );


if (!storedUser) {

    window.location.href =
        "login.html";

}


let user =
    JSON.parse(storedUser);


/* =========================================
   DOM
========================================= */

const firstName =
    document.getElementById("firstName");

const lastName =
    document.getElementById("lastName");

const email =
    document.getElementById("email");

const college =
    document.getElementById("college");

const course =
    document.getElementById("course");

const graduationYear =
    document.getElementById("graduationYear");


/* =========================================
   LOAD DATA
========================================= */

firstName.value =
    user.firstName || "";

lastName.value =
    user.lastName || "";

email.value =
    user.email || "";

college.value =
    user.college || "";

course.value =
    user.course || "";

graduationYear.value =
    user.graduationYear || "";


/* =========================================
   DISPLAY USER
========================================= */

const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`
        .trim();


document.getElementById(
    "profileName"
).textContent =
    fullName || "User";


document.getElementById(
    "profileEmail"
).textContent =
    user.email || "";


document.getElementById(
    "headerName"
).textContent =
    fullName || "User";


const initial =
    (user.firstName || "U")
        .charAt(0)
        .toUpperCase();


document.getElementById(
    "profileAvatar"
).textContent =
    initial;


document.getElementById(
    "largeAvatar"
).textContent =
    initial;


/* =========================================
   PROFILE COMPLETION
========================================= */

function calculateCompletion() {

    const fields = [

        user.firstName,

        user.lastName,

        user.email,

        user.college,

        user.course,

        user.graduationYear

    ];


    const completed =
        fields.filter(
            value =>
                value !== undefined &&
                value !== null &&
                value !== ""
        ).length;


    const percentage =
        Math.round(
            (completed / fields.length) * 100
        );


    document.getElementById(
        "completionPercentage"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "completionBar"
    ).style.width =
        `${percentage}%`;

}


calculateCompletion();


/* =========================================
   SAVE PROFILE
========================================= */

document
    .getElementById("profileForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            user.firstName =
                firstName.value.trim();


            user.lastName =
                lastName.value.trim();


            user.college =
                college.value.trim();


            user.course =
                course.value.trim();


            user.graduationYear =
                graduationYear.value.trim();


            /*
             * Update the users database
             */

            const users =
                JSON.parse(
                    localStorage.getItem(
                        "skillbridge_users"
                    )
                ) || [];


            const index =
                users.findIndex(
                    item =>
                        item.id === user.id
                );


            if (index !== -1) {

                users[index] = user;

                localStorage.setItem(
                    "skillbridge_users",
                    JSON.stringify(users)
                );

            }


            /*
             * Update current session
             */

            localStorage.setItem(
                "skillbridge_current_user",
                JSON.stringify(user)
            );


            /*
             * Update UI
             */

            const fullName =
                `${user.firstName} ${user.lastName}`
                    .trim();


            document.getElementById(
                "profileName"
            ).textContent =
                fullName;


            document.getElementById(
                "headerName"
            ).textContent =
                fullName;


            const message =
                document.getElementById(
                    "profileMessage"
                );


            message.textContent =
                "Profile updated successfully.";

            message.className =
                "form-message success";


            calculateCompletion();

        }
    );


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