"use client";

import { useRef } from "react";
import Link from "next/link";
import { Activity, HeartPulse, TestTube, Waves, Scan } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TestCarousel from "@/components/test-carousel";
import QuickView from "@/components/QuickView";
import { servicedData } from "@/lib/constants";

const partnerPics = [
  "/esalab/pic1.jpeg",
  "/esalab/pic2.jpeg",
  "/esalab/pic3.jpeg",
  "/esalab/pic4.jpeg",
  "/esalab/pic5.jpeg",
  "/esalab/pic6.jpeg",
];

const serviceCards = [
  { label: "ECG", href: "/Electrocardiogram (ECG)", icon: Activity },
  { label: "ETT", href: "/Exercies Tolerance Test ETT", icon: HeartPulse },
  { label: "Blood Tests", href: "#lab-tests", icon: TestTube, scroll: true },
  { label: "Ultrasound", href: "/Ultrasound", icon: Waves },
  { label: "X-ray", href: "/X-ray", icon: Scan },
];

export default function Home() {
  const labRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <QuickView />
      <section className="bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto grid gap-10 px-4 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <Badge>Home diagnostic services in Karachi</Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">X-Ray At Your Home</h1>
            <p className="max-w-xl text-muted-foreground md:text-lg">
              Our portable X-ray service brings advanced imaging technology directly to you,
              providing quick, accurate diagnoses in the comfort of your home. Experience
              exceptional care and convenience with our expert team.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" nativeButton={false} render={<Link href="/book" />}>
                Book an Appointment
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/reports" />}
              >
                View Reports
              </Button>
            </div>
          </div>
          <div className="hidden space-y-4 lg:block">
            <Card>
              <CardContent>
                <p className="text-3xl font-bold text-primary">1000+</p>
                <p className="text-muted-foreground">portable X-rays</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-3xl font-bold text-primary">5</p>
                <p className="text-muted-foreground">services</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-3xl font-bold text-primary">Karachi</p>
                <p className="text-muted-foreground">Home visits across the city</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto space-y-6 px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Services</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {serviceCards.map((service) => {
            const Icon = service.icon;
            if (service.scroll) {
              return (
                <button
                  key={service.label}
                  type="button"
                  className="text-left"
                  onClick={() => labRef.current?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Card className="h-full transition hover:shadow-md">
                    <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                      <span className="rounded-full bg-primary/10 p-3 text-primary">
                        <Icon className="size-6" />
                      </span>
                      <p className="font-medium">{service.label}</p>
                    </CardContent>
                  </Card>
                </button>
              );
            }
            return (
              <Link key={service.label} href={service.href}>
                <Card className="h-full transition hover:shadow-md">
                  <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                    <span className="rounded-full bg-primary/10 p-3 text-primary">
                      <Icon className="size-6" />
                    </span>
                    <p className="font-medium">{service.label}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <div ref={labRef} id="lab-tests" className="container mx-auto space-y-16 px-4 py-8">
        <TestCarousel title="Lab Home Sample Collection" lowerrange={0} upperrange={49} />
        <TestCarousel title="AHK Lab's Health Packages" lowerrange={50} upperrange={56} />
        <TestCarousel title="Home Physiotherapy & Nursing" lowerrange={73} upperrange={79} />
      </div>

      <section className="container mx-auto space-y-6 px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Our partners</h2>
        <div className="grid grid-cols-3 items-center gap-6 md:grid-cols-6">
          {partnerPics.map((src) => (
            <img
              key={src}
              src={src}
              alt="Partner logo"
              className="mx-auto h-12 w-auto object-contain grayscale transition hover:grayscale-0"
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-2xl bg-primary p-8 text-primary-foreground md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">Need a test at home?</h2>
          <p className="mt-2 max-w-xl text-primary-foreground/90">
            Book an appointment and our team will bring diagnostic care to your doorstep.
          </p>
          <Button
            className="mt-6 bg-background text-foreground hover:bg-background/90"
            nativeButton={false}
            render={<Link href="/book" />}
          >
            Book an Appointment
          </Button>
        </div>
      </section>
      <span className="sr-only">{servicedData.length} services available</span>
    </div>
  );
}
