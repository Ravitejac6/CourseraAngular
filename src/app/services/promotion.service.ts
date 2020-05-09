import { Injectable } from "@angular/core";
import { Promotion } from "../shared/promotion";
import { PROMOTIONS } from "../shared/promotions";
import { resolve } from "url";
import { delay } from "rxjs/operators";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PromotionService {
  constructor() {}

  getPromotions(): Observable<Promotion[]> {
    return of(PROMOTIONS).pipe(delay(2000));
  }

  getDish(id: String): Observable<Promotion> {
    return of(PROMOTIONS.filter((promo) => promo.id == id)[0]).pipe(
      delay(2000)
    );
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return of(PROMOTIONS.filter((promo) => promo.featured)[0]).pipe(
      delay(2000)
    );
  }
}
