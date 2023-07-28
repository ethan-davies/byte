import fs from 'fs'
import * as fileManager from '@/api/fileManager'

describe('fileManager', () => {
    beforeAll(() => {
        const testFileName = 'test-file.json'
        const testDirectory = './test-directory'
        const testData = { key: 'value' }
        const fileName = `${testDirectory}/${testFileName}`
        fs.mkdirSync(testDirectory, { recursive: true })
        fs.writeFileSync(fileName, JSON.stringify(testData))
    })

    afterAll(() => {
        const testFileName = 'test-file.json'
        const testDirectory = './test-directory'
        const fileName = `${testDirectory}/${testFileName}`
        fs.unlinkSync(fileName)
        fs.rmdirSync(testDirectory, { recursive: true })
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('createFile', () => {
        test('should create a new file with the provided name and contents', async () => {
            const testFileName = 'test-file.json'
            const testDirectory = './test-directory'
            const testData = { key: 'value' }
            const fileName = `${testDirectory}/${testFileName}`

            // Mock the 'fs.promises.writeFile' method
            jest.spyOn(fs.promises, 'writeFile').mockResolvedValue()

            await fileManager.createFile(fileName, JSON.stringify(testData))

            // Check if fs.promises.writeFile was called with the correct arguments
            expect(fs.promises.writeFile).toHaveBeenCalledWith(
                expect.stringContaining(testFileName),
                JSON.stringify(testData)
            )

            // Check if the file was created successfully
            expect(fs.existsSync(fileName)).toBe(true)

            // Check the contents of the created file
            const createdFileContent = fs.readFileSync(fileName, 'utf8')
            expect(createdFileContent).toBe(JSON.stringify(testData))
        })

        test('should log an error message if there is an error creating the file', async () => {
            const testFileName = 'test-file.json'
            const testDirectory = './test-directory'
            const testData = { key: 'value' }
            const fileName = `${testDirectory}/${testFileName}`
            const errorMessage = 'Error creating file'

            // Mock the 'fs.promises.writeFile' method to reject with an error message
            jest.spyOn(fs.promises, 'writeFile').mockRejectedValue(
                new Error(errorMessage)
            )

            // Spy on console.error to check if the error message is logged
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation()

            try {
                await fileManager.createFile(fileName, JSON.stringify(testData))
            } catch (error) {
                // Check if the error message is logged
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    `Error creating file '${fileName}': ${error}`
                )
            }
        })
    })
})
