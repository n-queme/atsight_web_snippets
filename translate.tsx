//
//  translate.tsx
//  AtSight version 1.0.0
//
//  Created by Nathan Quême.
//


import { translateClient } from "./configs/translate-client-config"
import { TranslateTextCommand } from "@aws-sdk/client-translate"



/** Translates the text into the target language.
 */
export function translateText(text: string, sourceLanguageCode: string, targetLanguageCode: string) : Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            let commandInput = {
                Text: text,
                SourceLanguageCode: sourceLanguageCode, 
                TargetLanguageCode: targetLanguageCode
            }
            
            if ((text ?? "") === "") reject("Translation error : empty input text")
            const result = await translateClient.send(
                new TranslateTextCommand(commandInput)
            )
            resolve(result?.TranslatedText ?? "")

        } catch (error) {
            reject(error)
        }
    })
}

