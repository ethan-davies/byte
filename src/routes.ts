import { Router } from 'express'
import helmet from 'helmet'

require('dotenv').config()

import main from '@/routes/main'
import uploadData from '@/routes/uploadData'

class Routes {
    private router: Router

    constructor() {
        this.router = Router()
        this.initializeMiddlewares()
        this.initializeRoutes()
    }

    private initializeMiddlewares() {
        this.router.use(helmet())
    }

    private initializeRoutes() {
        this.router.use('/', main)
    }

    public getRouter() {
        return this.router
    }
}

export default Routes
