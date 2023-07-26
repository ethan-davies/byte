import { database } from '@/index' // Replace 'your-file' with the correct path to your function file

// Mock fs module
jest.mock('fs', () => ({
    access: jest.fn(),
}))

// Mock createFile function (assuming it is in a separate file)
jest.mock('./createFile', () => ({
    createFile: jest.fn(),
}))

describe('remindDatabase', () => {
    it('should create a new file if the file does not exist', async () => {
        const name = 'newDatabase'

        // Mock fs.access to indicate that the file does not exist
        const fsMock = require('fs')
        fsMock.access.mockImplementationOnce((path, flags, callback) => {
            callback(new Error('File not found'))
        })

        // Mock createFile function to do nothing (as it is tested separately)
        const { createFile } = require('./createFile')
        createFile.mockResolvedValueOnce()

        // Call the function
        await database.remindDatabase(name)

        // Assertions
        expect(fsMock.access).toHaveBeenCalledWith(
            './database/newDatabase',
            fsMock.constants.F_OK
        )
        expect(createFile).toHaveBeenCalledWith(name, '{}')
    })

    it('should add the database name to activeDatabases if the file exists', async () => {
        const name = 'existingDatabase'

        // Mock fs.access to indicate that the file exists
        const fsMock = require('fs')
        fsMock.access.mockImplementationOnce((path, flags, callback) => {
            callback(null) // No error, file exists
        })

        const activeDatabases = []
        // Assigning the actual 'activeDatabases' array to the function's internal array.
        require('./your-file').activeDatabases = activeDatabases

        // Call the function
        await database.remindDatabase(name)

        // Assertions
        expect(fsMock.access).toHaveBeenCalledWith(
            './database/existingDatabase',
            fsMock.constants.F_OK
        )
        expect(activeDatabases).toContain(name)
    })
})
