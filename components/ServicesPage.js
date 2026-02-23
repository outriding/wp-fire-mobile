export default function ServicesPage() {
  return (
    <div className="bg-[#f5f5f5] text-gray-800 w-screen px-10 pb-10">
      <main className="max-w-7xl mx-auto px-6  lg:py-20 pl-20">
        <header className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-light mb-4">Our Services</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            This is a list of the services that we offer. Please note that this is a representative
            list and is not intended to be exhaustive. If you would like a bespoke service that is
            not listed here, please get in touch and a member of our team will be happy to help.
          </p>
        </header>

        {/* Life Safety Systems */}
        <section className="mb-12 flex-col">
          <h2 className="text-2xl font-medium mb-4">Life Safety Systems</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3  items-start gap-10">
            <div className="lg:col-span-2">
              <p className="text-gray-600 leading-relaxed mb-6">
                We specialise in the design, installation, and maintenance of life safety systems
                that protect people and property. From fire alarms to emergency lighting and
                integrated safety solutions, we ensure every system is compliant, reliable, and
                built to respond when it matters most. With constant innovation and a focus on
                quality, we deliver peace of mind through safety you can trust.
              </p>

              {/* adjusted spacing: tight vertical gap, large horizontal gap */}
              <div className=" grid grid-cols-2! gap-x-2! gap-y-4!">
                {[
                  'Fire Alarm Design',
                  'Fire Alarm Installation',
                  'Automatic Opening Vents',
                  'Emergency Voice Communication',
                  'Evacuation Alert',
                  'PA/VA',
                  'Emergency Lighting Solutions',
                ].map((item) => (
                  <div key={item} className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-5 w-5 align-middle text-sky-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-2xl font-medium mb-4">Security</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3  items-start">
            <div className="lg:col-span-2">
              <p className="text-gray-600 leading-relaxed mb-6">
                We provide consultation, design, and installation of a wide range of electrical
                security systems, tailored to the needs of both commercial and residential
                properties. In today’s world, advanced security technology is essential, and its
                effectiveness relies on expert installation and ongoing maintenance. As a
                forward-thinking company, we stay ahead of the curve by keeping up with the latest
                innovations in both home and commercial security.
              </p>

              {/* same spacing adjustment for the second list */}
              <ul className=" grid grid-cols-2! gap-x-2! gap-y-4!">
                {['Intruder Alarms', 'CCTV', 'Intercom', 'Access Control', 'Automated Gates'].map(
                  (s) => (
                    <li key={s} className="flex items-center ">
                      <svg
                        className="flex-shrink-0 h-5 w-5 align-middle text-sky-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-800">{s}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
