import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import * as AOS from 'aos';
declare var particlesJS: any;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'atoms';
  constructor(private cdr: ChangeDetectorRef) {
    console.log(AOS); // loaded script
  }

  ngOnInit() {
    AOS.init();
    particlesJS.load('particles-js', '../assets/particles.json', null);
  }
  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  // public invokeParticles(): void {
  //   particlesJS.load('particles-js', ParticlesConfig, null);
  // }
}
// export const ParticlesConfig = {
//   "particles": {
//     "number": {
//       "value": 300,
//       "density": {
//         "enable": true,
//         "value_area": 1000
//       }
//     },
//     "color": {
//       "value": ["#3DA5E5", "#efefef", "#226187", "#226187"]
//     },

//     "shape": {
//       "type": "circle",
//       "stroke": {
//         "width": 0,
//         "color": "#fff"
//       },
//       "polygon": {
//         "nb_sides": 9
//       },
//       "image": {
//         "src": "img/github.svg",
//         "width": 350,
//         "height": 350
//       }
//     },
//     "opacity": {
//       "value": 1,
//       "random": false,
//       "anim": {
//         "enable": true,
//         "speed": 2,
//         "opacity_min": 0.6,
//         "sync": false
//       }
//     },
//     "size": {
//       "value": 7,
//       "random": true,
//       "anim": {
//         "enable": false,
//         "speed": 40,
//         "size_min": 0.1,
//         "sync": false
//       }
//     },
//     "line_linked": {
//       "enable": true,
//       "distance": 100,
//       "color": "#ffffff",
//       "opacity": 0.4,
//       "width": 1
//     },
//   },
//   "interactivity": {
//     "detect_on": "canvas",
//     "events": {
//       "onhover": {
//         "enable": true,
//         "mode": "grab"
//       },
//       "onclick": {
//         "enable": false
//       },
//       "resize": true
//     },
//     "modes": {
//       "grab": {
//         "distance": 140,
//         "line_linked": {
//           "opacity": 1
//         }
//       },
//       "bubble": {
//         "distance": 400,
//         "size": 40,
//         "duration": 2,
//         "opacity": 8,
//         "speed": 3
//       },
//       "repulse": {
//         "distance": 200,
//         "duration": 0.4
//       },
//       "push": {
//         "particles_nb": 4
//       },
//       "remove": {
//         "particles_nb": 2
//       }
//     }
//   },
//   "retina_detect": true
// }
