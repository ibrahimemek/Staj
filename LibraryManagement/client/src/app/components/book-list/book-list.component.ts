import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.interface';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NotificationComponent],
  template: `
    <div class="book-list-container">
      <h2>Library Books</h2>
      <div *ngIf="mode" class="mode-indicator">
        <div class="mode-text">
          {{ mode === 'update' ? 'Click a book to update' : 'Click a book to delete' }}
        </div>
        <button class="cancel-button" (click)="cancelMode()">Cancel</button>
      </div>

      <div class="table-container">
        <table class="books-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Published Year</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let book of books"
                [class.clickable]="mode && !editingBook"
                [class.update-mode]="mode === 'update' && !editingBook"
                [class.delete-mode]="mode === 'delete' && !editingBook"
                [class.editing]="editingBook?.id === book.id">
              <ng-container *ngIf="editingBook?.id === book.id; else displayMode">
                <td colspan="4">
                  <form #editForm="ngForm" (ngSubmit)="saveBook(editForm)" class="edit-form">
                    <div class="form-row">
                      <input
                        type="text"
                        name="title"
                        [ngModel]="editingBook!.title"
                        (ngModelChange)="editingBook!.title = $event"
                        required
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        name="author"
                        [ngModel]="editingBook!.author"
                        (ngModelChange)="editingBook!.author = $event"
                        required
                        placeholder="Author"
                      />
                      <input
                        type="text"
                        name="genre"
                        [ngModel]="editingBook!.genre"
                        (ngModelChange)="editingBook!.genre = $event"
                        required
                        placeholder="Genre"
                      />
                      <input
                        type="number"
                        name="publishYear"
                        [ngModel]="editingBook!.publishYear"
                        (ngModelChange)="editingBook!.publishYear = $event"
                        required
                        placeholder="Published Year"
                      />
                    </div>
                    <div class="form-actions">
                      <button type="submit" class="save-button" [disabled]="!editForm.form.valid || isSaving">
                        {{ isSaving ? 'Saving...' : 'Save' }}
                      </button>
                      <button type="button" class="cancel-edit-button" (click)="cancelEdit()">Cancel</button>
                    </div>
                  </form>
                </td>
              </ng-container>
              <ng-template #displayMode>
                <td (click)="handleBookClick(book)">{{ book.title }}</td>
                <td (click)="handleBookClick(book)">{{ book.author }}</td>
                <td (click)="handleBookClick(book)">{{ book.genre }}</td>
                <td (click)="handleBookClick(book)">{{ book.publishYear }}</td>
              </ng-template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <app-notification></app-notification>
  `,
  styles: [`
    .book-list-container {
      padding: 0 2rem;
    }

    .book-list-container.with-panel {
      margin-left: 300px;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #1b4332;
    }

    .mode-indicator {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background-color: #d8f3dc;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .mode-text {
      color: #1b4332;
      font-weight: 500;
    }

    .cancel-button {
      background-color: #2d6a4f;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }

    .cancel-button:hover {
      background-color: #1b4332;
    }

    .table-container {
      overflow-x: auto;
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .books-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    .books-table th {
      background-color: #1b4332;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: white;
      border-bottom: 2px solid #2d6a4f;
    }

    .books-table td {
      padding: 1rem;
      border-bottom: 1px solid #d8f3dc;
      color: #1b4332;
    }

    .books-table tr:last-child td {
      border-bottom: none;
    }

    .books-table tr.clickable td {
      cursor: pointer;
    }

    .books-table tr.clickable:hover td {
      background-color: #d8f3dc;
    }

    .books-table tr.update-mode:hover td {
      background-color: rgba(45, 106, 79, 0.1);
    }

    .books-table tr.delete-mode:hover td {
      background-color: rgba(220, 53, 69, 0.1);
    }

    .books-table tr.editing td {
      padding: 0;
    }

    .edit-form {
      padding: 1rem;
      background-color: #f8f9fa;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-row input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d8f3dc;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .form-row input:focus {
      outline: none;
      border-color: #2d6a4f;
      box-shadow: 0 0 0 2px rgba(45, 106, 79, 0.25);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .save-button, .cancel-edit-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .save-button {
      background-color: #2d6a4f;
      color: white;
    }

    .save-button:hover:not(:disabled) {
      background-color: #1b4332;
    }

    .save-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .cancel-edit-button {
      background-color: #6c757d;
      color: white;
    }

    .cancel-edit-button:hover {
      background-color: #5a6268;
    }
  `]
})
export class BookListComponent implements OnInit {
  @ViewChild(NotificationComponent) notification!: NotificationComponent;
  books: Book[] = [];
  mode: 'update' | 'delete' | null = null;
  editingBook: Book | null = null;
  isSaving = false;

  constructor(
    private bookService: BookService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadBooks();
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'update' && this.authService.hasEditPermission()) {
        this.mode = 'update';
      } else if (params['mode'] === 'delete' && this.authService.isAdmin()) {
        this.mode = 'delete';
      } else {
        this.mode = null;
      }
      this.editingBook = null; // Reset editing state when mode changes
    });
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (error) => {
        this.notification.showNotification({
          message: 'Error loading books. Please try again.',
          type: 'error'
        });
      }
    });
  }

  handleBookClick(book: Book): void {
    if (!this.mode) return;

    if (this.mode === 'update' && this.authService.hasEditPermission()) {
      this.editingBook = { ...book };
    } else if (this.mode === 'delete' && this.authService.isAdmin()) {
      if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
        this.bookService.deleteBook(book.id).subscribe({
          next: () => {
            this.notification.showNotification({
              message: 'Book deleted successfully!',
              type: 'success'
            });
            this.loadBooks();
          },
          error: (error) => {
            this.notification.showNotification({
              message: 'Error deleting book. Please try again.',
              type: 'error'
            });
          }
        });
      }
    }
  }

  cancelMode(): void {
    this.mode = null;
    this.editingBook = null;
    this.router.navigate(['/books']);
  }

  cancelEdit(): void {
    this.editingBook = null;
  }

  saveBook(form: any): void {
    if (this.editingBook && form.valid && !this.isSaving) {
      this.isSaving = true;
      this.bookService.updateBook(this.editingBook.id, this.editingBook).subscribe({
        next: () => {
          this.notification.showNotification({
            message: 'Book updated successfully!',
            type: 'success'
          });
          this.editingBook = null;
          this.loadBooks();
        },
        error: (error) => {
          this.notification.showNotification({
            message: 'Error updating book. Please try again.',
            type: 'error'
          });
        },
        complete: () => {
          this.isSaving = false;
        }
      });
    }
  }
} 