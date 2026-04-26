/**
 * main.js
 * Handles Smooth Scrolling, Custom Cursor, Preloader, Theme, and GSAP Animations
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Lenis Smooth Scrolling ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);


    // --- 2. Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Check if device has touch screen, if so disable custom cursor
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Instant follow for dot
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Delayed follow for outline
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .service-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    } else {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
        document.querySelectorAll('a, button').forEach(el => el.style.cursor = 'pointer');
    }


    // --- 3. Preloader Animation ---
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.progress');
    const brandLogo = document.querySelector('.preloader .brand-logo');

    const tl = gsap.timeline();
    
    // Fade in Logo
    tl.to(brandLogo, { opacity: 1, duration: 1, ease: "power2.out" })
      // Animate progress bar
      .to(progressBar, { width: "100%", duration: 1.5, ease: "power2.inOut" })
      // Fade out Preloader
      .to(preloader, { 
          opacity: 0, 
          duration: 1, 
          ease: "power2.inOut",
          onComplete: () => {
              preloader.style.display = 'none';
              document.body.classList.remove('loading');
              
              // Trigger hero animations after load
              gsap.from(".hero-title", { 
                  y: 50, 
                  opacity: 0, 
                  duration: 1.2, 
                  ease: "power3.out", 
                  stagger: 0.2 
              });
              gsap.from(".hero-subtitle", { 
                  y: 20, 
                  opacity: 0, 
                  duration: 1, 
                  ease: "power3.out", 
                  delay: 0.5 
              });
          }
      });


    // --- 4. Header Scroll State ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // --- 5. Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('.icon');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        icon.textContent = '☼';
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            icon.textContent = '☾';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.textContent = '☼';
        }
    });


    // --- 6. GSAP ScrollTrigger Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Parallax Image Effect
    gsap.utils.toArray('.parallax-image').forEach(image => {
        gsap.to(image, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: image.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Fade Up Elements
    const fadeUpElements = gsap.utils.toArray('.section-title, .about-text p, .service-item');
    fadeUpElements.forEach(el => {
        gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

});
