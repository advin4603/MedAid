import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Modal,
  ModalBody,
  ModalHeader,
  Image,
  useDisclosure,
  ModalContent,
} from "@nextui-org/react";
import { useState } from "react";

import { usePrescriptionsStore } from "@/config/state.ts";

function MedicineList() {
  const data = usePrescriptionsStore((state) => state.prescriptionsData);
  const medicines = data
    .map(({ image, medicineData }) =>
      medicineData.map((d) => ({ ...d, image })),
    )
    .flat();

  const [image, setImage] = useState<string | null>(null);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <>
      <div className="overflow-y-scroll">
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            <ModalHeader>View Original Prescription</ModalHeader>
            <ModalBody className="items-center">
              <Image src={image || undefined} />
            </ModalBody>
          </ModalContent>
        </Modal>
        {medicines.map((medicine, index) => (
          <Card
            key={index}
            isPressable
            className="mb-4 text-medium w-full"
            onPress={() => {
              setImage(medicine.image);
              onOpen();
            }}
          >
            <CardHeader>{medicine.name}</CardHeader>
            <CardBody>Dose: {medicine.dose}</CardBody>
            <CardFooter>{medicine.time}</CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

function AppointmentList() {
  const data = usePrescriptionsStore((state) => state.prescriptionsData);
  const appointments = data
    .map(({ image, appointmentData }) =>
      appointmentData.map((d) => ({ ...d, image })),
    )
    .flat();
  const [image, setImage] = useState<string | null>(null);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <div className="overflow-y-scroll">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>View Original Prescription</ModalHeader>
          <ModalBody className="items-center">
            <Image src={image || undefined} />
          </ModalBody>
        </ModalContent>
      </Modal>
      {appointments.map((appointment, index) => (
        <Card
          key={index}
          isPressable
          className="mb-4 text-medium w-full"
          onPress={() => {
            setImage(appointment.image);
            onOpen();
          }}
        >
          <CardHeader>{appointment.name}</CardHeader>
          <CardBody>{appointment.time}</CardBody>
          <CardFooter>Where: {appointment.location}</CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function ViewPage() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 grid-rows-[auto_1fr] h-full">
      <div>
        <h1 className="text-center text text-xl">Medicines</h1>
      </div>
      <div>
        <h1 className="text-center text-xl">Upcoming Appointments</h1>
      </div>
      <MedicineList />
      <AppointmentList />
    </div>
  );
}
