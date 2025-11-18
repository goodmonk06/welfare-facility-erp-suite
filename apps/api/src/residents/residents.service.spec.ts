import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResidentsService } from './residents.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Gender } from './dto';

describe('ResidentsService', () => {
  let service: ResidentsService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      resident: {
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
    } as any;

    service = new ResidentsService(prismaService);
  });

  describe('findAll', () => {
    it('should throw BadRequestException when facilityId is not provided', async () => {
      await expect(service.findAll('')).rejects.toThrow(BadRequestException);
    });

    it('should return residents for a valid facilityId', async () => {
      const mockResidents = [
        {
          id: '1',
          facilityId: 'fac-1',
          lastName: 'Yamada',
          firstName: 'Taro',
          dateOfBirth: new Date('1941-05-15'),
          gender: Gender.MALE,
          status: 'active',
          facility: { id: 'fac-1', name: 'Test Facility', code: 'TEST' },
        },
      ];

      vi.spyOn(prismaService.resident, 'findMany').mockResolvedValue(mockResidents as any);

      const result = await service.findAll('fac-1');
      expect(result).toEqual(mockResidents);
      expect(prismaService.resident.findMany).toHaveBeenCalledWith({
        where: { facilityId: 'fac-1' },
        orderBy: { lastName: 'asc' },
        include: {
          facility: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when resident does not exist', async () => {
      vi.spyOn(prismaService.resident, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should return resident when found', async () => {
      const mockResident = {
        id: '1',
        facilityId: 'fac-1',
        lastName: 'Yamada',
        firstName: 'Taro',
        dateOfBirth: new Date('1941-05-15'),
        gender: Gender.MALE,
        status: 'active',
      };

      vi.spyOn(prismaService.resident, 'findUnique').mockResolvedValue(mockResident as any);

      const result = await service.findOne('1');
      expect(result).toEqual(mockResident);
    });
  });

  describe('create', () => {
    it('should throw BadRequestException when facility does not exist', async () => {
      vi.spyOn(prismaService.facility, 'findUnique').mockResolvedValue(null);

      const createDto = {
        facilityId: 'non-existent',
        lastName: 'Test',
        firstName: 'User',
        dateOfBirth: new Date(),
        gender: Gender.MALE,
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should create resident when facility exists', async () => {
      const mockFacility = { id: 'fac-1', name: 'Test Facility' };
      const mockResident = {
        id: '1',
        facilityId: 'fac-1',
        lastName: 'Test',
        firstName: 'User',
        gender: Gender.MALE,
      };

      vi.spyOn(prismaService.facility, 'findUnique').mockResolvedValue(mockFacility as any);
      vi.spyOn(prismaService.resident, 'create').mockResolvedValue(mockResident as any);

      const createDto = {
        facilityId: 'fac-1',
        lastName: 'Test',
        firstName: 'User',
        dateOfBirth: new Date(),
        gender: Gender.MALE,
      };

      const result = await service.create(createDto);
      expect(result).toEqual(mockResident);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when resident does not exist', async () => {
      vi.spyOn(prismaService.resident, 'findUnique').mockResolvedValue(null);

      await expect(service.update('non-existent', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when resident does not exist', async () => {
      vi.spyOn(prismaService.resident, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
