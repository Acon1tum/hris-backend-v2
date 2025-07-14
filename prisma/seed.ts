import { PrismaClient, Permission, Status, Gender, CivilStatus, EmploymentType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'System Administrator' },
    update: {},
    create: {
      name: 'System Administrator',
      description: 'Full system access with all permissions',
      is_active: true
    }
  });

  const hrRole = await prisma.role.upsert({
    where: { name: 'HR Manager' },
    update: {},
    create: {
      name: 'HR Manager',
      description: 'HR management with personnel and recruitment permissions',
      is_active: true
    }
  });

  const employeeRole = await prisma.role.upsert({
    where: { name: 'Employee' },
    update: {},
    create: {
      name: 'Employee',
      description: 'Basic employee access',
      is_active: true
    }
  });

  console.log('✅ Roles created');

  // Create permissions for admin role
  const adminPermissions = Object.values(Permission);
  for (const permission of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission: {
          role_id: adminRole.id,
          permission
        }
      },
      update: {},
      create: {
        role_id: adminRole.id,
        permission,
        granted_by: null
      }
    });
  }

  // Create permissions for HR role
  const hrPermissions: Permission[] = [
    Permission.employee_read, Permission.employee_create, Permission.employee_update,
    Permission.leave_request_read, Permission.leave_request_update,
    Permission.applicant_read, Permission.applicant_create, Permission.applicant_update,
    Permission.job_posting_read, Permission.job_posting_create, Permission.job_posting_update,
    Permission.application_read, Permission.application_create, Permission.application_update,
    Permission.recruitment_status_read, Permission.recruitment_status_create, Permission.recruitment_status_update,
    Permission.interview_schedule_read, Permission.interview_schedule_create, Permission.interview_schedule_update,
    Permission.payroll_record_read, Permission.payroll_record_create,
    Permission.performance_review_read, Permission.performance_review_create,
    Permission.report_read, Permission.report_generate
  ];

  for (const permission of hrPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission: {
          role_id: hrRole.id,
          permission
        }
      },
      update: {},
      create: {
        role_id: hrRole.id,
        permission,
        granted_by: null
      }
    });
  }

  // Create permissions for employee role
  const employeePermissions: Permission[] = [
    Permission.employee_read,
    Permission.leave_request_create, Permission.leave_request_read,
    Permission.attendance_log_create, Permission.attendance_log_read,
    Permission.performance_review_read
  ];

  for (const permission of employeePermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission: {
          role_id: employeeRole.id,
          permission
        }
      },
      update: {},
      create: {
        role_id: employeeRole.id,
        permission,
        granted_by: null
      }
    });
  }

  console.log('✅ Permissions assigned');

  // Create default departments
  const departments = [
    { name: 'Human Resources', description: 'HR Department' },
    { name: 'Information Technology', description: 'IT Department' },
    { name: 'Finance', description: 'Finance Department' },
    { name: 'Marketing', description: 'Marketing Department' },
    { name: 'Operations', description: 'Operations Department' }
  ];

  const createdDepartments: { [key: string]: string } = {};
  for (const dept of departments) {
    const department = await prisma.department.upsert({
      where: { department_name: dept.name },
      update: {},
      create: {
        department_name: dept.name,
        description: dept.description
      }
    });
    createdDepartments[dept.name] = department.id;
  }

  console.log('✅ Departments created');

  // Create default admin user with detailed personnel information
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@company.com',
      password_hash: hashedPassword,
      status: Status.Active,
      personnel: {
        create: {
          first_name: 'System',
          last_name: 'Administrator',
          middle_name: 'Admin',
          date_of_birth: new Date('1985-01-15'),
          gender: Gender.Male,
          civil_status: CivilStatus.Single,
          contact_number: '+63-917-123-4567',
          address: '123 Admin Street, Business District, Metro Manila, Philippines',
          department_id: createdDepartments['Information Technology'],
          designation: 'System Administrator',
          employment_type: EmploymentType.Regular,
          date_hired: new Date('2020-01-01'),
          salary: 80000,
          gsis_number: 'GSIS-001122334455',
          pagibig_number: 'HDMF-112233445566',
          philhealth_number: 'PH-123456789012',
          sss_number: 'SSS-001122334455',
          tin_number: 'TIN-123456789'
        }
      }
    }
  });

  // Assign admin role to admin user
  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: adminUser.id,
        role_id: adminRole.id
      }
    },
    update: {},
    create: {
      user_id: adminUser.id,
      role_id: adminRole.id,
      assigned_by: null
    }
  });

  console.log('✅ Admin user created');

  // Create sample HR user with detailed personnel information
  const hrPassword = await bcrypt.hash('HR123!', 12);
  
  const hrUser = await prisma.user.upsert({
    where: { username: 'hr_manager' },
    update: {},
    create: {
      username: 'hr_manager',
      email: 'hr@company.com',
      password_hash: hrPassword,
      status: Status.Active,
      personnel: {
        create: {
          first_name: 'Maria',
          last_name: 'Santos',
          middle_name: 'Reyes',
          date_of_birth: new Date('1988-03-22'),
          gender: Gender.Female,
          civil_status: CivilStatus.Married,
          contact_number: '+63-928-234-5678',
          address: '456 HR Avenue, Makati City, Metro Manila, Philippines',
          department_id: createdDepartments['Human Resources'],
          designation: 'HR Manager',
          employment_type: EmploymentType.Regular,
          date_hired: new Date('2019-06-15'),
          salary: 65000,
          gsis_number: 'GSIS-223344556677',
          pagibig_number: 'HDMF-223344556677',
          philhealth_number: 'PH-234567890123',
          sss_number: 'SSS-223344556677',
          tin_number: 'TIN-234567890'
        }
      }
    }
  });

  // Assign HR role to HR user
  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: hrUser.id,
        role_id: hrRole.id
      }
    },
    update: {},
    create: {
      user_id: hrUser.id,
      role_id: hrRole.id,
      assigned_by: null
    }
  });

  console.log('✅ HR user created');

  // Create sample employee user with detailed personnel information
  const employeePassword = await bcrypt.hash('Employee123!', 12);
  
  const employeeUser = await prisma.user.upsert({
    where: { username: 'employee' },
    update: {},
    create: {
      username: 'employee',
      email: 'employee@company.com',
      password_hash: employeePassword,
      status: Status.Active,
      personnel: {
        create: {
          first_name: 'Juan',
          last_name: 'Cruz',
          middle_name: 'dela',
          date_of_birth: new Date('1992-07-08'),
          gender: Gender.Male,
          civil_status: CivilStatus.Single,
          contact_number: '+63-939-345-6789',
          address: '789 Employee Road, Quezon City, Metro Manila, Philippines',
          department_id: createdDepartments['Information Technology'],
          designation: 'Software Developer',
          employment_type: EmploymentType.Regular,
          date_hired: new Date('2021-03-01'),
          salary: 45000,
          gsis_number: 'GSIS-334455667788',
          pagibig_number: 'HDMF-334455667788',
          philhealth_number: 'PH-345678901234',
          sss_number: 'SSS-334455667788',
          tin_number: 'TIN-345678901'
        }
      }
    }
  });

  // Assign employee role to employee user
  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: employeeUser.id,
        role_id: employeeRole.id
      }
    },
    update: {},
    create: {
      user_id: employeeUser.id,
      role_id: employeeRole.id,
      assigned_by: null
    }
  });

  console.log('✅ Employee user created');

  // Create additional sample employees with varied profiles
  const additionalEmployees = [
    {
      username: 'finance_head',
      email: 'finance@company.com',
      password: 'Finance123!',
      personnel: {
        first_name: 'Ana',
        last_name: 'Garcia',
        middle_name: 'Lopez',
        date_of_birth: new Date('1986-11-12'),
        gender: Gender.Female,
        civil_status: CivilStatus.Married,
        contact_number: '+63-917-456-7890',
        address: '321 Finance Street, BGC, Taguig City, Metro Manila, Philippines',
        department_id: createdDepartments['Finance'],
        designation: 'Finance Manager',
        employment_type: EmploymentType.Regular,
        date_hired: new Date('2018-09-01'),
        salary: 70000,
        gsis_number: 'GSIS-445566778899',
        pagibig_number: 'HDMF-445566778899',
        philhealth_number: 'PH-456789012345',
        sss_number: 'SSS-445566778899',
        tin_number: 'TIN-456789012'
      }
    },
    {
      username: 'marketing_lead',
      email: 'marketing@company.com',
      password: 'Marketing123!',
      personnel: {
        first_name: 'Carlos',
        last_name: 'Rodriguez',
        middle_name: 'Miguel',
        date_of_birth: new Date('1990-04-25'),
        gender: Gender.Male,
        civil_status: CivilStatus.Single,
        contact_number: '+63-928-567-8901',
        address: '654 Marketing Plaza, Ortigas Center, Pasig City, Metro Manila, Philippines',
        department_id: createdDepartments['Marketing'],
        designation: 'Marketing Specialist',
        employment_type: EmploymentType.Regular,
        date_hired: new Date('2020-11-15'),
        salary: 50000,
        gsis_number: 'GSIS-556677889900',
        pagibig_number: 'HDMF-556677889900',
        philhealth_number: 'PH-567890123456',
        sss_number: 'SSS-556677889900',
        tin_number: 'TIN-567890123'
      }
    },
    {
      username: 'operations_mgr',
      email: 'operations@company.com',
      password: 'Operations123!',
      personnel: {
        first_name: 'Elena',
        last_name: 'Fernandez',
        middle_name: 'Santos',
        date_of_birth: new Date('1987-09-30'),
        gender: Gender.Female,
        civil_status: CivilStatus.Divorced,
        contact_number: '+63-939-678-9012',
        address: '987 Operations Center, Alabang, Muntinlupa City, Metro Manila, Philippines',
        department_id: createdDepartments['Operations'],
        designation: 'Operations Manager',
        employment_type: EmploymentType.Regular,
        date_hired: new Date('2019-02-01'),
        salary: 60000,
        gsis_number: 'GSIS-667788990011',
        pagibig_number: 'HDMF-667788990011',
        philhealth_number: 'PH-678901234567',
        sss_number: 'SSS-667788990011',
        tin_number: 'TIN-678901234'
      }
    }
  ];

  for (const emp of additionalEmployees) {
    const hashedEmpPassword = await bcrypt.hash(emp.password, 12);
    
    const newUser = await prisma.user.upsert({
      where: { username: emp.username },
      update: {},
      create: {
        username: emp.username,
        email: emp.email,
        password_hash: hashedEmpPassword,
        status: Status.Active,
        personnel: {
          create: emp.personnel
        }
      }
    });

    // Assign employee role to additional employees
    await prisma.userRole.upsert({
      where: {
        user_id_role_id: {
          user_id: newUser.id,
          role_id: employeeRole.id
        }
      },
      update: {},
      create: {
        user_id: newUser.id,
        role_id: employeeRole.id,
        assigned_by: null
      }
    });
  }

  console.log('✅ Additional employees created');

  // Create default leave types
  const leaveTypes = [
    { name: 'Vacation Leave', description: 'Annual vacation leave', max_days: 15 },
    { name: 'Sick Leave', description: 'Medical leave', max_days: 15 },
    { name: 'Maternity Leave', description: 'Maternity leave', max_days: 105 },
    { name: 'Paternity Leave', description: 'Paternity leave', max_days: 7 },
    { name: 'Personal Leave', description: 'Personal leave', max_days: 3 }
  ];

  for (const leaveType of leaveTypes) {
    // Find existing leave type by name
    const existing = await prisma.leaveType.findFirst({ where: { leave_type_name: leaveType.name } });
    if (existing) {
      await prisma.leaveType.update({
        where: { id: existing.id },
        data: {
          description: leaveType.description,
          max_days: leaveType.max_days,
          is_active: true
        }
      });
    } else {
      await prisma.leaveType.create({
        data: {
          leave_type_name: leaveType.name,
          description: leaveType.description,
          max_days: leaveType.max_days,
          is_active: true
        }
      });
    }
  }

  console.log('✅ Leave types created');

  // Get all personnel and leave types for creating balances and applications
  const allPersonnel = await prisma.personnel.findMany();
  const allLeaveTypes = await prisma.leaveType.findMany();
  const currentYear = new Date().getFullYear().toString();

  // Create leave balances for all personnel
  console.log('🌱 Creating leave balances...');
  for (const personnel of allPersonnel) {
    for (const leaveType of allLeaveTypes) {
      let totalCredits = 15; // Default credits
      
      // Assign different credits based on leave type
      if (leaveType.leave_type_name === 'Vacation Leave') totalCredits = 15;
      else if (leaveType.leave_type_name === 'Sick Leave') totalCredits = 15;
      else if (leaveType.leave_type_name === 'Maternity Leave') totalCredits = 105;
      else if (leaveType.leave_type_name === 'Paternity Leave') totalCredits = 7;
      else if (leaveType.leave_type_name === 'Personal Leave') totalCredits = 3;

      await prisma.leaveBalance.upsert({
        where: {
          personnel_id_leave_type_id_year: {
            personnel_id: personnel.id,
            leave_type_id: leaveType.id,
            year: currentYear
          }
        },
        update: {},
        create: {
          personnel_id: personnel.id,
          leave_type_id: leaveType.id,
          year: currentYear,
          total_credits: totalCredits,
          used_credits: 0,
          earned_credits: totalCredits
        }
      });
    }
  }

  console.log('✅ Leave balances created');

  // Create sample leave applications
  console.log('🌱 Creating sample leave applications...');
  
  if (allPersonnel.length > 0 && allLeaveTypes.length > 0) {
    const vacationLeave = allLeaveTypes.find(lt => lt.leave_type_name === 'Vacation Leave');
    const sickLeave = allLeaveTypes.find(lt => lt.leave_type_name === 'Sick Leave');
    const personalLeave = allLeaveTypes.find(lt => lt.leave_type_name === 'Personal Leave');

    const sampleApplications = [
      {
        personnel_id: allPersonnel[0].id, // Admin
        leave_type_id: vacationLeave?.id || allLeaveTypes[0].id,
        start_date: new Date('2024-12-15'),
        end_date: new Date('2024-12-20'),
        total_days: 6,
        status: 'Approved',
        reason: 'Year-end vacation with family'
      },
      {
        personnel_id: allPersonnel[1].id, // HR Manager
        leave_type_id: sickLeave?.id || allLeaveTypes[1].id,
        start_date: new Date('2024-11-25'),
        end_date: new Date('2024-11-26'),
        total_days: 2,
        status: 'Approved',
        reason: 'Medical checkup and recovery',
        supporting_document: 'medical_certificate_nov2024.pdf'
      },
      {
        personnel_id: allPersonnel[2].id, // Employee
        leave_type_id: personalLeave?.id || allLeaveTypes[4].id,
        start_date: new Date('2024-12-02'),
        end_date: new Date('2024-12-02'),
        total_days: 1,
        status: 'Pending',
        reason: 'Personal appointment'
      },
      {
        personnel_id: allPersonnel.length > 3 ? allPersonnel[3].id : allPersonnel[0].id, // Finance Head or fallback
        leave_type_id: vacationLeave?.id || allLeaveTypes[0].id,
        start_date: new Date('2024-12-23'),
        end_date: new Date('2024-12-30'),
        total_days: 8,
        status: 'Pending',
        reason: 'Christmas and New Year holiday'
      },
      {
        personnel_id: allPersonnel.length > 4 ? allPersonnel[4].id : allPersonnel[1].id, // Marketing Lead or fallback
        leave_type_id: sickLeave?.id || allLeaveTypes[1].id,
        start_date: new Date('2024-10-15'),
        end_date: new Date('2024-10-16'),
        total_days: 2,
        status: 'Rejected',
        reason: 'Flu symptoms'
      },
      {
        personnel_id: allPersonnel.length > 5 ? allPersonnel[5].id : allPersonnel[2].id, // Operations Manager or fallback
        leave_type_id: vacationLeave?.id || allLeaveTypes[0].id,
        start_date: new Date('2024-11-18'),
        end_date: new Date('2024-11-22'),
        total_days: 5,
        status: 'Approved',
        reason: 'Wedding anniversary celebration'
      }
    ];

    for (const app of sampleApplications) {
      const existingApp = await prisma.leaveApplication.findFirst({
        where: {
          personnel_id: app.personnel_id,
          leave_type_id: app.leave_type_id,
          start_date: app.start_date
        }
      });

      if (!existingApp) {
        const leaveApp = await prisma.leaveApplication.create({
          data: {
            personnel_id: app.personnel_id,
            leave_type_id: app.leave_type_id,
            start_date: app.start_date,
            end_date: app.end_date,
            total_days: app.total_days,
            status: app.status as any,
            reason: app.reason,
            supporting_document: app.supporting_document
          }
        });

        // Update leave balance if approved
        if (app.status === 'Approved') {
          await prisma.leaveBalance.updateMany({
            where: {
              personnel_id: app.personnel_id,
              leave_type_id: app.leave_type_id,
              year: currentYear
            },
            data: {
              used_credits: {
                increment: app.total_days
              }
            }
          });
        }
      }
    }
  }

  console.log('✅ Sample leave applications created');

  // Create sample leave monetization requests
  console.log('🌱 Creating sample leave monetization requests...');
  
  if (allPersonnel.length > 0 && allLeaveTypes.length > 0) {
    const vacationLeave = allLeaveTypes.find(lt => lt.leave_type_name === 'Vacation Leave');
    
    const sampleMonetization = [
      {
        personnel_id: allPersonnel[0].id, // Admin
        leave_type_id: vacationLeave?.id || allLeaveTypes[0].id,
        days_to_monetize: 5,
        status: 'Approved',
        amount: 15000 // Assuming daily rate calculation
      },
      {
        personnel_id: allPersonnel[1].id, // HR Manager
        leave_type_id: vacationLeave?.id || allLeaveTypes[0].id,
        days_to_monetize: 3,
        status: 'Pending',
        amount: null
      },
      {
        personnel_id: allPersonnel.length > 3 ? allPersonnel[3].id : allPersonnel[2].id, // Finance Head or fallback
        leave_type_id: vacationLeave?.id || allLeaveTypes[0].id,
        days_to_monetize: 7,
        status: 'Rejected',
        amount: null
      }
    ];

    for (const monetization of sampleMonetization) {
      const existing = await prisma.leaveMonetization.findFirst({
        where: {
          personnel_id: monetization.personnel_id,
          leave_type_id: monetization.leave_type_id,
          days_to_monetize: monetization.days_to_monetize
        }
      });

      if (!existing) {
        await prisma.leaveMonetization.create({
          data: {
            personnel_id: monetization.personnel_id,
            leave_type_id: monetization.leave_type_id,
            days_to_monetize: monetization.days_to_monetize,
            status: monetization.status as any,
            amount: monetization.amount,
            approved_by: monetization.status === 'Approved' ? allPersonnel[0].user_id : null,
            approval_date: monetization.status === 'Approved' ? new Date() : null
          }
        });
      }
    }
  }

  console.log('✅ Sample leave monetization requests created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Default users created:');
  console.log('👤 Admin: admin / Admin123!');
  console.log('👤 HR Manager: hr_manager / HR123!');
  console.log('👤 Employee: employee / Employee123!');
  console.log('👤 Finance Manager: finance_head / Finance123!');
  console.log('👤 Marketing Specialist: marketing_lead / Marketing123!');
  console.log('👤 Operations Manager: operations_mgr / Operations123!');
  console.log('\n📊 Leave data created:');
  console.log(`✅ ${allLeaveTypes.length} leave types`);
  console.log(`✅ ${allPersonnel.length * allLeaveTypes.length} leave balances for ${currentYear}`);
  console.log('✅ 6 sample leave applications (Approved, Pending, Rejected)');
  console.log('✅ 3 sample leave monetization requests');
  console.log('\n🔍 Sample leave data includes:');
  console.log('• Admin: Approved vacation (Dec 15-20), Approved monetization (5 days)');
  console.log('• HR Manager: Approved sick leave (Nov 25-26), Pending monetization (3 days)');
  console.log('• Employee: Pending personal leave (Dec 2)');
  console.log('• Finance Head: Pending vacation (Dec 23-30), Rejected monetization (7 days)');
  console.log('• Marketing Lead: Rejected sick leave (Oct 15-16)');
  console.log('• Operations Manager: Approved vacation (Nov 18-22)');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 