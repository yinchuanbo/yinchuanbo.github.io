/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}
/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll(".nav__link");
const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.remove("show-menu");
};
navLink.forEach((n) => n.addEventListener("click", linkAction));
/*=============== ADD BLUR HEADER ===============*/
const scrollHeader = () => {
  const header = document.getElementById("header");
  this.scrollY >= 50
    ? header.classList.add("scroll-header")
    : header.classList.remove("scroll-header");
};
window.addEventListener("scroll", scrollHeader);
/*=============== GSAP ANIMATION ===============*/
gsap.from(".home__img-1", 5, { opacity: 0, x: 400 });
gsap.from(".home__img-6", 1.5, {
  opacity: 0,
  y: 200,
  delay: 0.1,
  ease: "back.out(1.5)",
});
gsap.from(".home__img-3", 1.5, {
  opacity: 0,
  y: 400,
  delay: 0.3,
  ease: "back.out(1.5)",
});
gsap.from(".home__img-5", 1.5, {
  opacity: 0,
  y: 400,
  delay: 0.5,
  ease: "back.out(1.5)",
});
gsap.from(".home__img-2", 1.5, {
  opacity: 0,
  y: 400,
  delay: 0.8,
  ease: "back.out(1.5)",
});
gsap.from(".home__img-4", 1.5, {
  opacity: 0,
  y: 200,
  delay: 1.8,
  ease: "back.out(1.5)",
});
gsap.from(".home__data", 1.5, {
  opacity: 0,
  y: -100,
  delay: 2.5,
  ease: "back.out(1.5)",
});
gsap.from(".home__lantern-1", 1.5, {
  opacity: 0,
  x: 70,
  delay: 3,
  ease: "back.out(1.5)",
});
gsap.from(".home__lantern-2", 1.5, {
  opacity: 0,
  x: -70,
  delay: 3.5,
  ease: "back.out(1.5)",
});
/*=============== SAKURA ANIMATION ===============*/
const sakura = new Sakura(".sakura-petals");
