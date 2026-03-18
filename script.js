// SmileNest Dental Clinic - Interactive Elements

document.addEventListener('DOMContentLoaded', () => {
    
    // ================== Navbar Scroll Effect ==================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ================== Mobile Menu Toggle ==================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const icon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // ================== Scroll Animations (Intersection Observer) ==================
    const fadeUpElements = document.querySelectorAll('.fade-in-up');
    const slideLeftElements = document.querySelectorAll('.slide-in-left');
    const slideRightElements = document.querySelectorAll('.slide-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    fadeUpElements.forEach(el => observer.observe(el));
    slideLeftElements.forEach(el => observer.observe(el));
    slideRightElements.forEach(el => observer.observe(el));

    // ================== Reviews Image Scroll ==================
    const reviewsTrack = document.getElementById('reviewsTrack');
    const nextBtn = document.querySelector('.reviews .next-btn');
    const prevBtn = document.querySelector('.reviews .prev-btn');

    if (reviewsTrack && nextBtn && prevBtn) {
        // Amount to scroll per click (approximate width of one image + gap)
        const scrollAmount = 415;

        const scrollRight = () => {
             if (reviewsTrack.scrollLeft + reviewsTrack.clientWidth >= reviewsTrack.scrollWidth - 10) {
                 // Reached the end, scroll back to start
                 reviewsTrack.scrollTo({ left: 0, behavior: 'smooth' });
             } else {
                 reviewsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
             }
        };

        nextBtn.addEventListener('click', () => {
            scrollRight();
        });

        prevBtn.addEventListener('click', () => {
            reviewsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        
        // Auto side scroll animation
        let autoScrollInterval = setInterval(scrollRight, 3000);

        // Pause auto-scroll on hover or touch
        reviewsTrack.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
        reviewsTrack.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(scrollRight, 3000);
        });
        reviewsTrack.addEventListener('touchstart', () => clearInterval(autoScrollInterval));
        reviewsTrack.addEventListener('touchend', () => {
            autoScrollInterval = setInterval(scrollRight, 3000);
        });
    }

});

// ================== Modal Logic ==================
const modal = document.getElementById('bookingModal');

function openBookingModal(e) {
    if(e) e.preventDefault(); // Prevent default link behavior if triggered by <a>
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeBookingModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside content
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeBookingModal();
    }
});

// ================== Form Handling ==================
function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const btn = e.target.querySelector('button');
    
    // Simulate sending
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.backgroundColor = '#25D366'; // Green success color
        e.target.reset(); // Clear form
        
        // Reset button after 3 seconds
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
            btn.disabled = false;
        }, 3000);
    }, 1500);
}

function handleBookingSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('modalName').value;
    const btn = e.target.querySelector('button');
    
    // Simulate booking
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Request Received!';
        btn.style.backgroundColor = '#25D366';
        
        setTimeout(() => {
            closeBookingModal();
            e.target.reset();
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
            btn.disabled = false;
            
            // Show a simple alert for demo purposes
            setTimeout(() => {
                alert(`Thank you, ${name}! Your appointment request has been received. Our team will contact you shortly to confirm the slot.`);
            }, 300);
        }, 1500);
    }, 1500);
}
