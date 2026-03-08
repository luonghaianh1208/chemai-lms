import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AITutorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", content: "Chào bạn! Mình là Trợ giảng Hoá học thông minh. Bạn cần hỗ trợ gì bài tập hoặc kiến thức ngày hôm nay?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceQueries, setPracticeQueries] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      if (e.detail?.message) {
        handleSendExternal(e.detail.message);
      }
    };
    
    const handlePracticeState = (e: any) => {
      setPracticeMode(e.detail.isPractice);
      if (e.detail.isPractice) {
        setPracticeQueries(0);
      }
    };

    window.addEventListener('open-ai-tutor', handleOpenChat as EventListener);
    window.addEventListener('practice-state', handlePracticeState as EventListener);
    
    return () => {
       window.removeEventListener('open-ai-tutor', handleOpenChat as EventListener);
       window.removeEventListener('practice-state', handlePracticeState as EventListener);
    };
  }, []);

  const getSystemPrefix = () => {
    return practiceMode 
      ? `[HỆ THỐNG YÊU CẦU LƯU Ý KHI TRẢ LỜI NGƯỜI DÙNG: HỌC SINH ĐANG LÀM BÀI KIỂM TRA. HÃY ĐÓNG VAI TRỢ GIẢNG NHƯNG CHỈ ĐƯỢC PHÉP GỢI Ý CÁCH LÀM (HOẶC GỢI Ý LÝ THUYẾT). BẠN TUYỆT ĐỐI KHÔNG ĐƯỢC CHO BIẾT TRỰC TIẾP HAY CHỈ RA CHÍNH XÁC ĐÁP ÁN CUỐI CÙNG TRONG SUỐT PHIÊN TRẢ LỜI NÀY.]\n\n` 
      : "";
  };

  const handleSendExternal = async (userMessage: string) => {
    if (practiceMode && practiceQueries >= 3) {
      toast.error("Bạn đã hết 3 lượt hỏi Trợ Giảng trong bài thi này!");
      return;
    }
    if (practiceMode) setPracticeQueries(prev => prev + 1);

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);
    
    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: getSystemPrefix() + userMessage })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: data.reply 
      }]);
    } catch (err) {
      toast.error("Không thể kết nối đến máy chủ AI.");
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "Xin lỗi, hiện tại mình không thể kết nối tới máy chủ AI." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const msg = input;
    setInput("");
    await handleSendExternal(msg);
  };

  const clearChat = () => {
    setMessages([{ role: "ai", content: "Chào bạn! Mình là Trợ giảng Hoá học. Mình đã dọn dẹp lịch sử, bạn cần hỗ trợ gì tiếp theo?" }]);
    toast.info("Đã làm mới cuộc hội thoại");
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-80 shadow-2xl z-50 rounded-2xl ring-1 ring-slate-900/10 bg-white flex flex-col"
          style={{ height: '520px', maxHeight: '90vh' }}
        >
          {/* Header — fixed height */}
          <div
            className="shrink-0 px-4 flex flex-row items-center justify-between bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-2xl"
            style={{ height: '60px' }}
          >
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="text-base font-semibold text-white">AI Trợ Giảng</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:bg-white/20 hover:text-white" onClick={clearChat} title="Làm mới">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages — explicit calc height, hard overflow scroll */}
          <div
            className="p-4 space-y-3 bg-white"
            style={{
              height: 'calc(520px - 60px - 68px)',
              maxHeight: 'calc(520px - 60px - 68px)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-2 items-start", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  msg.role === "user" ? "bg-slate-200" : "bg-indigo-100 text-indigo-600"
                )}>
                  {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm",
                    "min-w-0",
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-sm"
                      : "bg-slate-100 text-slate-800 rounded-tl-sm prose prose-sm prose-p:my-1 prose-p:leading-relaxed prose-ul:my-1 prose-li:my-0"
                  )}
                  style={{
                    maxWidth: 'calc(100% - 2.25rem)',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 flex-row items-center">
                <div className="h-7 w-7 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-slate-50 text-slate-500 rounded-2xl py-2 px-3 text-sm flex gap-1 items-center italic">
                  <Loader2 className="h-3 w-3 animate-spin mr-1" /> AI đang suy nghĩ...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input footer — fixed height */}
          <div
            className="shrink-0 px-3 py-3 border-t bg-white rounded-b-2xl"
            style={{ height: '68px' }}
          >
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex w-full items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi AI Trợ giảng..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
