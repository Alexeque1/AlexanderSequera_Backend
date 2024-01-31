FROM node:lts-alpine
ENV ENVIRONMENT="Production"
ENV PORT=8080
ENV DB_URI="mongodb+srv://alexeque1:alex15981478sequera@ecommerce.dvv9u6y.mongodb.net/CoderHouse_backend?retryWrites=true&w=majority"
ENV SECRET_KEY="secretKey"
ENV GITHUB_ID="Iv1.7b9adb1fbb8b5b80"
ENV GITHUB_CLIENT="5599ad5575fbb28618e872cb55383244a950b4b7"
ENV GOOGLE_ID="199260124299-tkd0tcc8sdr1s4qaun571covhl0ifk6m.apps.googleusercontent.com"
ENV GOOGLE_CLIENT="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"
ENV PERSISTENCE="mongo"
ENV TWILIO_SID="ACf21ae70b9c6f74618d373ee1a4fdfb6d"
ENV TWILIO_AUTH_TOKEN="3ce285eb2bea380b65f9de44551610af"
ENV TWILIO_PHONENUMBER='whatsapp:+14155238886'
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8080
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
