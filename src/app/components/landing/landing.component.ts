import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  isScrolled = false;
  currentSection = 'home';

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor() {}

  ngOnInit() {
    console.log('Landing component initialized');
  }

  ngAfterViewInit() {
    // Setup Intersection Observer for video auto-play
    this.setupVideoAutoPlay();
  }

  setupVideoAutoPlay() {
    if (this.heroVideo && this.heroVideo.nativeElement) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Video is visible, play it
            this.heroVideo.nativeElement.play().catch((error: any) => {
              console.log('Video autoplay prevented:', error);
            });
          } else {
            // Video is not visible, pause it
            this.heroVideo.nativeElement.pause();
          }
        });
      }, {
        threshold: 0.5 // Play when 50% of video is visible
      });

      observer.observe(this.heroVideo.nativeElement);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
    this.updateActiveSection();
  }

  scrollToSection(sectionId: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  updateActiveSection() {
    const sections = ['home', 'service', 'contact', 'help'];
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          this.currentSection = sectionId;
          break;
        }
      }
    }
  }

  isActive(section: string): boolean {
    return this.currentSection === section;
  }

  onSubmitContact(event: Event) {
    event.preventDefault();
    console.log('Form submitted:', this.contactForm);
    alert('Thank you for your message! We will get back to you soon.');

    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }

}
