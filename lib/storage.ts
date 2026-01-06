import { put } from "@vercel/blob"

export async function uploadFile(file: string | Buffer | Blob, filename: string): Promise<string | null> {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
        console.warn("BLOB_READ_WRITE_TOKEN is not set. File upload disabled.")
        return null
    }

    try {
        const blob = await put(filename, file, {
            access: "public",
        })
        return blob.url
    } catch (error) {
        console.error("Error uploading file to Vercel Blob:", error)
        throw new Error("File upload failed")
    }
}
