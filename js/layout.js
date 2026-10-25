/* Load the navbar and footer from their own HTML files on every page. */
var siteRoot = document.body.getAttribute("data-root");
var currentPage = document.body.getAttribute("data-page");

function showLayoutMessage(containerId, message) {
    var container = document.getElementById(containerId);
    container.textContent = message;
    container.classList.add("page-wrapper", "layout-message");
}

function loadComponent(containerId, filename) {
    var container = document.getElementById(containerId);

    return fetch(siteRoot + "/html/" + filename)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("The shared file could not be loaded.");
            }
            return response.text();
        })
        .then(function(markup) {
            var lowerMarkup = markup.toLowerCase();
            var expectedClass = filename === "navbar.html" ? "site-header" : "site-footer";
            if (lowerMarkup.indexOf("<html") !== -1 ||
                    lowerMarkup.indexOf("<!doctype") !== -1 ||
                    markup.indexOf('class="' + expectedClass + '"') === -1) {
                throw new Error("The response is not the requested shared component.");
            }

            container.innerHTML = markup;

            var links = container.querySelectorAll("a[href]");
            for (var i = 0; i < links.length; i++) {
                links[i].setAttribute("href", siteRoot + "/" + links[i].getAttribute("href"));
            }

            var images = container.querySelectorAll("img[src]");
            for (var j = 0; j < images.length; j++) {
                images[j].setAttribute("src", siteRoot + "/" + images[j].getAttribute("src"));
            }

            if (containerId === "navbar-placeholder") {
                var activeLink = container.querySelector('[data-page="' + currentPage + '"]');
                if (activeLink) {
                    activeLink.classList.add("active");
                    activeLink.setAttribute("aria-current", "page");
                }
                setupNavbar();
            }
        })
        .catch(function() {
            showLayoutMessage(containerId, "This part of the page could not be loaded. Please refresh the page.");
        });
}

if (window.location.protocol === "file:") {
    showLayoutMessage("navbar-placeholder", "Open this project with VS Code Live Server to load the navigation and footer.");
} else {
    loadComponent("navbar-placeholder", "navbar.html");
    loadComponent("footer-placeholder", "footer.html");
}
