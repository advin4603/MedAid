import { Camera } from "react-camera-pro";
import { useRef, useState } from "react";
import {
  Card,
  CardFooter,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { toast, Toaster } from "react-hot-toast";

import { CameraIcon, CancelIcon, ConfirmIcon } from "@/components/icons.tsx";
import { client } from "@/config/llm.ts";
import { usePrescriptionsStore } from "@/config/state.ts";

export default function AddPage() {
  const camera = useRef();
  const [image, setImage] = useState<null | string>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isFailedOpen,
    onOpen: onFailedOpen,
    onOpenChange: onFailedOpenChange,
  } = useDisclosure();

  const addPrescription = usePrescriptionsStore(
    (state) => state.addPrescription,
  );

  const [parsing, setParsing] = useState(false);

  const parseImage = async () => {
    if (image === null) return;

    setParsing(true);

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract the details of medicines and next appointments from the given prescription image. Organize the extracted data in the following JSON format:  

\`\`\`json
[
  { "type": "medicine", "name": "medicine_name", "dose": "How many", "time": "When to take" },
  { "type": "appointment", "name": "Name of test (like blood test) or Opthamologist visit", "time": "date", "location": "where" }
]
\`\`\`

- Include all medicines and their respective details, as well as any next appointments mentioned.  
- If the image is irrelevant (not a prescription or document) or if no details about medicines or appointments are present, return an empty list: \`[]\`.  
- Do not add information that is not present in the image.
- Adhere strictly to the provided format. Do not include extra fields or modify the structure.  

**Input**: The prescription image provided to you.  

**Output**: The JSON list as specified above.  
`,
            },
            { type: "image_url", image_url: { url: image } },
          ],
        },
        {
          role: "assistant",
          content: "```json\n",
        },
      ],
      model: "llama-3.2-90b-vision-preview",
      stop: "```",
      stream: false,
    });

    const extracted = chatCompletion.choices[0].message.content;

    try {
      if (extracted === null) throw "";
      const extractedJSON: (
        | { type: "medicine"; name: string; dose: string; time: string }
        | { type: "appointment"; name: string; time: string; location: string }
      )[] = JSON.parse(extracted);

      if (extractedJSON.length == 0) throw "";
      let medicineData: { name: string; dose: string; time: string }[] = [];
      let appointmentData: { name: string; time: string; location: string }[] =
        [];

      extractedJSON.forEach((entry) => {
        if (entry.type === "medicine" && entry.name)
          medicineData.push({
            name: entry.name,
            time: entry.time,
            dose: entry.dose,
          });
        else if (entry.type === "appointment" && entry.name)
          appointmentData.push({
            name: entry.name,
            time: entry.time,
            location: entry.location,
          });
      });

      if (medicineData.length == 0 && appointmentData.length == 0) throw "";

      addPrescription({ image, appointmentData, medicineData });
      onClose();
    } catch {
      onClose();
      onFailedOpen();
    }
    setParsing(false);
  };

  return (
    <>
      <Toaster />
      <Modal
        backdrop="blur"
        isOpen={isFailedOpen}
        onOpenChange={onFailedOpenChange}
      >
        <ModalContent>
          <ModalHeader>Try Again</ModalHeader>
          <ModalBody className="flex flex-row justify-center">
            Could not find anything in this image. Try Again
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Confirm Image</ModalHeader>
          <ModalBody className="flex basis-full justify-center items-center w-full">
            {image && <Image removeWrapper src={image} width={"80%"} />}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              isDisabled={parsing}
              startContent={<CancelIcon size={25} />}
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              color="success"
              isDisabled={parsing}
              startContent={<ConfirmIcon size={25} />}
              onPress={() =>
                toast.promise(
                  parseImage(),
                  {
                    loading: "Processing",
                    success: "Processed Prescription",
                    error: "Something went wrong",
                  },
                  {
                    style: { background: "#333", color: "#fff" },
                  },
                )
              }
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="grid grid-cols-1 gap-5 place-content-center h-min">
        <Card
          isFooterBlurred
          isPressable
          onPress={() => {
            // @ts-ignore
            camera.current && setImage(camera.current.takePhoto());
            onOpen();
          }}
        >
          <Camera
            ref={camera}
            aspectRatio={9 / 16}
            errorMessages={{
              noCameraAccessible:
                "No camera device accessible. Please connect your camera or try a different browser.",
              permissionDenied:
                "Permission denied. Please refresh and give camera permission.",
              switchCamera:
                "It is not possible to switch camera to different one because there is only one video device accessible.",
              canvas: "Canvas is not supported.",
            }}
            facingMode="environment"
          />
          <CardFooter className="border-white/20 border-1 overflow-hidden absolute before:rounded-xl rounded-large bottom-1 w-min shadow-medium mb-5 z-10 self-center">
            <CameraIcon size={30} />
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
