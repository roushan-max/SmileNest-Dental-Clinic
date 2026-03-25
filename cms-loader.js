// cms-loader.js
// Fetches content from _data JSON files and renders it into the page.
// Netlify CMS saves changes to these JSON files via GitHub commits.
// Netlify auto-redeploys on every commit, so updates appear within ~30 seconds.

(async function () {

  // ── Fetch helper ─────────────────────────────────────────────────────────
  async function fetchJSON(path) {
    try {
      const res = await fetch(path + '?v=' + Date.now()); // prevent stale cache
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('CMS loader: could not load', path, e);
      return null;
    }
  }

  // Generate star icons for a given rating number
  function stars(n) {
    const count = Math.min(Math.max(parseInt(n) || 5, 1), 5);
    return Array(count).fill('<i class="fas fa-star"></i>').join('');
  }

  // ── 1. Clinic Settings ────────────────────────────────────────────────────
  const settings = await fetchJSON('/_data/settings.json');
  if (settings) {
    // Hero call button — update href only, keep the icon + text intact
    const heroCallBtn = document.getElementById('heroCallBtn');
    if (heroCallBtn) {
      heroCallBtn.href = 'tel:' + settings.phone.replace(/[\s\-()]/g, '');
    }

    // Contact section phone link
    const contactPhone = document.getElementById('contactPhone');
    if (contactPhone) {
      contactPhone.href = 'tel:' + settings.phone.replace(/[\s\-()]/g, '');
      contactPhone.textContent = settings.phone;
    }

    // Footer phone link
    const footerPhone = document.getElementById('footerPhone');
    if (footerPhone) {
      footerPhone.href = 'tel:' + settings.phone.replace(/[\s\-()]/g, '');
      footerPhone.textContent = settings.phone;
    }

    // WhatsApp button
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
      whatsappBtn.href = 'https://wa.me/' + settings.whatsapp;
    }

    // Google rating in hero
    const ratingText = document.querySelector('.rating-text');
    if (ratingText) {
      ratingText.innerHTML = `<strong>${settings.rating}</strong> on Google rating`;
    }

    // Contact section address
    const contactAddress = document.getElementById('contactAddress');
    if (contactAddress) {
      contactAddress.innerHTML = `<h4>Location</h4><p>${settings.address}</p>`;
    }

    // Contact section hours
    const contactHours = document.getElementById('contactHours');
    if (contactHours) {
      contactHours.innerHTML = `<h4>Working Hours</h4><p><strong>Mon - Sun:</strong> ${settings.hours}</p>`;
    }

    // Footer address (short version)
    const footerAddress = document.getElementById('footerAddress');
    if (footerAddress) {
      footerAddress.textContent = settings.addressShort || settings.address;
    }

    // Footer hours
    const footerHours = document.getElementById('footerHours');
    if (footerHours) {
      footerHours.textContent = settings.hours;
    }
  }

  // ── 2. Doctor Profile ─────────────────────────────────────────────────────
  const doctorData = await fetchJSON('/_data/doctors.json');
  const doctorProfile = document.getElementById('doctorProfile');
  if (doctorData && doctorProfile) {
    const d = doctorData;
    doctorProfile.innerHTML = `
      <div class="doctor-image-cell">
        <img src="${d.photo}" alt="${d.name}" class="doctor-profile-img">
      </div>
      <div class="doctor-details-cell">
        <h3>${d.name}</h3>
        <p class="doctor-degree">${d.degree}</p>
        <p class="doctor-exp"><i class="fas fa-award"></i> ${d.experience}</p>
        <p class="doctor-bio">${d.bio}</p>
        <ul class="doctor-specialties">
          ${(d.specialties || []).map(s =>
            `<li><i class="fas fa-check-circle" style="color:var(--clr-accent);"></i> ${s}</li>`
          ).join('')}
        </ul>
      </div>
    `;
  }

  // ── 3. Reviews ────────────────────────────────────────────────────────────
  const reviewsData = await fetchJSON('/_data/reviews.json');
  const reviewsTrack = document.getElementById('reviewsTrack');
  if (reviewsData && reviewsData.reviews && reviewsData.reviews.length && reviewsTrack) {
    reviewsTrack.innerHTML = reviewsData.reviews.map(r => `
      <div class="testimonial-card scroll-card">
        <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
        <p class="review-text">"${r.review}"</p>
        <div class="reviewer-info">
          <div class="reviewer-avatar" style="background-color:${r.avatarColor || '#C67D33'}">
            ${r.avatar}
          </div>
          <div class="reviewer-details">
            <h4>${r.name}</h4>
            <div class="rating">${stars(r.rating)}</div>
          </div>
        </div>
      </div>
    `).join('');

    // Re-initialise the review scroll buttons & auto-scroll
    // (script.js runs before reviews are injected, so we set it up again here)
    const nextBtn = document.querySelector('.reviews .next-btn');
    const prevBtn = document.querySelector('.reviews .prev-btn');
    if (nextBtn && prevBtn) {
      const scrollAmount = 415;

      const scrollRight = () => {
        if (reviewsTrack.scrollLeft + reviewsTrack.clientWidth >= reviewsTrack.scrollWidth - 10) {
          reviewsTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          reviewsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      };

      nextBtn.addEventListener('click', scrollRight);
      prevBtn.addEventListener('click', () => {
        reviewsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });

      let autoScroll = setInterval(scrollRight, 3000);
      reviewsTrack.addEventListener('mouseenter', () => clearInterval(autoScroll));
      reviewsTrack.addEventListener('mouseleave', () => { autoScroll = setInterval(scrollRight, 3000); });
      reviewsTrack.addEventListener('touchstart', () => clearInterval(autoScroll));
      reviewsTrack.addEventListener('touchend', () => { autoScroll = setInterval(scrollRight, 3000); });
    }
  }

  // ── 4. Gallery ────────────────────────────────────────────────────────────
  const galleryData = await fetchJSON('/_data/gallery.json');
  const galleryGrid = document.getElementById('galleryGrid');
  const gallerySection = document.getElementById('gallery');

  if (galleryData && galleryData.photos && galleryData.photos.length && galleryGrid) {
    galleryGrid.innerHTML = galleryData.photos.map(item => `
      <div class="gallery-item">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        ${item.caption ? `<div class="gallery-caption">${item.caption}</div>` : ''}
      </div>
    `).join('');
  } else if (gallerySection) {
    // No photos yet — hide the whole gallery section
    gallerySection.style.display = 'none';
  }

})();
