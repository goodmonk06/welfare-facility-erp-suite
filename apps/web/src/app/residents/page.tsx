'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { residentsApi, Resident, facilitiesApi, Facility } from '@/lib/api';

const careLevelLabels: Record<number, string> = {
  0: '要支援',
  1: '要介護1',
  2: '要介護2',
  3: '要介護3',
  4: '要介護4',
  5: '要介護5',
};

export default function ResidentsPage() {
  const router = useRouter();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    if (selectedFacility) {
      loadResidents();
    }
  }, [selectedFacility]);

  const loadFacilities = async () => {
    try {
      const data = await facilitiesApi.list();
      setFacilities(data);
      if (data.length > 0 && !selectedFacility) {
        setSelectedFacility(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load facilities');
    }
  };

  const loadResidents = async () => {
    if (!selectedFacility) return;

    try {
      setLoading(true);
      setError(null);
      const data = await residentsApi.list(selectedFacility);
      setResidents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load residents');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">利用者管理</h1>
          <p className="text-gray-500 mt-2">利用者の情報を管理します</p>
        </div>
        <Button onClick={() => router.push('/residents/new')}>
          <Plus className="mr-2 h-4 w-4" />
          新規登録
        </Button>
      </div>

      {/* 事業所選択 */}
      {facilities.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="font-medium">事業所:</label>
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* エラー表示 */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* ローディング */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">読み込み中...</div>
          </CardContent>
        </Card>
      )}

      {/* 利用者一覧 */}
      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>利用者一覧（{residents.length}名）</CardTitle>
          </CardHeader>
          <CardContent>
            {residents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                利用者が登録されていません
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">氏名</th>
                      <th className="text-left py-3 px-4">フリガナ</th>
                      <th className="text-left py-3 px-4">年齢</th>
                      <th className="text-left py-3 px-4">性別</th>
                      <th className="text-left py-3 px-4">要介護度</th>
                      <th className="text-left py-3 px-4">入所日</th>
                      <th className="text-left py-3 px-4">状態</th>
                      <th className="text-left py-3 px-4">アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {residents.map((resident) => (
                      <tr key={resident.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">
                          {resident.lastName} {resident.firstName}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {resident.lastNameKana && resident.firstNameKana
                            ? `${resident.lastNameKana} ${resident.firstNameKana}`
                            : '-'}
                        </td>
                        <td className="py-3 px-4">{calculateAge(resident.dateOfBirth)}歳</td>
                        <td className="py-3 px-4 capitalize">{resident.gender}</td>
                        <td className="py-3 px-4">
                          {resident.careLevel !== null && resident.careLevel !== undefined ? (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {careLevelLabels[resident.careLevel]}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {resident.admissionDate
                            ? new Date(resident.admissionDate).toLocaleDateString('ja-JP')
                            : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-sm ${
                              resident.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {resident.status === 'active' ? '稼働中' : resident.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/residents/${resident.id}`)}
                          >
                            詳細
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
