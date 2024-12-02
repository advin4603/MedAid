import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { Link } from "@nextui-org/link";

import prescription_image from "@/images/prescription.jpg";
import view_image from "@/images/view.jpg";
import talk_image from "@/images/talk.webp";

export default function IndexPage() {
  const buttonInfo = [
    { name: "Add Prescription", image: prescription_image, link: "/add" },
    { name: "View Details", image: view_image, link: "/view" },
    { name: "Talk", image: talk_image, link: "/talk" },
  ];

  return (
    <div className="gap-3 grid grid-cols-1">
      {buttonInfo.map(({ name, image, link }) => (
        <Card key={name} isPressable as={Link} href={link} shadow="md">
          <CardBody className="flex basis-full justify-center items-center">
            <Image
              removeWrapper
              alt={"Add Prescription"}
              className="object-cover"
              height={"13vh"}
              radius={"lg"}
              src={image}
              width={"100%"}
            />
          </CardBody>
          <CardFooter className="justify-around">
            <b>{name}</b>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
