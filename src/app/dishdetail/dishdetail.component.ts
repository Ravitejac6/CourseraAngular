import { Component, OnInit, Input, ViewChild, Inject } from "@angular/core";
import { Dish } from "../shared/dish";
import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { DishService } from "../services/dish.service";
import { switchMap } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Comment } from "../shared/comment";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"],
  animations: [
    trigger("visibility", [
      state(
        "shown",
        style({
          transform: "scale(1.0)",
          opacity: 1,
        })
      ),
      state(
        "hidden",
        style({
          transform: "scale(0.5)",
          opacity: 0,
        })
      ),
      transition("*=>*", animate("0.5s ease-in-out")),
    ]),
  ],
})
export class DishdetailComponent implements OnInit {
  // @Input() // Here we are getting the input from the another component in the menu.component.html using the [dish]=selectedDish
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  newComment: Comment;
  errMess: String;
  dishcopy: Dish;
  visibility = "shown";

  @ViewChild("fform") commentFormDirective;
  formErrors = {
    comment: "",
    author: "",
  };

  validationMessages = {
    comment: {
      required: "Comment is Required",
      minlength: "Comment must be 2 charactes long.",
    },
    author: {
      required: "Author name is Required",
      minlength: "Author name must be 2 characters long",
    },
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject("BaseURL") private BaseURL
  ) {
    this.createCommentForm();
  }

  ngOnInit() {
    //Fetching parameter from the url using params.Here one observable is mapped into the another observable.
    this.dishService
      .getDishIds()
      .subscribe((dishIds) => (this.dishIds = dishIds));
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.visibility = "hidden"; // For animation.
          return this.dishService.getDish(params["id"]);
        })
      )
      .subscribe(
        (dish) => {
          this.dish = dish;
          this.dishcopy = dish;
          this.setPrevNext(dish.id);
          this.visibility = "shown";
        },
        (errmess) => (this.errMess = <any>errmess)
      ); // As we are subscribing always the dishId changes and
    // wants to track of prev and next that's why here setPrevNext() called.
  }

  createCommentForm() {
    this.commentForm = this.fb.group({
      rating: 5,
      comment: ["", [Validators.required, Validators.minLength(2)]],
      author: ["", [Validators.required, Validators.minLength(2)]],
    });

    this.commentForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const message = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += message[key] + " ";
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.newComment = this.commentForm.value;
    this.newComment.date = new Date().toISOString();
    console.log(this.newComment);
    this.dishcopy.comments.push(this.newComment);
    this.dishService.putDish(this.dishcopy).subscribe(
      (dish) => {
        this.dish = dish;
        this.dishcopy = dish;
      },
      (errmess) => {
        this.dish = null;
        this.dishcopy = null;
        this.errMess = <any>errmess;
      }
    );
    this.commentForm.reset({
      author: "",
      rating: 5,
      comment: "",
    });
    this.commentFormDirective.resetForm({ rating: 5 });
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }
  goBack(): void {
    this.location.back();
  }
}
