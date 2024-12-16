const express = require('express');
const sass = require('sass');
const cors = require('cors');
const app = express();

// 启用 CORS
app.use(cors());
app.use(express.json());

// SCSS 编译端点
app.post('/compile-scss', (req, res) => {
    try {
        const { scss } = req.body;
        if (!scss) {
            return res.status(400).json({ error: 'No SCSS code provided' });
        }

        const result = sass.compileString(scss, {
            style: 'expanded',
            sourceMap: false
        });

        res.json({ css: result.css });
    } catch (error) {
        console.error('SCSS compilation error:', error);
        res.status(500).json({ 
            error: 'SCSS compilation failed',
            message: error.message 
        });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`SCSS compilation server running on port ${PORT}`);
});
