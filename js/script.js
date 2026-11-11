// LankaTrail interactions: mobile navigation and accessible hero carousel.
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  primaryNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

const slides = [
  {
    location: "Mirissa, Sri Lanka",
    region: "SOUTHERN COAST",
    image: "img/hero-mirissa-carousel.jpg",
    alt: "Tropical ocean waves and beach in Sri Lanka"
  },
  {
    location: "Ella, Sri Lanka",
    region: "HILL COUNTRY",
    image: "img/ella.jpg",
    alt: "Mountain scenery in the Sri Lankan hill country"
  },
  {
    location: "Sigiriya, Sri Lanka",
    region: "CULTURAL TRIANGLE",
    image: "img/hero-sigiriya-carousel.jpg",
    alt: "Historic rock fortress landscape"
  },
  {
    location: "Yala, Sri Lanka",
    region: "WILDLIFE & NATURE",
    image: "img/hero-yala-carousel.jpg",
    alt: "Wild elephant in a natural habitat"
  }
];

const heroImage = document.querySelector("#hero-image");
const heroLocation = document.querySelector("#hero-location");
const captionKicker = document.querySelector(".caption-kicker");
const dots = [...document.querySelectorAll(".dot")];
let currentSlide = 0;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  const slide = slides[currentSlide];
  if (!heroImage) return;

  // Fade briefly, swap the image, then animate from a closer crop
  // back to its natural scale to create a cinematic zoom-out.
  heroImage.classList.remove("is-zooming");
  heroImage.style.opacity = "0.35";

  window.setTimeout(() => {
    heroImage.style.backgroundImage = `url("${slide.image}")`;
    heroImage.setAttribute("aria-label", slide.alt);
    heroLocation.textContent = slide.location;
    captionKicker.textContent = `${String(currentSlide + 1).padStart(2, "0")} / 04  ·  ${slide.region}`;

    // Force the browser to apply the starting transform before animating.
    void heroImage.offsetWidth;
    heroImage.style.opacity = "1";
    requestAnimationFrame(() => {
      heroImage.classList.add("is-zooming");
    });
  }, 220);

  dots.forEach((dot, i) => {
    const active = i === currentSlide;
    dot.classList.toggle("active", active);
    dot.setAttribute("aria-pressed", String(active));
  });
}
document.querySelector("#hero-prev")?.addEventListener("click", () => showSlide(currentSlide - 1));
document.querySelector("#hero-next")?.addEventListener("click", () => showSlide(currentSlide + 1));
dots.forEach(dot => dot.addEventListener("click", () => showSlide(Number(dot.dataset.slide))));

// Keyboard support for the carousel when the hero image is focused.
heroImage?.setAttribute("tabindex", "0");
heroImage?.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") showSlide(currentSlide - 1);
  if (event.key === "ArrowRight") showSlide(currentSlide + 1);
});


// Settle the initial hero image into its resting scale on first load.
window.addEventListener("load", () => {
  const initialHeroImage = document.querySelector("#hero-image");
  if (initialHeroImage) {
    requestAnimationFrame(() => initialHeroImage.classList.add("is-zooming"));
  }
});


// Automatically advance the hero carousel every 5.5 seconds.
// Pause while the visitor hovers over the hero or focuses a carousel control.
// Respect the visitor's reduced-motion preference.
const AUTOPLAY_INTERVAL = 5500;
const heroCarousel = document.querySelector(".hero-visual");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let autoplayTimer = null;

function stopHeroAutoplay() {
  if (autoplayTimer !== null) {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

function startHeroAutoplay() {
  stopHeroAutoplay();
  if (reducedMotion || document.hidden) return;
  autoplayTimer = window.setInterval(() => showSlide(currentSlide + 1), AUTOPLAY_INTERVAL);
}

if (heroCarousel) {
  heroCarousel.addEventListener("mouseenter", stopHeroAutoplay);
  heroCarousel.addEventListener("mouseleave", startHeroAutoplay);
  heroCarousel.addEventListener("focusin", stopHeroAutoplay);
  heroCarousel.addEventListener("focusout", event => {
    if (!heroCarousel.contains(event.relatedTarget)) startHeroAutoplay();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopHeroAutoplay();
    else startHeroAutoplay();
  });
  startHeroAutoplay();
}


// Client-side validation and confirmation for the travel enquiry form.
const travelForm = document.querySelector("#travel-inquiry-form");
const formStatus = document.querySelector("#form-status");

if (travelForm && formStatus) {
  travelForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!travelForm.checkValidity()) {
      travelForm.reportValidity();
      formStatus.textContent = "Please complete the required fields with valid information.";
      return;
    }

    const travellerName = travelForm.elements.name.value.trim();
    formStatus.textContent = `Thank you, ${travellerName}! Your enquiry has been validated. This demo does not send data to a server.`;
    travelForm.reset();
  });
}
