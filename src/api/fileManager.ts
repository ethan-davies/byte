import fs from 'fs'
const path = require('path')

export async function createFile(
    fileName: string,
    fileContents: any,
): Promise<void> {
    const directoryPath = path.dirname(fileName)
    try {
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true })
        }

        await fs.promises.writeFile(fileName, fileContents)
        console.log(`File '${fileName}' created successfully.`)
    } catch (err) {
        console.error(`Error creating file '${fileName}': ${err}`)
        throw err // Rethrow the error to handle it in the API route handler
    }
}

export async function addJsonDataToFile(
    filePath: string,
    data: any,
): Promise<void> {
    try {
        const fullPath = path.resolve(filePath)
        let existingData: any[] = []

        if (fs.existsSync(fullPath)) {
            const fileContent = fs.readFileSync(fullPath, 'utf-8')
            try {
                existingData = JSON.parse(fileContent)

                if (!Array.isArray(existingData)) {
                    throw new Error(
                        'Invalid data in the file. Expected a valid JSON array.',
                    )
                }
            } catch (err) {
                console.error(
                    `Error parsing JSON data from file '${fullPath}': ${err}`,
                )
            }
        }

        existingData.push(data)
        fs.writeFileSync(fullPath, JSON.stringify(existingData, null, 2))
        console.log(`JSON data added to file '${fullPath}' successfully.`)
    } catch (err) {
        console.error(`Error adding JSON data to file '${filePath}': ${err}`)
        throw err
    }
}

export function readJsonDataFromFile(fileName: string): any[] {
    try {
        if (!fs.existsSync(fileName)) {
            throw new Error(`File '${fileName}' does not exist.`)
        }

        const data = fs.readFileSync(fileName, 'utf8')
        return JSON.parse(data)
    } catch (error) {
        throw new Error(
            'Invalid data in the file. Expected a valid JSON array.',
        )
    }
}

export function deleteFile(fileName: string): void {
    if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName)
        console.log(`File '${fileName}' deleted successfully.`)
    }
}
