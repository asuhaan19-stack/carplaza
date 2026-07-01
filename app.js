/* 
  Car Plaza Landing Page Interactive Scripts
*/

document.addEventListener('DOMContentLoaded', () => {
  // --- Sticky Navbar ---
  const navbar = document.querySelector('.navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial run on load

  // --- Mobile Drawer Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    // Lock body scroll when mobile menu is active
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // --- Smooth Scrolling Active Section Spy ---
  const sections = document.querySelectorAll('section, header');
  
  const spyScroll = () => {
    const scrollPos = window.scrollY + 200; // Offset for navbar height and visual feel

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        const id = sec.getAttribute('id');
        if (id) {
          links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      }
    });
  };

  window.addEventListener('scroll', spyScroll);
  spyScroll();

  // --- Intersection Observer for Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Stat Counters Animation ---
  const statsSection = document.querySelector('.about-visual');
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const suffix = stat.getAttribute('data-suffix') || '';
      const decimals = parseInt(stat.getAttribute('data-decimals') || '0');
      let count = 0;
      const duration = 2000; // 2 seconds
      const frameRate = 1000 / 60; // 60fps
      const steps = duration / frameRate;
      const stepValue = target / steps;

      const updateCount = () => {
        count += stepValue;
        if (count >= target) {
          stat.textContent = target.toFixed(decimals) + suffix;
        } else {
          stat.textContent = count.toFixed(decimals) + suffix;
          requestAnimationFrame(updateCount);
        }
      };

      updateCount();
    });
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedStats) {
        animateStats();
        animatedStats = true;
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // --- Booking Slot Form Submission Handling ---
  const bookingForm = document.getElementById('bookingForm');
  const formStatus = document.getElementById('formStatus');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get values
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const vehicle = document.getElementById('vehicle').value.trim();
      const service = document.getElementById('service').value;
      const date = document.getElementById('date').value;
      const notes = document.getElementById('notes').value.trim();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');

      if (!name || !phone || !vehicle || !service || !date) {
        showStatus('Please fill in all required booking fields.', 'error');
        return;
      }

      // Disable button, show sending status
      submitBtn.disabled = true;
      const origBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = `Registering Slot...`;
      formStatus.style.display = 'none';

      // Simulate API request (1.5 seconds)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnText;

        // Visual success callback
        const confirmationMsg = `Successfully Registered! Thank you, ${name}. We have saved a booking slot inquiry for your ${vehicle} on ${date}. Our lead specialist will call you directly at ${phone} to confirm the fitting slot details.`;
        showStatus(confirmationMsg, 'success');
        bookingForm.reset();
      }, 1500);
    });
  }

  const showStatus = (msg, type) => {
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;
    formStatus.style.display = 'block';

    // Auto scroll slightly to ensure status message is visible
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
});
