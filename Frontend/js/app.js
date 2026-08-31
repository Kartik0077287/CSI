document.addEventListener("DOMContentLoaded", () => {

    /*
     * Smooth navigation for internal sections
     */

    const links = document.querySelectorAll(
        'a[href^="#"]'
    );

    links.forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });

});