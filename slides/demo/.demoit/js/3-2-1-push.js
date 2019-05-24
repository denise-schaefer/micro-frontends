const handElements = Array.from(document.querySelectorAll('[data-type="hand"]'));

handElements.forEach(handElement => {
  const originalLeft = parseInt(handElement.style.left);
  const originalTop = parseInt(handElement.style.top);

  const alternativeCoordinates = JSON.parse(
    handElement.getAttribute('data-alternative-coordinates')
  );

  const coordinates = [[originalLeft, originalTop], ...alternativeCoordinates];

  let idx = 0;

  const minTime = 300;
  const maxTime = 1000;
  const randomIntervalTime = Math.floor(Math.random() * maxTime) + minTime;

  setInterval(function wiggle() {
    idx = idx + 1 === coordinates.length ? 0 : idx + 1;
    handElement.style.left = `${coordinates[idx][0]}%`;
    handElement.style.top = `${coordinates[idx][1]}%`;
  }, randomIntervalTime);
});
