// auth.service.ts
import { Injectable } from '@angular/core';
import { invoke } from "@tauri-apps/api/core";

interface RegisterUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RegistrationResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly REGISTER_MUTATION = `
    mutation Register($data: UserInput!) {
      register(data: $data) {
        id
        email
        firstName
        lastName
      }
    }
  `;

  constructor() { }

  async register(user: RegisterUser): Promise<RegistrationResponse> {
    const variables = {
      data: {
        username: user.email,
        ...user
      }
    };

    try {
      return await invoke<RegistrationResponse>("gql", {
        url: "http://localhost:8000/graphql/",
        query: this.REGISTER_MUTATION,
        variables,
      });
    } catch (error) {
      throw this.handleRegistrationError(error);
    }
  }

  private handleRegistrationError(error: unknown): Error {
    console.error('Registration error:', error);
    return new Error(
      error instanceof Error
        ? error.message
        : 'Failed to register user. Please try again later.'
    );
  }
}
