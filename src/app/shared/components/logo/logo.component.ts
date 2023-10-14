import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { IonicModule, IonImg, AnimationController } from '@ionic/angular';
import type { Animation } from '@ionic/angular';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class LogoComponent implements AfterViewInit {
  @ViewChildren(IonImg, { read: ElementRef }) private images!: QueryList<
    ElementRef<HTMLIonImgElement>
  >;

  private animation: Animation = this.animationCtrl
    .create()
    .duration(500)
    .iterations(3);

  constructor(private animationCtrl: AnimationController) {}

  ngAfterViewInit(): void {
    this.images?.toArray().forEach((e) => {
      const animationPart = this.animationCtrl
        .create()
        .addElement(e.nativeElement)
        .fromTo('transform', 'rotate(0deg)', 'rotate(360deg)');

      this.animation?.addAnimation(animationPart);
    });
  }

  async initAnimation() {
    await this.animation?.play();
    return this.animation;
  }
}
