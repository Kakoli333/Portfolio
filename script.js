(() => {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Theme toggle
  // ============================================================
// THEME TOGGLE
// ============================================================

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    const themeIcon = themeToggle.querySelector("i");

    function updateThemeUI() {
        const isLightTheme =
            document.body.classList.contains("light-theme");

        if (themeIcon) {
            // Show the icon for the theme the user can switch TO
            themeIcon.className = isLightTheme
                ? "bi bi-moon-stars"
                : "bi bi-sun";
        }

        themeToggle.setAttribute(
            "aria-label",
            isLightTheme
                ? "Switch to dark theme"
                : "Switch to light theme"
        );
    }

    // Set correct icon on initial page load
    updateThemeUI();

    // Toggle theme on click
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        updateThemeUI();
    });
}

      // Set correct icon on initial page load
      updateThemeUI();

      // Toggle theme on click
      themeToggle.addEventListener("click", () => {
          document.body.classList.toggle("light-theme");
          updateThemeUI();
      });
  }

  // Typewriter
  const words = [
    "Computer Vision.",
    "Healthcare AI.",
    "Deep Learning.",
    "Natural Language Processing."
  ];
  const typewriter = doc.getElementById("typewriter");
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeStep() {
    if (!typewriter) return;

    if (reduceMotion) {
      typewriter.textContent = words[0];
      return;
    }

    const current = words[wordIndex];
    typewriter.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex < current.length) {
      charIndex++;
      setTimeout(typeStep, 58);
    } else if (!deleting && charIndex === current.length) {
      deleting = true;
      setTimeout(typeStep, 1250);
    } else if (deleting && charIndex > 0) {
      charIndex--;
      setTimeout(typeStep, 30);
    } else {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(typeStep, 260);
    }
  }
  typeStep();

  // Scroll reveal
  const revealItems = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((el) => revealObserver.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("visible"));
  }

  // Animated counters
  const counters = doc.querySelectorAll("[data-count]");
  const animateCounter = (el) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const duration = reduceMotion ? 0 : 1300;

    const frame = (now) => {
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.done) {
          entry.target.dataset.done = "1";
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  // Circular progress
  const ring = doc.querySelector(".score-ring");
  if (ring) {
    const circle = ring.querySelector(".ring-progress");
    const progress = Math.max(0, Math.min(100, Number(ring.dataset.progress || 0)));
    const circumference = 2 * Math.PI * 48;
    circle.style.strokeDasharray = circumference;

    const setRing = () => {
      circle.style.strokeDashoffset = circumference * (1 - progress / 100);
    };

    if ("IntersectionObserver" in window && !reduceMotion) {
      const ringObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setRing();
          ringObserver.disconnect();
        }
      }, { threshold: 0.4 });
      ringObserver.observe(ring);
    } else {
      setRing();
    }
  }

  // Scroll progress and back-to-top
  const progressBar = doc.getElementById("scrollProgress");
  const backToTop = doc.getElementById("backToTop");

  function handleScroll() {
    const scrollTop = root.scrollTop || body.scrollTop;
    const max = root.scrollHeight - root.clientHeight;
    if (progressBar) {
      progressBar.style.width = (max > 0 ? (scrollTop / max) * 100 : 0) + "%";
    }
    if (backToTop) {
      backToTop.classList.toggle("show", scrollTop > 650);
    }
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  // Bootstrap nav: close mobile menu after selection
  const menu = doc.getElementById("navMenu");
  doc.querySelectorAll("#navMenu .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.bootstrap && menu && menu.classList.contains("show")) {
        window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  // Active section in navbar
  const sections = [...doc.querySelectorAll("main section[id], header[id]")];
  const navLinks = [...doc.querySelectorAll("#navMenu .nav-link")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + visible.target.id);
      });
    }, { rootMargin: "-30% 0px -55% 0px", threshold: [0.01, 0.25, 0.5] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const year = doc.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Lightweight animated research network background
  const canvas = doc.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d");
  let points = [];
  let animationId = null;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(48, Math.max(22, Math.floor(rect.width / 26)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25
    }));
  }

  function drawNetwork() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const color = body.classList.contains("light-theme") ? "40,72,110" : "155,202,236";

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (!reduceMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > rect.width) p.vx *= -1;
        if (p.y < 0 || p.y > rect.height) p.vy *= -1;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},.45)`;
      ctx.fill();

      for (let j = i + 1; j < points.length; j++) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${color},${0.13 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!reduceMotion) animationId = requestAnimationFrame(drawNetwork);
  }

  resizeCanvas();
  drawNetwork();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (animationId) cancelAnimationFrame(animationId);
      resizeCanvas();
      drawNetwork();
    }, 120);
  });

  // ===============================
// Publication Filter System
// ===============================

const publicationFilters = document.querySelectorAll(".pub-filter");
const publicationCards = document.querySelectorAll(".publication-card");
const publicationEmpty = document.getElementById("publicationEmpty");

publicationFilters.forEach((button) => {

  button.addEventListener("click", () => {

    const selectedFilter = button.dataset.filter;

    // Update active button
    publicationFilters.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    let visibleCount = 0;

    publicationCards.forEach((card) => {

      const tags = card.dataset.tags
        .toLowerCase()
        .split(" ");

      const shouldShow =
        selectedFilter === "all" ||
        tags.includes(selectedFilter);

      if (shouldShow) {

        card.classList.remove("hide-publication");

        // restart animation
        card.classList.remove("filter-show");

        void card.offsetWidth;

        card.classList.add("filter-show");

        visibleCount++;

      } else {

        card.classList.add("hide-publication");
        card.classList.remove("filter-show");

      }

    });

    // Empty state
    if (publicationEmpty) {
      publicationEmpty.style.display =
        visibleCount === 0 ? "block" : "none";
    }

  });

});


// ============================================================
// PROJECT CAROUSEL
// ============================================================

const projectTrack =
    document.getElementById("projectCarouselTrack");

const projectSlides =
    document.querySelectorAll(".portfolio-project-slide");

const projectPrev =
    document.getElementById("projectPrev");

const projectNext =
    document.getElementById("projectNext");

const projectDots =
    document.querySelectorAll(".project-carousel-dot");

const projectCurrent =
    document.getElementById("projectCurrent");

let currentProjectSlide = 0;


/**
 * Displays the requested project slide and updates
 * the carousel indicators.
 */
function showProjectSlide(index) {

    if (!projectTrack || projectSlides.length === 0) {
        return;
    }


    // Wrap around when reaching either end
    if (index < 0) {
        currentProjectSlide =
            projectSlides.length - 1;

    } else if (index >= projectSlides.length) {

        currentProjectSlide = 0;

    } else {

        currentProjectSlide = index;

    }


    // Move the entire carousel track
    projectTrack.style.transform =
        `translateX(-${currentProjectSlide * 100}%)`;


    // Update navigation dots
    projectDots.forEach((dot, dotIndex) => {

        dot.classList.toggle(
            "active",
            dotIndex === currentProjectSlide
        );

    });


    // Update numerical counter
    if (projectCurrent) {

        projectCurrent.textContent =
            String(currentProjectSlide + 1)
                .padStart(2, "0");

    }

}


/* Previous project */

if (projectPrev) {

    projectPrev.addEventListener("click", () => {

        showProjectSlide(
            currentProjectSlide - 1
        );

    });

}


/* Next project */

if (projectNext) {

    projectNext.addEventListener("click", () => {

        showProjectSlide(
            currentProjectSlide + 1
        );

    });

}


/* Project navigation dots */

projectDots.forEach((dot) => {

    dot.addEventListener("click", () => {

        const slideIndex =
            Number(dot.dataset.projectSlide);

        showProjectSlide(slideIndex);

    });

});


/* Initialize carousel */

showProjectSlide(0);



// ============================================================
// PROJECT IMAGE GALLERIES
// ============================================================

const projectGalleries =
    document.querySelectorAll(".project-thumbnails");


projectGalleries.forEach((gallery) => {

    const galleryName =
        gallery.dataset.gallery;

    const mainImage =
        document.querySelector(
            `[data-gallery-main="${galleryName}"]`
        );


    const thumbnails =
        gallery.querySelectorAll(
            ".project-thumbnail"
        );


    thumbnails.forEach((thumbnail) => {

        thumbnail.addEventListener(
            "click",
            () => {

                if (!mainImage) {
                    return;
                }


                const newImage =
                    thumbnail.dataset.image;


                if (!newImage) {
                    return;
                }


                // Update active thumbnail
                thumbnails.forEach((item) => {

                    item.classList.remove(
                        "active"
                    );

                });


                thumbnail.classList.add(
                    "active"
                );


                // Smooth image change
                mainImage.style.opacity = "0";


                setTimeout(() => {

                    mainImage.src = newImage;

                    mainImage.style.opacity = "1";

                }, 180);

            }
        );

    });

});

})();
