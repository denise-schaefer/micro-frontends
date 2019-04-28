const image = document.querySelector('.magnifier-content');
const height = image.height;

const magnifierHeight = 300;

let y = height - magnifierHeight;

image.onload = function() {
  const imageUrl = image.getAttribute('data-image');

  image.src = imageUrl;
  image.onload = function() {
    y = y <= 0 ? height : y - 25;
    image.style.transform = `translateY(${-1 * y}px)`;

    setInterval(function() {
      y = y <= 0 ? height - magnifierHeight : y - 25;
      image.style.transform = `translateY(${-1 * y}px)`;
    }, 111);
  };
};
