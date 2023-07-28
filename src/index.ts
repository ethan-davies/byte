import * as fs from 'fs'
import * as path from 'path'
import express, { Application, Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'

require('dotenv').config()

import Logger from '@/utils/Logger'
import Routes from '@/routes'
import * as FileManager from '@/api/fileManager' // Import FileManager as namespace

export let activeDatabases = []

class Server {
    public app: Application

    constructor(private port: number) {
        this.app = express()
        this.initializeMiddlewares()
        this.initializeRoutes()
        this.initializeErrorHandlers()
    }

    private initializeMiddlewares() {
        this.app.use(cors())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(helmet())
    }

    private initializeRoutes() {
        const routes = new Routes()
        this.app.use(routes.getRouter())
    }

    private initializeErrorHandlers() {
        this.app.use(
            (err: any, req: Request, res: Response, next: NextFunction) => {
                console.error(err.stack)
                res.status(500).json({ message: 'Internal server error' })
            }
        )

        this.app.use((req: Request, res: Response) => {
            res.status(404).json({ message: 'Not found' })
        })
    }

    public listen() {
        this.app.listen(this.port, () => {
            Logger.info(
                `Initialised database and now listening on port ${this.port}`
            )
        })
    }
}

export function helloWorld() {
    console.log('Hello World!')
}

export class database {
    static initialise() {
        const port = parseInt(process.env.PORT || '3000')
        const server = new Server(port)
        server.listen()
    }

    static addDatabase(name: string) { // Alias of remind Database
        this.remindDatabase(name)
    }

    static remindDatabase(name: string) {
        const filePath = path.join('./database', name)
        fs.promises
            .access(filePath, fs.constants.F_OK)
            .then(() => {
                activeDatabases.push(name)
                console.log(activeDatabases)
            })
            .catch(() => {
                FileManager.createFile(filePath, '{}')
            })
    }
}

function dockerStartup() {
    database.initialise()
    database.addDatabase('database.json')
}

if (process.env.DOCKER == 'true') {
    dockerStartup()
}



database.initialise()
database.addDatabase('data.json')