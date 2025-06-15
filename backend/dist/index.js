"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const openai_1 = require("openai");
const app = (0, express_1.default)();
const APIKEY = process.env.APIKEY;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const client = new openai_1.OpenAI({
    apiKey: APIKEY
});
const PORT = 3000;
app.post("/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = req.body;
    if (!topic) {
        res.status(400).json({
            message: "prompt is empty"
        });
    }
    const prompt = `
Generate 5 creative blog titles with short outlines for the topic: "${topic}".
Format:
1. Title
   - Outline
2. Title
   - Outline
...
  `;
    try {
        const completion = yield client.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
        });
        const result = completion.choices[0].message.content;
        res.json({ response: result });
    }
    catch (err) {
        console.error(err instanceof Error ? err.message : 'Unknown error');
        res.status(500).send("Error generating blog ideas");
    }
}));
app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});
