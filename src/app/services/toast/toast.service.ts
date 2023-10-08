import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly basicToastOptions: ToastOptions = {
    position: 'top',
    duration: 3500,
    color: 'primary',
  };

  constructor(private toastController: ToastController) {}

  async show(options: ToastOptions): Promise<HTMLIonToastElement> {
    const toast = await this.toastController.create({
      ...this.basicToastOptions,
      ...options,
    });

    await toast.present();

    return toast;
  }

  async showDanger(options: ToastOptions): Promise<HTMLIonToastElement> {
    return this.show({ color: 'danger', ...options });
  }
}
