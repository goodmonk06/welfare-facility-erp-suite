import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IncidentsService } from './incidents.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IncidentType, IncidentSeverity, IncidentStatus } from './dto';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      incidentReport: {
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
      staff: {
        findUnique: vi.fn(),
      },
      resident: {
        findUnique: vi.fn(),
      },
      incidentCategory: {
        findUnique: vi.fn(),
      },
    } as any;

    service = new IncidentsService(prismaService);
  });

  describe('findAll', () => {
    it('should throw BadRequestException when facilityId is not provided', async () => {
      await expect(service.findAll('')).rejects.toThrow(BadRequestException);
    });

    it('should return incident reports for a valid facilityId', async () => {
      const mockIncidents = [
        {
          id: '1',
          facilityId: 'fac-1',
          incidentType: IncidentType.FALL,
          severity: IncidentSeverity.MEDIUM,
          status: IncidentStatus.REPORTED,
          resident: { id: 'res-1', lastName: 'Test', firstName: 'User' },
          reporter: { id: 'staff-1', lastName: 'Reporter', firstName: 'Staff' },
          category: null,
          followUpActions: [],
        },
      ];

      vi.spyOn(prismaService.incidentReport, 'findMany').mockResolvedValue(mockIncidents as any);

      const result = await service.findAll('fac-1');
      expect(result).toEqual(mockIncidents);
      expect(prismaService.incidentReport.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when incident does not exist', async () => {
      vi.spyOn(prismaService.incidentReport, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should return incident when found', async () => {
      const mockIncident = {
        id: '1',
        facilityId: 'fac-1',
        incidentType: IncidentType.FALL,
        severity: IncidentSeverity.HIGH,
        status: IncidentStatus.REPORTED,
        facility: { id: 'fac-1', name: 'Test Facility', code: 'TEST' },
        resident: { id: 'res-1', lastName: 'Test', firstName: 'User' },
        reporter: { id: 'staff-1', lastName: 'Reporter', firstName: 'Staff' },
        category: null,
        followUpActions: [],
      };

      vi.spyOn(prismaService.incidentReport, 'findUnique').mockResolvedValue(mockIncident as any);

      const result = await service.findOne('1');
      expect(result).toEqual(mockIncident);
    });
  });

  describe('create', () => {
    it('should throw BadRequestException when facility does not exist', async () => {
      vi.spyOn(prismaService.facility, 'findUnique').mockResolvedValue(null);

      const createDto = {
        facilityId: 'non-existent',
        reporterId: 'staff-1',
        incidentType: IncidentType.FALL,
        severity: IncidentSeverity.MEDIUM,
        occurredAt: new Date(),
        description: 'Test incident',
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when reporter does not exist', async () => {
      const mockFacility = { id: 'fac-1', name: 'Test Facility' };

      vi.spyOn(prismaService.facility, 'findUnique').mockResolvedValue(mockFacility as any);
      vi.spyOn(prismaService.staff, 'findUnique').mockResolvedValue(null);

      const createDto = {
        facilityId: 'fac-1',
        reporterId: 'non-existent',
        incidentType: IncidentType.FALL,
        severity: IncidentSeverity.MEDIUM,
        occurredAt: new Date(),
        description: 'Test incident',
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when resident does not exist', async () => {
      const mockFacility = { id: 'fac-1', name: 'Test Facility' };
      const mockStaff = { id: 'staff-1', lastName: 'Reporter' };

      vi.spyOn(prismaService.facility, 'findUnique').mockResolvedValue(mockFacility as any);
      vi.spyOn(prismaService.staff, 'findUnique').mockResolvedValue(mockStaff as any);
      vi.spyOn(prismaService.resident, 'findUnique').mockResolvedValue(null);

      const createDto = {
        facilityId: 'fac-1',
        reporterId: 'staff-1',
        residentId: 'non-existent',
        incidentType: IncidentType.FALL,
        severity: IncidentSeverity.MEDIUM,
        occurredAt: new Date(),
        description: 'Test incident',
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should create incident when all validations pass', async () => {
      const mockFacility = { id: 'fac-1', name: 'Test Facility' };
      const mockStaff = { id: 'staff-1', lastName: 'Reporter' };
      const mockIncident = {
        id: '1',
        facilityId: 'fac-1',
        reporterId: 'staff-1',
        incidentType: IncidentType.FALL,
        severity: IncidentSeverity.MEDIUM,
      };

      vi.spyOn(prismaService.facility, 'findUnique').mockResolvedValue(mockFacility as any);
      vi.spyOn(prismaService.staff, 'findUnique').mockResolvedValue(mockStaff as any);
      vi.spyOn(prismaService.incidentReport, 'create').mockResolvedValue(mockIncident as any);

      const createDto = {
        facilityId: 'fac-1',
        reporterId: 'staff-1',
        incidentType: IncidentType.FALL,
        severity: IncidentSeverity.MEDIUM,
        occurredAt: new Date(),
        description: 'Test incident',
      };

      const result = await service.create(createDto);
      expect(result).toEqual(mockIncident);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when incident does not exist', async () => {
      vi.spyOn(prismaService.incidentReport, 'findUnique').mockResolvedValue(null);

      await expect(service.update('non-existent', {})).rejects.toThrow(NotFoundException);
    });

    it('should update incident successfully', async () => {
      const mockExistingIncident = {
        id: '1',
        facilityId: 'fac-1',
        reporterId: 'staff-1',
        status: IncidentStatus.REPORTED,
      };
      const mockUpdatedIncident = {
        ...mockExistingIncident,
        status: IncidentStatus.RESOLVED,
      };

      vi.spyOn(prismaService.incidentReport, 'findUnique').mockResolvedValue(
        mockExistingIncident as any
      );
      vi.spyOn(prismaService.incidentReport, 'update').mockResolvedValue(
        mockUpdatedIncident as any
      );

      const result = await service.update('1', { status: IncidentStatus.RESOLVED });
      expect(result.status).toBe(IncidentStatus.RESOLVED);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when incident does not exist', async () => {
      vi.spyOn(prismaService.incidentReport, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should delete incident successfully', async () => {
      const mockIncident = { id: '1', facilityId: 'fac-1' };

      vi.spyOn(prismaService.incidentReport, 'findUnique').mockResolvedValue(mockIncident as any);
      vi.spyOn(prismaService.incidentReport, 'delete').mockResolvedValue(mockIncident as any);

      const result = await service.remove('1');
      expect(result).toEqual(mockIncident);
    });
  });

  describe('getStats', () => {
    it('should throw BadRequestException when facilityId is not provided', async () => {
      await expect(service.getStats('')).rejects.toThrow(BadRequestException);
    });

    it('should return statistics for a facility', async () => {
      vi.spyOn(prismaService.incidentReport, 'count')
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(2); // critical

      vi.spyOn(prismaService.incidentReport, 'groupBy')
        .mockResolvedValueOnce([
          { incidentType: IncidentType.FALL, _count: 5 },
          { incidentType: IncidentType.MEDICATION_ERROR, _count: 3 },
        ] as any)
        .mockResolvedValueOnce([
          { severity: IncidentSeverity.LOW, _count: 4 },
          { severity: IncidentSeverity.CRITICAL, _count: 2 },
        ] as any)
        .mockResolvedValueOnce([
          { status: IncidentStatus.REPORTED, _count: 3 },
          { status: IncidentStatus.RESOLVED, _count: 7 },
        ] as any);

      const result = await service.getStats('fac-1');

      expect(result.total).toBe(10);
      expect(result.critical).toBe(2);
      expect(result.byType[IncidentType.FALL]).toBe(5);
      expect(result.bySeverity[IncidentSeverity.LOW]).toBe(4);
      expect(result.byStatus[IncidentStatus.REPORTED]).toBe(3);
    });
  });

  describe('getCriticalIncidents', () => {
    it('should return recent critical incidents', async () => {
      const mockCriticalIncidents = [
        {
          id: '1',
          severity: IncidentSeverity.CRITICAL,
          incidentType: IncidentType.FRACTURE,
          occurredAt: new Date(),
          resident: { id: 'res-1', lastName: 'Test', firstName: 'User' },
          reporter: { id: 'staff-1', lastName: 'Reporter', firstName: 'Staff' },
        },
      ];

      vi.spyOn(prismaService.incidentReport, 'findMany').mockResolvedValue(
        mockCriticalIncidents as any
      );

      const result = await service.getCriticalIncidents('fac-1', 7);
      expect(result).toEqual(mockCriticalIncidents);
      expect(prismaService.incidentReport.findMany).toHaveBeenCalled();
    });
  });
});
