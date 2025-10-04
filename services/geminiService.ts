import { GoogleGenAI, Modality, Part, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// FIX: Removed deprecated `getGenerativeModel` call. The model name is specified directly in `generateContent` calls.

const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                resolve('');
            }
        };
        reader.readAsDataURL(file);
    });

    const data = await base64EncodedDataPromise;
    return {
        inlineData: {
            data,
            mimeType: file.type,
        },
    };
};

// FIX: Used `GenerateContentResponse` type for better type safety.
const extractBase64Image = (response: GenerateContentResponse): string => {
    const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part: Part) => part.inlineData
    );

    if (imagePart && imagePart.inlineData) {
        const mimeType = imagePart.inlineData.mimeType;
        const data = imagePart.inlineData.data;
        return `data:${mimeType};base64,${data}`;
    }
    throw new Error("Could not find image data in Gemini response.");
};

export const generateImage = async (
    designImage: File,
    productImage: File,
    logoImage: File,
    aspectRatio: string,
    logoPosition: string,
    isHighQuality: boolean
): Promise<string> => {
    const designPart = await fileToGenerativePart(designImage);
    const productPart = await fileToGenerativePart(productImage);
    const logoPart = await fileToGenerativePart(logoImage);

    const logoPlacementInstruction = logoPosition === 'center'
    ? `Place this transparent logo in the center of the final composite image.`
    : `Place this transparent logo in the ${logoPosition.replace('-', ' ')} corner of the final composite image.`;
    
    const qualityInstruction = isHighQuality 
        ? 'The final output must be an ultra-high-resolution, photorealistic, and professional-grade marketing image. Pay extreme attention to micro-details, textures, and realistic lighting.'
        : 'The final output must be a single, photorealistic, high-quality image.';


    const prompt = `
You are an expert photorealistic image editor. Your task is to composite three images into one seamless final image.

1. **Primary Image (Background & Scene):** Use the first image provided as the definitive source for the background, environment, perspective, and lighting. Do not alter this scene.
2. **Product Image (Subject):** Use the second image provided, which contains a product (like a T-shirt, pants, etc.). Your task is to flawlessly extract *only the product* from its original background.
3. **Logo Image (Watermark):** Use the third image provided, which is a logo.

**Instructions:**
- Replace the main product in the Primary Image with the extracted product from the Product Image.
- The integration must be seamless. The new product must adopt the exact lighting, shadows, and perspective of the original scene.
- Preserve every detail of the user's product: its texture, material, stitching, folds, creases, proportions, colors, and any unique imperfections.
- Ensure no trace of the original product from the Primary Image remains.
- Make the background of the Logo Image transparent.
- ${logoPlacementInstruction}
- The logo should be small, proportional to the image size, and have a subtle watermark effect. It must not obscure the main product.
- The final output image must have a ${aspectRatio} aspect ratio.
- ${qualityInstruction}
    `;

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [designPart, productPart, logoPart, { text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    return extractBase64Image(result);
};

export const editImage = async (
    base64Image: string,
    prompt: string,
    isHighQuality: boolean
): Promise<string> => {
    const mimeType = base64Image.substring(base64Image.indexOf(":") + 1, base64Image.indexOf(";"));
    const data = base64Image.substring(base64Image.indexOf(",") + 1);

    const imagePart: Part = {
        inlineData: {
            data,
            mimeType,
        },
    };

    const qualityInstruction = isHighQuality 
        ? 'Ensure the final edited image is of the highest possible photorealistic quality, with ultra-fine details and professional-grade lighting.'
        : '';

    const fullPrompt = `You are an expert image editor. The user has provided an image and a request. Apply the following instruction to the image: "${prompt}". ${qualityInstruction} Output only the edited image.`;

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [imagePart, { text: fullPrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    return extractBase64Image(result);
};