import axios from 'axios';
import logger from '../utils/logger';


export class AdjutorService {
  private static instance: AdjutorService;
  private baseUrl: string;
  private apiKey: string;

  private constructor() {
    this.baseUrl = process.env.ADJUTOR_API_URL!;
    this.apiKey = process.env.ADJUTOR_API_KEY!;
  }

  public static getInstance(): AdjutorService {
    if (!AdjutorService.instance) {
      AdjutorService.instance = new AdjutorService();
    }
    return AdjutorService.instance;
  }

  async checkKarmaBlacklist(userId: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/karma/blacklist/${userId}`,
        {
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        }
      );
      return response.data.isBlacklisted;
    } catch (error) {
      logger.error('Error checking karma blacklist:', error);
      throw new Error('Failed to check karma blacklist');
    }
  }
}