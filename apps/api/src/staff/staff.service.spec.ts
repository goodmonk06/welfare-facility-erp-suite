import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StaffService } from './staff.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StaffPosition, EmploymentType, StaffStatus } from './dto';

describe('StaffService', () => {
  let service: StaffService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      staff: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
        groupBy: vi.fn(),
      },
      facility: {
        findUnique: vi.fn(),
      },
      shift: {
        count: vi.fn(),
      },
    } as any;

    service = new StaffService(prismaService);
  });

  describe('findAll', () => {
    it('should throw BadRequestException when facilityId is not provided', async () => {
      await expect(service.findAll('')).rejects.toThrow(BadRequestException);
    });

    it('should return staff members for a valid facilityId', async () => {
      const mockStaff = [
        {
          id: '1',
          facilityId: 'fac-1',
          employeeNumber: 'EMP-0001',
          lastName: 'Tanaka',
          firstName: 'Taro',
          position: StaffPosition.CARE_WORKER,
          employmentType: EmploymentType.FULL_TIME,
          status: StaffStatus.ACTIVE,
          facility: { id: 'fac-1', name: 'Test Facility', code: 'TEST' },
          certifications: [],
        },
      ];

      vi.spyOn(prismaService.staff, 'findMany').mockResolvedValue(mockStaff as any);

      const result = await service.findAll('fac-1');
      expect(result).toEqual(mockStaff);
      expect(prismaService.staff.findMany).toHaveBeenCalledWith({
        where: { facilityId: 'fac-1' },
        orderBy: [
          { status: 'asc' },
          { employeeNumber: 'asc' },
        ],
        include: {
          facility: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          certifications: {
            where: {
              status: 'active',
            },
            select: {
              id: true,
              name: true,
              expiryDate: true,
              status: true,
            },
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when staff does not exist', async () => {
      vi.spyOn(prismaService.staff, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should return staff member when found', async () => {
      const mockStaff = {
        id: '1',
        facilityId: 'fac-1',
        employeeNumber: 'EMP-0001',
        lastName: 'Tanaka',
        firstName: 'Taro',
        position: StaffPosition.CARE_WORKER,
        employmentType: EmploymentType.FULL_TIME,
        status: StaffStatus.ACTIVE,
        facility: { id: 'fac-1', name: 'Test Facility', code: 'TEST', type: 'nursing_home' },
        certifications: [],
        shifts: [],
        leaveRequests: [],
        schedulePreferences: [],
        performanceReviews: [],
        teamMemberships: [],
      };

      vi.spyOn(prismaService.staff, 'findUnique').mockResolvedValue(mockStaff as any);

      const result = await service.findOne('1');
      expect(result).toEqual(mockStaff);
    });
  });

  describe('create', () => {
    it('should throw BadRequestException when facility does not exist', async () => {
      vi.spyOn(prismaService.facility, 'findUnique').mockResolvedValue(null);

      const createDto = {
        facilityId: 'non-existent',
        employeeNumber: 'EMP-0001',
        lastName: 'Test',
        firstName: 'User',
        position: StaffPosition.CARE_WORKER,
        employmentType: EmploymentType.FULL_TIME,
        hireDate: new Date(),
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when employee number already exists', async () => {
      const mockFacility = { id: 'fac-1', name: 'Test Facility' };
      const mockExistingStaff = { id: 'existing-1', employeeNumber: 'EMP-0001' };

      vi.spyOn(prismaService.facility, 'findUnique').mockResolvedValue(mockFacility as any);
      vi.spyOn(prismaService.staff, 'findUnique').mockResolvedValue(mockExistingStaff as any);

      const createDto = {
        facilityId: 'fac-1',
        employeeNumber: 'EMP-0001',
        lastName: 'Test',
        firstName: 'User',
        position: StaffPosition.CARE_WORKER,
        employmentType: EmploymentType.FULL_TIME,
        hireDate: new Date(),
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should create staff when facility exists and employee number is unique', async () => {
      const mockFacility = { id: 'fac-1', name: 'Test Facility' };
      const mockStaff = {
        id: '1',
        facilityId: 'fac-1',
        employeeNumber: 'EMP-0001',
        lastName: 'Test',
        firstName: 'User',
        position: StaffPosition.CARE_WORKER,
        employmentType: EmploymentType.FULL_TIME,
      };

      vi.spyOn(prismaService.facility, 'findUnique').mockResolvedValue(mockFacility as any);
      vi.spyOn(prismaService.staff, 'findUnique').mockResolvedValue(null); // No duplicate
      vi.spyOn(prismaService.staff, 'create').mockResolvedValue(mockStaff as any);

      const createDto = {
        facilityId: 'fac-1',
        employeeNumber: 'EMP-0001',
        lastName: 'Test',
        firstName: 'User',
        position: StaffPosition.CARE_WORKER,
        employmentType: EmploymentType.FULL_TIME,
        hireDate: new Date(),
      };

      const result = await service.create(createDto);
      expect(result).toEqual(mockStaff);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when staff does not exist', async () => {
      vi.spyOn(prismaService.staff, 'findUnique').mockResolvedValue(null);

      await expect(service.update('non-existent', {})).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when updating to duplicate employee number', async () => {
      const mockExistingStaff = {
        id: '1',
        employeeNumber: 'EMP-0001',
        facilityId: 'fac-1',
      };
      const mockDuplicateStaff = {
        id: '2',
        employeeNumber: 'EMP-0002',
      };

      vi.spyOn(prismaService.staff, 'findUnique')
        .mockResolvedValueOnce(mockExistingStaff as any) // First call - check exists
        .mockResolvedValueOnce(mockDuplicateStaff as any); // Second call - check duplicate

      await expect(service.update('1', { employeeNumber: 'EMP-0002' })).rejects.toThrow(
        BadRequestException
      );
    });

    it('should update staff successfully', async () => {
      const mockExistingStaff = {
        id: '1',
        employeeNumber: 'EMP-0001',
        facilityId: 'fac-1',
      };
      const mockUpdatedStaff = {
        ...mockExistingStaff,
        position: StaffPosition.NURSE,
      };

      vi.spyOn(prismaService.staff, 'findUnique').mockResolvedValue(mockExistingStaff as any);
      vi.spyOn(prismaService.staff, 'update').mockResolvedValue(mockUpdatedStaff as any);

      const result = await service.update('1', { position: StaffPosition.NURSE });
      expect(result).toEqual(mockUpdatedStaff);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when staff does not exist', async () => {
      vi.spyOn(prismaService.staff, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when staff has existing shifts', async () => {
      const mockStaff = { id: '1', employeeNumber: 'EMP-0001' };

      vi.spyOn(prismaService.staff, 'findUnique').mockResolvedValue(mockStaff as any);
      vi.spyOn(prismaService.shift, 'count').mockResolvedValue(5);

      await expect(service.remove('1')).rejects.toThrow(BadRequestException);
    });

    it('should delete staff successfully when no shifts exist', async () => {
      const mockStaff = { id: '1', employeeNumber: 'EMP-0001' };

      vi.spyOn(prismaService.staff, 'findUnique').mockResolvedValue(mockStaff as any);
      vi.spyOn(prismaService.shift, 'count').mockResolvedValue(0);
      vi.spyOn(prismaService.staff, 'delete').mockResolvedValue(mockStaff as any);

      const result = await service.remove('1');
      expect(result).toEqual(mockStaff);
    });
  });

  describe('getOnDutyStaff', () => {
    it('should throw BadRequestException when facilityId is not provided', async () => {
      await expect(service.getOnDutyStaff('', new Date())).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when date is invalid', async () => {
      await expect(service.getOnDutyStaff('fac-1', new Date('invalid'))).rejects.toThrow(
        BadRequestException
      );
    });

    it('should return on-duty staff for a valid date', async () => {
      const date = new Date('2024-01-20');
      const mockStaff = [
        {
          id: '1',
          employeeNumber: 'EMP-0001',
          status: StaffStatus.ACTIVE,
          shifts: [{ date, shiftType: 'day' }],
          certifications: [],
        },
      ];

      vi.spyOn(prismaService.staff, 'findMany').mockResolvedValue(mockStaff as any);

      const result = await service.getOnDutyStaff('fac-1', date);
      expect(result).toEqual(mockStaff);
    });
  });

  describe('getStaffStatistics', () => {
    it('should return staff statistics for a facility', async () => {
      vi.spyOn(prismaService.staff, 'count')
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(8)  // active
        .mockResolvedValueOnce(1)  // on_leave
        .mockResolvedValueOnce(1); // resigned

      vi.spyOn(prismaService.staff, 'groupBy')
        .mockResolvedValueOnce([
          { position: StaffPosition.CARE_WORKER, _count: 5 },
          { position: StaffPosition.NURSE, _count: 3 },
        ] as any)
        .mockResolvedValueOnce([
          { employmentType: EmploymentType.FULL_TIME, _count: 6 },
          { employmentType: EmploymentType.PART_TIME, _count: 2 },
        ] as any);

      const result = await service.getStaffStatistics('fac-1');

      expect(result).toEqual({
        total: 10,
        active: 8,
        onLeave: 1,
        resigned: 1,
        byPosition: {
          [StaffPosition.CARE_WORKER]: 5,
          [StaffPosition.NURSE]: 3,
        },
        byEmploymentType: {
          [EmploymentType.FULL_TIME]: 6,
          [EmploymentType.PART_TIME]: 2,
        },
      });
    });
  });
});
