import { Injectable } from "@angular/core";
import { Promotion } from "../shared/promotion";
import { PROMOTIONS } from "../shared/promotions";

@Injectable({
  providedIn: "root",
})
export class PromotionService {
  constructor() {}

  getPromotions(): Promotion[] {
    return PROMOTIONS;
  }

  getDish(id: String): Promotion {
    return PROMOTIONS.filter((promo) => promo.id == id)[0];
  }

  getFeaturedPromotion(): Promotion {
    return PROMOTIONS.filter((promo) => promo.featured)[0];
  }
}