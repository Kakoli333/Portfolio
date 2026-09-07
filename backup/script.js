(() => {
  "use strict";

  // ============================================================
  // Shared DOM references and motion preference
  // ============================================================
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ============================================================
  // Theme toggle
  // ============================================================
  const themeToggle = doc.getElementById("themeToggle");
  const themeIcon = themeToggle?.querySelector("i");

  if (themeToggle && themeIcon) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("light-theme");

      const isLight = body.classList.contains("light-theme");
      themeIcon.className = isLight
        ? "bi bi-sun"
        : "bi bi-moon-stars";
    });
  }

  // ============================================================
  // Hero typewriter
  // ============================================================
  const typewriter = doc.getElementById("typewriter");
  const typewriterWords = [
    "Computer Vision.",
    "Healthcare AI.",
    "Deep Learning.",
    "Natural Language Processing.",
  ];

  if (typewriter) {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeStep = () => {
      if (reduceMotion) {
        typewriter.textContent = typewriterWords[0];
        return;
      }

      const currentWord = typewriterWords[wordIndex];
      typewriter.textContent = currentWord.slice(0, charIndex);

      if (!deleting && charIndex < currentWord.length) {
        charIndex += 1;
        window.setTimeout(typeStep, 58);
        return;
      }

      if (!deleting && charIndex === currentWord.length) {
        deleting = true;
        window.setTimeout(typeStep, 1250);
        return;
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1;
        window.setTimeout(typeStep, 30);
        return;
      }

      deleting = false;
      wordIndex = (wordIndex + 1) % typewriterWords.length;
      window.setTimeout(typeStep, 260);
    };

    typeStep();
  }

  // ============================================================
  // Scroll-reveal animation
  // ============================================================
  const revealItems = doc.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // ============================================================
  // Animated statistics counters
  // ============================================================
  const counters = doc.querySelectorAll("[data-count]");

  const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    const decimals = Number(element.dataset.decimals || 0);
    const suffix = element.dataset.suffix || "";

    if (!Number.isFinite(target) || !Number.isFinite(decimals)) {
      return;
    }

    const startTime = performance.now();
    const duration = reduceMotion ? 0 : 1300;

    const update = (now) => {
      const progress =
        duration === 0
          ? 1
          : Math.min((now - startTime) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const value = target * easedProgress;

      element.textContent = `${value.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.target.dataset.done !== "1"
          ) {
            entry.target.dataset.done = "1";
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  // ============================================================
  // CAPT circular accuracy indicator
  // ============================================================
  const scoreRing = doc.querySelector(".score-ring");
  const progressCircle = scoreRing?.querySelector(".ring-progress");

  if (scoreRing && progressCircle) {
    const progress = Math.max(
      0,
      Math.min(100, Number(scoreRing.dataset.progress || 0))
    );

    const circumference = 2 * Math.PI * 48;
    progressCircle.style.strokeDasharray = `${circumference}`;

    const setRingProgress = () => {
      progressCircle.style.strokeDashoffset = `${
        circumference * (1 - progress / 100)
      }`;
    };

    if ("IntersectionObserver" in window && !reduceMotion) {
      const ringObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setRingProgress();
            ringObserver.disconnect();
          }
        },
        { threshold: 0.4 }
      );

      ringObserver.observe(scoreRing);
    } else {
      setRingProgress();
    }
  }

  // ============================================================
  // Page scroll progress and back-to-top button
  // ============================================================
  const progressBar = doc.getElementById("scrollProgress");
  const backToTop = doc.getElementById("backToTop");

  const handleScroll = () => {
    const scrollTop = root.scrollTop || body.scrollTop;
    const maxScroll = root.scrollHeight - root.clientHeight;
    const progress =
      maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (backToTop) {
      backToTop.classList.toggle("show", scrollTop > 650);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  }

  // ============================================================
  // Bootstrap mobile navigation
  // ============================================================
  const navMenu = doc.getElementById("navMenu");

  doc.querySelectorAll("#navMenu .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (
        navMenu &&
        window.bootstrap &&
        navMenu.classList.contains("show")
      ) {
        window.bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    });
  });

  // ============================================================
  // Active navigation link
  // ============================================================
  const sections = [
    ...doc.querySelectorAll("main section[id], header[id]"),
  ];
  const navLinks = [
    ...doc.querySelectorAll("#navMenu .nav-link"),
  ];

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          )[0];

        if (!visibleSection) {
          return;
        }

        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") ===
              `#${visibleSection.target.id}`
          );
        });
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.01, 0.25, 0.5],
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ============================================================
  // Optional dynamic footer year
  // ============================================================
  const yearElement = doc.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ============================================================
  // Animated research-network background
  // ============================================================
  const canvas = doc.getElementById("heroCanvas");
  const context = canvas?.getContext("2d");

  if (canvas && context) {
    let points = [];
    let animationId = null;
    let resizeTimer = null;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const pointCount = Math.min(
        48,
        Math.max(22, Math.floor(rect.width / 26))
      );

      points = Array.from({ length: pointCount }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const drawNetwork = () => {
      const rect = canvas.getBoundingClientRect();

      context.clearRect(0, 0, rect.width, rect.height);

      const color = body.classList.contains("light-theme")
        ? "40,72,110"
        : "155,202,236";

      for (let i = 0; i < points.length; i += 1) {
        const point = points[i];

        if (!reduceMotion) {
          point.x += point.vx;
          point.y += point.vy;

          if (point.x < 0 || point.x > rect.width) {
            point.vx *= -1;
          }

          if (point.y < 0 || point.y > rect.height) {
            point.vy *= -1;
          }
        }

        context.beginPath();
        context.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
        context.fillStyle = `rgba(${color},.45)`;
        context.fill();

        for (let j = i + 1; j < points.length; j += 1) {
          const otherPoint = points[j];
          const dx = point.x - otherPoint.x;
          const dy = point.y - otherPoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance >= 120) {
            continue;
          }

          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(otherPoint.x, otherPoint.y);
          context.strokeStyle =
            `rgba(${color},${0.13 * (1 - distance / 120)})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }

      if (!reduceMotion) {
        animationId = requestAnimationFrame(drawNetwork);
      }
    };

    resizeCanvas();
    drawNetwork();

    window.addEventListener("resize", () => {
      if (resizeTimer) {
        window.clearTimeout(resizeTimer);
      }

      resizeTimer = window.setTimeout(() => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        resizeCanvas();
        drawNetwork();
      }, 120);
    });
  }

  // ============================================================
  // Publication filtering
  // ============================================================
  const publicationFilters =
    doc.querySelectorAll(".pub-filter");
  const publicationCards =
    doc.querySelectorAll(".publication-card");
  const publicationEmpty =
    doc.getElementById("publicationEmpty");

  publicationFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = (
        button.dataset.filter || ""
      )
        .toLowerCase()
        .trim();

      publicationFilters.forEach((filter) => {
        filter.classList.remove("active");
      });

      button.classList.add("active");

      let visibleCount = 0;

      publicationCards.forEach((card) => {
        const tags = (card.dataset.tags || "")
          .toLowerCase()
          .trim()
          .split(/\s+/)
          .filter(Boolean);

        const shouldShow =
          selectedFilter === "all" ||
          tags.includes(selectedFilter);

        if (shouldShow) {
          card.classList.remove("hide-publication");
          card.classList.remove("filter-show");

          // Force reflow so the entrance animation restarts.
          void card.offsetWidth;

          card.classList.add("filter-show");
          visibleCount += 1;
        } else {
          card.classList.add("hide-publication");
          card.classList.remove("filter-show");
        }
      });

      if (publicationEmpty) {
        publicationEmpty.style.display =
          visibleCount === 0 ? "block" : "none";
      }
    });
  });

  // ============================================================
  // Project carousel
  // ============================================================
  const projectTrack =
    doc.getElementById("projectCarouselTrack");
  const projectSlides =
    [...doc.querySelectorAll(".portfolio-project-slide")];
  const projectPrev =
    doc.getElementById("projectPrev");
  const projectNext =
    doc.getElementById("projectNext");
  const projectDots =
    [...doc.querySelectorAll(".project-carousel-dot")];
  const projectCurrent =
    doc.getElementById("projectCurrent");

  let currentProjectSlide = 0;

  const showProjectSlide = (index) => {
    if (!projectTrack || projectSlides.length === 0) {
      return;
    }

    if (index < 0) {
      currentProjectSlide = projectSlides.length - 1;
    } else if (index >= projectSlides.length) {
      currentProjectSlide = 0;
    } else {
      currentProjectSlide = index;
    }

    projectTrack.style.transform =
      `translateX(-${currentProjectSlide * 100}%)`;

    projectSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentProjectSlide;
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    projectDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentProjectSlide;

      dot.classList.toggle("active", isActive);
      dot.setAttribute(
        "aria-current",
        isActive ? "true" : "false"
      );
    });

    if (projectCurrent) {
      projectCurrent.textContent = String(
        currentProjectSlide + 1
      ).padStart(2, "0");
    }
  };

  if (projectPrev) {
    projectPrev.addEventListener("click", () => {
      showProjectSlide(currentProjectSlide - 1);
    });
  }

  if (projectNext) {
    projectNext.addEventListener("click", () => {
      showProjectSlide(currentProjectSlide + 1);
    });
  }

  projectDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const slideIndex = Number(dot.dataset.projectSlide);

      if (Number.isInteger(slideIndex)) {
        showProjectSlide(slideIndex);
      }
    });
  });

  showProjectSlide(0);

  // ============================================================
  // Project image galleries
  // ============================================================
  const projectGalleries =
    doc.querySelectorAll(".project-thumbnails");

  projectGalleries.forEach((gallery) => {
    const galleryName = gallery.dataset.gallery;
    const mainImage = doc.querySelector(
      `[data-gallery-main="${galleryName}"]`
    );
    const thumbnails = [
      ...gallery.querySelectorAll(".project-thumbnail"),
    ];

    if (!mainImage) {
      return;
    }

    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
        const newImage = thumbnail.dataset.image;

        if (!newImage || mainImage.src.endsWith(newImage)) {
          return;
        }

        thumbnails.forEach((item) => {
          item.classList.remove("active");
        });

        thumbnail.classList.add("active");
        mainImage.style.opacity = "0";

        window.setTimeout(() => {
          mainImage.src = newImage;
          mainImage.style.opacity = "1";
        }, reduceMotion ? 0 : 180);
      });
    });
  });
})();
