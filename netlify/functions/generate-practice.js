import { GoogleGenAI } from '@google/genai';

export const handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { theory, studentScore, config } = JSON.parse(event.body);

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Lỗi: Chưa cấu hình GEMINI_API_KEY trên hệ thống." })
      };
    }
    
    // Evaluate student level based on local storage score (0-100)
    let difficulty = "Trung bình";
    if (studentScore >= 80) difficulty = "Khó (Vận dụng cao)";
    else if (studentScore < 50) difficulty = "Đơn giản (Nhận biết/Thông hiểu cơ bản)";

    const prompt = `
Bạn là một trợ lý giáo viên môn Hóa học xuất sắc, luôn bám sát **Chương trình Giáo dục phổ thông 2018 môn Hóa học của Bộ GD&ĐT Việt Nam**.
Dựa trên Nội dung Lý thuyết sau:
"""
${theory}
"""

Hãy tạo một bộ bài tập luyện tập cho học sinh có học lực ở mức độ: **${difficulty}**.
Cấu trúc bài tập yêu cầu theo đúng số lượng sau:
- Câu trắc nghiệm (MCQ): ${config.mcq || 0} câu
- Câu Đúng/Sai (True/False): ${config.tf || 0} câu
- Câu điền từ kéo thả (Cloze Test): ${config.short || 0} câu

**CẢNH BÁO QUAN TRỌNG VỀ DANH PHÁP (CHUẨN 2018):**
Tuyệt đối sử dụng **Danh pháp quốc tế (IUPAC)** có phiên âm tiếng Anh theo chuẩn GDPT 2018 thay vì danh pháp tiếng Việt cũ.
- Ví dụ BẮT BUỘC: phải dùng "Acid" (thay vì axit), "Base" (thay vì bazơ), "Oxide" (thay vì oxit), "Hydro" (thay vì Hidro/Hiđro), "Oxygen" (thay vì oxi)...
- Tên nguyên tố: "Copper" (thay vì Đồng), "Iron" (thay vì Sắt), "Sodium" (thay vì Natri), "Potassium" (thay vì Kali), "Calcium" (thay vì Canxi)...
Nếu nội dung Lý thuyết đưa vào có chứa từ cũ, bạn PHẢI TỰ ĐỘNG chuyển đổi sang danh pháp chuẩn 2018 trong mọi Câu hỏi và Lời giải thích.

YÊU CẦU ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:
Trả về JSON tuân thủ chặt chẽ Response Schema. Đối với \`correctAnswer\` của dạng điền khuyết (cloze) hãy trả về chuỗi văn bản của đáp án, còn đối với mcq và tf hãy trả về index của mảng (ví dụ "0" hoặc "1" dưới dạng chuỗi).
`;

    const responseSchema = {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
               type: { type: "string", description: "Lưu ý loại câu hỏi: mcq, tf, hoặc cloze" },
               text: { type: "string", description: "Đề bài trắc nghiệm hoặc đoạn văn chứa thẻ ___ để điền từ" },
               options: { type: "array", items: { type: "string" }, description: "Mảng các chuỗi lưu danh sách đáp án" },
               correctAnswer: { type: "string", description: "Chuỗi chứa số index (0,1,2,...) đối với mcq và tf, hoặc chứa chuỗi đáp án đúng với cloze" },
               explanation: { type: "string", description: "Giải thích rõ ràng vì sao lại chọn đáp án này" }
            },
            required: ["type", "text", "options", "correctAnswer", "explanation"]
          }
        }
      },
      required: ["questions"]
    };

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        }
    });

    const finalJsonString = response.text;
    if (!finalJsonString) {
      throw new Error("Gemini returned empty response text");
    }

    // responseSchema guarantees clean JSON — parse directly on the server
    const parsed = JSON.parse(finalJsonString);
    const questions = (parsed.questions || []).map(q => {
      // Normalize correctAnswer: mcq/tf return "0","1"... as string index → convert to number
      if (q.type === 'mcq' || q.type === 'tf') {
        return { ...q, correctAnswer: parseInt(q.correctAnswer, 10) };
      }
      return q; // cloze keeps correctAnswer as string
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions })
    };
  } catch (error) {
    console.error('Lỗi khi gọi Gemini API:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message || "Sự cố kết nối AI khi tạo bài tập." })
    };
  }
};
