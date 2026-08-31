/* =========================================
   AUTHENTICATION SYSTEM
========================================= */


/* =========================================
   UTILITY FUNCTIONS
========================================= */

function getUsers() {

    const users =
        localStorage.getItem("skillbridge_users");

    return users ? JSON.parse(users) : [];

}


function saveUsers(users) {

    localStorage.setItem(
        "skillbridge_users",
        JSON.stringify(users)
    );

}


function showMessage(element, message, type) {

    if (!element) return;

    element.textContent = message;

    element.className =
        `form-message ${type}`;

}


/* =========================================
   PASSWORD TOGGLE
========================================= */

const passwordToggle =
    document.getElementById("passwordToggle");

if (passwordToggle) {

    passwordToggle.addEventListener(
        "click",
        () => {

            const password =
                document.getElementById("password");

            if (password.type === "password") {

                password.type = "text";

                passwordToggle.textContent = "Hide";

            } else {

                password.type = "password";

                passwordToggle.textContent = "Show";

            }

        }
    );

}


/* =========================================
   ROLE FIELD DISPLAY
========================================= */

const roleInputs =
    document.querySelectorAll(
        'input[name="role"]'
    );

roleInputs.forEach(input => {

    input.addEventListener(
        "change",
        () => {

            const role = input.value;

            const studentFields =
                document.getElementById(
                    "studentFields"
                );

            const academiaFields =
                document.getElementById(
                    "academiaFields"
                );

            const industryFields =
                document.getElementById(
                    "industryFields"
                );


            if (studentFields) {

                studentFields.classList.toggle(
                    "hidden",
                    role !== "student"
                );

            }


            if (academiaFields) {

                academiaFields.classList.toggle(
                    "hidden",
                    role !== "academia"
                );

            }


            if (industryFields) {

                industryFields.classList.toggle(
                    "hidden",
                    role !== "industry"
                );

            }

        }
    );

});


/* =========================================
   REGISTRATION
========================================= */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const firstName =
                document.getElementById(
                    "firstName"
                ).value.trim();


            const lastName =
                document.getElementById(
                    "lastName"
                ).value.trim();


            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim().toLowerCase();


            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            const role =
                document.querySelector(
                    'input[name="role"]:checked'
                );


            const message =
                document.getElementById(
                    "registerMessage"
                );


            if (!role) {

                showMessage(
                    message,
                    "Please select your role.",
                    "error"
                );

                return;

            }


            const selectedRole =
                role.value;


            const users = getUsers();


            /* Check existing account */

            const existingUser =
                users.find(
                    user =>
                        user.email === email
                );


            if (existingUser) {

                showMessage(
                    message,
                    "An account with this email already exists.",
                    "error"
                );

                return;

            }


            /* Build user object */

            const user = {

                id:
                    "USR-" +
                    Date.now(),

                firstName,

                lastName,

                email,

                password,

                role: selectedRole,

                createdAt:
                    new Date().toISOString()

            };


            /* Role-specific information */

            if (selectedRole === "student") {

                user.college =
                    document.getElementById(
                        "college"
                    ).value.trim();

                user.course =
                    document.getElementById(
                        "course"
                    ).value.trim();

                user.graduationYear =
                    document.getElementById(
                        "graduationYear"
                    ).value;

            }


            if (selectedRole === "academia") {

                user.institution =
                    document.getElementById(
                        "institutionName"
                    ).value.trim();

                user.department =
                    document.getElementById(
                        "department"
                    ).value.trim();

            }


            if (selectedRole === "industry") {

                user.company =
                    document.getElementById(
                        "companyName"
                    ).value.trim();

                user.industry =
                    document.getElementById(
                        "industryType"
                    ).value;

            }


            /* Save */

            users.push(user);

            saveUsers(users);


            showMessage(
                message,
                "Account created successfully. Redirecting to login...",
                "success"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                1200
            );

        }
    );

}


/* =========================================
   LOGIN
========================================= */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                document.getElementById(
                    "email"
                ).value.trim().toLowerCase();


            const password =
                document.getElementById(
                    "password"
                ).value;


            const role =
                document.getElementById(
                    "loginRole"
                ).value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            if (!role) {

                showMessage(
                    message,
                    "Please select your role.",
                    "error"
                );

                return;

            }


            const users = getUsers();


            const user =
                users.find(
                    item =>
                        item.email === email &&
                        item.password === password &&
                        item.role === role
                );


            if (!user) {

                showMessage(
                    message,
                    "Invalid email, password or role.",
                    "error"
                );

                return;

            }


            /* Save active session */

            localStorage.setItem(
                "skillbridge_current_user",
                JSON.stringify(user)
            );


            showMessage(
                message,
                "Login successful. Redirecting...",
                "success"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "dashboard.html";

                },
                800
            );

        }
    );

}