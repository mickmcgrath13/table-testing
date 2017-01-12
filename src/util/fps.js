import Stats from 'stats.js'

export default function() {
  var stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  stats.dom.style.setProperty('left', undefined);
  stats.dom.style.setProperty('right', '0px');
  document.body.appendChild(stats.dom);
  requestAnimationFrame(function loop(){
    stats.update();
    requestAnimationFrame(loop)
  });
}