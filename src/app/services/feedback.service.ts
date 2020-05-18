import { Injectable } from "@angular/core";
import { Feedback } from "../shared/feedback";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ProcessHTTPMsgService } from "../services/process-httpmsg.service";
import { baseURL } from "../shared/baseurl";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FeedbackService {
  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) {}

  // Sending the form data to the server.
  submitFeedBack(feedback: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http
      .post<Feedback>(baseURL + "feedback", feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
