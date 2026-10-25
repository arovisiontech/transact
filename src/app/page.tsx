'use client'

import React from 'react'
import PublicShell from '@/src/components/public/PublicShell'
import HeroSection from '@/src/components/public/HeroSection'
import ImpactNumbersSection from '@/src/components/public/ImpactNumbersSection'
import AboutFacilitySection from '@/src/components/public/AboutFacilitySection'
import TrustFeaturesSection from '@/src/components/public/TrustFeaturesSection'
import ProductLineSection from '@/src/components/public/ProductLineSection'
import ProjectDevelopmentSection from '@/src/components/public/ProjectDevelopmentSection'
import PrecisionManufacturingSection from '@/src/components/public/PrecisionManufacturingSection'
import GlobalPartnerSection from '@/src/components/public/GlobalPartnerSection'
import LaryngoscopeExpertiseSection from '@/src/components/public/LaryngoscopeExpertiseSection'
import OtoscopeShowcaseSection from '@/src/components/public/OtoscopeShowcaseSection'
import ComplianceAndBlogsSection from '@/src/components/public/ComplianceAndBlogsSection'
import ClientOnly from '@/src/components/ClientOnly'

export default function HomePage() {
  return (
    <PublicShell>
      {/* 1. Hero Carousel */}
      <ClientOnly fallback={<div className="w-full bg-[#081022]" style={{ minHeight: 'clamp(520px, 75vh, 840px)' }} />}>
        <HeroSection />
      </ClientOnly>

      {/* 2. Impact in Numbers Section — exact as ss 1 & ss 2 */}
      <ImpactNumbersSection />

      {/* 3. About / Facility — text left / building right */}
      <AboutFacilitySection />

      {/* 4. Trust & Metallurgy strip — Quality You Can Trust, Every Time */}
      <TrustFeaturesSection />

      {/* 5. Our Complete Product Line — exact as ss 1 */}
      <ClientOnly fallback={<div className="py-16 bg-white min-h-[450px]" />}>
        <ProductLineSection />
      </ClientOnly>

      {/* 6. New Products Project Development — exact as ss 1 */}
      <ClientOnly fallback={<div className="py-16 bg-white min-h-[500px]" />}>
        <ProjectDevelopmentSection />
      </ClientOnly>

      {/* 7. Precision Manufacturing & Quality Control — exact as ss 1 */}
      <ClientOnly fallback={<div className="py-16 bg-white min-h-[500px]" />}>
        <PrecisionManufacturingSection />
      </ClientOnly>

      {/* 8. Global B2B Partner Section — exact as ss 1 */}
      <GlobalPartnerSection />

      {/* 9. Laryngoscope Expertise / Built for Precision & Reliability — exact as ss 2 */}
      <LaryngoscopeExpertiseSection />

      {/* 10. Complete Product Line / Otoscope Showcase — exact as ss 3 */}
      <OtoscopeShowcaseSection />

      {/* 11. Compliance & Quality + Latest Blogs — exact as ss 4 */}
      <ComplianceAndBlogsSection />
    </PublicShell>
  )
}
