import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Clock, AlertCircle } from 'lucide-react'

const tasks = {
  todo: [
    {
      id: '1',
      title: '介護記録の提出',
      priority: 'urgent',
      assignee: '田中 健一',
      dueDate: '2024-01-20',
    },
    {
      id: '2',
      title: 'ケアプラン更新',
      priority: 'high',
      assignee: '高橋 美咲',
      dueDate: '2024-01-22',
    },
    {
      id: '3',
      title: '備品発注',
      priority: 'medium',
      assignee: '伊藤 翔太',
      dueDate: '2024-01-25',
    },
  ],
  in_progress: [
    {
      id: '4',
      title: '医療機関への連絡',
      priority: 'high',
      assignee: '田中 健一',
      dueDate: '2024-01-20',
    },
    {
      id: '5',
      title: '家族面談の準備',
      priority: 'medium',
      assignee: '高橋 美咲',
      dueDate: '2024-01-21',
    },
  ],
  done: [
    {
      id: '6',
      title: '月次報告書作成',
      priority: 'high',
      assignee: '田中 健一',
      completedAt: '2024-01-19',
    },
  ],
}

const priorityColors = {
  urgent: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-green-100 text-green-800 border-green-300',
}

const priorityLabels = {
  urgent: '緊急',
  high: '高',
  medium: '中',
  low: '低',
}

function TaskCard({ task, status }: { task: any; status: string }) {
  return (
    <div
      className={`border-2 rounded-lg p-4 bg-white ${
        priorityColors[task.priority as keyof typeof priorityColors]
      } ${status === 'done' ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold">{task.title}</h3>
        <span className="text-xs px-2 py-1 rounded bg-white/50">
          {priorityLabels[task.priority as keyof typeof priorityLabels]}
        </span>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {task.dueDate || task.completedAt}
        </div>
        <div>担当: {task.assignee}</div>
      </div>
    </div>
  )
}

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">タスク管理</h1>
          <p className="text-gray-500 mt-2">
            カンバン形式でタスクを管理
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新規タスク
        </Button>
      </div>

      {/* カンバンボード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO */}
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center text-lg">
              <AlertCircle className="mr-2 h-5 w-5 text-blue-500" />
              TODO ({tasks.todo.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {tasks.todo.map((task) => (
                <TaskCard key={task.id} task={task} status="todo" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 進行中 */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center text-lg">
              <Clock className="mr-2 h-5 w-5 text-orange-500" />
              進行中 ({tasks.in_progress.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {tasks.in_progress.map((task) => (
                <TaskCard key={task.id} task={task} status="in_progress" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 完了 */}
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center text-lg">
              <CheckSquare className="mr-2 h-5 w-5 text-green-500" />
              完了 ({tasks.done.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {tasks.done.map((task) => (
                <TaskCard key={task.id} task={task} status="done" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CheckSquare({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
