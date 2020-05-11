import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Dish } from "../shared/dish";
import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { DishService } from "../services/dish.service";
import { switchMap } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Comment } from "../shared/comment";

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"],
})
export class DishdetailComponent implements OnInit {
  // @Input() // Here we are getting the input from the another component in the menu.component.html using the [dish]=selectedDish
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  newComment: Comment;

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
    private fb: FormBuilder
  ) {
    this.createCommentForm();
  }

  ngOnInit() {
    //Fetching parameter from the url using params.Here one observable is mapped into the another observable.
    this.dishService
      .getDishIds()
      .subscribe((dishIds) => (this.dishIds = dishIds));
    const id = this.route.params
      .pipe(
        switchMap((params: Params) => this.dishService.getDish(params["id"]))
      )
      .subscribe((dish) => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      }); // As we are subscribing always the dishId changes and
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
    this.newComment = new Comment();
    this.newComment.author = this.commentForm.get("author").value;
    this.newComment.comment = this.commentForm.get("comment").value;
    this.newComment.rating = this.commentForm.get("rating").value;
    this.newComment.date = new Date().toISOString();
    console.log(this.newComment);
    // Any new comment is added then it will be added to the particular dish comment.
    this.dishService
      .getFeaturedDish()
      .subscribe((dish) => dish.comments.push(this.newComment));
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
