import dotenv from "dotenv"

dotenv.config()

export default {
    enviroment: process.env.ENVIROMENT,
    port: process.env.PORT,
    mongo_uri: process.env.DB_URI,
    secret_key: process.env.SECRET_KEY,
    github_id: process.env.GITHUB_ID,
    github_client: process.env.GITHUB_CLIENT,
    google_id: process.env.GOOGLE_ID,
    google_client: process.env.GOOGLE_CLIENT,
    persistence: process.env.PERSISTENCE,
    twilio_sid: process.env.TWILIO_SID,
    twilio_auth: process.env.TWILIO_AUTH_TOKEN,
    twilio_phone: process.env.TWILIO_PHONENUMBER,
    jwt_key: process.env.JWT_SECRET_KEY,
    gmail_user: process.env.GMAIL_USER,
    gmail_password: process.env.GMAIL_PASSWORD
}
