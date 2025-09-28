import { LinkRepository } from "../repositories/linkRepository";
import type { ClickData } from "../types/click";

export class ClickService {
  constructor(private linkRepository: LinkRepository) {}

  async recordClick(linkId: number, clickData: ClickData) {
    try {
      await this.linkRepository.incrementClicks(linkId);
      await this.linkRepository.createClick({ linkId, ...clickData });
    } catch (_) {
      // log error kalau mau
    }
  }
}
