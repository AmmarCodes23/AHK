"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Phone,
  Mail,
  ShoppingCart,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Upload,
  ClipboardList,
  Wallet,
  FolderOpen,
  Tags,
  Files,
} from "lucide-react";
import { servicedData } from "@/lib/constants";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book" },
  { href: "/reports", label: "View Reports" },
];

function CartButton() {
  const { book } = useCart();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      nativeButton={false}
      render={<Link href="/book" />}
    >
      <ShoppingCart />
      <span className="sr-only">Booking cart</span>
      {book.length > 0 ? (
        <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px]">
          {book.length}
        </Badge>
      ) : null}
    </Button>
  );
}

function AccountMenu() {
  const { auth, role } = useAuth();
  const isPatient = role === "PATIENT";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon">
            <User />
            <span className="sr-only">Account</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-52">
        {isPatient ? (
          <>
            <DropdownMenuItem nativeButton={false} render={<Link href="/portal" />}>
              <FolderOpen />
              Portal
            </DropdownMenuItem>
            <DropdownMenuItem nativeButton={false} render={<Link href="/logout" />}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem nativeButton={false} render={<Link href="/login" />}>
              <LogIn />
              Login
            </DropdownMenuItem>
            <DropdownMenuItem nativeButton={false} render={<Link href="/registerPatient" />}>
              <UserPlus />
              Register Patient
            </DropdownMenuItem>
            <DropdownMenuItem nativeButton={false} render={<Link href="/logout" />}>
              <LogOut />
              Logout
            </DropdownMenuItem>
            {auth ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem nativeButton={false} render={<Link href="/patients" />}>
                  <Files />
                  Patient files
                </DropdownMenuItem>
                <DropdownMenuItem nativeButton={false} render={<Link href="/categories" />}>
                  <Tags />
                  Categories
                </DropdownMenuItem>
                <DropdownMenuItem nativeButton={false} render={<Link href="/uploadReports" />}>
                  <Upload />
                  Upload Reports
                </DropdownMenuItem>
                {role === "ADMIN" ? (
                  <>
                    <DropdownMenuItem nativeButton={false} render={<Link href="/checkBalance" />}>
                      <Wallet />
                      Check Balance
                    </DropdownMenuItem>
                    <DropdownMenuItem nativeButton={false} render={<Link href="/registerEmp" />}>
                      <UserPlus />
                      Register Employee
                    </DropdownMenuItem>
                  </>
                ) : null}
              </>
            ) : null}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { role } = useAuth();
  const isPatient = role === "PATIENT";

  if (isPatient) {
    return (
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          <Link href="/portal" className="flex shrink-0 items-center gap-2">
            <img
              src="/esalab/ahk-removebg-preview.png"
              alt="AHK Portable X-Ray"
              className="h-10 w-auto"
            />
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" nativeButton={false} render={<Link href="/portal" />}>
              Portal
            </Button>
            <Button variant="ghost" nativeButton={false} render={<Link href="/logout" />}>
              Logout
            </Button>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="hidden bg-primary text-primary-foreground lg:flex">
        <div className="container mx-auto flex items-center justify-end gap-6 px-4 py-1.5 text-xs">
          <a href="tel:03232195385" className="inline-flex items-center gap-1.5 hover:underline">
            <Phone className="size-3.5" />
            +92 3232195385
          </a>
          <a
            href="mailto:ahkportablexray@gmail.com"
            className="inline-flex items-center gap-1.5 hover:underline"
          >
            <Mail className="size-3.5" />
            ahkportablexray@gmail.com
          </a>
        </div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <img
            src="/esalab/ahk-removebg-preview.png"
            alt="AHK Portable X-Ray"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.slice(0, 1).map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    href={link.href}
                    className={pathname === link.href ? "bg-muted" : undefined}
                  >
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-64 gap-1 p-1">
                    {servicedData.map((item) => (
                      <li key={item.about}>
                        <NavigationMenuLink href={`/${item.about}`}>
                          {item.about}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {navLinks.slice(1).map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    href={link.href}
                    className={pathname === link.href ? "bg-muted" : undefined}
                  >
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <CartButton />
          <AccountMenu />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <CartButton />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-2 pb-6">
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    nativeButton={false}
                    render={<Link href={link.href} />}
                    className="py-3 text-base font-medium"
                  >
                    {link.label}
                  </SheetClose>
                ))}
                <p className="mt-2 px-0 py-2 text-sm font-semibold text-muted-foreground">
                  Services
                </p>
                {servicedData.map((item) => (
                  <SheetClose
                    key={item.about}
                    nativeButton={false}
                    render={<Link href={`/${item.about}`} />}
                    className="py-3 pl-4 text-base"
                  >
                    {item.about}
                  </SheetClose>
                ))}
                <SheetClose
                  nativeButton={false}
                  render={<Link href="/login" />}
                  className="mt-2 py-3 text-base font-medium"
                >
                  Login
                </SheetClose>
                <SheetClose
                  nativeButton={false}
                  render={<Link href="/logout" />}
                  className="py-3 text-base font-medium"
                >
                  Logout
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function StaffToolbar() {
  const { auth, role } = useAuth();
  if (!auth || role === "PATIENT") return null;

  const links = [
    { href: "/patients", label: "Patient files", icon: Files },
    { href: "/categories", label: "Categories", icon: Tags },
    { href: "/uploadReports", label: "Upload Reports", icon: Upload },
    { href: "/registerPatient", label: "Register Patient", icon: UserPlus },
    { href: "/seeAll", label: "See All", icon: ClipboardList },
    ...(role === "ADMIN"
      ? [
          { href: "/checkBalance", label: "Check Balance", icon: Wallet },
          { href: "/registerEmp", label: "Register Employee", icon: UserPlus },
        ]
      : []),
  ];

  return (
    <div className="border-b bg-muted/30">
      <div className="flex gap-2 overflow-x-auto px-4 py-2">
        {links.map((link) => (
          <Button
            key={link.href}
            variant="outline"
            size="sm"
            className="shrink-0"
            nativeButton={false}
            render={<Link href={link.href} />}
          >
            <link.icon />
            {link.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
