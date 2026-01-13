"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy, ExternalLink } from "lucide-react"

export function ApiIntegrationGuide() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        <span className="text-gradient">Free API Integration Guide</span>
      </motion.h2>

      <Tabs defaultValue="image-generation" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="image-generation">Image Generation</TabsTrigger>
          <TabsTrigger value="text-to-speech">Text-to-Speech</TabsTrigger>
        </TabsList>

        <TabsContent value="image-generation">
          <Card>
            <CardHeader>
              <CardTitle>Free Image Generation APIs</CardTitle>
              <CardDescription>
                Step-by-step guide to integrate free image generation for your historical posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-3">1. Hugging Face Inference API</h3>
                  <p className="mb-4">
                    Hugging Face offers a free tier for their Inference API, which allows you to use various image
                    generation models.
                  </p>

                  <div className="steps space-y-4">
                    <div className="step">
                      <h4 className="font-medium">Step 1: Create a Hugging Face account</h4>
                      <p>
                        Visit{" "}
                        <a
                          href="https://huggingface.co/join"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-instagram-blue hover:underline"
                        >
                          huggingface.co/join
                        </a>{" "}
                        and create a free account.
                      </p>
                    </div>

                    <div className="step">
                      <h4 className="font-medium">Step 2: Get your API key</h4>
                      <p>Go to your profile settings and create a new API key.</p>
                    </div>

                    <div className="step">
                      <h4 className="font-medium">Step 3: Implement the API call</h4>
                      <div className="relative bg-gray-900 rounded-md p-4 my-2">
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{`async function generateImage(prompt, era) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${process.env.HUGGINGFACE_API_KEY}\`,
      },
      body: JSON.stringify({
        inputs: \`A historical image from \${era}: \${prompt}\`,
      }),
    }
  );
  
  // The response is the image binary
  const imageBlob = await response.blob();
  return URL.createObjectURL(imageBlob);
}`}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            copyToClipboard(
                              `async function generateImage(prompt, era) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${process.env.HUGGINGFACE_API_KEY}\`,
      },
      body: JSON.stringify({
        inputs: \`A historical image from \${era}: \${prompt}\`,
      }),
    }
  );
  
  // The response is the image binary
  const imageBlob = await response.blob();
  return URL.createObjectURL(imageBlob);
}`,
                              "huggingface",
                            )
                          }
                        >
                          {copiedSection === "huggingface" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">2. Replicate API</h3>
                  <p className="mb-4">
                    Replicate offers a free tier with limited usage for various AI models including Stable Diffusion.
                  </p>

                  <div className="steps space-y-4">
                    <div className="step">
                      <h4 className="font-medium">Step 1: Create a Replicate account</h4>
                      <p>
                        Visit{" "}
                        <a
                          href="https://replicate.com/signin"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-instagram-blue hover:underline"
                        >
                          replicate.com/signin
                        </a>{" "}
                        and create a free account.
                      </p>
                    </div>

                    <div className="step">
                      <h4 className="font-medium">Step 2: Get your API token</h4>
                      <p>Go to your account settings to find your API token.</p>
                    </div>

                    <div className="step">
                      <h4 className="font-medium">Step 3: Implement the API call</h4>
                      <div className="relative bg-gray-900 rounded-md p-4 my-2">
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{`async function generateImageWithReplicate(prompt, era) {
  // First, start the prediction
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Token \${process.env.REPLICATE_API_TOKEN}\`,
    },
    body: JSON.stringify({
      version: "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      input: { prompt: \`A historical image from \${era}: \${prompt}\` },
    }),
  });
  
  const prediction = await response.json();
  
  // Then, poll for the result
  const pollInterval = 1000; // 1 second
  const maxAttempts = 30;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const statusResponse = await fetch(
      \`https://api.replicate.com/v1/predictions/\${prediction.id}\`,
      {
        headers: {
          Authorization: \`Token \${process.env.REPLICATE_API_TOKEN}\`,
        },
      }
    );
    
    const result = await statusResponse.json();
    
    if (result.status === "succeeded") {
      return result.output[0]; // URL to the generated image
    } else if (result.status === "failed") {
      throw new Error("Image generation failed");
    }
    
    await new Promise(resolve => setTimeout(resolve, pollInterval));
    attempts++;
  }
  
  throw new Error("Timeout waiting for image generation");
}`}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            copyToClipboard(
                              `async function generateImageWithReplicate(prompt, era) {
  // First, start the prediction
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Token \${process.env.REPLICATE_API_TOKEN}\`,
    },
    body: JSON.stringify({
      version: "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      input: { prompt: \`A historical image from \${era}: \${prompt}\` },
    }),
  });
  
  const prediction = await response.json();
  
  // Then, poll for the result
  const pollInterval = 1000; // 1 second
  const maxAttempts = 30;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const statusResponse = await fetch(
      \`https://api.replicate.com/v1/predictions/\${prediction.id}\`,
      {
        headers: {
          Authorization: \`Token \${process.env.REPLICATE_API_TOKEN}\`,
        },
      }
    );
    
    const result = await statusResponse.json();
    
    if (result.status === "succeeded") {
      return result.output[0]; // URL to the generated image
    } else if (result.status === "failed") {
      throw new Error("Image generation failed");
    }
    
    await new Promise(resolve => setTimeout(resolve, pollInterval));
    attempts++;
  }
  
  throw new Error("Timeout waiting for image generation");
}`,
                              "replicate",
                            )
                          }
                        >
                          {copiedSection === "replicate" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="bg-instagram-blue/10 p-4 rounded-md border border-instagram-blue/20">
                  <h4 className="font-semibold flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Recommendation
                  </h4>
                  <p className="text-sm">
                    For your hackathon project, we recommend using the Hugging Face Inference API as it's simpler to
                    implement and provides good results with minimal setup.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text-to-speech">
          <Card>
            <CardHeader>
              <CardTitle>Free Text-to-Speech Solutions</CardTitle>
              <CardDescription>
                Step-by-step guide to integrate free text-to-speech for your historical posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-3">1. Web Speech API</h3>
                  <p className="mb-4">
                    The Web Speech API is built into modern browsers and is completely free to use. It's perfect for
                    client-side text-to-speech.
                  </p>

                  <div className="steps space-y-4">
                    <div className="step">
                      <h4 className="font-medium">Step 1: Create a speech synthesis function</h4>
                      <div className="relative bg-gray-900 rounded-md p-4 my-2">
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{`// Client-side text-to-speech using Web Speech API
function speakText(text, voice = null, rate = 1, pitch = 1) {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if provided
    if (voice) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.name === voice);
      if (selectedVoice) utterance.voice = selectedVoice;
    }
    
    // Set other properties
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Handle events
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(\`Speech synthesis error: \${event.error}\`));
    
    // Speak
    window.speechSynthesis.speak(utterance);
  });
}`}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            copyToClipboard(
                              `// Client-side text-to-speech using Web Speech API
function speakText(text, voice = null, rate = 1, pitch = 1) {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if provided
    if (voice) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.name === voice);
      if (selectedVoice) utterance.voice = selectedVoice;
    }
    
    // Set other properties
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Handle events
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(\`Speech synthesis error: \${event.error}\`));
    
    // Speak
    window.speechSynthesis.speak(utterance);
  });
}`,
                              "webspeech",
                            )
                          }
                        >
                          {copiedSection === "webspeech" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="step">
                      <h4 className="font-medium">Step 2: Get available voices</h4>
                      <div className="relative bg-gray-900 rounded-md p-4 my-2">
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{`// Get available voices
function getAvailableVoices() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
}`}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            copyToClipboard(
                              `// Get available voices
function getAvailableVoices() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
}`,
                              "getvoices",
                            )
                          }
                        >
                          {copiedSection === "getvoices" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="step">
                      <h4 className="font-medium">Step 3: Implement historical voice selection</h4>
                      <div className="relative bg-gray-900 rounded-md p-4 my-2">
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{`// Speak with a voice appropriate for the historical era
async function speakHistoricalPost(text, era) {
  try {
    const voices = await getAvailableVoices();
    
    // Choose a voice based on the era (this is simplified)
    let voice;
    let rate = 1;
    let pitch = 1;
    
    if (era.includes("Ancient") || era.includes("Medieval")) {
      // Deep voice for ancient/medieval
      voice = voices.find(v => v.name.includes("Male") && v.lang.startsWith("en"));
      rate = 0.8; // Slower for ancient
      pitch = 0.9; // Deeper for ancient
    } else if (era.includes("Renaissance")) {
      // British accent for Renaissance
      voice = voices.find(v => v.lang === "en-GB");
      rate = 0.9;
    } else if (era.includes("Victorian") || era.includes("Industrial")) {
      // British accent for Victorian/Industrial
      voice = voices.find(v => v.lang === "en-GB");
      rate = 0.95;
    } else if (era.includes("Modern")) {
      // Default voice for modern
      voice = voices.find(v => v.lang.startsWith("en"));
      rate = 1.1; // Faster for modern
    } else {
      // Default voice
      voice = voices.find(v => v.lang.startsWith("en"));
    }
    
    // Speak the text
    await speakText(text, voice?.name, rate, pitch);
    
    return true;
  } catch (error) {
    console.error("Error speaking text:", error);
    return false;
  }
}`}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            copyToClipboard(
                              `// Speak with a voice appropriate for the historical era
async function speakHistoricalPost(text, era) {
  try {
    const voices = await getAvailableVoices();
    
    // Choose a voice based on the era (this is simplified)
    let voice;
    let rate = 1;
    let pitch = 1;
    
    if (era.includes("Ancient") || era.includes("Medieval")) {
      // Deep voice for ancient/medieval
      voice = voices.find(v => v.name.includes("Male") && v.lang.startsWith("en"));
      rate = 0.8; // Slower for ancient
      pitch = 0.9; // Deeper for ancient
    } else if (era.includes("Renaissance")) {
      // British accent for Renaissance
      voice = voices.find(v => v.lang === "en-GB");
      rate = 0.9;
    } else if (era.includes("Victorian") || era.includes("Industrial")) {
      // British accent for Victorian/Industrial
      voice = voices.find(v => v.lang === "en-GB");
      rate = 0.95;
    } else if (era.includes("Modern")) {
      // Default voice for modern
      voice = voices.find(v => v.lang.startsWith("en"));
      rate = 1.1; // Faster for modern
    } else {
      // Default voice
      voice = voices.find(v => v.lang.startsWith("en"));
    }
    
    // Speak the text
    await speakText(text, voice?.name, rate, pitch);
    
    return true;
  } catch (error) {
    console.error("Error speaking text:", error);
    return false;
  }
}`,
                              "historicalvoice",
                            )
                          }
                        >
                          {copiedSection === "historicalvoice" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">2. Google Cloud Text-to-Speech</h3>
                  <p className="mb-4">
                    Google Cloud Text-to-Speech offers a free tier with 4 million characters per month, which is more
                    than enough for a hackathon project.
                  </p>

                  <div className="steps space-y-4">
                    <div className="step">
                      <h4 className="font-medium">Step 1: Set up a Google Cloud account</h4>
                      <p>
                        Visit{" "}
                        <a
                          href="https://cloud.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-instagram-blue hover:underline"
                        >
                          cloud.google.com
                        </a>{" "}
                        and create a free account with $300 in credits.
                      </p>
                    </div>

                    <div className="step">
                      <h4 className="font-medium">Step 2: Enable the Text-to-Speech API</h4>
                      <p>In the Google Cloud Console, navigate to APIs & Services and enable the Text-to-Speech API.</p>
                    </div>

                    <div className="step">
                      <h4 className="font-medium">Step 3: Create API credentials</h4>
                      <p>Create a service account and download the JSON key file.</p>
                    </div>

                    <div className="step">
                      <h4 className="font-medium">Step 4: Implement the API call (server-side)</h4>
                      <div className="relative bg-gray-900 rounded-md p-4 my-2">
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{`// Server-side implementation using Google Cloud Text-to-Speech
// This would be in an API route in Next.js

import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';

export async function POST(request) {
  try {
    const { text, era } = await request.json();
    
    // Creates a client
    const client = new TextToSpeechClient();
    
    // Select voice based on era
    let voiceName = 'en-US-Standard-D';
    let pitch = 0;
    let speakingRate = 1.0;
    
    if (era.includes("Ancient") || era.includes("Medieval")) {
      voiceName = 'en-GB-Neural2-B'; // Deep male voice
      pitch = -2.0; // Lower pitch
      speakingRate = 0.85; // Slower
    } else if (era.includes("Renaissance")) {
      voiceName = 'en-GB-Neural2-A'; // British female
      pitch = -1.0;
      speakingRate = 0.9;
    } else if (era.includes("Victorian") || era.includes("Industrial")) {
      voiceName = 'en-GB-Neural2-B'; // British male
      pitch = -0.5;
      speakingRate = 0.95;
    } else if (era.includes("Modern")) {
      voiceName = 'en-US-Neural2-F'; // Modern female
      speakingRate = 1.1; // Faster
    }
    
    // Construct the request
    const request = {
      input: { text },
      voice: { languageCode: voiceName.substring(0, 5), name: voiceName },
      audioConfig: { 
        audioEncoding: 'MP3',
        pitch,
        speakingRate
      },
    };
    
    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    
    // Return the audio content as a response
    return new Response(response.audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate speech' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}`}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            copyToClipboard(
                              `// Server-side implementation using Google Cloud Text-to-Speech
// This would be in an API route in Next.js

import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';

export async function POST(request) {
  try {
    const { text, era } = await request.json();
    
    // Creates a client
    const client = new TextToSpeechClient();
    
    // Select voice based on era
    let voiceName = 'en-US-Standard-D';
    let pitch = 0;
    let speakingRate = 1.0;
    
    if (era.includes("Ancient") || era.includes("Medieval")) {
      voiceName = 'en-GB-Neural2-B'; // Deep male voice
      pitch = -2.0; // Lower pitch
      speakingRate = 0.85; // Slower
    } else if (era.includes("Renaissance")) {
      voiceName = 'en-GB-Neural2-A'; // British female
      pitch = -1.0;
      speakingRate = 0.9;
    } else if (era.includes("Victorian") || era.includes("Industrial")) {
      voiceName = 'en-GB-Neural2-B'; // British male
      pitch = -0.5;
      speakingRate = 0.95;
    } else if (era.includes("Modern")) {
      voiceName = 'en-US-Neural2-F'; // Modern female
      speakingRate = 1.1; // Faster
    }
    
    // Construct the request
    const request = {
      input: { text },
      voice: { languageCode: voiceName.substring(0, 5), name: voiceName },
      audioConfig: { 
        audioEncoding: 'MP3',
        pitch,
        speakingRate
      },
    };
    
    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    
    // Return the audio content as a response
    return new Response(response.audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate speech' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}`,
                              "googlecloud",
                            )
                          }
                        >
                          {copiedSection === "googlecloud" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="bg-instagram-blue/10 p-4 rounded-md border border-instagram-blue/20">
                  <h4 className="font-semibold flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Recommendation
                  </h4>
                  <p className="text-sm">
                    For your hackathon project, we recommend using the Web Speech API as it's completely free, requires
                    no API keys, and works directly in the browser. It's perfect for a demo and can be implemented
                    quickly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
        <h3 className="text-xl font-semibold mb-4">Implementation Plan for PastForward</h3>

        <ol className="space-y-4 list-decimal list-inside">
          <li className="pl-2">
            <span className="font-medium">Text Generation:</span> Continue using Gemini API as you already have it set
            up
          </li>
          <li className="pl-2">
            <span className="font-medium">Image Generation:</span> Implement Hugging Face Inference API for historical
            images
          </li>
          <li className="pl-2">
            <span className="font-medium">Text-to-Speech:</span> Implement Web Speech API for browser-based voice
            generation
          </li>
          <li className="pl-2">
            <span className="font-medium">UI Integration:</span> Add buttons to generate images and play speech in the
            post preview component
          </li>
        </ol>

        <div className="mt-6">
          <Button className="instagram-gradient-btn text-white">
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Started with Implementation
          </Button>
        </div>
      </div>
    </div>
  )
}
