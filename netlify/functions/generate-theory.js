import { GoogleGenAI } from '@google/genai';

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { grade, chapter, lessonTitle } = JSON.parse(event.body);

    if (!grade || !chapter || !lessonTitle) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing lesson info" }) };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Lỗi: Chưa cấu hình GEMINI_API_KEY trên hệ thống." })
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Bạn là một trợ lý giáo viên môn Hóa học xuất sắc cho chương trình GDPT 2018. \
Hãy tạo NỘI DUNG LÝ THUYẾT TRỌNG TÂM đầy đủ cho bài giảng sau:
- Khối lớp: ${grade}
- Chương: ${chapter}
- Bài học: ${lessonTitle}

Yêu cầu:
1. Viết theo cấu trúc rõ ràng: Khái niệm → Tính chất → Ứng dụng / Phương trình phản ứng (nếu có)
2. Sử dụng đúng danh pháp Hóa học GDPT 2018 (Acid, Base, Oxide, Salt, v.v.)
3. Bao gồm công thức hóa học, phương trình phản ứng quan trọng dưới dạng LaTeX ($$...$$)
4. Nếu có bảng so sánh hoặc dữ liệu, hãy trình bày dưới dạng bảng Markdown
5. Viết rõ ràng, súc tích, đủ kiến thức để học sinh hiểu bài
6. Trả về định dạng Markdown chuẩn`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [prompt],
    });

    const theoryContent = response.text;
    if (!theoryContent) throw new Error("AI không trả về nội dung.");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theoryContent }),
    };
  } catch (error) {
    console.error("Generate Theory Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Lỗi tạo nội dung: " + (error.message || "Unknown") }),
    };
  }
};
