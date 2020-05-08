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
    return new Promise((resolve) => {
      //Simulate server latency with 2seconds delay.
      setTimeout(() => resolve(DISHES), 2000);
    });
  }

  getDish(id: String): Promise<Dish> {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(DISHES.filter((dish) => dish.id == id)[0]),
        2000
      );
    });
  }

  getFeaturedDish(): Promise<Dish> {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(DISHES.filter((dish) => dish.featured)[0]),
        2000
      );
    });
  }
}
