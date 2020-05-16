import { Injectable } from "@angular/core";
import { Dish } from "../shared/dish";
import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { baseURL } from "../shared/baseurl";

@Injectable({
  providedIn: "root",
})
export class DishService {
  constructor(private http: HttpClient) {}

  // If we use Promise.resolve() then it will give the data available directly so it's good but when we are fecthing from servers it's not best way.
  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(baseURL + "dishes");
  }

  getDish(id: number): Observable<Dish> {
    return this.http.get<Dish>(baseURL + "dishes/" + id);
  }

  getFeaturedDish(): Observable<Dish> {
    //dishes?featured=true is a query which fetches the data from the server which are true.
    return this.http
      .get<Dish[]>(baseURL + "dishes?featured=true")
      .pipe(map((dishes) => dishes[0]));
  }

  getDishIds(): Observable<number[] | any> {
    return this.getDishes().pipe(
      map((dishes) => dishes.map((dish) => dish.id))
    );
  }
}
