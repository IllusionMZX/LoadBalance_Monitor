const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const client = new OpenAI({
    apiKey: "sk-aLh8nqo3P69PWp50KCJWCLOklKjRGE8Z2WDgAyYEPosjUbzu", // 替换为你自己的API密钥
    baseURL: "https://api.moonshot.cn/v1",
});

let history = [{"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手。你更擅长中文和英文的对话。你会为用户提供安全、有帮助、准确的回答。同时，你会拒绝一切涉及恐怖主义、种族歧视、黄色暴力等问题的回答。"}];

async function chat(prompt) {
    // 将用户输入加入历史记录
    history.push({ role: "user", content: prompt });
    
    try {
        const completion = await client.chat.completions.create({
            model: "moonshot-v1-8k",
            messages: history,
        });

        // 将AI的回复加入历史记录
        const aiMessage = completion.choices[0].message.content;
        history.push({ role: "assistant", content: aiMessage });

        return aiMessage;
    } catch (error) {
        console.error('Error:', error);
        return "对不起，发生了错误，请稍后再试。";
    }
}

// 提供一个API端点接收前端的请求
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const reply = await chat(userMessage);
    res.json({ reply });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
