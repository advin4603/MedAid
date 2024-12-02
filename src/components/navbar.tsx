import { Navbar as NextUINavbar, NavbarContent } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";

import { ThemeSwitch } from "@/components/theme-switch";
import { HomeIcon } from "@/components/icons.tsx";
import { Link } from "@nextui-org/link";

export default function Navbar() {
  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="flex basis-full" justify="start">
        <Button isIconOnly as={Link} href="/" variant="light">
          <HomeIcon />
        </Button>
      </NavbarContent>
      <NavbarContent className="flex basis-full" justify="end">
        <ThemeSwitch />
      </NavbarContent>
    </NextUINavbar>
  );
}
