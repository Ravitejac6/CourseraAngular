import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Feedback, ContactType } from "../shared/feedback";
import { flyInOut, expand } from "../animations/app.animation";
import { FeedbackService } from "../services/feedback.service";
@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  host: {
    "[@flyInOut]": "true",
    style: "display:block;",
  },
  animations: [flyInOut(), expand()],
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  feedbackErrMsg: String;
  showSpinner: boolean = false;
  preview: boolean = false;

  @ViewChild("fform") feedbackFormDirective; // To ensure completely set to reset.

  formErrors = {
    firstname: "",
    lastname: "",
    telnum: "",
    email: "",
  };

  validationMessages = {
    firstname: {
      required: "First Name is required.",
      minlength: "First name must be atleast 2 characters long",
      maxlength: "First name cannot be more than 25 characters long",
    },
    lastname: {
      required: "Last name is required.",
      minlength: "Last name must be atleast 2 characters long",
      maxlength: "Last name cannot be more than 25 characters long",
    },
    telnum: {
      required: "Tel. num is required",
      pattern: "Tel. num must contains only numbers",
    },
    email: {
      required: "Email is required",
      email: "Email is not in valid format",
    },
  };
  constructor(
    private fb: FormBuilder,
    private feedBackService: FeedbackService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      lastname: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ["", [Validators.required, Validators.email]],
      agree: false,
      contacttype: "None",
      message: "",
    });
    // valueChanges gives the observable and whenever the value changes it gives.
    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged(); // (re)set form validation messages.
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.showSpinner = true;
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedBackService.submitFeedBack(this.feedback).subscribe(
      (fd) => {
        this.feedback = fd;
        this.showSpinner = false;
        this.preview = true;
        setTimeout(() => {
          this.preview = false;
        }, 5000);
      },
      (errmess) => (this.feedbackErrMsg = <any>errmess)
    );
    this.feedbackForm.reset({
      firstname: "",
      lastname: "",
      telnum: 0,
      email: "",
      agree: false,
      contacttype: "None",
      message: "",
    });
    this.feedbackFormDirective.resetForm();
  }
}
