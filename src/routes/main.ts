import express, { Request, Response, NextFunction } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import rateLimit from 'express-rate-limit'
import { addJsonDataToFile } from '@/api/fileManager'
import Logger from '@/utils/Logger'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    const name = req.query.name

    if (name) {
        return res.status(200).json({
            message: `Hey, ${name}!`,
        })
    } else {
        return res.status(200).json({
            message:
                'Try adding ?name= and your name at the end, so I can greet you!',
        })
    }
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

        if (!json || typeof json !== 'object') {
            return res.status(400).json({ error: 'Invalid JSON data' })
        }

        const filePath = path.join('./database', `${database}.json`)
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Database does not exist' })
        }

        try {
            // Add the JSON data to the file
            console.log(json)
            await addJsonDataToFile(`${database}.json`, json)

            // Respond with a success message or any relevant data
            return res.json({ message: 'Data uploaded successfully' })
        } catch (error) {
            console.error('Error uploading data:', error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
)

export default router
