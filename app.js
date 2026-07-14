document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.count-number');
    const animatedCounters = new Set();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !animatedCounters.has(entry.target)) {
                animatedCounters.add(entry.target);
                const counter = entry.target;
                const target = Number(counter.dataset.target || 0);
                const suffix = counter.dataset.suffix || '';
                const prefix = counter.dataset.prefix || '';
                const duration = 1400;

                let startTime = null;

                const animate = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const value = Math.round(target * eased);

                    counter.textContent = `${prefix}${value}${suffix}`;

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        counter.textContent = `${prefix}${target}${suffix}`;
                    }
                };

                requestAnimationFrame(animate);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach((counter) => {
        observer.observe(counter);
    });

    const constructionOverlay = document.getElementById('constructionOverlay');
    const showConstructionOverlay = () => {
        document.body.classList.add('overlay-active');
        if (constructionOverlay) constructionOverlay.classList.add('show');
    };
    const hideConstructionOverlay = () => {
        document.body.classList.remove('overlay-active');
        if (constructionOverlay) constructionOverlay.classList.remove('show');
    };

    if (constructionOverlay) {
        showConstructionOverlay();
        constructionOverlay.addEventListener('click', () => {
            hideConstructionOverlay();
        });
    }
});

// ============ Language dropdown ============
const langSelect = document.getElementById('langSelect');
const langBtn = document.getElementById('langBtn');
const langMenu = document.getElementById('langMenu');
const langCurrent = document.getElementById('langCurrent');

const translations = {
  en: {
    heroTagline: 'Anywhere, Anytime <span>🚀🔥</span>',
    heroTitle: 'Your <span>Entire City</span>, Delivered to Your <span>Doorstep</span>',
    heroDescription: 'We are dedicated to moving whatever you need, whenever you need it, ensuring your items arrive safely while giving you your day back.',
    trustedBrand: 'Trusted Brand',
    trustedAnd: 'and',
    trustedPartners: 'Partners'
  },
  fr: {
    heroTagline: 'Partout, à tout moment <span>🚀🔥</span>',
    heroTitle: 'Votre <span>ville entière</span>, livrée à votre <span>porte</span>',
    heroDescription: 'Nous sommes dédiés à déplacer tout ce dont vous avez besoin, quand vous en avez besoin, en veillant à ce que vos articles arrivent en toute sécurité tout en vous laissant votre journée.',
    trustedBrand: 'Marque de confiance',
    trustedAnd: 'et',
    trustedPartners: 'Partenaires'
  },
  pt: {
    heroTagline: 'Em qualquer lugar, a qualquer hora <span>🚀🔥</span>',
    heroTitle: 'Sua <span>cidade inteira</span>, entregue na sua <span>porta</span>',
    heroDescription: 'Estamos dedicados a mover o que você precisa, quando você precisa, garantindo que seus itens cheguem em segurança enquanto devolvemos o seu dia.',
    trustedBrand: 'Marca confiável',
    trustedAnd: 'e',
    trustedPartners: 'Parceiros'
  },
  sw: {
    heroTagline: 'Popote, wakati wowote <span>🚀🔥</span>',
    heroTitle: 'Mji wako mzima, ukiletwa kwa <span>mlango wako</span>',
    heroDescription: 'Tumejitolea kusafirisha chochote unachohitaji, wakati wowote unachohitaji, tukihakikisha vitu vyako vinawafikia salama huku tukirudisha siku yako.',
    trustedBrand: 'Chapa ya Kuaminika',
    trustedAnd: 'na',
    trustedPartners: 'Wadau'
  }
};

const translatePage = (lang) => {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((element) => {
    const key = element.dataset.i18n;
    const value = translations[lang]?.[key] || translations.en[key] || '';
    element.innerHTML = value;
  });
  document.documentElement.lang = lang;
  langCurrent.textContent = lang;
  localStorage.setItem('selectedLang', lang);
};

const initialLang = localStorage.getItem('selectedLang') || 'en';
translatePage(initialLang);

if (langBtn && langMenu) {
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langSelect.classList.toggle('is-open');
    langBtn.setAttribute('aria-expanded', String(isOpen));
  });

  langMenu.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      langMenu.querySelectorAll('li').forEach(li => li.removeAttribute('aria-selected'));
      item.setAttribute('aria-selected', 'true');
      const selectedLang = item.dataset.lang;
      translatePage(selectedLang);
      langSelect.classList.remove('is-open');
      langBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!langSelect.contains(e.target)) {
      langSelect.classList.remove('is-open');
      langBtn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      langSelect.classList.remove('is-open');
      langBtn.setAttribute('aria-expanded', 'false');
    }
  });
}