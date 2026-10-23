(function () {
  window.dataLayer = window.dataLayer || [];

  var experiment =
    document.body.getAttribute("data-experiment") ||
    (document.querySelector('meta[name="experiment"]') || {}).content ||
    "unknown";

  function track(event, detail) {
    window.dataLayer.push(
      Object.assign(
        {
          event: event,
          experiment_id: experiment
        },
        detail || {}
      )
    );
  }

  track("page_view");

  document.addEventListener("click", function (event) {
    var cta = event.target.closest("[data-cta]");
    if (!cta) return;
    track("cta_click", {
      cta_name: cta.getAttribute("data-cta"),
      cta_location: cta.getAttribute("data-cta-location") || "",
      cta_text: (cta.textContent || "").replace(/\s+/g, " ").trim()
    });
  });

  var newsletter = document.getElementById("newsletter-form");
  if (newsletter) {
    newsletter.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!newsletter.checkValidity()) {
        newsletter.reportValidity();
        return;
      }
      track("newsletter_signup", {
        form_id: newsletter.getAttribute("data-form") || newsletter.id
      });
      newsletter.reset();
    });
  }

  var form = document.getElementById("demo-form");
  var success = document.getElementById("form-success");
  if (!form || !success) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    track("generate_lead", {
      form_id: form.getAttribute("data-form") || form.id
    });
    success.classList.add("is-visible");
    success.focus();
    form.reset();
  });
})();
