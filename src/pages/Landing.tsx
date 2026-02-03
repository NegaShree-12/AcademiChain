import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/WalletButton";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Lock,
  Users,
  CheckCircle2,
  ArrowRight,
  Search,
  Blocks,
  FileCheck,
  Globe,
  Zap,
  Award,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Landing() {
  const [verifyHash, setVerifyHash] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    if (verifyHash) {
      navigate(`/verify/${verifyHash}`);
    }
  };

  const features = [
    {
      icon: Lock,
      title: "Tamper-Proof Records",
      description:
        "Every credential is cryptographically hashed and stored on the Ethereum blockchain, making falsification impossible.",
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description:
        "Verify any academic record in seconds. No phone calls, no emails, no waiting. Just blockchain-powered truth.",
    },
    {
      icon: Users,
      title: "Student-Controlled",
      description:
        "You own your credentials. Share them on your terms with customizable access controls and expiration dates.",
    },
  ];

  const stats = [
    { value: "500K+", label: "Credentials Issued" },
    { value: "150+", label: "Partner Institutions" },
    { value: "2M+", label: "Verifications" },
    { value: "99.9%", label: "Uptime" },
  ];

  const partners = ["MIT", "Stanford", "Harvard", "Oxford", "Cambridge", "ETH"];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-pattern">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl" />

        <div className="container relative pt-20 pb-32 md:pt-32 md:pb-40">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blockchain-light px-4 py-2 text-sm font-medium text-primary mb-8 animate-fade-in">
              <Blocks className="h-4 w-4" />
              Powered by Ethereum Blockchain
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
              Own Your{" "}
              <span className="text-gradient-primary">Academic Identity</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Secure, blockchain-verified academic credentials that you control.
              Share instantly, verify anywhere, trust always.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <WalletButton variant="hero" />
              <Link to="/verify">
                <Button variant="outline-primary" size="lg">
                  Verify a Record
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Verify Widget */}
          <div
            className="max-w-xl mx-auto mt-16 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Quick Verification</span>
              </div>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter credential hash or verification link..."
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value)}
                  className="font-mono text-sm"
                />
                <Button onClick={handleVerify}>Verify</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 border-b border-border/50 bg-muted/30">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by world-leading institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {partners.map((partner) => (
              <div
                key={partner}
                className="text-2xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Blockchain Credentials?
            </h2>
            <p className="text-lg text-muted-foreground">
              Traditional paper credentials are slow, expensive, and easily
              forged. AcademiChain changes everything.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-card border border-border/50 card-hover"
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple, secure, and seamless. Get started in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: GraduationCap,
                title: "Institution Issues",
                description:
                  "Your university uploads your credential to IPFS and hashes it on the blockchain.",
              },
              {
                step: "02",
                icon: Shield,
                title: "You Receive",
                description:
                  "Get notified when credentials are issued to your wallet address.",
              },
              {
                step: "03",
                icon: Globe,
                title: "You Share",
                description:
                  "Generate secure verification links with custom expiry and access controls.",
              },
              {
                step: "04",
                icon: FileCheck,
                title: "Instant Verify",
                description:
                  "Employers verify instantly by checking the blockchain record.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary/10 mb-4">
                    {item.step}
                  </div>
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary text-primary-foreground mb-4">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-foreground/10 text-primary-foreground mb-8">
              <Award className="h-8 w-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Take Control of Your Credentials?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Join thousands of students and institutions already using
              blockchain verification.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="xl"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Get Started for Free
              </Button>
              <Link to="/verify">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">AcademiChain</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 AcademiChain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
