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

  private toast?: HTMLIonToastElement;

  constructor(private toastController: ToastController) {}

  async show(options: ToastOptions): Promise<HTMLIonToastElement> {
    try {
      await this.toastController.dismiss();
    } catch (error) {}

    this.toast = await this.toastController.create({
      ...this.basicToastOptions,
      ...options,
    });

    await this.toast.present();

    return this.toast;
  }

  async showDanger(options: ToastOptions): Promise<HTMLIonToastElement> {
    return this.show({ color: 'danger', ...options });
  }

  async showSuccess(options: ToastOptions): Promise<HTMLIonToastElement> {
    return this.show({ color: 'success', ...options });
  }
}
