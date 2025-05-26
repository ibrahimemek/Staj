import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.interface';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="book-detail-container" *ngIf="book">
      <h2>{{ isEditing ? 'Edit Book' : 'Book Details' }}</h2>
      <div class="book-form" *ngIf="isEditing">
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" id="title" name="title" [(ngModel)]="editedBook.title" required />
        </div>
        <div class="form-group">
          <label for="author">Author:</label>
          <input type="text" id="author" name="author" [(ngModel)]="editedBook.author" required />
        </div>
        <div class="form-group">
          <label for="genre">Genre:</label>
          <input type="text" id="genre" name="genre" [(ngModel)]="editedBook.genre" required />
        </div>
        <div class="form-group">
          <label for="publishYear">Published Year:</label>
          <input type="number" id="publishYear" name="publishYear" [(ngModel)]="editedBook.publishYear" required />
        </div>
        <div class="button-group">
          <button (click)="saveBook()" class="save-button">Save</button>
          <button (click)="cancelEdit()" class="cancel-button">Cancel</button>
        </div>
      </div>
      <div class="book-details" *ngIf="!isEditing">
        <p><strong>Title:</strong> {{ book.title }}</p>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Genre:</strong> {{ book.genre }}</p>
        <p><strong>Published Year:</strong> {{ book.publishYear }}</p>
        <div class="button-group">
          <button *ngIf="authService.hasEditPermission()" (click)="startEdit()" class="edit-button">Edit</button>
          <button (click)="goBack()" class="back-button">Back to List</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .book-detail-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
    }
    .form-group input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .edit-button {
      background-color: #007bff;
      color: white;
    }
    .save-button {
      background-color: #28a745;
      color: white;
    }
    .cancel-button, .back-button {
      background-color: #6c757d;
      color: white;
    }
  `]
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  editedBook: Partial<Book> = {};
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.authService.hasEditPermission()) {
      this.router.navigate(['/books']);
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadBook(id);
    }
  }

  loadBook(id: number): void {
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        this.book = book;
        this.editedBook = { ...book };
      },
      error: (error) => {
        console.error('Error loading book:', error);
      }
    });
  }

  startEdit(): void {
    if (this.authService.hasEditPermission()) {
      this.isEditing = true;
    }
  }

  cancelEdit(): void {
    this.editedBook = { ...this.book! };
    this.isEditing = false;
  }

  saveBook(): void {
    if (this.book && this.editedBook && this.authService.hasEditPermission()) {
      this.bookService.updateBook(this.book.id, this.editedBook).subscribe({
        next: (updatedBook) => {
          this.book = updatedBook;
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Error updating book:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }
} 