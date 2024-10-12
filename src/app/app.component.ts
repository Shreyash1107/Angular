import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule ], // Make sure NgForm is available
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected property name
})
export class AppComponent {
  title = 'AngularCRUD';
}
