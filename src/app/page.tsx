import type { Metadata } from "next";
import { CTABox } from "@/components/common/CTABox";
import { FeaturedTutors } from "@/components/home/FeaturedTutors";
import { Hero } from "@/components/home/Hero";
import { IntroSection } from "@/components/home/IntroSection";
import { LatestPosts } from "@/components/home/LatestPosts";
import { NewClasses } from "@/components/home/NewClasses";
import { PricingPreview } from "@/components/home/PricingPreview";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { StatsSection } from "@/components/home/StatsSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export const metadata: Metadata = {
  title: "Gia sư dạy kèm tại nhà và online",
  description:
    "Gia Sư Tài Năng kết nối phụ huynh với gia sư tại nhà và online phù hợp theo môn học, khu vực, trình độ và ngân sách.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <IntroSection />
      <ProcessSection />
      <WhyChooseUs />
      <ServiceGrid />
      <FeaturedTutors />
      <NewClasses />
      <PricingPreview />
      <LatestPosts />
      <CTABox />
    </>
  );
}
