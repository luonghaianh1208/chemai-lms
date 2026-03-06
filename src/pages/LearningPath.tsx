import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Lock, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const chapters = [
  {
    id: 1,
    title: "Chương 1: Cấu tạo nguyên tử",
    status: "completed",
    progress: 100,
    lessons: [
      { title: "Thành phần của nguyên tử", status: "completed" },
      { title: "Nguyên tố hóa học", status: "completed" },
      { title: "Cấu trúc lớp vỏ electron", status: "completed" },
    ]
  },
  {
    id: 2,
    title: "Chương 2: Bảng tuần hoàn",
    status: "completed",
    progress: 100,
    lessons: [
      { title: "Cấu tạo bảng tuần hoàn", status: "completed" },
      { title: "Xu hướng biến đổi tính chất", status: "completed" },
    ]
  },
  {
    id: 3,
    title: "Chương 3: Liên kết hóa học",
    status: "completed",
    progress: 100,
    lessons: [
      { title: "Quy tắc octet", status: "completed" },
      { title: "Liên kết ion", status: "completed" },
      { title: "Liên kết cộng hóa trị", status: "completed" },
    ]
  },
  {
    id: 4,
    title: "Chương 4: Phản ứng oxi hóa - khử",
    status: "in-progress",
    progress: 30,
    isRecommended: true,
    lessons: [
      { title: "Số oxi hóa", status: "completed" },
      { title: "Phản ứng oxi hóa - khử", status: "in-progress" },
      { title: "Lập phương trình hóa học", status: "locked" },
    ]
  },
  {
    id: 5,
    title: "Chương 5: Năng lượng hóa học",
    status: "locked",
    progress: 0,
    lessons: [
      { title: "Enthalpy tạo thành", status: "locked" },
      { title: "Biến thiên enthalpy", status: "locked" },
    ]
  }
];

export function LearningPath() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lộ trình học tập cá nhân</h1>
          <p className="text-slate-500">Được thiết kế riêng cho bạn bởi AI dựa trên năng lực hiện tại.</p>
        </div>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Cập nhật lộ trình
        </Button>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-8">
        {chapters.map((chapter, index) => (
          <div key={chapter.id} className="relative pl-8">
            {/* Timeline dot */}
            <div className={cn(
              "absolute -left-[11px] top-1 h-5 w-5 rounded-full border-2 bg-white flex items-center justify-center",
              chapter.status === "completed" ? "border-emerald-500" : 
              chapter.status === "in-progress" ? "border-indigo-600" : "border-slate-300"
            )}>
              {chapter.status === "completed" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              {chapter.status === "in-progress" && <div className="h-2 w-2 rounded-full bg-indigo-600" />}
            </div>

            <Card className={cn(
              "transition-all",
              chapter.isRecommended ? "ring-2 ring-indigo-600 shadow-md" : "",
              chapter.status === "locked" ? "opacity-75 bg-slate-50" : ""
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{chapter.title}</CardTitle>
                    {chapter.isRecommended && (
                      <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none gap-1">
                        <Sparkles className="h-3 w-3" /> AI Đề xuất
                      </Badge>
                    )}
                  </div>
                  {chapter.status === "completed" && <Badge variant="success">Hoàn thành</Badge>}
                  {chapter.status === "in-progress" && <Badge>Đang học</Badge>}
                  {chapter.status === "locked" && <Lock className="h-4 w-4 text-slate-400" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chapter.lessons.map((lesson, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        {lesson.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : lesson.status === "in-progress" ? (
                          <Circle className="h-4 w-4 text-indigo-600 fill-indigo-100" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-300" />
                        )}
                        <span className={cn(
                          lesson.status === "locked" ? "text-slate-500" : "text-slate-900",
                          lesson.status === "in-progress" ? "font-medium" : ""
                        )}>
                          Bài {idx + 1}: {lesson.title}
                        </span>
                      </div>
                      {lesson.status === "in-progress" && (
                        <Button size="sm" variant="ghost" className="h-8 gap-1 text-indigo-600">
                          Học tiếp <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
