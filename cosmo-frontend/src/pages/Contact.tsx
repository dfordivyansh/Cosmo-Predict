import { useState } from "react";
import emailjs from "emailjs-com";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

import { Mail, MapPin, Send, User, Phone, Building } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    inquiryType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send(
        "service_7xtte9x",
        "template_g4r36ip",
        formData,
        "9Aix5mfMWoPEWDXmy",
      )
      .then(
        () => {
          toast.success("Message sent successfully 🚀");
          setFormData({
            name: "",
            email: "",
            phone: "",
            organization: "",
            subject: "",
            inquiryType: "",
            message: "",
          });
        },
        () => {
          toast.error("Failed to send message ❌");
        },
      );
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* HEADER */}
        <div className="mb-12 text-center">
          <Mail className="w-16 h-16 mx-auto mb-4 text-cyan-400 animate-pulse" />
          <h1 className="text-4xl font-bold text-white">Contact Us</h1>
          <p className="text-gray-400">We'd love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* FORM */}
          <Card className="p-8 bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Send Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAME + EMAIL */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* PHONE + ORG */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input
                    placeholder="+91 1234567890"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Organization</Label>
                  <Input
                    placeholder="College / Company"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* SUBJECT */}
              <div>
                <Label>Subject</Label>
                <Input
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                />
              </div>

              {/* INQUIRY TYPE */}
              <div>
                <Label>Inquiry Type</Label>
                <select
                  className="w-full p-2 rounded-md bg-black border border-gray-700 text-white"
                  value={formData.inquiryType}
                  onChange={(e) =>
                    setFormData({ ...formData, inquiryType: e.target.value })
                  }>
                  <option value="">Select type</option>
                  <option>Space Weather Detection</option>
                  <option>Rocket Trajectory Simulation</option>
                  <option>Research Collaboration</option>
                  <option>General Query</option>
                </select>
              </div>

              {/* MESSAGE */}
              <div>
                <Label>Message</Label>
                <Textarea
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  className="min-h-[120px]"
                />
              </div>

              {/* BUTTON */}
              <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-105 transition-all">
                <Send className="mr-2 w-5 h-5" />
                Send Message
              </Button>
            </form>
          </Card>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/5 border border-white/10">
              <div className="flex gap-4">
                <Mail className="text-cyan-400" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Email</h3>

                  <p className="text-gray-400">dfordivyansh3@gmail.com</p>
                  <p className="text-gray-400">
                    krishnakantsharma122004@gmail.com
                  </p>

                  <p className="text-gray-400">ajayadav7376@gmail.com</p>
                  <p className="text-gray-400">shantanushahi9@gmail.com </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 border border-white/10">
              <div className="flex gap-4">
                <MapPin className="text-purple-400" />
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    Institute of Technology & Management
                  </h3>
                  <p className="text-gray-400">GIDA, Gorakhpur</p>
                </div>
              </div>
            </Card>

            <Card className="p-2 bg-white/5 border border-white/10 overflow-hidden rounded-xl">
              <iframe
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.bing.com/maps/embed?h=450&w=600&cp=26.752611~83.371307&lvl=16&typ=d&sty=r&src=SHELL&form=BMEMJS"
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
