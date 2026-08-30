"use client";
import { useState, useEffect, useId } from "react";
import GradientButton from "./GradientButton";

export default function ContactForm({ className = "max-w-2xl mx-auto" }: { className?: string }) {
    const formId = useId();
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
        <form onSubmit={handleSubmit} className={className}>
            <div className="grid grid-cols-auto gap-6 mb-6">
                <div className="flex-1">
                    <label htmlFor={`${formId}-name`} className="sr-only">
                        Your name
                    </label>
                    <input
                        id={`${formId}-name`}
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor={`${formId}-email`} className="sr-only">
                        Your email
                    </label>
                    <input
                        id={`${formId}-email`}
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                        required
                    />
                </div>
            </div>
            <label htmlFor={`${formId}-message`} className="sr-only">
                Your message
            </label>
            <textarea
                id={`${formId}-message`}
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
            <div role="status" aria-live="polite" className="max-w-md mx-auto">
                {submitMessage && (
                    <div className={`text-center my-4 p-3 rounded-md ${
                        submitMessage.includes('successfully')
                            ? 'bg-green-100 text-green-700 border border-green-400'
                            : 'bg-red-100 text-red-700 border border-red-400'
                    }`}>
                        {submitMessage}
                    </div>
                )}
            </div>
        </form>
    );
}
