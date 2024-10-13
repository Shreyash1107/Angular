import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { Usermodel } from '../../Model/user';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxPaginationModule],
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  tasklist: Usermodel[] = [];
  filteredTaskList: Usermodel[] = [];
  editmode: boolean = false;
  searchTerm: string = '';
  user: Usermodel = {
    Name: "",
    Status: "",
    date: "",
    Priority: "",
    Comments: ""
  };
  p: number = 1;

  constructor(private _userService: UserService, private _toastrservice: ToastrService) { }

  ngOnInit(): void {
    this.getTasklist();
  }

  // Fetch task list from service
  getTasklist(): void {
    this._userService.getUsers().subscribe((res) => {
      this.tasklist = res;
      this.filteredTaskList = [...this.tasklist]; // Use a spread operator to clone the array
    });
  }

  // Handle form submission for adding/updating tasks
  onSubmit(form: NgForm): void {
    if (this.editmode) {
      // Update task
      this._userService.updateUser(this.user).subscribe((res) => {
        const index = this.tasklist.findIndex(t => t.id === this.user.id);
        if (index !== -1) {
          this.tasklist[index] = { ...res }; // Deep clone the updated task to prevent reference issues
          this.filteredTaskList = [...this.tasklist]; // Re-assign filtered list to reflect changes
        }
        form.resetForm();
        this._toastrservice.success('Task Updated Successfully', 'Success');
        this.editmode = false;
      });
    } else {
      // Check if task already exists based on unique properties (like name or status)
      const duplicateTask = this.tasklist.some(t => t.Name === this.user.Name && t.Status === this.user.Status);
      if (!duplicateTask) {
        // Add task
        this._userService.adduser(this.user).subscribe((res) => {
          this.tasklist.push(res);
          this.filteredTaskList = [...this.tasklist]; // Reflect added task in filtered list
          form.resetForm();
          this._toastrservice.success('Task Added Successfully', 'Success');
        });
      } else {
        this._toastrservice.warning('Task already exists!', 'Warning');
      }
    }
  }

  // Reset form and clear current user task data
  onResetForm(): void {
    this.user = {
      Name: "",
      Status: "",
      date: "",
      Priority: "",
      Comments: ""
    };
    this.editmode = false; // Reset edit mode when form is cleared
  }

  // Set task in edit mode
  editTask(task: Usermodel): void {
    this.user = { ...task }; // Clone the task to avoid two-way binding issues
    this.editmode = true;
  }

  // Delete task by ID
  deleteTask(id: number): void {
    if (confirm("Are you sure you want to delete this Task?")) {
      this._userService.deleteUser(id).subscribe(() => {
        this._toastrservice.error('Task Deleted Successfully', 'Error');
        this.tasklist = this.tasklist.filter(task => task.id !== id);
        this.filteredTaskList = this.filteredTaskList.filter(task => task.id !== id);
      });
    }
  }

  // Filter tasks based on search term
  filterTasks(): void {
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase().trim();
      this.filteredTaskList = this.tasklist.filter(task =>
        task.Name.toLowerCase().includes(lowerCaseSearchTerm) ||
        task.Status.toLowerCase().includes(lowerCaseSearchTerm) ||
        task.Priority.toLowerCase().includes(lowerCaseSearchTerm)
      );
    } else {
      this.filteredTaskList = [...this.tasklist];
    }
  }
}
