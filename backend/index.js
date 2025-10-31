// backend/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----- API LẤY DANH SÁCH LOẠI SẢN PHẨM -----
app.get('/api/categories', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM categories ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Lỗi khi lấy loại sản phẩm:", err);
        res.status(500).send("Lỗi Server");
    }
});

// ----- API LẤY DANH SÁCH THƯƠNG HIỆU -----
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

/* * API LẤY DANH SÁCH SẢN PHẨM, TÌM KIẾM, VÀ LỌC
 * - Sử dụng JOIN để lấy tên category và brand.
 * - Có khả năng lọc theo Tên (q=...) và Loại (category=...)
 */
app.get('/api/products', async (req, res) => {
    try {
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

        if (q) {
            params.push(`%${q}%`);
            whereClauses.push(`p.name ILIKE $${params.length}`);
        }
        if (category) {
            params.push(category);
            whereClauses.push(`c.name ILIKE $${params.length}`);
        }
        
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

/* * API LẤY CHI TIẾT SẢN PHẨM (NÂNG CẤP LỚN)
 * - Lấy thông tin chính, thông số kỹ thuật (specifications), và danh sách hình ảnh con.
 */
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const productResult = await db.query(`
            SELECT p.*, b.name AS brand_name, c.name AS category_name 
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = $1
        `, [id]);

        if (productResult.rows.length === 0) {
            return res.status(404).send("Không tìm thấy sản phẩm");
        }

        const imagesResult = await db.query("SELECT * FROM product_images WHERE product_id = $1", [id]);

        const productData = productResult.rows[0];
        productData.images = imagesResult.rows;

        res.json(productData);

    } catch (err) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
        res.status(500).send("Lỗi Server");
    }
});

/* * API TẠO SẢN PHẨM MỚI (NÂNG CẤP)
 * - Nhận category_id, brand_id, specifications, và nhiều hình ảnh.
 */
app.post('/api/products', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Bắt đầu transaction

        const { name, description, price, stock_quantity, image_url, video_url, category_id, brand_id, specifications, images } = req.body;
        
        const newProductResult = await client.query(
            "INSERT INTO products (name, description, price, stock_quantity, image_url, video_url, category_id, brand_id, specifications) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [name, description, price, stock_quantity, image_url, video_url, category_id, brand_id, specifications]
        );
        const newProduct = newProductResult.rows[0];

        if (images && images.length > 0) {
            for (const imageUrl of images) {
                await client.query("INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)", [newProduct.id, imageUrl]);
            }
        }

        await client.query('COMMIT'); // Hoàn tất transaction
        res.status(201).json(newProduct);

    } catch (err) {
        await client.query('ROLLBACK'); // Hủy bỏ transaction nếu có lỗi
        console.error("Lỗi khi tạo sản phẩm:", err);
        res.status(500).send("Lỗi Server");
    } finally {
        client.release(); // Trả kết nối về pool
    }
});


/* * API CẬP NHẬT SẢN PHẨM (NÂNG CẤP)
 * - Cập nhật thông tin chính, specifications, và danh sách hình ảnh.
 */
app.put('/api/products/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const { name, description, price, stock_quantity, image_url, video_url, category_id, brand_id, specifications, images } = req.body;
        const numericPrice = parseFloat(String(price).replace(/,/g, ''));
        if (isNaN(numericPrice)) {
            throw new Error("Định dạng giá tiền không hợp lệ.");
        }
        const updatedProductResult = await client.query(
            "UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, image_url = $5, video_url = $6, category_id = $7, brand_id = $8, specifications = $9 WHERE id = $10 RETURNING *",
            [name, description, price, stock_quantity, image_url, video_url, category_id, brand_id, specifications, id]
        );

        if (updatedProductResult.rows.length === 0) {
            throw new Error("Không tìm thấy sản phẩm để cập nhật");
        }
        // Xóa các ảnh cũ và thêm lại các ảnh mới
        await client.query("DELETE FROM product_images WHERE product_id = $1", [id]);
        if (images && images.length > 0) {
            for (const imageUrl of images) {
                await client.query("INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)", [id, imageUrl]);
            }
        }

        await client.query('COMMIT');
        res.json(updatedProductResult.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Lỗi khi cập nhật sản phẩm:", err);
        if (err.message === "Không tìm thấy sản phẩm để cập nhật") {
            return res.status(404).send(err.message);
        }
        res.status(500).send("Lỗi Server");
    } finally {
        client.release();
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
// Thêm biến pool để sử dụng trong transaction
const { Pool } = require('pg');

console.log("Đang kết nối database với Port:", process.env.DB_PORT); 
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // Cấu hình SSL, có thể bạn sẽ cần khi deploy
    // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

