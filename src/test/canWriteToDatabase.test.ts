import { addJsonDataToFile } from '@/api/fileManager' // Replace 'your-file' with the correct path to your function file

// Mock the 'fs.promises.writeFile' function
jest.mock('fs.promises', () => ({
    writeFile: jest.fn(),
}))

describe('addJsonDataToFile', () => {
    it('should write the JSON data to the file', async () => {
        const fileName = 'testFile.json'
        const jsonData = { name: 'John Doe', age: 30 }

        // Call the function
        const result = await addJsonDataToFile(fileName, jsonData)

        // Assertions
        expect(result).toEqual({
            success: true,
            message: `JSON data added to file '${fileName}' successfully.`,
        })

        // Verify that 'fs.promises.writeFile' was called with the correct arguments
        expect(require('fs.promises').writeFile).toHaveBeenCalledWith(
            `./database/${fileName}`,
            JSON.stringify([jsonData], null, 2)
        )
    })
})
