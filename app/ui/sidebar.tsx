import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";

const links = [
  { name: 'Shop', href: '/shop' },
  { name: 'About Us', href: '/about' },
  {
    name: 'Blog',
    href: '/blog',
  },
  { name: 'Service', href: '/customer-service' },
];

export default function Sidebar() {
  return (
    <Menu as="div" className="flex items-center">
      <MenuButton>
        <Bars3Icon className="size-7" />
      </MenuButton>
      <MenuItems
        transition
        as={motion.div}
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        anchor="bottom start"
        className="relative z-10 w-48 rounded-lg bg-white shadow-lg"
      >
        {links.map((link) => {
          return (
            <MenuItem key={link.name}>
              <Link
                href={link.href}
                className='flex grow items-center justify-start gap-2 rounded-md text-lg text-gray-900 font-medium px-3 py-2'
              >
                <strong>{link.name}</strong>
              </Link>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  )
}