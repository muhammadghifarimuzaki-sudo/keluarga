/**
 * PORTOFOLIO KELUARGA KAMI - INTERACTIVE JS
 * Fitur: Hero Quote Rotator, Filter Anggota & Modal Detail,
 * Lightbox Galeri, Tambah Kenangan (LocalStorage), Timeline Reveal,
 * Dinding Doa & Pesan Interaktif, Musik Akustik Sintetis (Web Audio API),
 * Kuis Trivia, dan Tema Hangat/Malam.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. TEMA HANGAT / MALAM (THEME SWITCHER)
  // =========================================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeToggleBtn.querySelector('.theme-icon');
  
  const savedTheme = localStorage.getItem('keluarga_theme') || 'warm-light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'warm-light' ? 'warm-dark' : 'warm-light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('keluarga_theme', newTheme);
    updateThemeIcon(newTheme);
    triggerAudioChime(440, 'sine', 0.1);
  });

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.textContent = theme === 'warm-light' ? '☀️' : '🌙';
    }
  }

  // =========================================================================
  // 2. MOBILE MENU DRAWER
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileDrawer.classList.toggle('open', !isExpanded);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // =========================================================================
  // 3. SCROLL SPY & BACK TO TOP
  // =========================================================================
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 4. STATS COUNTER ANIMATION
  // =========================================================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsCounted = false;

  function countUpStats() {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      let count = 0;
      const speed = Math.ceil(target / 40);

      const updateCount = () => {
        count += speed;
        if (count < target) {
          stat.innerText = count;
          setTimeout(updateCount, 40);
        } else {
          stat.innerText = target;
        }
      };
      updateCount();
    });
  }

  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsCounted) {
      statsCounted = true;
      countUpStats();
    }
  }, { threshold: 0.3 });

  const heroSection = document.getElementById('hero');
  if (heroSection) heroObserver.observe(heroSection);

  // =========================================================================
  // 5. HERO QUOTE ROTATOR
  // =========================================================================
  const familyQuotes = [
    {
      text: "Keluarga adalah kompas yang memandu jalan kita. Mereka adalah inspirasi untuk mencapai ketinggian, dan kenyamanan saat kita sesekali goyah.",
      author: "Nilai Kehidupan Keluarga"
    },
    {
      text: "Rumah bukanlah tentang seberapa megah dindingnya, tetapi tentang seberapa hangat tawa dan doa yang terdengar di dalamnya.",
      author: "Pesan Ayah & Ibu"
    },
    {
      text: "Baitii Jannatii — Rumahku adalah Surgaku. Tempat berpulang terbaik dari hiruk pikuk dunia luar.",
      author: "Motto Keluarga"
    },
    {
      text: "Saling mendukung di saat sulit, saling merayakan di kala bahagia. Itulah arti sejati dari sebuah keluarga.",
      author: "Renungan Bersama"
    },
    {
      text: "Doa tulus seorang ibu dan ridho seorang ayah adalah pelindung tak kasat mata bagi langkah anak-anaknya.",
      author: "Untaian Kasih Sayang"
    }
  ];

  let currentQuoteIndex = 0;
  const quoteTextEl = document.getElementById('quoteText');
  const quoteAuthorEl = document.getElementById('quoteAuthor');
  const nextQuoteBtn = document.getElementById('nextQuoteBtn');

  if (nextQuoteBtn) {
    nextQuoteBtn.addEventListener('click', () => {
      currentQuoteIndex = (currentQuoteIndex + 1) % familyQuotes.length;
      quoteTextEl.style.opacity = '0';
      quoteAuthorEl.style.opacity = '0';
      triggerAudioChime(520, 'sine', 0.1);

      setTimeout(() => {
        quoteTextEl.textContent = `"${familyQuotes[currentQuoteIndex].text}"`;
        quoteAuthorEl.textContent = `— ${familyQuotes[currentQuoteIndex].author}`;
        quoteTextEl.style.opacity = '1';
        quoteAuthorEl.style.opacity = '1';
      }, 200);
    });
  }

  // =========================================================================
  // 6. HERO MINI CARDS INTERACTION (SWAP TO MAIN VIEW)
  // =========================================================================
  const heroFeaturedImg = document.getElementById('heroFeaturedImg');
  const heroFeaturedCaption = document.getElementById('heroFeaturedCaption');
  const miniCards = document.querySelectorAll('.mini-card');

  miniCards.forEach(mini => {
    mini.addEventListener('click', () => {
      const miniImg = mini.querySelector('img');
      const caption = mini.getAttribute('data-caption');
      if (heroFeaturedImg && miniImg) {
        // Swap src
        const tempSrc = heroFeaturedImg.src;
        const tempAlt = heroFeaturedImg.alt;
        heroFeaturedImg.src = miniImg.src;
        heroFeaturedImg.alt = miniImg.alt;
        miniImg.src = tempSrc;
        miniImg.alt = tempAlt;

        if (heroFeaturedCaption && caption) {
          heroFeaturedCaption.textContent = caption;
        }

        triggerHeartBurst(mini.getBoundingClientRect().left + 50, mini.getBoundingClientRect().top + 50);
        triggerAudioChime(660, 'sine', 0.15);
      }
    });
  });

  // Mobile Thumb Chips Interaction (Touch-friendly on smartphone)
  const mobileThumbChips = document.querySelectorAll('.mobile-thumb-chip');
  mobileThumbChips.forEach(chip => {
    chip.addEventListener('click', () => {
      mobileThumbChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const src = chip.getAttribute('data-src');
      const caption = chip.getAttribute('data-caption');
      if (heroFeaturedImg && src) {
        heroFeaturedImg.src = src;
        if (heroFeaturedCaption && caption) {
          heroFeaturedCaption.textContent = caption;
        }
        triggerAudioChime(620, 'sine', 0.12);
        const rect = chip.getBoundingClientRect();
        triggerHeartBurst(rect.left + rect.width / 2, rect.top);
      }
    });
  });

  // =========================================================================
  // 7. ANGGOTA KELUARGA (FILTER & PROFIL MODAL)
  // =========================================================================
  const memberTabs = document.querySelectorAll('.member-tab');
  const memberCards = document.querySelectorAll('.member-card');

  memberTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      memberTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      memberCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
      triggerAudioChime(480, 'sine', 0.08);
    });
  });

  // Member Detailed Data
  const memberData = {
    ayah: {
      name: "Ayahanda Tercinta",
      role: "Kepala Keluarga & Pelindung Rumah",
      photo: "assets/images/ayah.jpg",
      tagline: "Tiang penyangga keluarga yang bijaksana, tekun, dan penuh kasih.",
      bio: "Ayah adalah sosok yang senantiasa bekerja keras demi masa depan anak-anak. Menyukai ketenangan alam terbuka, suasana pantai, dan diskusi santai di beranda ditemani secangkir kopi hitam.",
      hobbies: ["Wisata Alam & Pantai", "Fotografi Pemandangan", "Ngopi & Diskusi Santai", "Otomotif & Merawat Rumah"],
      trivia: [
        "Selalu menjadi orang pertama yang bangun di pagi hari.",
        "Senang mengajak keluarga berlibur menikmati desiran ombak pantai.",
        "Motto hidup: 'Kebaikan kecil yang konsisten lebih berharga daripada niat besar yang tak terlaksana.'"
      ]
    },
    ibu: {
      name: "Ibunda Tersayang",
      role: "Ratu Rumah Tangga & Sumber Kehangatan",
      photo: "assets/images/ibu.jpg",
      tagline: "Senyuman manis penyejuk hati dan doa yang senantiasa menembus langit.",
      bio: "Ibu adalah pusat kehangatan dalam rumah kami. Kelembutan tutur katanya dan sajian masakannya yang tiada tara selalu membuat siapa saja rindu untuk segera pulang ke rumah.",
      hobbies: ["Memasak Menu Rumahan", "Tadarus Al-Qur'an", "Merawat Tanaman Hias", "Merajut Silaturahmi"],
      trivia: [
        "Paling hafal makanan favorit setiap anggota keluarga.",
        "Doanya tak pernah putus di sepertiga malam untuk keselamatan anak-anak.",
        "Semboyan kasih: 'Keluarga yang bahagia berawal dari hati yang penuh rasa syukur.'"
      ]
    },
    anak1: {
      name: "Putra Sulung (Anak Pertama)",
      role: "Putra Sulung / Harapan & Teladan Adik",
      photo: "assets/images/anak_sulung.jpg",
      tagline: "Tegap, berwibawa, berjiwa pemimpin dan tekun menyongsong masa depan cerah.",
      bio: "Sebagai anak sulung, ia tumbuh menjadi sosok pemuda yang bertanggung jawab, berwibawa, dan siap menghadapi dunia profesional demi membanggakan kedua orang tua dan menjadi panutan bagi sang adik.",
      hobbies: ["Studi Profesional & Karir", "Kepemimpinan & Organisasi", "Eksplorasi Teknologi", "Pengembangan Diri"],
      trivia: [
        "Dikenal memiliki wibawa, disiplin tinggi, dan tenang saat menghadapi tantangan.",
        "Memiliki tekad kuat untuk terus belajar dan mandiri dalam berkarir.",
        "Prinsip diri: 'Setiap langkah besar berawal dari kedisiplinan dan niat yang tulus.'"
      ]
    },
    anak2: {
      name: "Putra Kedua (Adik)",
      role: "Putra Kedua / Penyejuk & Pembelajar Gigih",
      photo: "assets/images/anak_kedua.jpg",
      tagline: "Santun, hangat, gemar membaca dan menyerap ilmu kebaikan.",
      bio: "Putra kedua adalah sosok penyejuk hati di rumah yang berhati lembut, bersahaja, tekun dalam menuntut ilmu, dan selalu menjaga kedamaian serta keharmonisan keluarga.",
      hobbies: ["Membaca Kitab & Buku", "Mendengarkan Kajian/Podcast", "Keseharian Santun", "Menuntut Ilmu"],
      trivia: [
        "Senang menghabiskan waktu luang dengan membaca dan mendalami wawasan baru.",
        "Selalu menjadi pendengar yang baik dan menyejukkan bagi anggota keluarga lainnya.",
        "Prinsip diri: 'Ilmu dan kelembutan hati adalah sebaik-baiknya bekal kehidupan.'"
      ]
    }
  };

  const memberModal = document.getElementById('memberModal');
  const memberModalContent = document.getElementById('memberModalContent');
  const closeMemberModalBtn = document.getElementById('closeMemberModalBtn');

  function openMemberModal(id) {
    const data = memberData[id];
    if (!data) return;

    memberModalContent.innerHTML = `
      <div class="profile-modal-grid">
        <div class="modal-photo-col text-center">
          <img src="${data.photo}" alt="${data.name}">
          <span class="modal-role-pill">${data.role}</span>
        </div>
        <div class="modal-info-col">
          <h2 class="modal-name">${data.name}</h2>
          <p class="modal-tagline"><em>"${data.tagline}"</em></p>
          <p class="modal-bio">${data.bio}</p>

          <h4 class="modal-section-title">Hobi & Kegemaran</h4>
          <div class="tags-container" style="margin-bottom: 14px;">
            ${data.hobbies.map(h => `<span class="tag">${h}</span>`).join('')}
          </div>

          <h4 class="modal-section-title">Fakta Menarik & Nilai Diri</h4>
          <ul class="modal-trivia-list">
            ${data.trivia.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    memberModal.classList.add('show');
    memberModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    triggerAudioChime(580, 'sine', 0.12);
  }

  function closeMemberModal() {
    memberModal.classList.remove('show');
    memberModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.show-modal-trigger, .expand-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.member-card');
      const id = btn.getAttribute('data-id') || card.getAttribute('data-member');
      openMemberModal(id);
    });
  });

  if (closeMemberModalBtn) {
    closeMemberModalBtn.addEventListener('click', closeMemberModal);
  }

  // =========================================================================
  // 8. GALERI MOMEN (FILTER, LIGHTBOX, & USER UPLOAD LOCALSTORAGE)
  // =========================================================================
  const galleryFilters = document.querySelectorAll('.filter-btn');
  const galleryGrid = document.getElementById('galleryGrid');

  // Filter click
  galleryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');
      const items = document.querySelectorAll('.gallery-item');

      items.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (cat === 'all' || itemCat === cat) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.3s ease';
        } else {
          item.style.display = 'none';
        }
      });
      triggerAudioChime(420, 'sine', 0.08);
    });
  });

  // Lightbox Modal Controls
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxDate = document.getElementById('lightboxDate');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const prevLightboxBtn = document.getElementById('prevLightboxBtn');
  const nextLightboxBtn = document.getElementById('nextLightboxBtn');

  let currentGalleryIndex = 0;
  let visibleGalleryItems = [];

  function updateVisibleGallery() {
    visibleGalleryItems = Array.from(document.querySelectorAll('.gallery-item')).filter(
      item => item.style.display !== 'none'
    );
  }

  function openLightboxAtIndex(index) {
    updateVisibleGallery();
    if (visibleGalleryItems.length === 0) return;

    if (index < 0) index = visibleGalleryItems.length - 1;
    if (index >= visibleGalleryItems.length) index = 0;
    currentGalleryIndex = index;

    const item = visibleGalleryItems[index];
    const img = item.querySelector('img');
    const title = item.getAttribute('data-title');
    const date = item.getAttribute('data-date');
    const desc = item.getAttribute('data-desc');
    const badge = item.querySelector('.gallery-badge')?.textContent || 'Momen';

    lightboxImg.src = img.src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDate.textContent = date;
    lightboxDesc.textContent = desc;
    lightboxCategory.textContent = badge;

    lightboxModal.classList.add('show');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    triggerAudioChime(500, 'sine', 0.1);
  }

  function closeLightbox() {
    lightboxModal.classList.remove('show');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Delegated click for gallery items
  galleryGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) {
      updateVisibleGallery();
      const idx = visibleGalleryItems.indexOf(item);
      openLightboxAtIndex(idx !== -1 ? idx : 0);
    }
  });

  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
  if (prevLightboxBtn) {
    prevLightboxBtn.addEventListener('click', () => openLightboxAtIndex(currentGalleryIndex - 1));
  }
  if (nextLightboxBtn) {
    nextLightboxBtn.addEventListener('click', () => openLightboxAtIndex(currentGalleryIndex + 1));
  }

  // Keyboard navigation for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeMemberModal();
      closeUploadModal();
    }
    if (lightboxModal.classList.contains('show')) {
      if (e.key === 'ArrowLeft') openLightboxAtIndex(currentGalleryIndex - 1);
      if (e.key === 'ArrowRight') openLightboxAtIndex(currentGalleryIndex + 1);
    }
  });

  // Modal Backdrop Click to close
  [memberModal, lightboxModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    }
  });

  // Upload New Memory Modal
  const openUploadModalBtn = document.getElementById('openUploadModalBtn');
  const uploadModal = document.getElementById('uploadModal');
  const closeUploadModalBtn = document.getElementById('closeUploadModalBtn');
  const cancelUploadBtn = document.getElementById('cancelUploadBtn');
  const addMemoryForm = document.getElementById('addMemoryForm');
  const memoryImageInput = document.getElementById('memoryImageInput');
  const filePreviewContainer = document.getElementById('filePreviewContainer');
  const filePreviewImg = document.getElementById('filePreviewImg');

  function openUploadModal() {
    uploadModal.classList.add('show');
    uploadModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeUploadModal() {
    uploadModal.classList.remove('show');
    uploadModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    addMemoryForm.reset();
    filePreviewContainer.style.display = 'none';
  }

  if (openUploadModalBtn) openUploadModalBtn.addEventListener('click', openUploadModal);
  if (closeUploadModalBtn) closeUploadModalBtn.addEventListener('click', closeUploadModal);
  if (cancelUploadBtn) cancelUploadBtn.addEventListener('click', closeUploadModal);

  // Preview local image
  if (memoryImageInput) {
    memoryImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          filePreviewImg.src = event.target.result;
          filePreviewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Load custom memories from LocalStorage
  function loadCustomMemories() {
    const saved = JSON.parse(localStorage.getItem('keluarga_custom_memories') || '[]');
    saved.forEach(mem => {
      appendGalleryItem(mem, false);
    });
  }

  function appendGalleryItem(data, prepend = true) {
    const categoryLabels = {
      keluarga: "Keseharian & Doa",
      alam: "Wisata & Alam",
      sekolah: "Masa Sekolah & Cita"
    };

    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.setAttribute('data-category', data.category);
    div.setAttribute('data-title', data.title);
    div.setAttribute('data-date', data.date || "Momen Baru");
    div.setAttribute('data-desc', data.desc || "Kenangan indah yang baru ditambahkan ke album keluarga.");

    div.innerHTML = `
      <div class="item-inner">
        <img src="${data.imgSrc}" alt="${data.title}" loading="lazy">
        <div class="gallery-badge">${categoryLabels[data.category] || 'Momen'}</div>
        <div class="gallery-overlay">
          <span class="overlay-icon">🔍</span>
          <h4 class="overlay-title">${data.title}</h4>
          <p class="overlay-meta">${data.date || 'Kenangan Berharga'}</p>
        </div>
      </div>
    `;

    if (prepend && galleryGrid.firstChild) {
      galleryGrid.insertBefore(div, galleryGrid.firstChild);
    } else {
      galleryGrid.appendChild(div);
    }
  }

  loadCustomMemories();

  if (addMemoryForm) {
    addMemoryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('memoryTitle').value.trim();
      const category = document.getElementById('memoryCategory').value;
      const desc = document.getElementById('memoryDesc').value.trim();
      const file = memoryImageInput.files[0];

      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const newMemory = {
          title,
          category,
          desc: desc || "Momen tak terlupakan yang baru saja diabadikan.",
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          imgSrc: evt.target.result
        };

        // Save to localStorage
        const existing = JSON.parse(localStorage.getItem('keluarga_custom_memories') || '[]');
        existing.unshift(newMemory);
        try {
          localStorage.setItem('keluarga_custom_memories', JSON.stringify(existing));
        } catch (err) {
          console.warn("Storage quota full, displaying in session only.");
        }

        appendGalleryItem(newMemory, true);
        closeUploadModal();
        triggerConfetti();
        triggerAudioChime(720, 'triangle', 0.2);
      };
      reader.readAsDataURL(file);
    });
  }

  // =========================================================================
  // 9. INTERACTIVE TRIVIA / QUIZ GAME
  // =========================================================================
  const triviaQuestions = [
    {
      q: "Siapa yang paling sering bangun paling pagi dan mengingatkan keluarga untuk beraktivitas dengan penuh semangat?",
      options: [
        { text: "Ayahanda", isCorrect: true },
        { text: "Anak Kedua", isCorrect: false },
        { text: "Tamu", isCorrect: false }
      ],
      praise: "Benar sekali! Ayah selalu menjadi nahkoda pagi yang mengawali hari dengan penuh berkah. ☀️"
    },
    {
      q: "Siapa yang masakannya paling selalu dirindukan saat anak-anak pulang dari perantauan / sekolah?",
      options: [
        { text: "Warung Depan", isCorrect: false },
        { text: "Ibunda Tersayang", isCorrect: true },
        { text: "Tetangga", isCorrect: false }
      ],
      praise: "Tepat! Masakan Ibu tak ada tandingannya di dunia! Penuh cinta dan kehangatan. 🍲"
    },
    {
      q: "Masa kecil anak-anak penuh kenangan saat seru-serunya berniaga minuman di kegiatan apa?",
      options: [
        { text: "Bazar Pramuka SD", isCorrect: true },
        { text: "Pameran Otomotif", isCorrect: false },
        { text: "Turnamen Golf", isCorrect: false }
      ],
      praise: "Luar biasa! Foto bazar seragam pramuka masa SD adalah salah satu kenangan paling mengesankan. 🎒"
    }
  ];

  let currentTriviaIdx = 0;
  const triviaQuestionEl = document.getElementById('triviaQuestion');
  const triviaOptionsEl = document.getElementById('triviaOptions');
  const triviaFeedbackEl = document.getElementById('triviaFeedback');

  function renderTrivia(index) {
    const item = triviaQuestions[index];
    triviaQuestionEl.textContent = `Pertanyaan ${index + 1}: ${item.q}`;
    triviaFeedbackEl.textContent = '';
    triviaFeedbackEl.style.color = '';

    triviaOptionsEl.innerHTML = '';
    item.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'trivia-btn';
      btn.textContent = opt.text;
      btn.setAttribute('data-answer', opt.isCorrect);

      btn.addEventListener('click', () => {
        const allBtns = triviaOptionsEl.querySelectorAll('.trivia-btn');
        allBtns.forEach(b => b.disabled = true);

        if (opt.isCorrect) {
          btn.classList.add('correct');
          triviaFeedbackEl.textContent = item.praise;
          triviaFeedbackEl.style.color = '#10b981';
          triggerHeartBurst(btn.getBoundingClientRect().left + 40, btn.getBoundingClientRect().top);
          triggerAudioChime(660, 'sine', 0.2);

          // Advance to next trivia after 2.5s
          setTimeout(() => {
            currentTriviaIdx = (currentTriviaIdx + 1) % triviaQuestions.length;
            renderTrivia(currentTriviaIdx);
          }, 2600);
        } else {
          btn.classList.add('wrong');
          triviaFeedbackEl.textContent = "Hampir tepat! Coba renungkan lagi kebiasaan manis di rumah ini. 😊";
          triviaFeedbackEl.style.color = '#ef4444';
          triggerAudioChime(220, 'sawtooth', 0.15);

          setTimeout(() => {
            allBtns.forEach(b => {
              b.disabled = false;
              b.classList.remove('wrong');
            });
          }, 1200);
        }
      });

      triviaOptionsEl.appendChild(btn);
    });
  }

  if (triviaQuestionEl && triviaOptionsEl) {
    renderTrivia(0);
  }

  // =========================================================================
  // 10. PESAN & DOA (GUESTBOOK & REAL-TIME LOCALSTORAGE)
  // =========================================================================
  const defaultPrayers = [
    {
      id: "prayer-farel",
      name: "Sodara Farel",
      relation: "Saudara / Sepupu",
      emoji: "⭐",
      message: "Sehat dan sukses selalu untuk sekeluarga! Buat Mas Sulung yang makin berwibawa dan Mas Kedua yang tekun, semoga lancar terus semua ikhtiar dan cita-citanya. Tetap kompak selalu keluarga panutan! 🔥",
      date: "11 November 2026",
      aamiinCount: 16
    },
    {
      id: "prayer-adi",
      name: "Mas Adi",
      relation: "Keluarga / Saudara",
      emoji: "🤲",
      message: "Barakallah fikum untuk Ayah, Ibu, dan adik-adik semua. Semoga rumah ini senantiasa dipenuhi keberkahan, rezeki melimpah yang barokah, serta kebahagiaan dunia hingga akhirat. Aamiin ya Rabbal alamin.",
      date: "10 November 2026",
      aamiinCount: 21
    },
    {
      id: "prayer-firman",
      name: "Mas Firman",
      relation: "Keluarga / Saudara",
      emoji: "❤️",
      message: "Salam hangat penuh kasih untuk seluruh keluarga. Senang sekali melihat kebersamaan dan kehangatan keluarga ini yang selalu saling menguatkan. Sukses terus buat Mas Sulung dan adiknya tercinta!",
      date: "9 November 2026",
      aamiinCount: 14
    },
    {
      id: "prayer-hendra",
      name: "Om Hendra",
      relation: "Paman / Om",
      emoji: "🤲",
      message: "Semoga Allah SWT senantiasa melimpahkan kesehatan, umur panjang, dan ketenangan hati untuk sekeluarga. Bangga melihat putra-putra tumbuh menjadi pemuda yang berakhlak mulia dan berilmu.",
      date: "8 November 2026",
      aamiinCount: 25
    },
    {
      id: "prayer-toni",
      name: "Acu Toni",
      relation: "Acu / Kerabat Keluarga",
      emoji: "🌸",
      message: "Doa tulus dari Acu Toni untuk keluarga tercinta. Semoga selalu rukun, bahagia, dipermudah segala urusan, dan dijauhkan dari segala marabahaya. Selalu menjadi tempat berpulang yang paling damai.",
      date: "7 November 2026",
      aamiinCount: 19
    }
  ];

  const guestbookForm = document.getElementById('guestbookForm');
  const messagesContainer = document.getElementById('messagesContainer');
  const totalPrayersBadge = document.getElementById('totalPrayersBadge');
  const statsPrayers = document.getElementById('statsPrayers');
  const resetWishesBtn = document.getElementById('resetWishesBtn');
  const senderMessage = document.getElementById('senderMessage');
  const charNum = document.getElementById('charNum');

  // Textarea live char counter
  if (senderMessage && charNum) {
    senderMessage.addEventListener('input', () => {
      charNum.textContent = senderMessage.value.length;
    });
  }

  // Quick chips insert text
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-text');
      if (senderMessage) {
        senderMessage.value = text;
        charNum.textContent = text.length;
        senderMessage.focus();
        triggerAudioChime(450, 'sine', 0.08);
      }
    });
  });

  function getStoredPrayers() {
    const data = localStorage.getItem('keluarga_prayers');
    if (!data) {
      localStorage.setItem('keluarga_prayers', JSON.stringify(defaultPrayers));
      return defaultPrayers;
    }
    try {
      const parsed = JSON.parse(data);
      // Ensure the requested family members (Farel, Adi, Firman, Hendra, Toni) exist
      const hasFarel = parsed.some(p => p.name && p.name.includes("Farel"));
      const hasToni = parsed.some(p => p.name && p.name.includes("Toni"));
      if (!hasFarel || !hasToni) {
        // Upgrade prayers list to include the newly requested relatives
        localStorage.setItem('keluarga_prayers', JSON.stringify(defaultPrayers));
        return defaultPrayers;
      }
      return parsed;
    } catch {
      localStorage.setItem('keluarga_prayers', JSON.stringify(defaultPrayers));
      return defaultPrayers;
    }
  }

  function renderPrayers() {
    const prayers = getStoredPrayers();
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';
    prayers.forEach(item => {
      const card = document.createElement('div');
      card.className = 'message-card';
      card.id = item.id;

      card.innerHTML = `
        <div class="msg-header">
          <div class="msg-author-info">
            <div class="msg-avatar">${item.emoji || '🤲'}</div>
            <div>
              <div class="msg-author-name">${escapeHTML(item.name)}</div>
              <div class="msg-relation">${escapeHTML(item.relation)}</div>
            </div>
          </div>
          <span class="msg-date">${escapeHTML(item.date)}</span>
        </div>
        <p class="msg-text">${escapeHTML(item.message)}</p>
        <div class="msg-footer">
          <span style="font-size:0.75rem; color:var(--text-faint);">Doa Tulus Dikirimkan</span>
          <button class="aamiin-btn" data-id="${item.id}" title="Ikut Mengaamiinkan">
            <span>🤲 Aamiin</span>
            <span class="aamiin-count">${item.aamiinCount || 0}</span>
          </button>
        </div>
      `;

      messagesContainer.appendChild(card);
    });

    // Update counters
    if (totalPrayersBadge) totalPrayersBadge.textContent = `${prayers.length} Doa`;
    if (statsPrayers) statsPrayers.textContent = prayers.length;

    // Attach Aamiin like events
    attachAamiinEvents();
  }

  function attachAamiinEvents() {
    document.querySelectorAll('.aamiin-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const countSpan = btn.querySelector('.aamiin-count');
        const prayers = getStoredPrayers();
        const targetPrayer = prayers.find(p => p.id === id);

        if (targetPrayer) {
          targetPrayer.aamiinCount = (targetPrayer.aamiinCount || 0) + 1;
          localStorage.setItem('keluarga_prayers', JSON.stringify(prayers));
          countSpan.textContent = targetPrayer.aamiinCount;
          btn.classList.add('voted');

          const rect = btn.getBoundingClientRect();
          triggerHeartBurst(rect.left + 20, rect.top - 10);
          triggerAudioChime(600, 'triangle', 0.15);
        }
      });
    });
  }

  renderPrayers();

  // Handle Prayer Form Submission
  if (guestbookForm) {
    guestbookForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const relation = document.getElementById('senderRelation').value;
      const message = senderMessage.value.trim();
      const emojiRadio = document.querySelector('input[name="prayerEmoji"]:checked');
      const emoji = emojiRadio ? emojiRadio.value : '🤲';

      if (!name || !message) return;

      const newPrayer = {
        id: 'prayer-' + Date.now(),
        name,
        relation: relation || 'Sahabat Keluarga',
        emoji,
        message,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        aamiinCount: 1
      };

      const prayers = getStoredPrayers();
      prayers.unshift(newPrayer);
      localStorage.setItem('keluarga_prayers', JSON.stringify(prayers));

      guestbookForm.reset();
      charNum.textContent = '0';
      renderPrayers();

      // Celebration
      triggerConfetti();
      triggerAudioChime(660, 'sine', 0.25);

      // Scroll to newly created wish
      const newCard = document.getElementById(newPrayer.id);
      if (newCard) {
        newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // Reset Prayers
  if (resetWishesBtn) {
    resetWishesBtn.addEventListener('click', () => {
      if (confirm("Kembalikan daftar doa ke contoh awal?")) {
        localStorage.removeItem('keluarga_prayers');
        renderPrayers();
      }
    });
  }

  // Escape HTML helper
  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // =========================================================================
  // 11. AMBIENT ACOUSTIC MUSIC SYNTHESIZER (WEB AUDIO API)
  // =========================================================================
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicTimer = null;

  // Gentle pentatonic chord frequencies for warm ambient music
  // Chords: Cmaj7, Am7, Fmaj7, G7
  const ambientChords = [
    [261.63, 329.63, 392.00, 493.88], // C, E, G, B
    [220.00, 261.63, 329.63, 392.00], // A, C, E, G
    [174.61, 220.00, 261.63, 329.63], // F, A, C, E
    [196.00, 246.94, 293.66, 392.00]  // G, B, D, G
  ];

  let chordIndex = 0;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPluckNote(freq, delay = 0, duration = 1.8) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + delay + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration);
  }

  function playArpeggiatedChord() {
    if (!isPlayingMusic) return;
    const currentChord = ambientChords[chordIndex];
    chordIndex = (chordIndex + 1) % ambientChords.length;

    // Pluck notes gently like an acoustic guitar arpeggio
    currentChord.forEach((note, i) => {
      playPluckNote(note, i * 0.45, 2.2);
    });

    // Also a soft high harmonic chime
    playPluckNote(currentChord[1] * 2, 1.2, 1.6);

    musicTimer = setTimeout(playArpeggiatedChord, 2800);
  }

  function startAmbientMusic() {
    initAudio();
    isPlayingMusic = true;
    musicToggleBtn.classList.add('playing');
    musicToggleBtn.querySelector('.music-label').textContent = 'Jeda';
    playArpeggiatedChord();
  }

  function stopAmbientMusic() {
    isPlayingMusic = false;
    clearTimeout(musicTimer);
    musicToggleBtn.classList.remove('playing');
    musicToggleBtn.querySelector('.music-label').textContent = 'Musik';
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (!isPlayingMusic) {
        startAmbientMusic();
      } else {
        stopAmbientMusic();
      }
    });
  }

  // Micro interaction Audio chime helper
  function triggerAudioChime(freq = 440, type = 'sine', duration = 0.1) {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio autoplay restrictions gracefully handled
    }
  }

  // =========================================================================
  // 12. FLOATING HEARTS & CONFETTI ANIMATIONS
  // =========================================================================
  const confettiContainer = document.getElementById('confettiContainer');

  function triggerHeartBurst(x, y) {
    if (!confettiContainer) return;
    const hearts = ['💖', '🤍', '🌸', '✨', '🤲'];
    for (let i = 0; i < 6; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = `${x + (Math.random() * 60 - 30)}px`;
      heart.style.top = `${y + (Math.random() * 40 - 20)}px`;
      heart.style.fontSize = `${1.2 + Math.random() * 0.8}rem`;

      confettiContainer.appendChild(heart);
      setTimeout(() => heart.remove(), 2400);
    }
  }

  function triggerConfetti() {
    if (!confettiContainer) return;
    const colors = ['#d97706', '#f59e0b', '#c25e10', '#be123c', '#10b981', '#3b82f6'];
    for (let i = 0; i < 45; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = `-20px`;
      piece.style.width = `${6 + Math.random() * 8}px`;
      piece.style.height = `${10 + Math.random() * 10}px`;
      piece.style.animationDuration = `${2.2 + Math.random() * 1.8}s`;
      piece.style.animationDelay = `${Math.random() * 0.5}s`;

      confettiContainer.appendChild(piece);
      setTimeout(() => piece.remove(), 4200);
    }
  }

});
