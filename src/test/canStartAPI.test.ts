// Import the database class and any other required modules
import { database } from '@/index' // Replace 'your-file' with the correct path to your file containing the database class

// Mock Server class (assuming it is in a separate file)
jest.mock('./Server', () => {
    return jest.fn().mockImplementation(() => ({
        listen: jest.fn(),
    }))
})

// Mock any other modules you might be using in the database class

// Mock process.env.PORT
const OLD_ENV = process.env

beforeEach(() => {
    jest.resetModules() // Resets any cached modules before each test
    process.env = { ...OLD_ENV } // Clone the process.env object to prevent affecting other tests
})

afterAll(() => {
    process.env = OLD_ENV // Restore the original process.env after all tests
})

describe('database', () => {
    describe('initialise', () => {
        it('should create a Server instance and call listen with the default port (3000)', () => {
            // Call the function
            database.initialise()

            // Assertions
            const { Server } = require('./Server')
            expect(Server).toHaveBeenCalledTimes(1) // Ensure the Server constructor is called
            expect(Server).toHaveBeenCalledWith(3000) // Ensure it is called with the default port (3000)
            expect(Server().listen).toHaveBeenCalledTimes(1) // Ensure the Server instance's listen method is called
        })

        it('should create a Server instance and call listen with the specified port from process.env', () => {
            process.env.PORT = '5000' // Set a custom port in process.env

            // Call the function
            database.initialise()

            // Assertions
            const { Server } = require('./Server')
            expect(Server).toHaveBeenCalledTimes(1) // Ensure the Server constructor is called
            expect(Server).toHaveBeenCalledWith(5000) // Ensure it is called with the custom port (5000)
            expect(Server().listen).toHaveBeenCalledTimes(1) // Ensure the Server instance's listen method is called
        })
    })
})
