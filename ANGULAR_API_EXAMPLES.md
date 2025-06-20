# Angular Frontend Examples for HR Admin API

This document provides comprehensive examples of how to integrate with the HR Admin API from an Angular frontend application.

## Prerequisites

```bash
npm install @angular/common @angular/core @angular/forms @angular/http
```

## API Base Configuration

### environment.ts
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Service Examples

### 1. Employee Service

```typescript
// services/employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  hireDate: Date;
  position: string;
  department: string;
  salary?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  emergencyContacts?: EmergencyContact[];
  benefits?: Benefit[];
  leaveBalances?: LeaveBalance[];
}

export interface CreateEmployeeRequest {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  hireDate: string;
  position: string;
  department: string;
  salary?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  // Get all employees with filtering and pagination
  getEmployees(params?: {
    page?: number;
    limit?: number;
    department?: string;
    status?: string;
    search?: string;
  }): Observable<{employees: Employee[], total: number, page: number, totalPages: number}> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  // Get employee by ID
  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  // Create new employee
  createEmployee(employee: CreateEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  // Update employee
  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  // Delete employee
  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get employee statistics
  getEmployeeStats(): Observable<{
    totalEmployees: number;
    activeEmployees: number;
    departmentCounts: { department: string; count: number }[];
  }> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}
```

### 2. Emergency Contact Service

```typescript
// services/emergency-contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface EmergencyContact {
  id: string;
  employeeId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
}

export interface CreateEmergencyContactRequest {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmergencyContactService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  // Get emergency contacts for an employee
  getEmergencyContacts(employeeId: string): Observable<EmergencyContact[]> {
    return this.http.get<EmergencyContact[]>(`${this.apiUrl}/${employeeId}/emergency-contacts`);
  }

  // Add emergency contact
  addEmergencyContact(employeeId: string, contact: CreateEmergencyContactRequest): Observable<EmergencyContact> {
    return this.http.post<EmergencyContact>(`${this.apiUrl}/${employeeId}/emergency-contacts`, contact);
  }

  // Update emergency contact
  updateEmergencyContact(employeeId: string, contactId: string, contact: Partial<EmergencyContact>): Observable<EmergencyContact> {
    return this.http.put<EmergencyContact>(`${this.apiUrl}/${employeeId}/emergency-contacts/${contactId}`, contact);
  }

  // Delete emergency contact
  deleteEmergencyContact(employeeId: string, contactId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${employeeId}/emergency-contacts/${contactId}`);
  }
}
```

### 3. Benefits Service

```typescript
// services/benefits.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Benefit {
  id: string;
  employeeId: string;
  name: string;
  type: 'HEALTH' | 'DENTAL' | 'VISION' | 'RETIREMENT' | 'LIFE_INSURANCE' | 'OTHER';
  provider: string;
  cost: number;
  employeeContribution: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface CreateBenefitRequest {
  name: string;
  type: 'HEALTH' | 'DENTAL' | 'VISION' | 'RETIREMENT' | 'LIFE_INSURANCE' | 'OTHER';
  provider: string;
  cost: number;
  employeeContribution: number;
  startDate: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BenefitsService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  // Get benefits for an employee
  getBenefits(employeeId: string): Observable<Benefit[]> {
    return this.http.get<Benefit[]>(`${this.apiUrl}/${employeeId}/benefits`);
  }

  // Add benefit
  addBenefit(employeeId: string, benefit: CreateBenefitRequest): Observable<Benefit> {
    return this.http.post<Benefit>(`${this.apiUrl}/${employeeId}/benefits`, benefit);
  }

  // Update benefit
  updateBenefit(employeeId: string, benefitId: string, benefit: Partial<Benefit>): Observable<Benefit> {
    return this.http.put<Benefit>(`${this.apiUrl}/${employeeId}/benefits/${benefitId}`, benefit);
  }

  // Delete benefit
  deleteBenefit(employeeId: string, benefitId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${employeeId}/benefits/${benefitId}`);
  }

  // Get all benefit types
  getBenefitTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/benefits/types`);
  }
}
```

### 4. Leave Management Service

```typescript
// services/leave.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveType: 'VACATION' | 'SICK' | 'PERSONAL' | 'MATERNITY' | 'PATERNITY' | 'OTHER';
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: 'VACATION' | 'SICK' | 'PERSONAL' | 'MATERNITY' | 'PATERNITY' | 'OTHER';
  startDate: Date;
  endDate: Date;
  days: number;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  comments?: string;
}

export interface CreateLeaveRequestRequest {
  leaveType: 'VACATION' | 'SICK' | 'PERSONAL' | 'MATERNITY' | 'PATERNITY' | 'OTHER';
  startDate: string;
  endDate: string;
  reason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  // Get leave balances for an employee
  getLeaveBalances(employeeId: string): Observable<LeaveBalance[]> {
    return this.http.get<LeaveBalance[]>(`${this.apiUrl}/${employeeId}/leave-balances`);
  }

  // Update leave balance
  updateLeaveBalance(employeeId: string, balanceId: string, balance: Partial<LeaveBalance>): Observable<LeaveBalance> {
    return this.http.put<LeaveBalance>(`${this.apiUrl}/${employeeId}/leave-balances/${balanceId}`, balance);
  }

  // Get leave requests for an employee
  getLeaveRequests(employeeId: string, params?: {
    status?: string;
    leaveType?: string;
    year?: number;
  }): Observable<LeaveRequest[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/${employeeId}/leave-requests`, { params: httpParams });
  }

  // Create leave request
  createLeaveRequest(employeeId: string, request: CreateLeaveRequestRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.apiUrl}/${employeeId}/leave-requests`, request);
  }

  // Update leave request
  updateLeaveRequest(employeeId: string, requestId: string, request: Partial<LeaveRequest>): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.apiUrl}/${employeeId}/leave-requests/${requestId}`, request);
  }

  // Delete leave request
  deleteLeaveRequest(employeeId: string, requestId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${employeeId}/leave-requests/${requestId}`);
  }

  // Get all leave requests (for managers/HR)
  getAllLeaveRequests(params?: {
    status?: string;
    department?: string;
    page?: number;
    limit?: number;
  }): Observable<{requests: LeaveRequest[], total: number, page: number, totalPages: number}> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    
    return this.http.get<any>(`${environment.apiUrl}/leave-requests`, { params: httpParams });
  }

  // Approve/Reject leave request
  reviewLeaveRequest(requestId: string, action: 'approve' | 'reject', comments?: string): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${environment.apiUrl}/leave-requests/${requestId}/${action}`, { comments });
  }
}
```

## Component Examples

### 1. Employee List Component

```typescript
// components/employee-list/employee-list.component.ts
import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalEmployees = 0;
  pageSize = 10;
  
  // Filters
  searchTerm = '';
  selectedDepartment = '';
  selectedStatus = '';
  departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];
  statuses = ['ACTIVE', 'INACTIVE', 'TERMINATED'];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = null;

    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...(this.searchTerm && { search: this.searchTerm }),
      ...(this.selectedDepartment && { department: this.selectedDepartment }),
      ...(this.selectedStatus && { status: this.selectedStatus })
    };

    this.employeeService.getEmployees(params).subscribe({
      next: (response) => {
        this.employees = response.employees;
        this.totalEmployees = response.total;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load employees';
        this.loading = false;
        console.error('Error loading employees:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEmployees();
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          this.error = 'Failed to delete employee';
          console.error('Error deleting employee:', error);
        }
      });
    }
  }
}
```

```html
<!-- components/employee-list/employee-list.component.html -->
<div class="employee-list-container">
  <h2>Employee Management</h2>
  
  <!-- Search and Filters -->
  <div class="filters-section">
    <div class="search-box">
      <input 
        type="text" 
        [(ngModel)]="searchTerm" 
        placeholder="Search employees..."
        (keyup.enter)="onSearch()"
      >
      <button (click)="onSearch()">Search</button>
    </div>
    
    <div class="filters">
      <select [(ngModel)]="selectedDepartment" (change)="onFilterChange()">
        <option value="">All Departments</option>
        <option *ngFor="let dept of departments" [value]="dept">{{dept}}</option>
      </select>
      
      <select [(ngModel)]="selectedStatus" (change)="onFilterChange()">
        <option value="">All Statuses</option>
        <option *ngFor="let status of statuses" [value]="status">{{status}}</option>
      </select>
    </div>
    
    <button routerLink="/employees/new" class="btn btn-primary">Add Employee</button>
  </div>

  <!-- Loading and Error States -->
  <div *ngIf="loading" class="loading">Loading employees...</div>
  <div *ngIf="error" class="error">{{error}}</div>

  <!-- Employee Table -->
  <table *ngIf="!loading && !error" class="employee-table">
    <thead>
      <tr>
        <th>Employee ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Department</th>
        <th>Position</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let employee of employees">
        <td>{{employee.employeeId}}</td>
        <td>{{employee.firstName}} {{employee.lastName}}</td>
        <td>{{employee.email}}</td>
        <td>{{employee.department}}</td>
        <td>{{employee.position}}</td>
        <td>
          <span [class]="'status ' + employee.status.toLowerCase()">
            {{employee.status}}
          </span>
        </td>
        <td>
          <button [routerLink]="['/employees', employee.id]" class="btn btn-sm">View</button>
          <button [routerLink]="['/employees', employee.id, 'edit']" class="btn btn-sm">Edit</button>
          <button (click)="deleteEmployee(employee)" class="btn btn-sm btn-danger">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Pagination -->
  <div *ngIf="totalPages > 1" class="pagination">
    <button 
      (click)="onPageChange(currentPage - 1)" 
      [disabled]="currentPage === 1"
    >Previous</button>
    
    <span *ngFor="let page of [].constructor(totalPages); let i = index">
      <button 
        (click)="onPageChange(i + 1)"
        [class.active]="currentPage === i + 1"
      >{{i + 1}}</button>
    </span>
    
    <button 
      (click)="onPageChange(currentPage + 1)" 
      [disabled]="currentPage === totalPages"
    >Next</button>
  </div>
</div>
```

## HTTP Interceptor for Authentication

```typescript
// interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add authentication token to requests
    const token = localStorage.getItem('authToken');
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}
```

## Usage Examples

### 1. Get All Employees with Pagination
```typescript
this.employeeService.getEmployees({ 
  page: 1, 
  limit: 10, 
  department: 'IT',
  status: 'ACTIVE' 
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
  hireDate: '2024-01-15',
  position: 'Software Developer',
  department: 'IT',
  salary: 75000
};

this.employeeService.createEmployee(newEmployee).subscribe(employee => {
  console.log('Created employee:', employee);
});
```

### 3. Submit Leave Request
```typescript
const leaveRequest = {
  leaveType: 'VACATION',
  startDate: '2024-03-01',
  endDate: '2024-03-05',
  reason: 'Family vacation'
};

this.leaveService.createLeaveRequest('employee-id', leaveRequest).subscribe(request => {
  console.log('Leave request submitted:', request);
});
```

### 4. Add Emergency Contact
```typescript
const emergencyContact = {
  name: 'Jane Doe',
  relationship: 'Spouse',
  phone: '555-0123',
  email: 'jane.doe@email.com',
  isPrimary: true
};

this.emergencyContactService.addEmergencyContact('employee-id', emergencyContact).subscribe(contact => {
  console.log('Emergency contact added:', contact);
});
```

This comprehensive guide provides all the Angular code needed to integrate with your HR Admin API! 