'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { residentsApi, Resident } from '@/lib/api/residents';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

export default function ResidentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResident();
  }, [params.id]);

  const loadResident = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await residentsApi.get(params.id);
      setResident(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load resident');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('この利用者を削除してもよろしいですか？')) return;

    try {
      await residentsApi.delete(params.id);
      router.push('/residents');
    } catch (err: any) {
      alert(err.message || 'Failed to delete resident');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error || !resident) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.push('/residents')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          一覧に戻る
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-500">{error || '利用者が見つかりません'}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const age = new Date().getFullYear() - new Date(resident.dateOfBirth).getFullYear();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/residents')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Button>
          <h1 className="text-3xl font-bold">
            {resident.lastName} {resident.firstName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/residents/${resident.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            編集
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            削除
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">氏名</dt>
                <dd className="mt-1 text-sm">
                  {resident.lastName} {resident.firstName}
                  {resident.lastNameKana && resident.firstNameKana && (
                    <span className="ml-2 text-gray-400">
                      ({resident.lastNameKana} {resident.firstNameKana})
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">性別</dt>
                <dd className="mt-1 text-sm capitalize">{resident.gender}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">生年月日</dt>
                <dd className="mt-1 text-sm">
                  {new Date(resident.dateOfBirth).toLocaleDateString('ja-JP')} ({age}歳)
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">要介護度</dt>
                <dd className="mt-1 text-sm">
                  {resident.careLevel !== null && resident.careLevel !== undefined
                    ? `要介護${resident.careLevel}`
                    : '未設定'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* 事業所情報 */}
        <Card>
          <CardHeader>
            <CardTitle>事業所情報</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">事業所名</dt>
                <dd className="mt-1 text-sm">{resident.facility?.name || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">事業所コード</dt>
                <dd className="mt-1 text-sm">{resident.facility?.code || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">入所日</dt>
                <dd className="mt-1 text-sm">
                  {resident.admissionDate
                    ? new Date(resident.admissionDate).toLocaleDateString('ja-JP')
                    : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">ステータス</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-block px-2 py-1 text-sm rounded ${
                      resident.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {resident.status === 'active' ? '稼働中' : resident.status}
                  </span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* 医療情報 */}
        <Card>
          <CardHeader>
            <CardTitle>医療情報</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">医療ニーズ</dt>
                <dd className="mt-1 text-sm">
                  {resident.hasMedicalNeeds ? (
                    <span className="text-orange-600">あり</span>
                  ) : (
                    'なし'
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">アレルギー</dt>
                <dd className="mt-1 text-sm">
                  {resident.hasAllergies ? (
                    <span className="text-orange-600">あり</span>
                  ) : (
                    'なし'
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* 緊急連絡先 */}
        <Card>
          <CardHeader>
            <CardTitle>緊急連絡先</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">連絡先名</dt>
                <dd className="mt-1 text-sm">{resident.emergencyContact || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                <dd className="mt-1 text-sm">{resident.emergencyPhone || '-'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
