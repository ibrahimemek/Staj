import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  template: `
    <div class="add-book-container">
      <h2>Add New Book</h2>
      <form #addForm="ngForm" (ngSubmit)="onSubmit(addForm)" class="book-form">
        <div class="form-group">
          <label for="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            [(ngModel)]="newBook.title"
            required
            #title="ngModel"
          />
          <div class="error-message" *ngIf="title.invalid && (title.dirty || title.touched)">
            Title is required
          </div>
        </div>

        <div class="form-group">
          <label for="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            [(ngModel)]="newBook.author"
            required
            #author="ngModel"
          />
          <div class="error-message" *ngIf="author.invalid && (author.dirty || author.touched)">
            Author is required
          </div>
        </div>

        <div class="form-group">
          <label for="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            [(ngModel)]="newBook.genre"
            required
            #genre="ngModel"
          />
          <div class="error-message" *ngIf="genre.invalid && (genre.dirty || genre.touched)">
            Genre is required
          </div>
        </div>

        <div class="form-group">
          <label for="publishYear">Published Year:</label>
          <input
            type="number"
            id="publishYear"
            name="publishYear"
            [(ngModel)]="newBook.publishYear"
            required
            min="1"
            max="{{ currentYear }}"
            #publishYear="ngModel"
          />
          <div class="error-message" *ngIf="publishYear.invalid && (publishYear.dirty || publishYear.touched)">
            <div *ngIf="publishYear.errors?.['required']">Published year is required</div>
            <div *ngIf="publishYear.errors?.['min'] || publishYear.errors?.['max']">
              Year must be between 1 and {{ currentYear }}
            </div>
          </div>
        </div>

        <div class="button-group">
          <button type="submit" [disabled]="!addForm.form.valid || isSubmitting" class="submit-button">
            {{ isSubmitting ? 'Adding...' : 'Add Book' }}
          </button>
          <button type="button" (click)="goBack()" [disabled]="isSubmitting" class="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
    <app-notification></app-notification>
  `,
  styles: [`
    .add-book-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      margin-bottom: 2rem;
      color: #333;
      text-align: center;
    }

    .book-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 500;
      color: #555;
    }

    input {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
    }

    input.ng-invalid.ng-touched {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: opacity 0.2s;
      flex: 1;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .submit-button {
      background-color: #28a745;
      color: white;
    }

    .cancel-button {
      background-color: #6c757d;
      color: white;
    }

    button:not(:disabled):hover {
      opacity: 0.9;
    }
  `]
})
export class AddBookComponent {
  @ViewChild(NotificationComponent) notification!: NotificationComponent;
  
  newBook = {
    title: '',
    author: '',
    genre: '',
    publishYear: new Date().getFullYear()
  };

  currentYear = new Date().getFullYear();
  isSubmitting = false;

  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  onSubmit(form: any): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.bookService.addBook(this.newBook).subscribe({
        next: () => {
          this.notification.showNotification({
            message: 'Book added successfully!',
            type: 'success'
          });
          setTimeout(() => {
            this.router.navigate(['/books']);
          }, 1000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.notification.showNotification({
            message: 'Error adding book. Please try again.',
            type: 'error'
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }
} 