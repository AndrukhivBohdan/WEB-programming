let currentSlide = 0;
let slides = [];
let slidesCont;
let dotsCont;
let slideInterval;
let slideTimeout;

function showSlide(index) {
  slidesCont.style.transform = `translateX(-${index * 100}%)`;
  [...dotsCont.children].forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  currentSlide = index;
}

function changeSlide(step) {
  resetAutoSlide();
  const nextSlide = (currentSlide + step + slides.length) % slides.length;
  showSlide(nextSlide);
}

function createDots() {
  dotsCont.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => {
      resetAutoSlide();
      showSlide(i);
    });
    dotsCont.appendChild(dot);
  });
}

function startAutoSlide() {
  slideInterval = setInterval(() => {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }, 3000);
}

function resetAutoSlide() {
  clearInterval(slideInterval);
  clearTimeout(slideTimeout);
  slideTimeout = setTimeout(() => {
    startAutoSlide();
  }, 1000);
}

function toggleMenu() {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('show');
}

window.addEventListener('DOMContentLoaded', function () {
  slides = document.querySelectorAll('.slide');
  slidesCont = document.querySelector('.slides');
  dotsCont = document.querySelector('.dots');

  createDots();
  showSlide(0);
  startAutoSlide();
});
