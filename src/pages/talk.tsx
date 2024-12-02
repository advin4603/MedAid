import React, { useEffect, useRef, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody, Progress } from "@nextui-org/react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import Markdown from "react-markdown";

import { RecordIcon, SendIcon, StopIcon } from "@/components/icons.tsx";
import { client } from "@/config/llm.ts";
import { usePrescriptionsStore } from "@/config/state.ts";

export default function TalkPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: any }[]
  >([]);

  const [userMessage, setUserMessage] = useState("");

  const messagesRef = useRef<HTMLDivElement>(null);

  const { startRecording, stopRecording, recordingBlob, isRecording } =
    useAudioRecorder();

  const transcribeAndResponse = async () => {
    if (recordingBlob === undefined) return;
    const transcription = await client.audio.transcriptions.create({
      file: new File([recordingBlob], "audio.webm"),
      model: "distil-whisper-large-v3-en",
    });

    if (transcription.text.length == 0) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: transcription.text },
    ]);
    setIsGenerating(true);
  };

  useEffect(() => {
    setIsGenerating(true);
  }, []);

  useEffect(() => {
    if (recordingBlob === undefined) return;
    transcribeAndResponse();
  }, [recordingBlob]);

  const state = usePrescriptionsStore();
  const medicineData = JSON.stringify(
    state.prescriptionsData.map((d) => d.medicineData).flat(),
  );
  const appointmentData = JSON.stringify(
    state.prescriptionsData
      .map((d) => d.appointmentData)
      .flat()
      .toString(),
  );

  const generator = async () => {
    const messagesPrefix: { role: "user" | "assistant"; content: any }[] = [
      {
        role: "user",
        content: `You are a concise, empathetic medical assistant. Based on the prescription images, extracted medicine details, appointment information, and the current date, provide short, clear, and personalized responses to the user. Focus on helping the user understand their medications, appointments, and any relevant actions they need to take.

Respond briefly, avoiding unnecessary explanations unless the user asks for more details. Always speak in bullet points, and bolden what is important for ease of reading. Do not give a paragraph, always a bullet point list with spaces.

Today's Date: ${new Date().toString()} (Always Accurate, No need to confirm) 
Extracted Medicine Data (from prescription images given): ${medicineData} (Always Accurate, No need to confirm)
Extracted Appointment Data (from prescription images given): ${appointmentData} (Always Accurate, No need to confirm)

Present to the user saying hi I am here to help you, use the record button in red below to talk to me, or type a message and press the green send button to chat.

`,
      },
    ];

    const stream = await client.chat.completions.create({
      model: "llama-3.2-90b-vision-preview",
      messages: [...messagesPrefix, ...messages],
      stream: true,
    });

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    for await (const chunk of stream) {
      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1),
        {
          role: "assistant",
          content:
            prev[prev.length - 1].content +
            (chunk.choices[0]?.delta?.content || ""),
        },
      ]);
      if (messagesRef.current) {
        messagesRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }
    setIsGenerating(false);
  };

  useEffect(() => {
    if (!isGenerating) return;
    generator();
  }, [isGenerating]);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setUserMessage("");
    setIsGenerating(true);
  };

  return (
    <>
      <form onSubmit={onFormSubmit}>
        <div className="grid grid-rows-[1fr_auto] min-h-screen">
          <div ref={messagesRef} className="overflow-y-auto">
            {messages.map((message, index) => (
              <Card
                key={index}
                className={
                  message.role == "user"
                    ? "mb-5 w-5/6 justify-self-end"
                    : "mb-5 w-5/6"
                }
              >
                <CardBody className="text-large">
                  <Markdown>{message.content}</Markdown>
                </CardBody>
              </Card>
            ))}
            <div className="w-full h-20" />
          </div>
          <div className="sticky bottom-11 h-max">
            {isRecording ? (
              <Progress isIndeterminate aria-label="Recording..." />
            ) : null}
            <Input
              size={"lg"}
              className={"pt-5 pb-2"}
              endContent={
                <Button
                  isIconOnly
                  color="success"
                  isDisabled={isGenerating || isRecording}
                  size={"sm"}
                  type="submit"
                >
                  <SendIcon size={20} />
                </Button>
              }
              startContent={
                isRecording ? (
                  <Button
                    isIconOnly
                    color="danger"
                    isDisabled={isGenerating}
                    size={"sm"}
                    onPress={stopRecording}
                  >
                    <StopIcon size={20} />
                  </Button>
                ) : (
                  <Button
                    isIconOnly
                    color="danger"
                    isDisabled={isGenerating}
                    size={"sm"}
                    onPress={startRecording}
                  >
                    <RecordIcon size={20} />
                  </Button>
                )
              }
              value={userMessage}
              onValueChange={setUserMessage}
            />
          </div>
        </div>
      </form>
    </>
  );
}
