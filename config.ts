require("dotenv").config();


export class Configurations {
    public static Config = {
        telegram_bot_token : process.env.telegram_bot_token,
        openai_apikey : process.env.openai_apikey,
        openai_assistant_id : process.env.openai_assistant_id,
        openai_file_id: process.env.openai_file_id,
        openai_thread_id : process.env.openai_thread_id
    }
}