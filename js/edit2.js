const navDom = document.querySelector('#nav')
const switchDom = document.querySelector('.switch')

switchDom.onclick = () => {
    console.log('ddd')
    navDom.classList.toggle('showNav')
}