import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, Play } from "lucide-react";

interface PrePracticeScreenProps {
  lesson: any;
  onStart: () => void;
  onBack: () => void;
}

export function PrePracticeScreen({ lesson, onStart, onBack }: PrePracticeScreenProps) {
  const totalQuestions =
    (lesson.practiceConfig?.mcq || 0) +
    (lesson.practiceConfig?.tf || 0) +
    (lesson.practiceConfig?.short || 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b pb-4">
        <Button
          variant="link"
          onClick={onBack}
          className="h-auto p-0 text-slate-500 hover:text-indigo-600"
        >
          &larr; Quay lại
        </Button>
        <h1 className="text-xl font-bold text-slate-900">{lesson.title}</h1>
      </div>

      <Card className="border-2 border-indigo-100 shadow-md">
        <CardHeader className="bg-indigo-50/50">
          <CardTitle className="flex justify-center text-2xl text-indigo-900 py-4">
            Chuẩn bị Kiểm tra
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 py-6 text-center">
          <div className="flex justify-center gap-8 text-slate-600">
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold tracking-wider opacity-70">Thời gian</p>
              <p className="text-2xl font-bold flex items-center justify-center gap-2">
                <Clock className="h-6 w-6 text-indigo-500" />
                {lesson.practiceConfig?.timeLimit || 15} Phút
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold tracking-wider opacity-70">Số câu hỏi</p>
              <p className="text-2xl font-bold text-slate-900">{totalQuestions} Câu</p>
            </div>
          </div>

          <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm text-left mx-auto max-w-lg space-y-2 border border-red-100">
            <p className="font-bold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Nội quy phòng thi:
            </p>
            <ul className="list-disc pl-6 space-y-1 opacity-90">
              <li>Ngay khi bấm bắt đầu, đồng hồ sẽ đếm ngược liên tục.</li>
              <li>
                Hệ thống <b>không cho phép chuyển Tab</b> trình duyệt hoặc thoát khỏi màn hình.
              </li>
              <li>
                Chỉ được sử dụng Trợ giảng AI tối đa <b>3 lượt</b> và AI chỉ đưa ra gợi ý, không
                nhắc đáp án.
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="justify-center py-6 bg-slate-50">
          <Button
            size="lg"
            className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 w-full max-w-sm shadow-xl"
            onClick={onStart}
          >
            <Play className="h-5 w-5 mr-3" /> BẮT ĐẦU LÀM BÀI
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
