"use client";
import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";


export default function Services() {
    const [services, setServices] = useState<Array<{ id: number; title: string; description: string; icon: string }>>([]);
        const [servicesLoading, setServicesLoading] = useState(true);

    useEffect(() => {
            let cancelled = false;
            async function loadServices() {
                try {
                    const res = await fetch("/api/services");
                    const data = await res.json();
                    if (!cancelled) setServices(Array.isArray(data) ? data : []);
                } catch {
                    if (!cancelled) setServices([]);
                } finally {
                    if (!cancelled) setServicesLoading(false);
                }
            }
            loadServices();
            return () => {
                cancelled = true;
            };
        }, []);
    return (
        <section id="services" className="w-full px-[12%] py-10 scroll-mt-20">
            <SectionHeader 
                intro="What I Offer"
                title="My Services"
                description="From responsive web design to interactive UI/UX development, I provide a range of services to help bring your digital ideas to life. Let's collaborate to create a web presence that not only looks great but also performs exceptionally."
            />
            <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
                {servicesLoading ? (
                    <div className="col-span-full flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                    </div>
                ) : services.length === 0 ? (
                    <div className="col-span-full text-center text-gray-600 dark:text-gray-300">No services added yet.</div>
                ) : (
                    services.map((service, index) => (
                        <div key={`service-${service.id || index}-${service.title}`} className="group bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="w-14 h-14 rounded-xl bg-linear-to-r from-[#eda40d]/15 to-[#c17e0a]/15 flex items-center justify-center mb-4">
                                <img src={service.icon} alt={service.title} className="w-8 h-8 object-contain" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-[#c17e0a] transition-colors duration-300">{service.title}</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{service.description}</p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}