


document.addEventListener("DOMContentLoaded", () => {

  /**
   * Load a view into a container dynamically
   * @param {string} viewName - name of the view (e.g., "login", "register", "home")
   * @param {string} containerId - id of the div to inject HTML into
   */
  function loadView(viewName, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    // Fetch the HTML
    fetch(`./views/${viewName}.html`)
      .then(response => response.text())
      .then(html => {
        container.innerHTML = html;

        // Inject CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `/static/css/${viewName}.css`;
        document.head.appendChild(link);

        // Inject JS
        const script = document.createElement("script");
        script.src = `/static/js/${viewName}.js`;
        document.body.appendChild(script);
      })
      .catch(err => console.error(`Error loading ${viewName} page:`, err));
  }

  // load different pages into their respective container
  loadView("login", "login-container");
  loadView("register", "register-container");


});