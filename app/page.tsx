'use client'

import Image from 'next/image'
import Link from 'next/link'
import logo from "@/assets/logo.png"
import { useState, useEffect } from 'react'
import { translations, type Language } from '@/lib/translations'

function EtymologyTabs({ language }: { language: Language }) {
  const [activeTab, setActiveTab] = useState('bear')
  const t = translations[language]

  const tabContent = {
    bear: {
      name: "The 'Bear' Etymology (Wam)",
      label: 'Bear Theory',
      scholar: 'Candra Bahadur Rai',
      icon: '🐻',
      color: 'bg-primary/5',
      text: "Scholar Candra Bahadur Rai posits that 'Wambule' combines the noun 'wam' (bear), the verbal root *bu (meaning 'to get up/arise'), and the element -le. Local belief holds that the ancestral region was a dense jungle heavily populated by bears. 'Wamdyal' combines wam (bear) and dyal (village), translating to \"Village of the Bears.\"",
      insight: 'The bear held both physical and spiritual significance in ancestral territories.',
    },
    linguistic: {
      name: 'Linguistic/Adjectival Theory',
      label: 'Linguistic',
      scholar: 'Jean Robert Opgenort',
      icon: '📚',
      color: 'bg-secondary/5',
      text: "Linguist Jean Robert Opgenort suggests 'Wambule' derives from the name 'Vanbu' combined with the Nepali adjectival suffix -le. This is similar to how gaũle (meaning \"of the village\") derives from gaũ. The name thus becomes a geographical or descriptive identifier.",
      insight: 'A purely descriptive naming convention based on regional designation.',
    },
    royal: {
      name: 'Royal Theory (Vaizbu)',
      label: 'Royal Theory',
      scholar: 'Ganesh Rai',
      icon: '👑',
      color: 'bg-tertiary-fixed/5',
      text: "Scholar Ganesh Rai suggests 'Wamdyal' combines a legendary king's name, 'Vaizbu', with dyal (village). This translates to \"Village of Vaizbu.\" It is possible that this king adopted the name 'bear' as an ancient symbol of power and sovereignty.",
      insight: 'Royal lineage and ancestral kingship form the basis of community identity.',
    },
  }

  const current = tabContent[activeTab as keyof typeof tabContent]

  return (
    <div>
      <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">{t.etymology.title}</h2>

      <div className="flex flex-col sm:flex-row gap-2 mb-8 border-b border-outline/20">
        {Object.entries(tabContent).map(([key, tab]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === key
                ? 'border-b-2 border-primary text-primary'
                : 'border-b-2 border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-8 animate-fadeIn">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-lg ${current.color}`}>
            <span className="text-2xl">{current.icon}</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary">{current.name}</h3>
            <p className="text-sm text-on-surface-variant">{language === 'en' ? 'By' : 'द्वारा'} {current.scholar}</p>
          </div>
        </div>
        <p className="text-on-surface-variant leading-relaxed text-sm mb-4">{current.text}</p>
        <div className="p-4 bg-primary/10 border-l-4 border-primary rounded">
          <p className="text-xs font-semibold text-primary mb-1">{t.etymology.keyInsight}</p>
          <p className="text-sm text-on-surface-variant">{current.insight}</p>
        </div>
      </div>
    </div>
  )
}

/**
 *
 * @returns
 */
export default function Home() {
  const [activeSection, setActiveSection] = useState('origins')
  const [language, setLanguage] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'origins',
        'culture',
        'geography',
        'dialects',
        'spirituality',
        'rituals',
        'ceremonies',
        'reformed-sects',
        'cta'
      ]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const t = translations[language]
  const chapters = t.chapters

  return (
    <div className="scroll-smooth overflow-x-hidden">
      {/* Chapter Progress Navigation - Right Side */}
      <aside className="hidden xl:fixed xl:right-8 xl:top-1/2 xl:-translate-y-1/2 xl:flex xl:flex-col xl:gap-6 xl:z-40">
        <div className="flex flex-col gap-4">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="flex items-center gap-3 group cursor-pointer">
              <button
                onClick={() => {
                  const element = document.getElementById(chapter.id)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className={`flex-shrink-0 w-3 h-3 rounded-full transition-all duration-300 ${activeSection === chapter.id
                  ? 'bg-primary w-8 shadow-lg'
                  : 'bg-outline/30 hover:bg-outline/60'
                  }`}
              />
              <span
                className={`text-xs font-medium whitespace-nowrap transition-all opacity-20 group-hover:opacity-100 ${activeSection === chapter.id ? 'opacity-100 text-primary' : 'text-on-surface-variant'
                  }`}
              >
                {chapter.label}
              </span>
            </div>
          ))}
        </div>

        {/* Vertical Line Connector */}
        <div className="absolute left-1.5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent -z-10"></div>
      </aside>

      {/* Mobile Chapter Indicator - Top */}
      {mounted && (
      <div className="xl:hidden sticky top-20 z-30 bg-surface/80 backdrop-blur-sm border-b border-outline/10 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold mb-2">{t.mobileNav.currentSection}</p>
          <p className="text-sm font-bold text-primary">
            {chapters.find(c => c.id === activeSection)?.label}
          </p>
        </div>
      </div>
      )}
      {/* Top Navigation Bar */}
      {mounted && (
      <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md bg-white py-2 flex items-center">
        <div className="flex justify-between items-center w-full px-4 md:px-16 max-w-6xl mx-auto h-full">
          <span className="text-2xl font-bold text-primary">
            {t.nav.title}
          </span>
          {/* <div className="hidden md:flex gap-8 items-center">
            <a href="#origins" className="text-primary border-b-2 border-primary pb-1 font-medium text-sm">
              {t.nav.origins}
            </a>
            <a href="#culture" className="text-on-surface-variant hover:text-primary transition-colors font-medium text-sm">
              {t.nav.culture}
            </a>
            <a href="#spirituality" className="text-on-surface-variant hover:text-primary transition-colors font-medium text-sm">
              {t.nav.spiritual}
            </a>
            <a href="#clans" className="text-on-surface-variant hover:text-primary transition-colors font-medium text-sm">
              {t.nav.clans}
            </a>
          </div> */}
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container rounded-full p-1 border border-outline/20">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  language === 'en'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('ne')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  language === 'ne'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                नेपाली
              </button>
            </div>
            <Link
              href="/submit"
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
            >
              {t.nav.contribute}
            </Link>
          </div>
        </div>
      </nav>
      )}

      <main>
        {/* Hero Section */}
        <section
          id="origins"
          className="relative h-screen flex items-center justify-center overflow-hidden bg-white"
        >
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full object-cover bg-center"
              style={{
                backgroundImage:
                  'url(https://lh3.googleusercontent.com/aida/AP1WRLs6ry71xX5Vp_P-U-_5BQ0ObmFpVYDeZLixE0QsXXovSBxIaUjhY9y3oOcBOmUZ7t89mNp_SvAGe1FACe4u4v_LM46g7f_OQc2YYCWXCgq3U8DeSxX2NAFUeIUP_vNtCK6bHoLGsDL1fXZh1qPwaJ0i1IvxzEH5sml4y07uLeAR-zxyPsQmdlbnVWlHSQdL6h-R9JPlnX3jHHb7IiIXPCuDMZO5iKy-bIk3pJQPEp9ormcVwGDBuGKbYMsm)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-primary/60 via-transparent to-black/20"></div>
          </div>

          {mounted && (
          <div className="relative z-10 text-center px-4">
            <p className="text-tertiary-fixed font-semibold tracking-widest uppercase block mb-4 text-sm">
              {t.hero.subtitle}
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-on-primary mb-6 max-w-4xl mx-auto leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-xl text-on-primary/80 max-w-2xl mx-auto leading-relaxed">
              {t.hero.description}
            </p>
          </div>
          )}
        </section>

        {/* Origins of the Name */}
        {mounted && (
        <section id="culture" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <EtymologyTabs language={language} />
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-white p-8 rounded-full shadow-lg border border-outline/10 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin" style={{ animationDuration: '60s' }}></div>
                <span className="text-8xl text-primary opacity-10 absolute select-none">WAM</span>
                <div className="w-64 h-64 rounded-full overflow-hidden relative z-10 border-4 border-white">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy0clf5oDJjGPZzj7DcICTzrLIgx9Ob2_2igGCItF-R4rB7wdEJWF_ptSTIYW5XItvlxltDZte7t73n5-I62uZkIygpIDWqiVsJpmQ4QDjdcK3b117WbcWDiE49nebsBGA4H769fabo_t7ttOuheQd8RhZSlUNmBxPIQQlZO-ziL4XyFfJb8E3kMkbIDZfRInlKy8v-_CmOf6mU6cgGoboxtZ90FzJtsp3XY3Zy7b1kzvvn4HLJoFBw8_KBMG3eXFm9kSih7FxHorH"
                    alt="Himalayan Black Bear silhouette with Kirat patterns"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Sacred Confluence: Geography */}
        {mounted && (
        <section id="geography" className="py-32 bg-background">
          <div className="max-w-6xl mx-auto px-4 md:px-16">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.geography.title}</h2>
              <p className="text-lg text-on-surface-variant max-w-3xl mx-auto">
                {t.geography.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-12">
              <div className="p-8 bg-surface-container-low rounded-2xl border border-outline/10 hover:shadow-md transition-all">
                <span className="text-secondary font-bold text-2xl block mb-4">{t.geography.dudh}</span>
                <p className="text-on-surface-variant text-sm">
                  {t.geography.dudh_desc}
                </p>
              </div>

              <div className="lg:col-span-1 flex justify-center relative h-96">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:shadow-xl transition-all"
                    style={{
                      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAl_1wNd5-SXkN6y1lTApAHLv_vS-cVNyLH_SV9LCGsBFWvgFLPdZnilvCOpA5YraxcQo-WLAf6d_fHBQDtI3EnpfAhcvBZpHSp1LgrZABjNWL-kUNZ4-7v83WYT9tiZjNUR1_UvaSeTiQNqAhKUX_h7NWRAunoyd_QS4XzRZ0D99ImMHFREXBl13CbRF0RaiFmdGHaMb8bXHFKVmEsxWcJe4QDaYMhF2smk-HSumwZxZeCVXkJPv35R51Cldv0XjITV3tyR9qo9ruu')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </div>
              </div>

              <div className="p-8 bg-surface-container-low rounded-2xl border border-outline/10 hover:shadow-md transition-all">
                <span className="text-tertiary font-bold text-2xl block mb-4">{t.geography.sun}</span>
                <p className="text-on-surface-variant text-sm">
                  {t.geography.sun_desc}
                </p>
              </div>
            </div>

            <div className="bg-surface-container rounded-2xl p-8 border border-outline/10">
              <h3 className="text-2xl font-bold text-primary mb-6">Ancestral Territories & Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-primary mb-3 text-lg">Core Ancestral Home</h4>
                  <p className="text-on-surface-variant text-sm mb-4">
                    <strong>Wamdyal (Unbugaun)</strong> in Ward No. 3 of Maneybhanjyang Rural Municipality, Okhaldhunga
                  </p>
                  <h4 className="font-bold text-primary mb-3 text-lg">Primary Geographic Range</h4>
                  <ul className="space-y-2 text-on-surface-variant text-sm">
                    <li>✓ South-East Okhaldhunga</li>
                    <li>✓ South-West Khotang</li>
                    <li>✓ North-West Udayapur</li>
                    <li>✓ North-East Sindhuli (Ratnawati region)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-3 text-lg">Modern Diaspora</h4>
                  <p className="text-on-surface-variant text-sm mb-4">
                    Due to urbanization, significant communities have settled across Nepal:
                  </p>
                  <ul className="space-y-2 text-on-surface-variant text-sm">
                    <li>✓ Eastern Nepal: Jhapa, Morang, Panchthar, Dhankuta, Bhojpur</li>
                    <li>✓ Central Nepal: Kathmandu Valley, Sindhuli</li>
                    <li>✓ Historical settlements in high-altitude communities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Dialects Section */}
        {mounted && (
        <section id="dialects" className="py-32 bg-surface-container-lowest">
          <div className="max-w-6xl mx-auto px-4 md:px-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.dialects.title}</h2>
              <p className="text-lg text-on-surface-variant max-w-3xl mx-auto">
                {t.dialects.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl border border-outline/10 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Wamdyal Dialect</h3>
                <p className="text-on-surface-variant text-sm mb-4">Spoken in the core ancestral settlements</p>
                <p className="text-sm text-on-surface-variant font-mono bg-surface-container p-3 rounded">
                  Rikdum, Lukuvapani, Wamdyal (Ubu), Huku, Sikapu, Tarkomdada, Moli, Vaksa
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-outline/10 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-secondary text-on-secondary rounded-full flex items-center justify-center font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Hilepane Dialect</h3>
                <p className="text-on-surface-variant text-sm mb-4">Spoken in the western highlands</p>
                <p className="text-sm text-on-surface-variant font-mono bg-surface-container p-3 rounded">
                  Pipale, Bhadare, Hilepani, Thakle, Mandhare, Lekhani, Ghurmi
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-outline/10 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-tertiary-fixed text-on-tertiary-fixed rounded-full flex items-center justify-center font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Udayapure Dialect</h3>
                <p className="text-on-surface-variant text-sm mb-4">Spoken in the southern territories</p>
                <p className="text-sm text-on-surface-variant font-mono bg-surface-container p-3 rounded">
                  Udayapur, Phedigau, Barasi, Ghiramdi, Simkaku, Peku
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-outline/10 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-bold mb-4">
                  4
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Jhappali Dialect</h3>
                <p className="text-on-surface-variant text-sm mb-4">Spoken in the eastern lowlands</p>
                <p className="text-sm text-on-surface-variant font-mono bg-surface-container p-3 rounded">
                  Kurleghat, Majhkhani, Byanditar, Rupatar, Jhappa, Gurdum
                </p>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-xl border border-outline/10">
              <p className="text-on-surface-variant text-sm">
                <strong>Population Statistics (National Census 2078 BS / 2021 AD):</strong> The Wambule Rai language has <strong className="text-primary text-lg">15,285 speakers</strong>, underscoring its status as a distinct linguistic identity within Nepal. The four dialects maintain mutual intelligibility while featuring distinct phonological and lexical characteristics shaped by their geographical and cultural contexts.
              </p>
            </div>
          </div>
        </section>
        )}

        {/* The 34 Clans */}
        {mounted && (
        <section id="clans" className="py-24 bg-surface-container-lowest">
          <div className="max-w-6xl mx-auto px-4 md:px-16">
            <div className="mb-16">
              <p className="text-secondary font-semibold tracking-widest uppercase block mb-4 text-sm">Lineage & Structure</p>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">The 34 Pillars</h2>
              <p className="text-lg text-on-surface-variant max-w-md">
                A complex lineage system defining social and ritual hierarchy within the Wambule community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                { num: '01', m: 'Birwancha', f: 'Birwanme / Birwancheni' },
                { num: '02', m: 'Boqwam', f: 'Boqwamme' },
                { num: '03', m: 'Bhau-Chacho', f: 'Bhau-Cacwame / Bhaume' },
                { num: '04', m: 'Dwankhumcho', f: 'Dwankhumme / Dwankhumcheni' },
                { num: '05', m: 'Dwarwancha', f: 'Dwarwanme / Dwarwncheni' },
                { num: '06', m: 'Grturathoke', f: 'Grturathokeme' },
                { num: '07', m: 'Gurba / Gurbha', f: 'Gurbame / Gurbhame' },
                { num: '08', m: 'Jero', f: 'Jerome' },
                { num: '09', m: 'Kyampacho', f: 'Kyampame' },
                { num: '10', m: 'Laimcho', f: 'Laimme / Laimceni' },
                { num: '11', m: 'Mukkacho', f: 'Mukkame' },
                { num: '12', m: 'Nakso-Chacho', f: 'Nakso-Cacwame' },
                { num: '13', m: 'Phumlacho', f: 'Phumlacheni / Phumlame' },
                { num: '14', m: 'Rabdhacho', f: 'Rabdhaceni / Rabdhame' },
                { num: '15', m: 'Rabracho', f: 'Rabrame' },
                { num: '16', m: 'Rabhancho', f: 'Rabhanme / Rabhancheni' },
                { num: '17', m: 'Rwake', f: 'Rwakeme' },
                { num: '18', m: 'SumdiChaco', f: 'Sumdi-Cacwame / Sumdime' },
                { num: '19', m: 'Twarbe', f: 'Twarbeni' },
                { num: '20', m: 'Bagale', f: '' },
                { num: '21', m: 'Binjarav', f: '' },
                { num: '22', m: 'Brankhelcho', f: 'Brainkhelme' },
                { num: '23', m: 'Budarai', f: '' },
                { num: '24', m: 'Hatacho', f: '' },
                { num: '25', m: 'Jimbuwal', f: '' },
                { num: '26', m: 'Jubule', f: '' },
                { num: '27', m: 'Lolpe', f: '' },
                { num: '28', m: 'Luwari', f: '' },
                { num: '29', m: 'Mukhethoke', f: '' },
                { num: '30', m: 'Ribuwali', f: '' },
                { num: '31', m: 'Sankhelcho', f: '' },
                { num: '32', m: 'Sekilcho', f: '' },
                { num: '33', m: 'Tilpiacho', f: 'Tilpame' },
                { num: '34', m: 'Topile', f: '' },
              ].map((clan) => (
                <div key={clan.num} className="p-4 border border-outline/10 bg-white hover:border-secondary transition-all rounded-xl">
                  <p className="text-sm text-secondary font-bold mb-1">{clan.num}</p>
                  <p className="font-bold text-primary text-lg">{clan.m}</p>
                  {clan.f && <p className="text-sm text-on-surface-variant">{clan.f}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Jagrat: The Ancestral Eye */}
        {mounted && (
        <section id="spirituality" className="py-32 bg-surface-dim">
          <div className="max-w-6xl mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative h-96 lg:h-full min-h-96">
              <img
                alt="Kirat Rai shaman performing a ritual by a sacred fire at dusk."
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3HYtzGl45W3wPKJSQjhTU7_-L8LiTvoXCvgaZeKlRR9ByulZ6c5rJ06_b4Ek3-S9Wef99pH1YobrDCcS76V-iRjKjTK9Q6i4THjVXKrXc31asi1h8sem5zV28OP1rZtCSxkA0dGAB41DbLCylWjK3ztuUGh_xNucTuPtmHrdkQqpj97UKs9kM73E-Q9jvXmTh6qDqvJEFALUaPf-YExubkoPA5-hpc6jV_U1d6hjAdzKKbio8nrSPh1vqfF4gc-gqLZyZvXZf04I7"
              />
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">Jagrat: The Ancestral Way</h2>
              <p className="text-lg text-on-surface-variant mb-6 leading-relaxed">
                The <span className="font-bold text-primary">Jagrat</span> is the oldest and primary religious group, historically known as <span className="italic">'Sama pwaco'</span> (literally "the ones who obey the deities and spirits"). Their faith is rooted in ancestral shamanist traditions common to Kirat Rai peoples and focuses on maintaining harmony with both beneficent ancestral spirits and protective spiritual forces.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-secondary text-3xl flex-shrink-0">visibility</span>
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-2">Libju (Grandfather / Gorujure Dada)</h4>
                    <p className="text-on-surface-variant text-sm">
                      The male primordial ancestor represented by the 1957-meter Libju Hill north of the Dudh Koshi. Also known as "Crested Bull Hill" (Gorujure Dada) and "Hill of the Rai Shaman" (Bijuva Dada), Libju is a deeply benevolent protector offering spiritual strength to all clans. According to legend, he was a divine boy discovered in a jungle tree during a 12-year drought and brought spiritual abundance back to the land.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-secondary text-3xl flex-shrink-0">grass</span>
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-2">Bhumju (Grandmother)</h4>
                    <p className="text-on-surface-variant text-sm">
                      The female primordial ancestor represented by the 1400-meter Bhumju Hill south of the Dudh Koshi, near Damli village in Khotang. She completes the sacred pair with Libju and presides over the fertility and abundance of the land, ensuring agricultural prosperity.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-secondary text-3xl flex-shrink-0">warning</span>
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-2">Hivaco Pudme (Malevolent Spirits)</h4>
                    <p className="text-on-surface-variant text-sm">
                      Goblins and evil spirits (bhut, bhutpret, pisac) born from those who suffered an inauspicious death. These must be strictly exorcised or appeased through blood sacrifices and food offerings to prevent illness, fever, and misfortune.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Ritual Hierarchy */}
        {mounted && (
        <section id="rituals" className="py-24 bg-surface-bright">
          <div className="max-w-6xl mx-auto px-4 md:px-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Religious Specialists & Ritual Hierarchy</h2>
              <p className="text-lg text-on-surface-variant">The ecclesiastical structure of Wambule spiritual life utilizes a sacred register of vocabulary called Swamdi (Mundhum in Nepali).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-10 rounded-2xl border border-outline/10 flex flex-col hover:-translate-y-2 transition-all shadow-sm">
                <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="material-symbols-outlined text-on-secondary-container text-4xl">ecg_heart</span>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2 text-center">Jwamco</h3>
                <p className="text-sm text-secondary font-bold mb-4 text-center">Shaman / Diviner</p>
                <p className="text-on-surface-variant text-sm">
                  A powerful wizard, sorcerer, and diviner (dhami, jhakri, bijuva) with clairvoyant and healing powers. Acts as an emergency spiritual medium who enters a deep trance (jwamcam) to communicate with ancestors and diagnose which spirits cause misfortune.
                </p>
              </div>

              <div className="bg-white p-10 rounded-2xl border-2 border-primary flex flex-col hover:-translate-y-2 transition-all shadow-md">
                <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="material-symbols-outlined text-on-primary-container text-4xl">temple_hindu</span>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2 text-center">Nakso</h3>
                <p className="text-sm text-primary font-bold mb-4 text-center">Family Priest</p>
                <p className="text-on-surface-variant text-sm">
                  The formal domestic spiritual teacher (kulguru) chosen from related males. Hereditary role memorizing vast Swamdi texts and conducting all lifecycle and ancestral ceremonies. Wears white ceremonial dress, rudraksha necklace, and carries the sacred dhyangro drum.
                </p>
              </div>

              <div className="bg-white p-10 rounded-2xl border border-outline/10 flex flex-col hover:-translate-y-2 transition-all shadow-sm">
                <div className="w-20 h-20 bg-tertiary-fixed rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="material-symbols-outlined text-on-tertiary-fixed text-4xl">local_library</span>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2 text-center">Labuco</h3>
                <p className="text-sm text-on-tertiary-fixed-variant font-bold mb-4 text-center">Assistant Priest</p>
                <p className="text-on-surface-variant text-sm">
                  (Sahapujari) A supportive position beneath the Nakso. Possesses working knowledge of Swamdi texts and may temporarily lead ceremonies if no qualified Nakso is available (max 3-4 years).
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-xl border border-outline/10">
              <p className="text-on-surface-variant text-sm">
                <strong>Sacred Implements & Dress:</strong> The Nakso's formal dress is strictly white (daura, suruval, patuki, topi, pagari). Essential ritual implements include a rudraksha necklace, khukuri knife, khuda sword, large dhyangro drum with bamboo rod (baisko gajo), bronze tray with polished rice, sal tree incense, clarified butter, water pots, and dried gourds (tumba) filled with millet beer. Each implements carries specific spiritual significance in ceremonies.
              </p>
            </div>
          </div>
        </section>
        )}

        {/* Sacred Rhythms: Festivals & Rituals */}
        {mounted && (
        <section id="ceremonies" className="py-24 bg-surface-container-high">
          <div className="max-w-6xl mx-auto px-4 md:px-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Sacred Rhythms: Ceremonies & Festivals</h2>
              <p className="text-lg text-on-surface-variant">The seasonal and spiritual cycles that define Wambule spiritual life and community identity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Nwaŋgi',
                  subtitle: 'Annual Harvest Festival',
                  desc: 'Held November–January (Mansir/Pus). Absolute obligation to offer new harvest to ancestors before household consumption. Two variants: Phryacyap (simple) and Samahepa (elaborate with animal sacrifices).',
                  timing: 'Nov–Jan',
                },
                {
                  title: 'Khaumo',
                  subtitle: 'Ancestral & Funeral Rituals',
                  desc: '3-5 day ceremony for family ancestors. Phuri Khaumo marks joyful events; Kuyamo Khaumo is solemn funeral purification conducted 45 days or 1 year after death.',
                  timing: 'Year-round',
                },
                {
                  title: 'Bhume Puja',
                  subtitle: 'Worship of the Earth',
                  desc: '9-day collective nature festival (Jeth/May–June). Community honors earth spirits and sowing season. Wambule uniquely prohibit dhol and jhyamta drums during this sacred time.',
                  timing: 'May–Jun',
                },
                {
                  title: 'Sesa Ceremony',
                  subtitle: 'Ancestor Feeding',
                  desc: 'Annual mandatory ancestor-worship ritual at the pilumba shrine. Conducted on three seasonal dates to feed spirits of family members (Jeth, Saun, Bhadau).',
                  timing: 'Seasonal',
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-lg border border-outline/5 flex flex-col hover:-translate-y-1 transition-all">
                  <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold text-primary mb-1">{item.title}</h3>
                    <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-4 bg-primary/10 px-2 py-1 w-fit rounded">
                      {item.timing}
                    </p>
                    <p className="text-sm text-secondary uppercase tracking-wider mb-3 font-semibold">{item.subtitle}</p>
                    <p className="text-on-surface-variant text-sm leading-relaxed flex-grow">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-white p-8 rounded-xl border-2 border-primary">
              <h3 className="text-xl font-bold text-primary mb-4">Dhule Puja (Worship of the Dust)</h3>
              <p className="text-on-surface-variant text-sm">
                Celebrated annually on the full moon of Caitra (March–April), this ceremony pays reverence to the surrounding environment and marks spiritual harmony with nature. The Wambule maintain strict ecological awareness through ritual observance of environmental reciprocity.
              </p>
            </div>
          </div>
        </section>
        )}

        {/* The Reformed Sects */}
        {mounted && (
        <section id="reformed-sects" className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-16">
            <div className="mb-16">
              <p className="text-primary-fixed-variant font-semibold tracking-widest uppercase mb-4 text-sm">Religious Evolution</p>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">The Reformed Sects: Hindu-Kirati Syncretism</h2>
              <p className="text-lg text-on-surface-variant max-w-3xl">
                Alongside the traditional Jagrat faith, two distinct reformed Hindu-influenced sects have emerged, driven largely by economic pressures and desire for spiritual modernization.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="p-8 bg-surface-container rounded-2xl border-l-4 border-tertiary-fixed">
                  <h4 className="text-2xl font-bold text-primary mb-2">Santau-Bhes</h4>
                  <p className="text-sm text-secondary font-semibold mb-3 uppercase">Followers of Lord Shiva</p>
                  <div className="space-y-3 text-on-surface-variant text-sm">
                    <p>
                      <strong>Founded:</strong> ~1850 AD by spiritual teacher Siva Jnandil Rai
                    </p>
                    <p>
                      <strong>Core Belief:</strong> Abandoned sama spirit worship in favor of Lord Shiva (Mahadev). Followers are called "bastan pwaco" ("ones who perform a sacrifice").
                    </p>
                    <p>
                      <strong>Primary Motivation:</strong> Economic—traditional Jagrat rituals require expensive animal sacrifices and alcohol that impoverished families cannot afford.
                    </p>
                    <p>
                      <strong>Distribution:</strong> ~5% of total Wambule population, concentrated in Hilepane and Jhappali dialect regions.
                    </p>
                    <p>
                      <strong>Religious Authority:</strong> Hereditary bhes-guru (saint guides) who wear white ashes (bhagut) on foreheads and white clothes, carry ritual items (sotha staff, musti grain, conch shell).
                    </p>
                    <p>
                      <strong>Daily Practice:</strong> Twice-daily dhup-bati ceremony (10 minutes) honoring Shiva through water purification, incense, burnt sacrifice, and ritual instruments.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-8 bg-surface-container rounded-2xl border-l-4 border-secondary">
                  <h4 className="text-2xl font-bold text-primary mb-2">Hwam</h4>
                  <p className="text-sm text-secondary font-semibold mb-3 uppercase">Followers of Lord Vishnu</p>
                  <div className="space-y-3 text-on-surface-variant text-sm">
                    <p>
                      <strong>Founded:</strong> ~1969 AD by charismatic woman Guruama (Kasilalki Ama) from Khotang
                    </p>
                    <p>
                      <strong>Core Belief:</strong> Replaces all traditional sama spirits with Hindu god Lord Vishnu. Followers called "hwam cwaco" or "hwam phikco" ("ones who burn/throw offerings").
                    </p>
                    <p>
                      <strong>Philosophy:</strong> Iconoclastic movement aimed at dismantling influence of traditional shamanism and jwamco power structures while adapting ancestral traditions.
                    </p>
                    <p>
                      <strong>Conversion Ritual:</strong> Radical cleansing where gurus extinguish central fireplace, smash indoor sama shrines, replaster with water, and declare household exempt from evil spirit propitiation.
                    </p>
                    <p>
                      <strong>Water Festivals:</strong> Ubhrauli (May–July) replaces Bhume Puja; Udhrauli (Oct–Dec) replaces Nwaŋgi, with community offerings thrown into river confluences.
                    </p>
                    <p>
                      <strong>Identity:</strong> Followers wear small black marks on foreheads during rituals; concentrated in Khotang, Okhaldhunga, Udayapur, and Sindhuli.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 p-8 rounded-xl border border-outline/10">
              <p className="text-on-surface-variant text-sm">
                <strong>Religious Coexistence:</strong> The three groups—Jagrat, Santau-Bhes, and Hwam—coexist in Wambule society. Even reformed sect followers often celebrate Hindu national festivals (Dasai, Tihar) and households may practice mixed worship. The choice between traditions often reflects economic circumstances, family lineage, and individual spiritual preference rather than strict sectarian boundaries.
              </p>
            </div>
          </div>
        </section>
        )}

        {/* CTA Section */}
        {mounted && (
        <section id="cta" className="py-16 bg-gradient-to-r from-primary to-primary/90">
          <div className="max-w-6xl mx-auto px-4 md:px-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-on-primary mb-6">Ready to Explore?</h2>
            <p className="text-xl text-on-primary/80 mb-10 max-w-2xl mx-auto">
              Start your journey into the Wambule language and cultural heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="px-8 py-4 bg-on-primary text-primary font-semibold rounded-full hover:shadow-lg transition-all text-lg"
              >
                Open Dictionary
              </Link>
              <Link
                href="/media"
                className="px-8 py-4 border-2 border-on-primary text-on-primary font-semibold rounded-full hover:bg-on-primary/10 transition-all text-lg"
              >
                Browse Heritage
              </Link>
            </div>
          </div>
        </section>
        )}
      </main>

      {/* Footer */}
      {mounted && (
      <footer className="bg-primary text-on-primary py-16 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-3xl font-bold text-on-primary block mb-4">Wambule Rai</h3>
              <p className="text-on-primary/70 max-w-sm mb-8">© 2024 Kirat Wambule Rai Community. Preserving Ancestral Modernism.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-on-primary/20 flex items-center justify-center hover:bg-on-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-sm">public</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-on-primary/20 flex items-center justify-center hover:bg-on-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-sm">share</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <h5 className="font-bold text-on-primary/50 text-sm uppercase tracking-widest">Resources</h5>
                <a href="/search" className="text-on-primary/70 hover:text-on-primary hover:underline transition-all">
                  Dictionary
                </a>
                <a href="/media" className="text-on-primary/70 hover:text-on-primary hover:underline transition-all">
                  Heritage Media
                </a>
                <a href="#" className="text-on-primary/70 hover:text-on-primary hover:underline transition-all">
                  Language Lab
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <h5 className="font-bold text-on-primary/50 text-sm uppercase tracking-widest">Community</h5>
                <Link href="/signup" className="text-on-primary/70 hover:text-on-primary hover:underline transition-all">
                  Join
                </Link>
                <Link href="/submit" className="text-on-primary/70 hover:text-on-primary hover:underline transition-all">
                  Contribute
                </Link>
                <Link href="/login" className="text-on-primary/70 hover:text-on-primary hover:underline transition-all">
                  Sign In
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-on-primary/10 pt-12 text-center text-sm">
            <p className="text-on-primary/70">Preserving language. Celebrating culture. Honoring heritage.</p>
          </div>
        </div>
      </footer>
      )}
    </div>
  )
}
