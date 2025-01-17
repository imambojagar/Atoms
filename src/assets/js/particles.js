$(document).ready(function () {

  AOS.init();

    particlesJS("particles-js", {
        "particles": {
          "number": {
            "value": 300,
            "density": {
              "enable": true,
              "value_area":1000
            }
          },
          "color": {
            "value": ["#3DA5E5", "#efefef", "#226187", "#226187"]
          },
          
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#fff"
            },
            "polygon": {
              "nb_sides": 9
            },
            "image": {
              "src": "img/github.svg",
              "width": 350,
              "height": 350
            }
          },
          "opacity": {
            "value": 1,
            "random": false,
            "anim": {
              "enable": true,
              "speed": 2,
              "opacity_min": 0.6,
              "sync": false
            } 
          },
          "size": {
            "value": 7,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 100,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
          },
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "grab"
            },
            "onclick": {
              "enable": false
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 140,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      });
    });