import { Injectable } from "@angular/core";
import { Dish } from "../shared/dish";
import { DISHES } from "../shared/dishes";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DishService {
  constructor() {}

  // If we use Promise.resolve() then it will give the data available directly so it's good but when we are fecthing from servers it's not best way.
  getDishes(): Observable<Dish[]> {
    return of(DISHES).pipe(delay(2000)); // Getting a data as an observable and then changing it into the promise using toPromise() and of().
  }

  getDish(id: String): Observable<Dish> {
    return of(DISHES.filter((dish) => dish.id == id)[0]).pipe(delay(2000));
  }

  getFeaturedDish(): Observable<Dish> {
    return of(DISHES.filter((dish) => dish.featured)[0]).pipe(delay(2000));
  }

  getDishIds(): Observable<string[] | any> {
    return of(DISHES.map((dish) => dish.id));
  }
}
