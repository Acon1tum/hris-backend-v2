import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../../types';

const prisma = new PrismaClient();

function mapPersonnelToUserProfile(personnel: any) {
  return {
    general: {
      firstName: personnel.first_name || '',
      middleName: personnel.middle_name || '',
      lastName: personnel.last_name || '',
      fullName: `${personnel.first_name || ''} ${personnel.last_name || ''}`.trim(),
      birthdate: personnel.date_of_birth ? new Date(personnel.date_of_birth).toLocaleDateString() : '',
      contactNumber: personnel.contact_number || '',
      address: personnel.address || '',
      email: personnel.user?.email || '',
      gender: personnel.gender || '',
      civilStatus: personnel.civil_status || '',
      citizenship: personnel.citizenship || '', // If you add this to schema/seed
    },
    employment: {
      employmentType: personnel.employment_type || '',
      designation: personnel.designation || '',
      department: personnel.department?.department_name || '',
      appointmentDate: personnel.date_hired ? new Date(personnel.date_hired).toLocaleDateString() : '',
      startDate: personnel.date_hired ? new Date(personnel.date_hired).toLocaleDateString() : '',
      employmentStatus: personnel.user?.status || '',
      jobLevel: personnel.job_level || '', // If you add this to schema/seed
      jobGrade: personnel.job_grade || '', // If you add this to schema/seed
    },
    membership: {
      gsis: personnel.gsis_number || '',
      pagibig: personnel.pagibig_number || '',
      philhealth: personnel.philhealth_number || '',
      sss: personnel.sss_number || '',
    },
    other: {
      dependents: personnel.dependents || '', // If you add this to schema/seed
      emergencyContactName: personnel.emergency_contact_name || '', // If you add this to schema/seed
      emergencyContactNumber: personnel.emergency_contact_number || '', // If you add this to schema/seed
      emergencyContactRelationship: personnel.emergency_contact_relationship || '', // If you add this to schema/seed
    },
  };
}

export const employeeSelfServiceController = {
  // GET /api/employee-self-service/my-profile - Get logged-in user's profile
  async getMyProfile(req: AuthenticatedRequest, res: Response) {
    try {
      // Assume req.user.id is set by auth middleware
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      // Fetch personnel profile by userId
      const personnel = await prisma.personnel.findFirst({
        where: { user_id: userId },
        include: {
          department: true,
          user: true,
        },
      });
      if (!personnel) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
      }
      console.log('Personnel raw from DB:', personnel); // Dump raw personnel object
      const userProfile = mapPersonnelToUserProfile(personnel);
      res.json({
        success: true,
        data: userProfile,
        message: 'Profile fetched successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
        error: error.message,
      });
    }
  },
}; 