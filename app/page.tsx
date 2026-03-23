import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-light font-sans text-dark overflow-hidden">
      {/* Decorative Background Blur */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      {/* Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-sm ring-1 ring-primary/20 transition-transform group-hover:scale-105">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-dark">Zenvist</span>
            </Link>
          </div>
          <div className="flex flex-1 justify-end gap-x-4 items-center">
            <Link href="/login" className="text-sm/6 font-semibold text-dark hover:text-primary transition-colors">
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all hover:-translate-y-0.5"
            >
              Dashboard <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow pt-24 sm:pt-32 lg:pt-40">
        {/* Hero Section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center">
              <span className="relative rounded-full px-4 py-1.5 text-sm/6 text-dark/80 ring-1 ring-accent/50 hover:ring-secondary/50 transition-colors cursor-default bg-white/50 backdrop-blur-sm">
                Next-generation automated sessions.{' '}
                <Link href="/login" className="font-semibold text-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </Link>
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-dark sm:text-7xl">
              Automated visits.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary/80 animate-gradient-x">
                Real sessions.
              </span>
            </h1>
            <p className="mt-8 text-lg font-medium text-dark/70 sm:text-xl/8 mx-auto max-w-2xl">
              Schedule intelligent website visits, monitor detailed run logs, and review high-fidelity playback artifacts—all seamlessly tied together.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary/20 hover:bg-secondary hover:shadow-secondary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300 hover:-translate-y-1"
              >
                Get started for free
              </Link>
              <Link href="#features" className="text-base/6 font-semibold text-dark group flex items-center gap-1">
                Learn more <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* Abstract Dashboard Visual */}
          <div className="mt-16 sm:mt-24 lg:mt-32 relative mx-auto max-w-5xl">
            <div className="rounded-2xl bg-white/40 p-2 ring-1 ring-inset ring-accent/50 lg:rounded-3xl backdrop-blur-xl shadow-2xl shadow-primary/5">
              <div className="rounded-xl ring-1 ring-accent/30 overflow-hidden bg-white shadow-sm flex flex-col h-[400px] sm:h-[500px]">
                {/* Mock Browser Header */}
                <div className="border-b border-accent/30 bg-light/50 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-error/80"></div>
                    <div className="h-3 w-3 rounded-full bg-accent"></div>
                    <div className="h-3 w-3 rounded-full bg-success/80"></div>
                  </div>
                  <div className="mx-4 flex-1 rounded-md bg-white border border-accent/20 h-6"></div>
                </div>
                {/* Mock Content */}
                <div className="flex-1 p-6 flex gap-6 bg-light/10">
                  <div className="w-1/3 flex flex-col gap-4">
                    <div className="h-8 w-1/2 rounded bg-accent/30 animate-pulse"></div>
                    <div className="h-24 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20"></div>
                    <div className="h-24 rounded-xl bg-white border border-accent/30 shadow-sm"></div>
                    <div className="h-24 rounded-xl bg-white border border-accent/30 shadow-sm"></div>
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="h-8 w-1/4 rounded bg-accent/30 animate-pulse mb-2"></div>
                    <div className="flex-1 rounded-xl bg-white border border-accent/30 shadow-sm overflow-hidden flex flex-col">
                      <div className="border-b border-accent/20 p-4 flex gap-4">
                        <div className="h-4 w-16 rounded bg-primary/20"></div>
                        <div className="h-4 w-16 rounded bg-accent/40"></div>
                        <div className="h-4 w-16 rounded bg-accent/40"></div>
                      </div>
                      <div className="flex-1 p-4 bg-light/30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                         <div className="h-full w-full rounded-lg border border-primary/20 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                               <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8 mb-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base/7 font-semibold text-primary">Deploy Faster</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-dark sm:text-5xl border-b pb-8 border-accent/30 inline-block">
              Everything you need to automate
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: 'Scheduled Routine Visits',
                  description: 'Easily schedule bots to navigate through your critical user flows at exact intervals, preventing downtime surprises.',
                  icon: (
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  ),
                },
                {
                  name: 'Comprehensive Run Logs',
                  description: 'Every interaction is meticulously recorded. Access detailed terminal-style logs directly from your dashboard for instant insight.',
                  icon: (
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  ),
                },
                {
                  name: 'Playback Artifacts',
                  description: 'Review full visual replays of the automated session seamlessly. Never guess what went wrong on the UI again.',
                  icon: (
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  ),
                },
              ].map((feature) => (
                <div key={feature.name} className="flex flex-col group p-6 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-accent/40 ring-1 ring-transparent hover:ring-accent/40">
                  <dt className="flex items-center gap-x-3 text-lg/7 font-semibold text-dark">
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base/7 text-dark/70">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-accent/30 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center flex-col md:flex-row items-center gap-6 md:order-2">
            <Link href="#" className="text-sm font-medium text-dark/60 hover:text-dark">Terms</Link>
            <Link href="#" className="text-sm font-medium text-dark/60 hover:text-dark">Privacy</Link>
            <Link href="#" className="text-sm font-medium text-dark/60 hover:text-dark">Contact</Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0 flex items-center justify-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
             <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-center text-sm/6 text-dark/60">
              &copy; {new Date().getFullYear()} Zenvist, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
