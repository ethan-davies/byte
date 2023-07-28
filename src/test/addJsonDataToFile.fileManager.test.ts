import * as fs from 'fs'
import path from 'path'
import * as fileManager from '@/api/fileManager'
import prettier from 'prettier'

// Set up Jest to use ES modules
jest.mock('prettier', () => jest.requireActual('prettier'))

describe('fileManager', () => {
    const testDirectory = './test-directory'

    beforeAll(() => {
        // Create the test directory before running the tests
        if (!fs.existsSync(testDirectory)) {
            fs.mkdirSync(testDirectory, { recursive: true })
        }
    })

    afterAll(() => {
        // Clean up the test directory after running all tests
        if (fs.existsSync(testDirectory)) {
            fs.rmSync(testDirectory, { recursive: true })
        }
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('should create a new file with the provided name and contents', async () => {
        // Test data
        const testFileName = 'test-file.json'
        const testData = { key: 'value' }
        const fileName = path.join(testDirectory, testFileName)

        // Call the function to create the file
        await fileManager.createFile(
            testFileName,
            JSON.stringify(testData, null, 2),
        )

        // Check if the file was created successfully
        expect(fs.existsSync(fileName)).toBe(true)

        // Check the contents of the created file
        const createdFileContent = fs.readFileSync(fileName, 'utf8')

        // Use prettier to format the JSON string consistently
        const formattedTestData = await prettier.format(
            JSON.stringify(testData),
            {
                parser: 'json',
            },
        )

        expect(createdFileContent).toBe(formattedTestData)
    })

    test('should add JSON data to an existing file', async () => {
        // Test data
        const testFileName = 'test-file.json'
        const existingData = [{ existingKey: 'existingValue' }]
        const newData = { newKey: 'newValue' }
        const fileName = path.join(testDirectory, testFileName)

        // Create a file with existing JSON data
        fs.writeFileSync(fileName, JSON.stringify(existingData))

        // Call the function to add JSON data to the file
        await fileManager.addJsonDataToFile(testFileName, newData)

        // Check the updated contents of the file
        const updatedFileContent = fs.readFileSync(fileName, 'utf8')
        const parsedUpdatedFileContent = JSON.parse(updatedFileContent)

        // Format the expected JSON data using prettier
        const formattedExpectedData = await prettier.format(
            JSON.stringify([...existingData, newData]),
            {
                parser: 'json',
            },
        )

        expect(parsedUpdatedFileContent).toEqual(
            JSON.parse(formattedExpectedData),
        )
    })

    test('should throw an error if the existing file contains invalid JSON data (not an array)', async () => {
        // Test data
        const testFileName = 'test-file.json'
        const invalidData = 'invalid-json-data'
        const fileName = path.join(testDirectory, testFileName)

        // Create a file with invalid JSON data
        fs.writeFileSync(fileName, invalidData)

        // Call the function and expect it to throw an error
        await expect(
            fileManager.addJsonDataToFile(testFileName, { key: 'value' }),
        ).rejects.toThrow(
            'Invalid data in the file. Expected a valid JSON array.',
        )
    })
})
