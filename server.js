const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// 启用CORS
app.use(cors());

// 静态文件服务
app.use(express.static('.'));

// 代理百度Token请求
app.get('/get-token', async (req, res) => {
    try {
        const API_KEY = 'EZipOlMqDiAgvL64Kj7JvqL1';
        const SECRET_KEY = '0ZpXlYZ8JMxnMrQKjjQUeSk1xesHZrfK';
        const response = await fetch(
            `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 代理语音合成请求
app.get('/text2audio', async (req, res) => {
    try {
        // 构建请求URL，确保参数正确编码
        const params = new URLSearchParams();
        for (let [key, value] of Object.entries(req.query)) {
            params.append(key, value);
        }
        const url = `https://tsn.baidu.com/text2audio?${params.toString()}`;
        
        // 发送请求到百度API
        const response = await fetch(url);
        
        // 检查响应类型
        const contentType = response.headers.get('content-type');
        
        // 如果返回的是JSON，说明有错误
        if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error('百度API错误:', errorData);
            return res.status(400).json(errorData);
        }
        
        // 如果是音频数据，则转发
        if (contentType && (contentType.includes('audio/mp3') || contentType.includes('audio/mpeg'))) {
            res.set('Content-Type', 'audio/mpeg');
            const buffer = await response.buffer();
            return res.send(buffer);
        }
        
        // 其他情况，记录详细信息并返回错误
        console.error('意外的响应类型:', {
            contentType,
            status: response.status,
            statusText: response.statusText,
            url: response.url
        });
        
        throw new Error(`Unexpected response type: ${contentType}`);
        
    } catch (error) {
        console.error('Text to audio error:', error);
        res.status(500).json({ 
            error: error.message,
            details: '语音合成服务出错，请稍后重试'
        });
    }
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
