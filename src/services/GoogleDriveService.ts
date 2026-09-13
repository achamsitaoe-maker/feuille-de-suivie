import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';

class GoogleDriveService {
  private accessToken: string | null = null;
  private folderId: string | null = null;

  async authenticate() {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      if (!hasPlayServices) {
        throw new Error('Google Play Services not available');
      }

      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      this.accessToken = tokens.accessToken;
      return userInfo;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await GoogleSignin.signOut();
      this.accessToken = null;
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async createOrGetFolder() {
    try {
      // Search for existing folder
      const searchResponse = await axios.get(
        'https://www.googleapis.com/drive/v3/files',
        {
          headers: this.getHeaders(),
          params: {
            q: "name='FeuilleDeSuivie' and mimeType='application/vnd.google-apps.folder' and trashed=false",
            spaces: 'drive',
            fields: 'files(id, name)',
            pageSize: 10,
          },
        }
      );

      if (searchResponse.data.files.length > 0) {
        this.folderId = searchResponse.data.files[0].id;
        return this.folderId;
      }

      // Create new folder if not found
      const createResponse = await axios.post(
        'https://www.googleapis.com/drive/v3/files',
        {
          name: 'FeuilleDeSuivie',
          mimeType: 'application/vnd.google-apps.folder',
        },
        { headers: this.getHeaders() }
      );

      this.folderId = createResponse.data.id;
      return this.folderId;
    } catch (error) {
      console.error('Folder creation error:', error);
      throw error;
    }
  }

  async uploadData(data: any, fileName: string) {
    try {
      if (!this.folderId) {
        await this.createOrGetFolder();
      }

      const metadata = {
        name: fileName,
        parents: [this.folderId],
        mimeType: 'application/json',
      };

      const response = await axios.post(
        'https://www.googleapis.com/drive/v3/files',
        {
          resource: metadata,
          media: {
            body: JSON.stringify(data),
          },
        },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async downloadData(fileName: string) {
    try {
      if (!this.folderId) {
        await this.createOrGetFolder();
      }

      const searchResponse = await axios.get(
        'https://www.googleapis.com/drive/v3/files',
        {
          headers: this.getHeaders(),
          params: {
            q: `name='${fileName}' and '${this.folderId}' in parents and trashed=false`,
            spaces: 'drive',
            fields: 'files(id)',
          },
        }
      );

      if (searchResponse.data.files.length === 0) {
        return null;
      }

      const fileId = searchResponse.data.files[0].id;
      const fileResponse = await axios.get(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: this.getHeaders() }
      );

      return fileResponse.data;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }
}

export default new GoogleDriveService();