import express, { Request, Response, NextFunction } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import rateLimit from 'express-rate-limit'
import { addJsonDataToFile } from '@/api/fileManager'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    return res.json(`This server utilizes ByteDB's API system`)
})

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many requests, Please try again later',
})

router.post(
    '/databaseUpload/:database',
    limiter,
    async (req: Request, res: Response, next: NextFunction) => {
        const { database } = req.params
        const { json } = req.body

        const filePath = path.join('./database', `${database}.json`)

        if (!json || typeof json !== 'object') {
            return res.status(400).json({ error: 'Invalid JSON data' })
        }


        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Database does not exist' })
        }

        try {
            // Add the JSON data to the file
            await addJsonDataToFile(filePath, json)

            // Respond with a success message or any relevant data
            return res.json({ message: 'Data uploaded successfully' })
        } catch (error) {
            console.error('Error uploading data:', error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
)

export default router
