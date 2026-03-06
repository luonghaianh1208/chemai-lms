import { useState } from "react";
import { PlayCircle, FileText, CheckCircle2, ChevronRight, HelpCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function Lesson() {
  const [activeTab, setActiveTab] = useState("theory");

  return (
    <div className="flex h-full gap-6">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <span>Chương 4</span>
              <ChevronRight className="h-4 w-4" />
              <span>Bài 12</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Phản ứng oxi hóa - khử</h1>
          </div>
          <Badge variant="secondary" className="text-indigo-600 bg-indigo-50">Đang học</Badge>
        </div>

        {/* Video Player Placeholder */}
        <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <PlayCircle className="h-16 w-16 text-white/80 hover:text-white cursor-pointer transition-colors z-10" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <span className="text-sm font-medium">1. Khái niệm phản ứng oxi hóa - khử</span>
            <span className="text-sm">05:24 / 12:30</span>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex gap-4 border-b border-slate-200">
          <button 
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'theory' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
            onClick={() => setActiveTab('theory')}
          >
            Lý thuyết trọng tâm
          </button>
          <button 
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'examples' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
            onClick={() => setActiveTab('examples')}
          >
            Ví dụ minh họa
          </button>
          <button 
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'practice' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
            onClick={() => setActiveTab('practice')}
          >
            Bài tập vận dụng
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6">
          {activeTab === 'theory' && (
            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold mb-4">I. Khái niệm</h3>
              <ul className="space-y-2 text-slate-700">
                <li><strong>Chất khử:</strong> là chất nhường electron (số oxi hóa tăng).</li>
                <li><strong>Chất oxi hóa:</strong> là chất nhận electron (số oxi hóa giảm).</li>
                <li><strong>Sự oxi hóa:</strong> là quá trình nhường electron.</li>
                <li><strong>Sự khử:</strong> là quá trình nhận electron.</li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">
                  💡 Mẹo ghi nhớ: "Khử cho - O nhận" (Chất khử cho electron, chất oxi hóa nhận electron).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Lesson Navigation */}
      <div className="w-80 flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Nội dung bài học</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={30} className="flex-1" />
              <span className="text-xs font-medium text-slate-500">30%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-md bg-slate-50 text-sm font-medium text-slate-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              1. Khái niệm cơ bản
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md bg-indigo-50 text-sm font-medium text-indigo-700">
              <PlayCircle className="h-4 w-4" />
              2. Lập phương trình hóa học
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md text-sm text-slate-500 hover:bg-slate-50 cursor-pointer">
              <FileText className="h-4 w-4" />
              3. Ý nghĩa thực tiễn
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md text-sm text-slate-500 hover:bg-slate-50 cursor-pointer">
              <HelpCircle className="h-4 w-4" />
              4. Bài tập tự luyện
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Tutor Gợi ý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-indigo-50 leading-relaxed mb-4">
              Phần cân bằng phương trình oxi hóa - khử thường gây khó khăn. Bạn có muốn xem một ví dụ từng bước do AI hướng dẫn không?
            </p>
            <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
              Xem hướng dẫn chi tiết
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
