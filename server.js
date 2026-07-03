const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();

// Cho phép tất cả các nguồn (bao gồm Salesforce) gọi tới API này mà không bị lỗi CORS
app.use(cors()); 
app.use(express.json());

// ⚠️ THAY THẾ CHUỖI KẾT NỐI MONGODB ATLAS CỦA BẠN VÀO ĐÂY
const uri = "mongodb+srv://fukoonline_db_user:4yNpr314RJfTHB1S@cluster0.lqdct2b.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// Route API chính để Salesforce gọi lấy dữ liệu
app.get('/api/data', async (req, res) => {
    try {
        // Kết nối tới MongoDB Atlas
        await client.connect();
        
        // ⚠️ THAY TÊN DATABASE VÀ COLLECTION CỦA BẠN VÀO ĐÂY
        const database = client.db('Dictionary');
        const collection = database.collection('Dictionary');
        
        // Lấy toàn bộ dữ liệu từ Collection dưới dạng mảng (Array)
        const result = await collection.find({}).toArray();
        
        // Trả về dữ liệu JSON cho bên gọi (Salesforce)
        res.status(200).json(result);
        
    } catch (error) {
        console.error("Lỗi hệ thống:", error);
        res.status(500).json({ error: "Lỗi kết nối database: " + error.message });
    } finally {
        // Đóng kết nối sau khi xử lý xong để tối ưu tài nguyên
        await client.close();
    }
});

// Cấu hình cổng: Ưu tiên cổng của Render cấp, nếu chạy local thì dùng cổng 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server API đang chạy mượt mà tại cổng: ${PORT}`);
});