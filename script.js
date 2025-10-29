// Carrossel de Notícias
let currentSlide = 0;

function changeNoticia(n) {
    showNoticia(currentSlide += n);
}

function currentNoticia(n) {
    showNoticia(currentSlide = n);
}

function showNoticia(n) {
    const slides = document.querySelectorAll('.noticia-card');
    const dots = document.querySelectorAll('.dot');
    
    if (n >= slides.length) {
        currentSlide = 0;
    }
    if (n < 0) {
        currentSlide = slides.length - 1;
    }
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Formulário de Contato
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('assunto').value;
        const message = document.getElementById('mensagem').value;
        
        // Simular envio (em produção, isso seria enviado para um servidor)
        console.log('Formulário enviado:', { name, email, subject, message });
        
        // Mostrar mensagem de sucesso
        alert('Obrigado! Sua mensagem foi recebida. Entraremos em contato em breve.');
        contactForm.reset();
    });
}

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animação ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.desafio-card, .valor-card, .realizacao-card, .parceiro-card, .cta-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Auto-rotação do carrossel
setInterval(() => {
    changeNoticia(1);
}, 5000);
