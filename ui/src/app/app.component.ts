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
<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-6 text-center">User Registration</h2>
  <form [formGroup]="registrationForm" (submit)="onSubmit($event)">
    <!-- Email Input -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        formControlName="email"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Password Input -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Password</label>
      <input
        type="password"
        formControlName="password"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- First Name Input -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">First Name</label>
      <input
        type="text"
        formControlName="firstName"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Last Name Input -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Last Name</label>
      <input
        type="text"
        formControlName="lastName"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Submit
    </button>
  </form>

  <!-- Response Container -->
  <div *ngIf="data" class="mt-6 p-4 bg-gray-50 rounded-lg">
    <h3 class="text-lg font-semibold mb-2">Response</h3>
    <pre class="bg-white p-3 rounded-md text-sm text-gray-700">{{ data | json }}</pre>
  </div>
</div>
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
