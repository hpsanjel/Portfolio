"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import SectionHeader from "../components/SectionHeader";
import GradientButton from "../components/GradientButton";
import { Mail, Phone } from "lucide-react";

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        if (submitMessage) {
            const timer = setTimeout(() => {
                setSubmitMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [submitMessage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitMessage('Email sent successfully!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setSubmitMessage(result.error || 'Failed to send email');
            }
        } catch (error) {
            setSubmitMessage('Failed to send email');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <section id="contact" className="w-full px-[12%] py-10">
            <SectionHeader 
                intro="Let's Get Connected"
                title="Get in Touch"
                description="Whether you have a project in mind, a question, or just want to say hello, I'd love to hear from you. Reach out through the contact form or connect with me on social media. Let's start a conversation!"
            />
            
            <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row items-center justify-center mt-10">
                <div className="flex items-center gap-2 text-md mr-4"><Phone className="w-5 h-5 text-yellow-600" /> +47 46344530</div>
                <div className="flex items-center gap-2 text-md"><Mail className="w-5 h-5 text-yellow-600" /> harisanjel@gmail.com</div>
            </div>
            
           
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="grid grid-cols-auto gap-6 mt-10 mb-8">
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Enter your name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        className="flex-1 p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90" 
                        required 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Enter your email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        className="flex-1 p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90" 
                        required 
                    />
                </div>
                <textarea 
                    rows={6} 
                    name="message" 
                    placeholder="Enter your message" 
                    value={formData.message}
                    onChange={handleTextareaChange}
                    className="w-full p-4 outline-none border-[0.5px] border-gray-400 rounded-md bg-white mb-6 dark:bg-darkHover/30 dark:border-white/90"
                ></textarea>
                <GradientButton 
                    text={isSubmitting ? 'Sending...' : 'Submit Now'} 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-max mx-auto"
                />
                 {submitMessage && (
                <div className={`max-w-md mx-auto text-center my-4 p-3 rounded-md ${
                    submitMessage.includes('successfully') 
                        ? 'bg-green-100 text-green-700 border border-green-400' 
                        : 'bg-red-100 text-red-700 border border-red-400'
                }`}>
                    {submitMessage}
                </div>
            )}

            </form>
        </section>
    );
}
