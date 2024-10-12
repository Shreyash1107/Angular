import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Usermodel } from "../Model/user";
import { Observable } from "rxjs";
import { FormsModule } from "@angular/forms";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiURL = "http://localhost:3000/users";

  constructor(private http: HttpClient) {}

  getUsers(): Observable<Usermodel[]> {
    return this.http.get<Usermodel[]>(this.apiURL);
  }

  adduser(user: Usermodel): Observable<Usermodel> {
    return this.http.post<Usermodel>(this.apiURL, user);
  }

  updateUser(user: Usermodel): Observable<Usermodel> {
    return this.http.put<Usermodel>(`${this.apiURL}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<Usermodel> {
    return this.http.delete<Usermodel>(`${this.apiURL}/${id}`);
  }
}
