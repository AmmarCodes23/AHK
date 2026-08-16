export default function Aboutus() {
  const copy =
    "In 2020, during the Covid-19 pandemic, Saeed Ahmed Khan, a senior radiographer at Tabba Heart Institute, launched AHK Portable X-ray Service. He started this service with his son, Ahmed Hassan Khan, and together they performed over 1000 portable X-rays during the pandemic. AHK Portable X-ray Service established contracts with major labs and hospitals such as Essa Lab, Hashmani Labs, and Health Solutions. They collaborated to provide X-ray and lab services throughout Karachi. Currently, AHK Portable X-ray Service has set up digital X-ray facilities in hospitals like ZMT, Darul Shifa, and Lyfe Health Care, which are still operational today. Initially, they only offered X-ray services but have since expanded to include lab tests, ECG, and ultrasound services.";

  return (
    <div className="container mx-auto space-y-16 px-4 py-12 md:py-16">
      <section className="grid items-center gap-10 md:grid-cols-2">
        <img
          src="/lab-3498584_1280.jpg"
          alt="AHK lab"
          className="h-full max-h-96 w-full rounded-2xl object-cover shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">About Us</h1>
          <span className="mt-3 mb-4 block h-1 w-12 rounded bg-primary" />
          <p className="leading-relaxed text-muted-foreground">{copy}</p>
        </div>
      </section>
      <section className="grid items-center gap-10 md:grid-cols-2 md:[&>*:first-child]:order-2">
        <img
          src="/lab-3498584_1280.jpg"
          alt="AHK story"
          className="h-full max-h-96 w-full rounded-2xl object-cover shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Story</h2>
          <span className="mt-3 mb-4 block h-1 w-12 rounded bg-primary" />
          <p className="leading-relaxed text-muted-foreground">{copy}</p>
        </div>
      </section>
    </div>
  );
}
