// backend/index.js

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors()); 
app.use(express.json());

// ----- API MỚI: LẤY DANH SÁCH LOẠI SẢN PHẨM -----
app.get('/api/categories', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM categories ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Lỗi khi lấy loại sản phẩm:", err);
        res.status(500).send("Lỗi Server");
    }
});

// ----- API MỚI: LẤY DANH SÁCH THƯƠNG HIỆU -----
app.get('/api/brands', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM brands ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Lỗi khi lấy thương hiệu:", err);
        res.status(500).send("Lỗi Server");
    }
});


// ----- API SẢN PHẨM ĐÃ NÂNG CẤP -----

/* ==================================================================
 * API LẤY DANH SÁCH SẢN PHẨM & TÌM KIẾM (SIÊU NÂNG CẤP)
 * - Có khả năng lọc theo Tên (q=...) và Loại (category=...)
 * ==================================================================
 */
app.get('/api/products', async (req, res) => {
    try {
        // Lấy cả tham số tìm kiếm 'q' và lọc 'category' từ URL
        const { q, category } = req.query;
        
        let sqlQuery = `
            SELECT 
                p.id, p.name, p.description, p.price, p.stock_quantity, p.image_url, p.video_url,
                b.name AS brand_name, 
                c.name AS category_name,
                p.category_id,
                p.brand_id
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN categories c ON p.category_id = c.id
        `;
        
        const params = [];
        let whereClauses = [];

        // Nếu có từ khóa tìm kiếm (q)
        if (q) {
            params.push(`%${q}%`);
            whereClauses.push(`p.name ILIKE $${params.length}`);
        }

        // Nếu có lọc theo loại sản phẩm (category)
        if (category) {
            params.push(category);
            whereClauses.push(`c.name ILIKE $${params.length}`);
        }
        
        // Nối các điều kiện WHERE lại với nhau bằng 'AND'
        if (whereClauses.length > 0) {
            sqlQuery += " WHERE " + whereClauses.join(" AND ");
        }
        
        sqlQuery += " ORDER BY p.id DESC";

        const result = await db.query(sqlQuery, params);
        res.json(result.rows);

    } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
        res.status(500).send("Lỗi Server");
    }
});

/* * API LẤY CHI TIẾT SẢN PHẨM (NÂNG CẤP)
 * - Đã sử dụng JOIN để lấy tên category và brand.
 */
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT 
                p.*, 
                b.name AS brand_name, 
                c.name AS category_name 
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).send("Không tìm thấy sản phẩm");
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
        res.status(500).send("Lỗi Server");
    }
});

/* * API TẠO SẢN PHẨM MỚI (NÂNG CẤP)
 * - Bây giờ sẽ nhận category_id và brand_id thay vì chữ.
 */
app.post('/api/products', async (req, res) => {
    try {
        const { name, description, price, stock_quantity, image_url, video_url, category_id, brand_id } = req.body;
        
        const newProduct = await db.query(
            "INSERT INTO products (name, description, price, stock_quantity, image_url, video_url, category_id, brand_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [name, description, price, stock_quantity, image_url, video_url, category_id, brand_id]
        );
        
        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        console.error("Lỗi khi tạo sản phẩm:", err);
        res.status(500).send("Lỗi Server");
    }
});

/* * API CẬP NHẬT SẢN PHẨM (NÂNG CẤP)
 * - Tương tự, cập nhật theo category_id và brand_id.
 */
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock_quantity, image_url, video_url, category_id, brand_id } = req.body;
        
        const updatedProduct = await db.query(
            "UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, image_url = $5, video_url = $6, category_id = $7, brand_id = $8 WHERE id = $9 RETURNING *",
            [name, description, price, stock_quantity, image_url, video_url, category_id, brand_id, id]
        );

        if (updatedProduct.rows.length === 0) {
            return res.status(404).send("Không tìm thấy sản phẩm để cập nhật");
        }
        
        res.json(updatedProduct.rows[0]);
    } catch (err) {
        console.error("Lỗi khi cập nhật sản phẩm:", err);
        res.status(500).send("Lỗi Server");
    }
});

/* API XÓA SẢN PHẨM (Không thay đổi) */
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteOp = await db.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

        if (deleteOp.rows.length === 0) {
            return res.status(404).send("Không tìm thấy sản phẩm để xóa");
        }
        
        res.json({ message: "Sản phẩm đã được xóa thành công" });
    } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
        res.status(500).send("Lỗi Server");
    }
});


// Khởi động server
app.listen(PORT, () => {
    console.log(`Backend server đang chạy trên http://localhost:${PORT}`);
});