import { GiScales, GiGreekTemple } from "react-icons/gi";
import { LuBriefcaseBusiness, LuCalendarDays, LuFileText, LuSquareCheckBig, LuArrowRight } from "react-icons/lu";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-bgcol">
      {/* Navigation */}
      <nav className="w-full h-[60px] bg-cards border-b-1 border-border flex items-center justify-between px-6 fixed top-0 left-0 z-50">
        <div className="flex items-center gap-1">
          <GiScales className="text-xl text-logo"/>
          <span className="text-lg font-sora text-navy pt-1">Courtly</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/sign-in" className="text-sm font-sora text-sec-text hover:text-navy transition-all">
            Sign In
          </Link>
          <Link 
            to="/sign-up" 
            className="bg-navy text-cards px-4 py-2 rounded-md text-sm font-sora hover:bg-sec-navy hover:opacity-80 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-[60px] min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-2 mt-4">
                <GiScales className="text-2xl text-logo"/>
                <span className="text-sm font-sora text-sec-text">Courtly Legal Management</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-sora font-semibold text-navy leading-tight">
                Modern Case Management for Legal Professionals
              </h1>
              
              <p className="text-lg font-sora text-sec-text leading-relaxed">
                Streamline your legal practice with powerful tools for case tracking, document management, 
                hearing scheduling, and team collaboration. Built for modern law firms.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/sign-up" 
                  className="bg-navy text-cards px-6 py-3 rounded-md text-sm font-sora hover:bg-sec-navy hover:opacity-80 transition-all flex items-center justify-center gap-2"
                >
                  Create Account
                  <LuArrowRight className="text-sm"/>
                </Link>
                <Link 
                  to="/sign-in" 
                  className="border-1 border-navy text-navy px-6 py-3 rounded-md text-sm font-sora hover:bg-navy hover:text-cards transition-all flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-cards border-1 border-border rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-icon-green"></div>
                  <div className="w-3 h-3 rounded-full bg-icon-red"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-bgcol rounded-md">
                    <div className="flex items-center gap-2">
                      <LuBriefcaseBusiness className="text-logo"/>
                      <span className="text-sm font-sora text-navy">Active Cases</span>
                    </div>
                    <span className="text-lg font-sora font-semibold text-navy">24</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-bgcol rounded-md">
                    <div className="flex items-center gap-2">
                      <LuCalendarDays className="text-icon-green"/>
                      <span className="text-sm font-sora text-navy">Upcoming Hearings</span>
                    </div>
                    <span className="text-lg font-sora font-semibold text-navy">8</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-bgcol rounded-md">
                    <div className="flex items-center gap-2">
                      <LuSquareCheckBig className="text-icon-red"/>
                      <span className="text-sm font-sora text-navy">Pending Tasks</span>
                    </div>
                    <span className="text-lg font-sora font-semibold text-navy">15</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-bgcol rounded-md">
                    <div className="flex items-center gap-2">
                      <LuFileText className="text-navy"/>
                      <span className="text-sm font-sora text-navy">Documents</span>
                    </div>
                    <span className="text-lg font-sora font-semibold text-navy">142</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-cards">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-sora font-semibold text-navy mb-4">
              Everything You Need to Manage Your Practice
            </h2>
            <p className="text-lg font-sora text-sec-text max-w-2xl mx-auto">
              Comprehensive tools designed specifically for legal professionals to streamline workflows and improve productivity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: LuBriefcaseBusiness,
                title: "Case Management",
                description: "Track all your cases in one place with detailed status updates, client information, and case history."
              },
              {
                icon: LuCalendarDays,
                title: "Hearing Scheduling",
                description: "Never miss a court date with intuitive calendar integration and automated reminders."
              },
              {
                icon: LuSquareCheckBig,
                title: "Task Management",
                description: "Stay organized with task lists, deadlines, and assignment tracking for your team."
              },
              {
                icon: LuFileText,
                title: "Document Management",
                description: "Securely store, organize, and share legal documents with advanced search capabilities."
              },
              {
                icon: GiGreekTemple,
                title: "Organization Management",
                description: "Manage multiple law firms or legal departments with hierarchical organization structures."
              },
              {
                icon: GiScales,
                title: "Activity Tracking",
                description: "Monitor all activities across your practice with comprehensive audit trails and reporting."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-bgcol border-1 border-border rounded-lg p-6 hover:border-logo transition-all"
              >
                <div className="w-12 h-12 bg-icon-green-bg rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-xl text-icon-green"/>
                </div>
                <h3 className="text-lg font-sora font-semibold text-navy mb-2">{feature.title}</h3>
                <p className="text-sm font-sora text-sec-text leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-sora font-semibold text-cards mb-4">
            Ready to Transform Your Legal Practice?
          </h2>
          <p className="text-lg font-sora text-sec-text mb-8 max-w-2xl mx-auto">
            Start managing your legal practice more efficiently with Courtly's comprehensive case management tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/sign-up" 
              className="bg-logo text-navy px-8 py-3 rounded-md text-sm font-sora hover:bg-logo-faint transition-all flex items-center justify-center gap-2"
            >
              Create Account
              <LuArrowRight className="text-sm"/>
            </Link>
            <Link 
              to="/sign-in" 
              className="border-1 border-cards text-cards px-8 py-3 rounded-md text-sm font-sora hover:bg-cards hover:text-navy transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cards border-t-1 border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <GiScales className="text-xl text-logo"/>
            <span className="text-lg font-sora text-navy pt-1">Courtly</span>
          </div>
          <p className="text-sm font-sora text-sec-text">
            © 2024 Courtly. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm font-sora text-sec-text hover:text-navy transition-all">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm font-sora text-sec-text hover:text-navy transition-all">
              Terms
            </Link>
            <Link to="#" className="text-sm font-sora text-sec-text hover:text-navy transition-all">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
