import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, BarChart3, AlertTriangle } from "lucide-react";

interface TeacherStatsProps {
  students: any[];
  lessons: any[];
}

export function TeacherStats({ students, lessons }: TeacherStatsProps) {
  const avgScore = students.length
    ? Math.round(students.reduce((acc, s) => acc + s.score, 0) / students.length)
    : 0;

  const overdueCount = lessons.filter(
    (l) => l.dueDate && new Date(l.dueDate) < new Date() && l.status !== "completed"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:border-indigo-200 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Học sinh đang theo học</CardTitle>
          <Users className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{students.length}</div>
          <p className="text-xs text-slate-500">Tổng số học sinh</p>
        </CardContent>
      </Card>

      <Card className="hover:border-emerald-200 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bài giảng &amp; Khóa học</CardTitle>
          <BookOpen className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lessons.length}</div>
          <p className="text-xs text-slate-500">Bài giảng đã xuất bản</p>
        </CardContent>
      </Card>

      <Card className="hover:border-orange-200 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Điểm số trung bình</CardTitle>
          <BarChart3 className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgScore}</div>
          <p className="text-xs text-slate-500">Trung bình lớp</p>
        </CardContent>
      </Card>

      <Card className="hover:border-red-200 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Báo động Quá hạn</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
          <p className="text-xs text-slate-500">Bài tập chưa nộp</p>
        </CardContent>
      </Card>
    </div>
  );
}
