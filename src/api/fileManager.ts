import * as fs from 'fs'
import * as path from 'path'

export function createFile(fileName: string, fileContents: any): void {
    const appendedFileName = `./database/${fileName}`
    const directoryPath = path.dirname(appendedFileName)
    try {
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true })
        }

        fs.writeFileSync(appendedFileName, fileContents)
        console.log(`File '${appendedFileName}' created successfully.`)
    } catch (err) {
        console.error(`Error creating file '${appendedFileName}': ${err}`)
    }
}

export async function addJsonDataToFile(
    fileName: string,
    jsonData: object
): Promise<void> {
    const filePath = path.join('./database', fileName)
    const jsonString = JSON.stringify(jsonData, null, 2)

    try {
        // Read the existing data from the file, or an empty array if the file is new
        const existingData = fs.existsSync(filePath)
            ? fs.readFileSync(filePath, 'utf-8')
            : '[]'

        let dataArray
        try {
            dataArray = JSON.parse(existingData)
            if (!Array.isArray(dataArray)) {
                throw new Error('Invalid data in the file. Expected an array.')
            }
        } catch (err) {
            dataArray = [] // If parsing fails or data is not an array, initialize an empty array.
        }

        // Append the new JSON data to the array
        dataArray.push(jsonData)

        // Write the updated array back to the file
        await fs.promises.writeFile(
            filePath,
            JSON.stringify(dataArray, null, 2)
        )

        console.log(`JSON data added to file '${fileName}' successfully.`)
    } catch (err) {
        console.error(`Error adding JSON data to file '${fileName}': ${err}`)
        throw err // Rethrow the error to handle it in the API route handler
    }
}
