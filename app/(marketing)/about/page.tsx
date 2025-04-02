import { Users, Heart, Lightbulb, Target, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About ComplexCare.app</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Transforming complex care management with innovative technology solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted p-2">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter">Our Mission</h2>
              <p className="text-muted-foreground md:text-lg">
                Our mission is to empower healthcare providers with the tools they need to deliver exceptional care to
                patients with complex needs. We believe that technology should simplify complex processes, not add to
                them.
              </p>
              <p className="text-muted-foreground md:text-lg">
                By streamlining care coordination, improving communication, and providing actionable insights, we help
                healthcare organizations focus on what matters most: patient outcomes.
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted p-2">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter">Our Vision</h2>
              <p className="text-muted-foreground md:text-lg">
                We envision a future where complex care is seamlessly coordinated, where patients receive personalized
                care plans that adapt to their changing needs, and where healthcare providers have the tools to deliver
                the highest quality care efficiently.
              </p>
              <p className="text-muted-foreground md:text-lg">
                Our goal is to be the leading platform for complex care management, setting the standard for innovation,
                security, and user experience in healthcare technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Values</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                The principles that guide everything we do.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Target className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Patient-Centered</h3>
              <p className="text-center text-muted-foreground">
                We design our solutions with patients at the center, ensuring their needs drive our innovation.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Lightbulb className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Innovation</h3>
              <p className="text-center text-muted-foreground">
                We continuously seek new ways to improve our platform and solve complex healthcare challenges.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Shield className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Security</h3>
              <p className="text-center text-muted-foreground">
                We maintain the highest standards of data security and privacy in everything we do.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Users className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Collaboration</h3>
              <p className="text-center text-muted-foreground">
                We work closely with healthcare providers to ensure our solutions meet their real-world needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Team</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Meet the dedicated professionals behind ComplexCare.app.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="h-24 w-24 rounded-full bg-muted"></div>
              <h3 className="text-xl font-bold">Dr. Sarah Johnson</h3>
              <p className="text-primary">Founder & CEO</p>
              <p className="text-center text-muted-foreground">
                Former NHS Clinical Director with 15+ years of experience in complex care management.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="h-24 w-24 rounded-full bg-muted"></div>
              <h3 className="text-xl font-bold">James Wilson</h3>
              <p className="text-primary">CTO</p>
              <p className="text-center text-muted-foreground">
                Healthcare technology expert with a background in secure medical systems development.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="h-24 w-24 rounded-full bg-muted"></div>
              <h3 className="text-xl font-bold">Emily Thompson</h3>
              <p className="text-primary">Head of Product</p>
              <p className="text-center text-muted-foreground">
                Former care coordinator with a passion for creating intuitive healthcare solutions.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="h-24 w-24 rounded-full bg-muted"></div>
              <h3 className="text-xl font-bold">Dr. Michael Chen</h3>
              <p className="text-primary">Clinical Advisor</p>
              <p className="text-center text-muted-foreground">
                Specialist in complex care with expertise in care pathway optimization.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="h-24 w-24 rounded-full bg-muted"></div>
              <h3 className="text-xl font-bold">Robert Brown</h3>
              <p className="text-primary">Head of Security</p>
              <p className="text-center text-muted-foreground">
                Cybersecurity expert specializing in healthcare data protection.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="h-24 w-24 rounded-full bg-muted"></div>
              <h3 className="text-xl font-bold">Lisa Davis</h3>
              <p className="text-primary">Customer Success Director</p>
              <p className="text-center text-muted-foreground">
                Dedicated to ensuring healthcare providers get the most from our platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

