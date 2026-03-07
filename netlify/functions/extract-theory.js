const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { base64Data, mimeType } = JSON.parse(event.body);

    if (!base64Data || !mimeType) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing file data" }) };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: "Bạn là một trợ lý giáo viên. Hãy trích xuất và tóm tắt ngắn gọn NỘI DUNG LÝ THUYẾT TRỌNG TÂM môn Hóa học từ tài liệu do người dùng cung cấp. Loại bỏ các chi tiết thừa, chỉ giữ lại định nghĩa, công thức hoặc kiến thức lõi để dễ dàng đưa vào bài giảng số. Tuân thủ danh pháp Hóa học Tiếng Anh chuẩn GDPT 2018 (Ví dụ: Acid, Base, Oxide, Hydro, Oxygen...)." },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ]
        }
      ]
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ extractedText: response.text })
    };
  } catch (error) {
    console.error("OCR Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Lỗi phân tích tài liệu: " + error.message })
    };
  }
};
