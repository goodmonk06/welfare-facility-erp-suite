import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'

// ダミーデータ
const residents = [
  {
    id: '1',
    name: '山田 太郎',
    kana: 'ヤマダ タロウ',
    age: 82,
    careLevel: 3,
    status: 'active',
    admissionDate: '2023-04-01',
  },
  {
    id: '2',
    name: '佐藤 花子',
    kana: 'サトウ ハナコ',
    age: 75,
    careLevel: 2,
    status: 'active',
    admissionDate: '2023-06-15',
  },
  {
    id: '3',
    name: '鈴木 一郎',
    kana: 'スズキ イチロウ',
    age: 88,
    careLevel: 4,
    status: 'active',
    admissionDate: '2022-11-20',
  },
]

const careLevelLabels: Record<number, string> = {
  0: '要支援',
  1: '要介護1',
  2: '要介護2',
  3: '要介護3',
  4: '要介護4',
  5: '要介護5',
}

export default function ResidentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">利用者管理</h1>
          <p className="text-gray-500 mt-2">
            利用者の情報を管理します
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新規登録
        </Button>
      </div>

      {/* フィルタ・検索 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="名前・カナで検索..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <select className="border rounded-lg px-4 py-2">
              <option value="">全ての要介護度</option>
              <option value="0">要支援</option>
              <option value="1">要介護1</option>
              <option value="2">要介護2</option>
              <option value="3">要介護3</option>
              <option value="4">要介護4</option>
              <option value="5">要介護5</option>
            </select>
            <select className="border rounded-lg px-4 py-2">
              <option value="active">稼働中</option>
              <option value="discharged">退所</option>
              <option value="all">全て</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 利用者一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>利用者一覧（{residents.length}名）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">氏名</th>
                  <th className="text-left py-3 px-4">フリガナ</th>
                  <th className="text-left py-3 px-4">年齢</th>
                  <th className="text-left py-3 px-4">要介護度</th>
                  <th className="text-left py-3 px-4">入所日</th>
                  <th className="text-left py-3 px-4">状態</th>
                  <th className="text-left py-3 px-4">アクション</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((resident) => (
                  <tr key={resident.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{resident.name}</td>
                    <td className="py-3 px-4 text-gray-600">{resident.kana}</td>
                    <td className="py-3 px-4">{resident.age}歳</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {careLevelLabels[resident.careLevel]}
                      </span>
                    </td>
                    <td className="py-3 px-4">{resident.admissionDate}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        稼働中
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm">
                        詳細
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
