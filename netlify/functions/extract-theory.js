import { GoogleGenAI } from '@google/genai';

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { base64Data, mimeType } = JSON.parse(event.body);

    if (!base64Data || !mimeType) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing file data" }) };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Lỗi: Chưa cấu hình GEMINI_API_KEY trên hệ thống." })
      };
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const promptText = "Bạn là một trợ lý giáo viên môn Hóa học xuất sắc. Hãy trích xuất và tóm tắt ngắn gọn NỘI DUNG LÝ THUYẾT TRỌNG TÂM từ tài liệu do người dùng cung cấp. Loại bỏ các chi tiết thừa, chỉ giữ lại định nghĩa, công thức hoặc kiến thức lõi để cấu thành bài giảng số. Tuân thủ danh pháp Hóa học Tiếng Anh chuẩn GDPT 2018 (Ví dụ: Acid, Base, Oxide, Hydro, Oxygen...). Trả về định dạng Markdown phù hợp.";

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        promptText,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ]
    });

    let extractedText = response.text;
    if (!extractedText) {
      throw new Error("Mô hình AI không trả về dữ liệu.");
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ extractedText })
    };
  } catch (error) {
    console.error("OCR Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "Lỗi phân tích tài liệu: " + (error.message || "Unknown error") })
    };
  }
};
