const current = document.querySelector('#current');
const imgs = document.querySelectorAll('.sidepic img');


imgs.forEach(img => img.addEventListener('click', imgClick));

function imgClick(e){
    //Change current image to src of clicked image 
    current.src = e.target.src;
}