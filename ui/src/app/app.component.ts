// app.component.ts
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from './services/auth.service';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: "app.template.html",
})
export class AppComponent {
  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
  });

  data: unknown = null;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    try {
      this.data = await this.authService.register(this.registrationForm.value as any);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Registration failed';
    }
  }
}
