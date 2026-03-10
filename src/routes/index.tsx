import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Lock,
  Mail,
  Rocket,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession()
        setIsLoggedIn(!!session.data)
      } catch {
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const features = [
    { icon: FileText, title: 'Easy Form Builder', description: 'Drag-and-drop interface to create forms in minutes. No coding required.' },
    { icon: GraduationCap, title: 'College-Ready Templates', description: 'Pre-built validations for roll numbers, CGPA, semesters, and more.' },
    { icon: Shield, title: 'Smart Validation', description: 'Built-in patterns for emails, phone numbers, and college-specific fields.' },
    { icon: LineChart, title: 'Response Analytics', description: 'Track submissions, view responses, and export data easily.' },
    { icon: Users, title: 'Easy Sharing', description: 'Share forms with a single link. Students can fill from any device.' },
    { icon: Lock, title: 'Secure & Private', description: 'Your data is encrypted and stored securely. GDPR compliant.' },
  ]

  const useCases = [
    { title: 'Student Registration', description: 'Collect student details, course preferences, and document uploads.', icon: ClipboardList },
    { title: 'Event Sign-ups', description: 'Manage college fest registrations, workshop enrollments, and club memberships.', icon: Sparkles },
    { title: 'Feedback Collection', description: 'Gather course feedback, faculty evaluations, and suggestions.', icon: Mail },
    { title: 'Exam & Assignment', description: 'Create quizzes, collect submissions, and manage exam registrations.', icon: GraduationCap },
  ]

  const stats = [
    { value: '10K+', label: 'Forms Created' },
    { value: '50K+', label: 'Responses Collected' },
    { value: '100+', label: 'Colleges Using' },
    { value: '99.9%', label: 'Uptime' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">FormEngine</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#use-cases" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Use Cases</a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
              ) : isLoggedIn ? (
                <Button asChild><Link to="/dashboard"><LayoutDashboard className="w-4 h-4 mr-2" />Dashboard</Link></Button>
              ) : (
                <>
                  <Button variant="ghost" asChild><Link to="/signin">Sign In</Link></Button>
                  <Button asChild><Link to="/signup">Get Started</Link></Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />Built for Colleges & Universities
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Create Beautiful Forms for Your <span className="text-primary">College</span> in Minutes
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              FormEngine is the easiest way to build forms with college-specific validations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isLoggedIn ? (
                <Button size="lg" asChild className="gap-2 px-8"><Link to="/dashboard">Go to Dashboard<ArrowRight className="w-4 h-4" /></Link></Button>
              ) : (
                <>
                  <Button size="lg" asChild className="gap-2 px-8"><Link to="/signup">Start Building Free<ArrowRight className="w-4 h-4" /></Link></Button>
                  <Button size="lg" variant="outline" asChild><Link to="/signin">Sign In to Your Account</Link></Button>
                </>
              )}
            </div>
          </div>
          <div className="mt-16 relative">
            <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-4 sm:p-8 border border-border shadow-2xl">
              <div className="bg-background rounded-xl border border-border overflow-hidden shadow-lg">
                <div className="bg-primary p-6 text-primary-foreground">
                  <h3 className="text-xl font-bold">Student Registration Form</h3>
                  <p className="text-primary-foreground/80 text-sm mt-1">Academic Year 2025-26</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2"><label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></label><div className="h-10 bg-muted/50 rounded-md border border-border" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Roll Number <span className="text-destructive">*</span></label><div className="h-10 bg-muted/50 rounded-md border border-border" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-sm font-medium">Semester</label><div className="h-10 bg-muted/50 rounded-md border border-border" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">CGPA</label><div className="h-10 bg-muted/50 rounded-md border border-border" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (<div key={index} className="text-center"><div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</div><div className="text-sm text-muted-foreground">{stat.label}</div></div>))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"><Zap className="w-4 h-4" />Powerful Features</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Everything You Need to Build Great Forms</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">FormEngine comes packed with features designed specifically for educational institutions.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><feature.icon className="w-6 h-6" /></div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"><Rocket className="w-4 h-4" />Use Cases</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Perfect for Every College Need</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="flex gap-4 p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><useCase.icon className="w-6 h-6" /></div>
                <div><h3 className="text-lg font-semibold mb-2">{useCase.title}</h3><p className="text-muted-foreground text-sm">{useCase.description}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Trusted by Educators</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "FormEngine simplified our student registration. What took weeks now takes hours.", author: "Dr. Priya Sharma", role: "Dean of Admissions", college: "IIT Delhi" },
              { quote: "College-specific validations are a game-changer. No more invalid entries.", author: "Prof. Rajesh Kumar", role: "HOD, Computer Science", college: "NIT Trichy" },
              { quote: "We collected 5,000+ feedback responses. The analytics dashboard is amazing.", author: "Ms. Ananya Patel", role: "Student Affairs", college: "BITS Pilani" },
            ].map((testimonial, index) => (
              <div key={index} className="p-6 rounded-xl border border-border bg-card">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => (<svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>))}</div>
                <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div><div className="font-semibold">{testimonial.author}</div><div className="text-sm text-muted-foreground">{testimonial.role}</div><div className="text-sm text-primary">{testimonial.college}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"><GraduationCap className="w-4 h-4" />College-Specific</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Built-in Validations for Academic Data</h2>
              <p className="text-lg text-muted-foreground mb-8">No need to write complex regex patterns. Pre-built validations for educational institutions.</p>
              <ul className="space-y-4">
                {['Roll Number format (e.g., 21BCE1234)', 'CGPA range (0.00 - 10.00)', 'Semester validation (1-8)', 'College email verification', 'Year of study validation', 'Phone number format (+91)'].map((item, index) => (
                  <li key={index} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /><span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-primary" />Validation Example</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border"><div className="text-sm font-medium mb-2">Roll Number</div><div className="flex items-center gap-2"><code className="text-xs bg-background px-2 py-1 rounded">21BCE1234</code><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-xs text-green-600">Valid</span></div></div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border"><div className="text-sm font-medium mb-2">CGPA</div><div className="flex items-center gap-2"><code className="text-xs bg-background px-2 py-1 rounded">8.75</code><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-xs text-green-600">Valid</span></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to Streamline Your College Forms?</h2>
          <p className="text-lg text-muted-foreground mb-8">Join hundreds of colleges using FormEngine.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <Button size="lg" asChild className="gap-2 px-8"><Link to="/dashboard">Go to Dashboard<ArrowRight className="w-4 h-4" /></Link></Button>
            ) : (
              <>
                <Button size="lg" asChild className="gap-2 px-8"><Link to="/signup">Get Started Free<ArrowRight className="w-4 h-4" /></Link></Button>
                <Button size="lg" variant="outline" asChild><Link to="/signin">Sign In</Link></Button>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-4">No credit card required</p>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground"><FileText className="w-5 h-5" /></div>
            <span className="text-xl font-bold">FormEngine</span>
          </div>
          <p className="text-muted-foreground text-sm">The easiest way to create forms for colleges and universities.</p>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} FormEngine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
