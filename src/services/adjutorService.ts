import axios from "axios";
import logger from "../utils/logger";

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

  async checkKarmaBlacklist(identity: string): Promise<boolean> {
    try {
      if (!this.baseUrl || !this.apiKey) {
        throw new Error("Adjutor API URL and API key must be defined");
      }

      // 0zspgifzbo.ga

      const response = await axios.get(
        `${this.baseUrl}/verification/karma/${identity}`,
        {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }
      );

      if (response.data.status === "success") {
        return true; // User is blacklisted
      }

      return false;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 404 &&
        error.response?.data?.status === "success"
      ) {
        // User is not found in the blacklist
        return false;
      }
      logger.error("Error checking karma blacklist:", error);
      throw new Error("Failed to check karma blacklist");
    }
  }
}
