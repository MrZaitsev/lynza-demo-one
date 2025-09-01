import WebApp from '@twa-dev/sdk';

export class TelegramService {
  private static instance: TelegramService;
  
  private constructor() {
    this.init();
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  private init() {
    if (this.isTelegramEnvironment()) {
      WebApp.ready();
      WebApp.expand();
      
      // Set up theme
      WebApp.setHeaderColor('#1a1a2e');
      WebApp.setBackgroundColor('#0f0f23');
      
      // Enable haptic feedback
      WebApp.enableClosingConfirmation();
    }
  }

  public isTelegramEnvironment(): boolean {
    return typeof window !== 'undefined' && (window as any).Telegram?.WebApp;
  }

  public getUser() {
    if (this.isTelegramEnvironment()) {
      return WebApp.initDataUnsafe.user;
    }
    // Return mock user for development
    return {
      id: 12345,
      first_name: 'Demo',
      last_name: 'User',
      username: 'demouser'
    };
  }

  public showAlert(message: string) {
    if (this.isTelegramEnvironment()) {
      WebApp.showAlert(message);
    } else {
      alert(message);
    }
  }

  public showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isTelegramEnvironment()) {
        WebApp.showConfirm(message, resolve);
      } else {
        resolve(confirm(message));
      }
    });
  }

  public hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') {
    if (this.isTelegramEnvironment() && WebApp.HapticFeedback) {
      switch (type) {
        case 'light':
        case 'medium':
        case 'heavy':
          WebApp.HapticFeedback.impactOccurred(type);
          break;
        case 'success':
        case 'warning':
        case 'error':
          WebApp.HapticFeedback.notificationOccurred(type);
          break;
      }
    }
  }

  public setMainButton(text: string, onClick: () => void) {
    if (this.isTelegramEnvironment()) {
      WebApp.MainButton.setText(text);
      WebApp.MainButton.onClick(onClick);
      WebApp.MainButton.show();
    }
  }

  public hideMainButton() {
    if (this.isTelegramEnvironment()) {
      WebApp.MainButton.hide();
    }
  }

  public setBackButton(onClick: () => void) {
    if (this.isTelegramEnvironment()) {
      WebApp.BackButton.onClick(onClick);
      WebApp.BackButton.show();
    }
  }

  public hideBackButton() {
    if (this.isTelegramEnvironment()) {
      WebApp.BackButton.hide();
    }
  }

  public close() {
    if (this.isTelegramEnvironment()) {
      WebApp.close();
    }
  }

  public openTelegramLink(url: string) {
    if (this.isTelegramEnvironment()) {
      WebApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  }

  public openLink(url: string) {
    if (this.isTelegramEnvironment()) {
      WebApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  }

  public getThemeParams() {
    if (this.isTelegramEnvironment()) {
      return WebApp.themeParams;
    }
    // Return dark theme as default
    return {
      bg_color: '#0f0f23',
      text_color: '#ffffff',
      hint_color: '#708499',
      link_color: '#6ab7ff',
      button_color: '#5288c1',
      button_text_color: '#ffffff',
      secondary_bg_color: '#1a1a2e'
    };
  }

  public shareToStory(media_url: string, text?: string) {
    if (this.isTelegramEnvironment() && WebApp.shareToStory) {
      WebApp.shareToStory(media_url, { text });
    }
  }
}

export const telegram = TelegramService.getInstance();
