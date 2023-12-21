import dotenv from "dotenv"

dotenv.config()

export default {
    port: process.env.PORT,
    mongo_uri: process.env.DB_URI,
    secret_key: process.env.SECRET_KEY,
    github_id: process.env.GITHUB_ID,
    github_client: process.env.GITHUB_CLIENT,
    google_id: process.env.GOOGLE_ID,
    google_client: process.env.GOOGLE_CLIENT,
    persistence: process.env.PERSISTENCE
}