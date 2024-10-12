import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { Usermodel } from '../../Model/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [FormsModule,CommonModule ],
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  tasklist: Usermodel[] = [];
  user: Usermodel = {
    Name: "",
    Status: "",
    date: "",
    Priority: "",
    Comments: ""
  };

  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    this.getTasklist();
  }

  getTasklist(): void {
    this._userService.getUsers().subscribe((res) => {
      this.tasklist = res;
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this._userService.adduser(this.user).subscribe((res) => {
        this.tasklist.push(res);
        form.resetForm(); // Clear the form after submission
      });
    }
  }

  onResetForm(): void {
    this.user = {
      Name: "",
      Status: "",
      date: "",
      Priority: "",
      Comments: ""
    };
  }

  editTask(task: Usermodel): void {
    this.user = { ...task };
  }

  deleteTask(id: number): void {
    this._userService.deleteUser(id).subscribe(() => {
      this.tasklist = this.tasklist.filter((task) => task.id !== id);
    });
  }
}
