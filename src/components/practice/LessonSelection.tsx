import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, ChevronRight, ChevronDown, Clock, AlertTriangle } from "lucide-react";

interface LessonSelectionProps {
  availableLessons: any[];
  expandedChapters: Record<string, boolean>;
  onToggleChapter: (chapter: string) => void;
  onSelectLesson: (lesson: any) => void;
}

export function LessonSelection({
  availableLessons,
  expandedChapters,
  onToggleChapter,
  onSelectLesson,
}: LessonSelectionProps) {
  const grouped = availableLessons.reduce((acc, curr) => {
    const key = curr.chapter?.trim() || "Chưa phân loại";
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Góc Luyện Tập Tùy Chọn</h1>
        <p className="text-slate-500">Hãy chọn một chủ đề bên dưới để AI thiết kế bài tập dành riêng cho bạn.</p>
      </div>

      {availableLessons.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">
          Khóa học hiện tại chưa có bài giảng nào. Vui lòng liên hệ Giáo viên.
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([chapter, lessonsInChapter]) => (
            <div key={chapter} className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => onToggleChapter(chapter)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h2 className="text-xl font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-500" />
                  {chapter}{" "}
                  <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-2">
                    {lessonsInChapter.length} bài
                  </span>
                </h2>
                {expandedChapters[chapter] ? (
                  <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                )}
              </button>

              {expandedChapters[chapter] && (
                <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-slate-100 mt-2">
                  {lessonsInChapter.map((lesson: any) => (
                    <Card
                      key={lesson.id}
                      className="hover:border-indigo-300 transition-colors cursor-pointer"
                      onClick={() => onSelectLesson(lesson)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                            {lesson.chapter}
                          </Badge>
                          <Sparkles className="h-4 w-4 text-amber-500" />
                        </div>
                        <CardTitle className="text-lg mt-2">{lesson.title}</CardTitle>
                        {lesson.dueDate && (
                          <div
                            className={`flex items-center gap-1.5 mt-2 text-xs font-semibold ${
                              new Date(lesson.dueDate) < new Date() ? "text-red-600" : "text-orange-600"
                            }`}
                          >
                            {new Date(lesson.dueDate) < new Date() ? (
                              <AlertTriangle className="h-3.5 w-3.5" />
                            ) : (
                              <Clock className="h-3.5 w-3.5" />
                            )}
                            {new Date(lesson.dueDate) < new Date() ? "Đã quá hạn: " : "Hạn hoàn thành: "}
                            {new Date(lesson.dueDate).toLocaleString("vi-VN")}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {lesson.practiceConfig?.mcq || 0} Trắc nghiệm,{" "}
                          {lesson.practiceConfig?.tf || 0} Đúng/Sai,{" "}
                          {lesson.practiceConfig?.short || 0} Trả lời ngắn.
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 border-t mt-4 flex justify-between items-center py-3 bg-slate-50 rounded-b-xl">
                        <span className="text-sm font-medium text-slate-600">Bắt đầu Thực hành</span>
                        <ChevronRight className="h-4 w-4 text-indigo-600" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
