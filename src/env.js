export class Env {
    static get BOT_TOKEN() {
        return process.env.BOT_TOKEN;
    }
    
    static get BOT_PREFIX() {
        return process.env.BOT_PREFIX;
    }
}