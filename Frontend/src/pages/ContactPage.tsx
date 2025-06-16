
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the form schema using zod
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Form submission handler
  const onSubmit = (data: ContactFormValues) => {
    setIsSubmitting(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      console.log(data);
      setIsSubmitting(false);

      // Show success toast
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form
      form.reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen ">      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-education-dark mb-4 animate-fade-in">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about MyEnlightiq? We're here to help! Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <MessageSquare className="mr-2 h-5 w-5 text-education-blue" />
                  Get in Touch
                </CardTitle>
                <CardDescription>
                  We'd love to hear from you. Here's how you can reach us.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-education-blue mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:collaborations@enlightiq.in" className="text-education-blue hover:underline" target="_blank" rel="noopener noreferrer">
                      collaborations@enlightiq.in
                    </a>
                  </div>
                </div>                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-education-blue mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+919652012388" className="text-education-blue hover:underline" target="_blank" rel="noopener noreferrer">
                      +91 96520 12388
                    </a>
                    <br></br>
                     <a href="tel:+917075916202" className="text-education-blue hover:underline" target="_blank" rel="noopener noreferrer">
                     +91 70759 16202
                    </a>
                  </div>
                </div>                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-education-blue mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <a 
                      href="https://maps.google.com/maps?ll=17.453802,78.389876&z=22&t=m&hl=en&gl=IN&mapclient=embed&cid=3800074837228319126"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-education-blue hover:underline"
                    >
                      Aishwarya Towers <br/>
                      Ayyapa Society<br />
                      Madhapur, Hyderabad<br />
                      500081
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Connect with Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <a href="#" className="bg-blue-100 p-2 rounded-full text-blue-600 hover:bg-blue-200 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#" className="bg-blue-100 p-2 rounded-full text-blue-400 hover:bg-blue-200 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/enlightiq?igsh=Mm8ycWszb3p2eGgw" className="bg-blue-100 p-2 rounded-full text-pink-600 hover:bg-blue-200 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#" className="bg-blue-100 p-2 rounded-full text-blue-700 hover:bg-blue-200 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Send className="mr-2 h-5 w-5 text-education-blue" />
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Message subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your message" 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-education-blue hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Map */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Our Location</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video w-full">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.1228547098517!2d78.38736047493626!3d17.453832983444805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91d79d2c328b%3A0x34bc93ee48e4f196!2sAishwarya%20Tower!5e0!3m2!1sen!2sin!4v1749725698581!5m2!1sen!2sin"
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={false} 
                      loading="lazy"
                      title="Enlightiq Location Map"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="floating-symbols">
        <span className="symbol">π</span>
        <span className="symbol">∑</span>
        <span className="symbol">√</span>
        <span className="symbol">≈</span>
        <span className="symbol">∫</span>
        <span className="symbol">⚛</span> {/* Atom symbol */}
        <span className="symbol">🧪</span> {/* Beaker */}
      </div>
      <div className="fixed-symbols">
        <span className="fixed-symbol" style={{ top: '10%', left: '5%' }}>π</span>
        <span className="fixed-symbol" style={{ top: '30%', right: '10%' }}>∑</span>
        <span className="fixed-symbol" style={{ top: '60%', left: '15%' }}>⚛</span>
        <span className="fixed-symbol" style={{ top: '80%', right: '20%' }}>🧪</span>
      </div>
    </div>
  );
};

export default ContactPage;
