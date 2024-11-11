import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import passport from 'passport'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import './config/passport'
import authRoute from './routes/auth'
import contractsRoute from './routes/contracts'
import paymentsRoute from './routes/payments'
import { handleWebhook } from './controllers/payment.controller'

dotenv.config()

const app = express()
const PORT = 8080

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
)

app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI! }),
		cookie: {
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		},
	})
)

app.post(
	'/payments/webhook',
	express.raw({ type: 'application/json' }),
	handleWebhook
)

app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoute)
app.use('/contracts', contractsRoute)
app.use('/payments', paymentsRoute)

app.listen(PORT, async () => {
	await mongoose
		.connect(process.env.MONGODB_URI!)
		.then(() => console.log('Connected to MongoDB'))
		.then(() => console.log(`Server started on port ${PORT}`))
		.catch((err) => console.error(err))
})
