import { ElevenLabsClient } from "elevenlabs";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import path from "path";

import { v4 as uuid } from "uuid";

import * as dotenv from "dotenv";

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export const createAudioFileFromText = async (
  text: string
): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const audio = await client.generate({
        voice: "Rachel",
        model_id: "eleven_turbo_v2_5",
        text,
      });

      const publicFolderPath = path.join(
        process.cwd(),
        "public",
        "user-audio-generate"
      );

      // Ensure the folder exists
      if (!existsSync(publicFolderPath)) {
        mkdirSync(publicFolderPath, { recursive: true });
      }

      const fileName = `${uuid()}.mp3`;
      const filePath = path.join(publicFolderPath, fileName); // Full path to save the file in 'public/user-audio-generate'

      const fileStream = createWriteStream(filePath); // Use the full file path to save in the target folder

      audio.pipe(fileStream);
      fileStream.on("finish", () => resolve(fileName)); // Resolve with the fileName
      fileStream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};
