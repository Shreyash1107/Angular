import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { Usermodel } from '../../Model/user';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';  // Import ngx-pagination

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxPaginationModule],  // Add NgxPaginationModule here
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  tasklist: Usermodel[] = [];
  filteredTaskList: Usermodel[] = []; // To store filtered tasklist
  editmode: boolean = false;
  searchTerm: string = '';  // Property for search input
  user: Usermodel = {
    Name: "",
    Status: "",
    date: "",
    Priority: "",
    Comments: ""
  };
  p: number = 1;  // Page number for pagination

  constructor(private _userService: UserService, private _toastrservice: ToastrService) { }

  ngOnInit(): void {
    this.getTasklist();
  }

  getTasklist(): void {
    this._userService.getUsers().subscribe((res) => {
      this.tasklist = res;
      this.filteredTaskList = res; // Initialize filteredTaskList
    });
  }

  // Handle form submission
  onSubmit(form: NgForm): void {
    if (this.editmode) {
      this._userService.updateUser(this.user).subscribe((res) => {
        const index = this.tasklist.findIndex(t => t.id === this.user.id);
        if (index !== -1) {
          this.tasklist[index] = res;
        }
        form.resetForm();
        this._toastrservice.success('Task Updated Successfully', 'Success');
        this.editmode = false;  // Reset edit mode
      });
    } else {
      this._userService.adduser(this.user).subscribe((res) => {
        this.tasklist.push(res);
        this.filteredTaskList = this.tasklist; // Update the filteredTaskList
        form.resetForm();
        this._toastrservice.success('Task Added Successfully','Success');
      });
    }
  }

  // Reset form
  onResetForm(): void {
    this.user = {
      Name: "",
      Status: "",
      date: "",
      Priority: "",
      Comments: ""
    };
  }

  // Edit task
  editTask(task: Usermodel): void {
    this.user = task;
    this.editmode = true;
  }

  // Delete task
  deleteTask(id: number): void {
    const isconfirm = confirm("Are you sure you want to delete this Task ?");
    if (isconfirm) {
      this._userService.deleteUser(id).subscribe(() => {
        this._toastrservice.error('Task Deleted Successfully', 'Error');
        this.tasklist = this.tasklist.filter((task) => task.id !== id);
        this.filteredTaskList = this.filteredTaskList.filter((task) => task.id !== id); // Filter deleted task
      });
    }
  }

  // Method to filter the task list based on the search term
  filterTasks(): void {
    if (this.searchTerm) {
      this.filteredTaskList = this.tasklist.filter(task => 
        task.Name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.Status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.Priority.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredTaskList = this.tasklist;
    }
  }
}
