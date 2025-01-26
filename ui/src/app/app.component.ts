import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { invoke } from "@tauri-apps/api/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>User Registration</h2>
      <form [formGroup]="registrationForm" (submit)="onSubmit($event)">
        <div class="form-group">
          <label>Email</label>
          <input type="email" formControlName="email" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" formControlName="password" />
        </div>
        <div class="form-group">
          <label>First Name</label>
          <input type="text" formControlName="firstName" />
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" formControlName="lastName" />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div *ngIf="data" class="response-container">
        <h3>Response</h3>
        <pre>{{ data | json }}</pre>
      </div>
    </div>
  `,
  styles: `
    .form-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }

    h2 {
      text-align: center;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }

    .response-container {
      margin-top: 20px;
    }

    pre {
      background: #f4f4f4;
      padding: 10px;
      border-radius: 4px;
    }
  `,
})
export class AppComponent {
  registrationForm: FormGroup;
  data: any | null = null;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
    });
  }

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    if (this.registrationForm.invalid) {
      alert("Please fill out the form correctly.");
      return;
    }

    const query = `
    mutation Register($data: UserInput!) {
      register(data: $data) {
        id
        email
        firstName
        lastName
      }
    }
  `;

    const variables = {
      data: {
        username: this.registrationForm.value.email,
        email: this.registrationForm.value.email,
        password: this.registrationForm.value.password,
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName,
      }
    };

    invoke<any>("gql", { url: "http://localhost:8000/graphql/", query, variables })
      .then((data) => {
        this.data = data;
        alert("Registration successful!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while submitting the form.");
      });
  }
}
