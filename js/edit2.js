const navDom = document.querySelector("#nav");
const switchDom = document.querySelector(".switch");

switchDom.onclick = () => {
  navDom.classList.toggle("showNav");
};

const liActive = document.querySelector("#nav li.active");
liActive.scrollIntoView({
  behavior: "smooth",
  block: "center",
  inline: "nearest",
});

const imgs = document.querySelectorAll("main img");
imgs.forEach((img) => {
  img.onclick = () => {
    img.style.opacity = 0;
    let imgHove = document.querySelector(".img-hover");
    if (imgHove) imgHove.remove();
    const src = img.src;
    const html = `
            <div class="img-hover">
              <img src="${src}" />
            </div>
          `;
    document.body.insertAdjacentHTML("beforeend", html);
    document.body.style.overflow = "hidden";
    imgHove = document.querySelector(".img-hover");
    imgHove.onclick = () => {
      imgHove.remove();
      document.body.style.overflow = "initial";
      img.style.opacity = 1;
    };
  };
});
