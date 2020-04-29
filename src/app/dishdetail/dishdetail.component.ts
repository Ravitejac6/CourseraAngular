import { Component, OnInit, Input } from "@angular/core";
import { Dish } from "../shared/dish";

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"],
})
export class DishdetailComponent implements OnInit {
  @Input() // Here we are getting the input from the another component in the menu.component.html using the [dish]=selectedDish
  dish: Dish;
  constructor() {}

  ngOnInit() {}
}
