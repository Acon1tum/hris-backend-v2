# Angular Frontend Examples for HR Admin API

## Service Examples

### Employee Service
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get(this.apiUrl, { params: httpParams });
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: any): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(id: string, employee: any): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### Leave Service
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  getLeaveBalances(employeeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${employeeId}/leave-balances`);
  }

  createLeaveRequest(employeeId: string, request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${employeeId}/leave-requests`, request);
  }

  getLeaveRequests(employeeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${employeeId}/leave-requests`);
  }
}
```

## Component Examples

### Employee List Component
```typescript
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-list',
  template: `
    <div class="employee-list">
      <h2>Employees</h2>
      
      <div class="filters">
        <input [(ngModel)]="searchTerm" placeholder="Search employees...">
        <select [(ngModel)]="departmentFilter">
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
        <button (click)="loadEmployees()">Search</button>
      </div>

      <table *ngIf="employees.length > 0">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let employee of employees">
            <td>{{ employee.employeeId }}</td>
            <td>{{ employee.firstName }} {{ employee.lastName }}</td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.department }}</td>
            <td>{{ employee.status }}</td>
            <td>
              <button (click)="editEmployee(employee.id)">Edit</button>
              <button (click)="deleteEmployee(employee.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination" *ngIf="totalPages > 1">
        <button (click)="previousPage()" [disabled]="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button (click)="nextPage()" [disabled]="currentPage === totalPages">Next</button>
      </div>
    </div>
  `
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  currentPage = 1;
  totalPages = 1;
  searchTerm = '';
  departmentFilter = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    const params = {
      page: this.currentPage,
      limit: 10,
      search: this.searchTerm,
      department: this.departmentFilter
    };

    this.employeeService.getEmployees(params).subscribe(response => {
      this.employees = response.employees;
      this.totalPages = response.totalPages;
    });
  }

  editEmployee(id: string) {
    // Navigate to edit form
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.loadEmployees();
      });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEmployees();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEmployees();
    }
  }
}
```

### Employee Form Component
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-form',
  template: `
    <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
      <h2>{{ isEdit ? 'Edit' : 'Add' }} Employee</h2>
      
      <div class="form-group">
        <label>Employee ID:</label>
        <input formControlName="employeeId" type="text" required>
      </div>

      <div class="form-group">
        <label>First Name:</label>
        <input formControlName="firstName" type="text" required>
      </div>

      <div class="form-group">
        <label>Last Name:</label>
        <input formControlName="lastName" type="text" required>
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input formControlName="email" type="email" required>
      </div>

      <div class="form-group">
        <label>Department:</label>
        <select formControlName="department" required>
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div class="form-group">
        <label>Position:</label>
        <input formControlName="position" type="text" required>
      </div>

      <div class="form-group">
        <label>Hire Date:</label>
        <input formControlName="hireDate" type="date" required>
      </div>

      <button type="submit" [disabled]="employeeForm.invalid">
        {{ isEdit ? 'Update' : 'Create' }} Employee
      </button>
    </form>
  `
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEdit = false;
  employeeId: string;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      position: ['', Validators.required],
      hireDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if editing
    if (this.employeeId) {
      this.isEdit = true;
      this.loadEmployee();
    }
  }

  loadEmployee() {
    this.employeeService.getEmployee(this.employeeId).subscribe(employee => {
      this.employeeForm.patchValue(employee);
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;
      
      if (this.isEdit) {
        this.employeeService.updateEmployee(this.employeeId, formData).subscribe(
          response => {
            console.log('Employee updated:', response);
            // Navigate back to list
          }
        );
      } else {
        this.employeeService.createEmployee(formData).subscribe(
          response => {
            console.log('Employee created:', response);
            // Navigate back to list
          }
        );
      }
    }
  }
}
```

## Usage Examples

### 1. Fetch Employees with Filters
```typescript
// Get employees with pagination and filters
this.employeeService.getEmployees({
  page: 1,
  limit: 10,
  department: 'IT',
  status: 'ACTIVE',
  search: 'john'
}).subscribe(response => {
  console.log('Employees:', response.employees);
  console.log('Total:', response.total);
});
```

### 2. Create New Employee
```typescript
const newEmployee = {
  employeeId: 'EMP001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  department: 'IT',
  position: 'Developer',
  hireDate: '2024-01-15'
};

this.employeeService.createEmployee(newEmployee).subscribe(
  response => console.log('Created:', response)
);
```

### 3. Leave Request Example
```typescript
const leaveRequest = {
  leaveType: 'VACATION',
  startDate: '2024-03-01',
  endDate: '2024-03-05',
  reason: 'Family vacation'
};

this.leaveService.createLeaveRequest('employee-id', leaveRequest).subscribe(
  response => console.log('Leave request created:', response)
);
```

### 4. Emergency Contact Example
```typescript
const emergencyContact = {
  name: 'Jane Doe',
  relationship: 'Spouse',
  phone: '555-0123',
  email: 'jane@email.com',
  isPrimary: true
};

this.http.post(`/api/employees/${employeeId}/emergency-contacts`, emergencyContact)
  .subscribe(response => console.log('Contact added:', response));
```

### 5. Benefits Management
```typescript
const benefit = {
  name: 'Health Insurance',
  type: 'HEALTH',
  provider: 'ABC Insurance',
  cost: 500,
  employeeContribution: 150,
  startDate: '2024-01-01'
};

this.http.post(`/api/employees/${employeeId}/benefits`, benefit)
  .subscribe(response => console.log('Benefit added:', response));
```

## Module Setup

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  // ... other module configuration
})
export class AppModule { }
```

This guide provides complete Angular integration examples for your HR API! 