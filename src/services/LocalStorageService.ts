import AsyncStorage from '@react-native-async-storage/async-storage';
import { Revenue, User } from '../types';

const REVENUES_KEY = 'feuille_de_suivie_revenues';
const USER_KEY = 'feuille_de_suivie_user';
const SETTINGS_KEY = 'feuille_de_suivie_settings';

class LocalStorageService {
  /**
   * Save revenues to local storage
   */
  async saveRevenues(revenues: Revenue[]): Promise<void> {
    try {
      await AsyncStorage.setItem(REVENUES_KEY, JSON.stringify(revenues));
    } catch (error) {
      console.error('Error saving revenues:', error);
      throw error;
    }
  }

  /**
   * Load revenues from local storage
   */
  async loadRevenues(): Promise<Revenue[]> {
    try {
      const data = await AsyncStorage.getItem(REVENUES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading revenues:', error);
      return [];
    }
  }

  /**
   * Save user to local storage
   */
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  /**
   * Load user from local storage
   */
  async loadUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  }

  /**
   * Clear user data
   */
  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error clearing user:', error);
      throw error;
    }
  }

  /**
   * Save settings
   */
  async saveSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  /**
   * Load settings
   */
  async loadSettings(): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading settings:', error);
      return {};
    }
  }

  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([REVENUES_KEY, USER_KEY, SETTINGS_KEY]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
}

export default new LocalStorageService();