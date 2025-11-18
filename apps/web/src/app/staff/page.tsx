'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  staffApi,
  facilitiesApi,
  StaffMember,
  Facility,
  getStaffDisplayName,
  getPositionLabel,
  getEmploymentTypeLabel,
  getStatusLabel,
  getStatusBadgeClass,
} from '@/lib/api';

export default function StaffPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load facilities on mount
  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await facilitiesApi.list();
        setFacilities(data);
        if (data.length > 0 && !selectedFacilityId) {
          setSelectedFacilityId(data[0].id);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load facilities');
      }
    };
    loadFacilities();
  }, []);

  // Load staff when facility changes
  useEffect(() => {
    if (!selectedFacilityId) {
      setLoading(false);
      return;
    }

    const loadStaff = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await staffApi.list(selectedFacilityId);
        setStaff(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load staff');
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, [selectedFacilityId]);

  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);

  // Group staff by status
  const activeStaff = staff.filter((s) => s.status === 'active');
  const onLeaveStaff = staff.filter((s) => s.status === 'on_leave');
  const resignedStaff = staff.filter((s) => s.status === 'resigned');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">職員管理</h1>
        <p className="text-gray-600">事業所の職員情報を管理します</p>
      </div>

      {/* Facility Selector */}
      <div className="mb-6 bg-white rounded-lg shadow p-6">
        <label htmlFor="facility" className="block text-sm font-medium text-gray-700 mb-2">
          事業所を選択
        </label>
        <select
          id="facility"
          value={selectedFacilityId}
          onChange={(e) => setSelectedFacilityId(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- 事業所を選択してください --</option>
          {facilities.map((facility) => (
            <option key={facility.id} value={facility.id}>
              {facility.name} ({facility.code})
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Staff List */}
      {!loading && !error && selectedFacilityId && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">総職員数</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{staff.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">在職中</div>
              <div className="text-3xl font-bold text-green-600 mt-2">{activeStaff.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">休職中</div>
              <div className="text-3xl font-bold text-yellow-600 mt-2">{onLeaveStaff.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">退職</div>
              <div className="text-3xl font-bold text-gray-600 mt-2">{resignedStaff.length}</div>
            </div>
          </div>

          {staff.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">
                {selectedFacility?.name}に登録されている職員はまだありません
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  職員一覧 ({staff.length}名)
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        職員番号
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        氏名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        役職
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        雇用形態
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        資格
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アクション
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staff.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.employeeNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getStaffDisplayName(member)}
                          </div>
                          {member.email && (
                            <div className="text-sm text-gray-500">{member.email}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getPositionLabel(member.position)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getEmploymentTypeLabel(member.employmentType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.certifications && member.certifications.length > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {member.certifications.length} 件
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                              member.status
                            )}`}
                          >
                            {getStatusLabel(member.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link
                            href={`/staff/${member.id}`}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            詳細
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && !selectedFacilityId && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">事業所を選択してください</p>
        </div>
      )}
    </div>
  );
}
