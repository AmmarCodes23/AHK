import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <img
            src="/esalab/ahk-removebg-preview.png"
            alt="AHK Portable X-Ray"
            className="h-12 w-auto"
          />
          <p className="text-sm text-muted-foreground">
            Portable X-ray and diagnostic services at your home across Karachi.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/book" className="text-muted-foreground hover:text-foreground">
                Book
              </Link>
            </li>
            <li>
              <Link href="/reports" className="text-muted-foreground hover:text-foreground">
                Reports
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Contact</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <span>
                <a href="tel:03232195385" className="hover:text-foreground">
                  +92 323-2195385
                </a>
                <br />
                <a href="tel:03333382302" className="hover:text-foreground">
                  +92 333-3382302
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <a href="mailto:ahkportablexray@gmail.com" className="hover:text-foreground">
                ahkportablexray@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <a
                href="https://maps.app.goo.gl/nMhwwcztjjtztBLGA"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                S 1/10 Majeed Colony Sector II, Landhi Town, Karachi
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Location</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14483.23433034392!2d67.2370514!3d24.8362189!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb3319b2b25ac13%3A0x7b5d84aba97585f8!2sAHK%20portable%20X-RAY%20Service!5e0!3m2!1sen!2s!4v1721623939508!5m2!1sen!2s"
            title="AHK Portable X-Ray location"
            className="aspect-video w-full rounded-lg border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AHK Portable X-Ray Service. All rights reserved.
      </div>
    </footer>
  );
}
