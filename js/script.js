/*
    Main features: episode popups, a theme switch, and contact validation.
*/

/* FEATURE 1: Open the reflection belonging to the selected episode. */
function openEpisode(episodeId) {
    var sections = document.getElementsByClassName("episode-details");

    // Hide every episode before revealing the one that was clicked.
    for (var i = 0; i < sections.length; i++) {
        sections[i].hidden = true;
    }

    document.getElementById(episodeId).hidden = false;

    var dialog = document.getElementById("episode-dialog");
    dialog.setAttribute("aria-labelledby", episodeId + "-title");
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add("dialog-open");
}

function closeEpisode() {
    document.getElementById("episode-dialog").close();
}

var episodeDialog = document.getElementById("episode-dialog");

if (episodeDialog) {
    // Clicking the backdrop closes the popup.
    episodeDialog.addEventListener("click", function(event) {
        if (event.target === episodeDialog) {
            closeEpisode();
        }
    });

    episodeDialog.addEventListener("close", function() {
        document.body.classList.remove("dialog-open");
    });
}

/* FEATURE 2: Switch themes. */
function updateThemeButton() {
    var button = document.getElementById("theme-button");
    if (!button) {
        return;
    }
    var isLight = document.documentElement.classList.contains("light-mode");

    if (isLight) {
        button.textContent = "Dark mode";
        button.setAttribute("aria-label", "Switch to dark mode");
    } else {
        button.textContent = "Light mode";
        button.setAttribute("aria-label", "Switch to light mode");
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle("light-mode");
    updateThemeButton();

    // Remember the visitor's choice when opening another page.
    try {
        if (document.documentElement.classList.contains("light-mode")) {
            localStorage.setItem("caitlin-theme", "light");
        } else {
            localStorage.setItem("caitlin-theme", "dark");
        }
    } catch (error) {

    }
}


try {
    if (localStorage.getItem("caitlin-theme") === "light") {
        document.documentElement.classList.add("light-mode");
    }
} catch (error) {
//keep default
}

// layout.js calls this after inserting the shared navbar into the page.
function setupNavbar() {
    var button = document.getElementById("theme-button");
    if (!button) {
        return;
    }
    if (!button.hasAttribute("data-theme-ready")) {
        button.addEventListener("click", toggleTheme);
        button.setAttribute("data-theme-ready", "true");
    }
    updateThemeButton();
}

/* FEATURE 3: Validate the contact form and show a safe message preview. */
function validateContact(event) {
    event.preventDefault();

    var name = document.getElementById("contact-name");
    var email = document.getElementById("contact-email");
    var message = document.getElementById("contact-message");
    var error = document.getElementById("form-error");
    var preview = document.getElementById("message-preview");

    error.hidden = true;
    preview.hidden = true;

    if (name.value.trim().length < 2) {
        error.textContent = "Please enter a name with at least two characters.";
        error.hidden = false;
        name.focus();
        return;
    }

    if (!email.checkValidity()) {
        error.textContent = "Please enter a valid email address.";
        error.hidden = false;
        email.focus();
        return;
    }

    if (message.value.trim().length < 10) {
        error.textContent = "Please write a message with at least ten characters.";
        error.hidden = false;
        message.focus();
        return;
    }

    document.getElementById("preview-name").textContent = name.value.trim();
    document.getElementById("preview-email").textContent = email.value.trim();
    document.getElementById("preview-message").textContent = message.value.trim();
    preview.hidden = false;
}

var episodeCards = document.querySelectorAll("[data-episode]");
for (var i = 0; i < episodeCards.length; i++) {
    episodeCards[i].addEventListener("click", function() {
        openEpisode(this.getAttribute("data-episode"));
    });
}

var closeButton = document.getElementById("close-episode");
if (closeButton) {
    closeButton.addEventListener("click", closeEpisode);
}

var contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", validateContact);
}
