import { PrismaClient, Permission, Status } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { department_name: dept.name },
      update: {},
      create: {
        department_name: dept.name,
        description: dept.description
      }
    });
  }

  console.log('✅ Departments created');

  // Create default admin user
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
          employment_type: 'Regular',
          date_hired: new Date(),
          salary: 0
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

  // Create sample HR user
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
          first_name: 'HR',
          last_name: 'Manager',
          employment_type: 'Regular',
          date_hired: new Date(),
          salary: 50000,
          department_id: (await prisma.department.findFirst({ where: { department_name: 'Human Resources' } }))?.id
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

  // Create sample employee user
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
          first_name: 'John',
          last_name: 'Doe',
          employment_type: 'Regular',
          date_hired: new Date(),
          salary: 30000,
          department_id: (await prisma.department.findFirst({ where: { department_name: 'Information Technology' } }))?.id
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

  // Create default leave types
  const leaveTypes = [
    { name: 'Vacation Leave', description: 'Annual vacation leave', max_days: 15 },
    { name: 'Sick Leave', description: 'Medical leave', max_days: 15 },
    { name: 'Maternity Leave', description: 'Maternity leave', max_days: 105 },
    { name: 'Paternity Leave', description: 'Paternity leave', max_days: 7 },
    { name: 'Personal Leave', description: 'Personal leave', max_days: 3 }
  ];

  for (const leaveType of leaveTypes) {
    await prisma.leaveType.upsert({
      where: { leave_type_name: leaveType.name },
      update: {},
      create: {
        leave_type_name: leaveType.name,
        description: leaveType.description,
        max_days: leaveType.max_days,
        is_active: true
      }
    });
  }

  console.log('✅ Leave types created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Default users created:');
  console.log('👤 Admin: admin / Admin123!');
  console.log('👤 HR Manager: hr_manager / HR123!');
  console.log('👤 Employee: employee / Employee123!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 