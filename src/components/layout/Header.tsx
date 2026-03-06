import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input 
            type="search" 
            placeholder="Tìm kiếm bài học, câu hỏi..." 
            className="w-full pl-9 bg-slate-50 border-transparent focus:bg-white"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </Button>
        
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-slate-900">Nguyễn Văn A</span>
            <span className="text-xs text-slate-500">Học sinh Lớp 10</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
