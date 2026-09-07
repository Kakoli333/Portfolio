"use strict";

/* ============================================================
   HTML PARTIAL LOADER
   ------------------------------------------------------------
   The portfolio is split into small HTML files for easier
   maintenance. This loader inserts those files into index.html
   and only then starts the main JavaScript.

   IMPORTANT:
   Run the site through a local web server (for example VS Code
   Live Server). Browsers usually block fetch() for file:// URLs.
============================================================ */

(async function loadPageSections() {
    const includeNodes = Array.from(document.querySelectorAll("[data-include]"));

    async function loadPartial(node) {
        const filePath = node.dataset.include;
        if (!filePath) return;

        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath} (${response.status})`);
        }

        const html = await response.text();
        node.insertAdjacentHTML("beforebegin", html);
        node.remove();
    }

    try {
        // Keep document order deterministic.
        for (const node of includeNodes) {
            await loadPartial(node);
        }

        // script.js depends on elements contained in the loaded partials.
        const script = document.createElement("script");
        script.src = "script.js";
        script.defer = true;
        document.body.appendChild(script);
    } catch (error) {
        console.error("Portfolio section loading failed:", error);

        const message = document.createElement("p");
        message.style.cssText = "padding:2rem;text-align:center;font-family:system-ui,sans-serif";
        message.textContent = "Some portfolio sections could not be loaded. Please run the site through a local web server.";
        document.body.appendChild(message);
    }
})();
