import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const staff = [
  {
    id: '1',
    name: '田中 健一',
    position: '施設長',
    employmentType: '正社員',
    qualifications: ['介護福祉士', '社会福祉士'],
    hireDate: '2020-04-01',
  },
  {
    id: '2',
    name: '高橋 美咲',
    position: '介護職員',
    employmentType: '正社員',
    qualifications: ['介護福祉士'],
    hireDate: '2021-06-15',
  },
  {
    id: '3',
    name: '伊藤 翔太',
    position: '介護職員',
    employmentType: 'パート',
    qualifications: ['ヘルパー2級'],
    hireDate: '2022-09-01',
  },
]

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">職員管理</h1>
          <p className="text-gray-500 mt-2">
            職員の情報を管理します
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新規登録
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>職員一覧（{staff.length}名）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">氏名</th>
                  <th className="text-left py-3 px-4">役職</th>
                  <th className="text-left py-3 px-4">雇用形態</th>
                  <th className="text-left py-3 px-4">資格</th>
                  <th className="text-left py-3 px-4">入社日</th>
                  <th className="text-left py-3 px-4">アクション</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{member.name}</td>
                    <td className="py-3 px-4">{member.position}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-sm ${
                          member.employmentType === '正社員'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {member.employmentType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {member.qualifications.map((qual, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                          >
                            {qual}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">{member.hireDate}</td>
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
