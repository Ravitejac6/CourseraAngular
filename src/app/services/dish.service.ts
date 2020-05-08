import { Injectable } from "@angular/core";
import { Dish } from "../shared/dish";
import { DISHES } from "../shared/dishes";
@Injectable({
  providedIn: "root",
})
export class DishService {
  constructor() {}

  // If we use Promise.resolve() then it will give the data available directly so it's good but when we are fecthing from servers it's not best way.
  getDishes(): Promise<Dish[]> {
    return Promise.resolve(DISHES);
  }

  getDish(id: String): Promise<Dish> {
    return Promise.resolve(DISHES.filter((dish) => dish.id == id)[0]);
  }

  getFeaturedDish(): Promise<Dish> {
    return Promise.resolve(DISHES.filter((dish) => dish.featured)[0]);
  }
}
