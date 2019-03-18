import React from 'react'
import Header from './Header'
import Icon from './common/Icon'
import { IMG_URL } from '../utils/constants'

const AboutPage = () => {
  return (
    <div>
      <Header />

      <div className="container-narrow pt5 pb3 pb4-ns">
        <div className="row">
          <div className="col-xs-12">
            <div className="relative">
              <h1 className="f-subheadline f-headline-l fw7 lh-title lh-solid-ns near-black">We believe in:</h1>

              {/* mission */}
              <div className="f1 lh-title near-black mt5">
                <Icon type="caret-right" className="mr3 coral" />
                <span>Infinite Learners</span>
              </div>
              <div className="f3 gray mt3" style={{ paddingLeft: '4.5rem' }}>
                Technology accelerates and the pace of change accelerates with it.
                We believe that the world will increasingly be driven by people who are willing to learn continuously
                regardless of their age or circumstances.
              </div>

              <div className="f1 lh-title near-black mt5">
                <Icon type="caret-right" className="mr3 sunglow" />
                <span>Freedom of Career</span>
              </div>
              <div className="f3 gray mt3" style={{ paddingLeft: '4.5rem' }}>
                We believe that you should have the means to switch careers if you find true passion later in life. Your life shouldn't
                be determined by which school you attended or what major you decided to pursue when you were young. Indeed, many inspirational leaders, both historical and contemporary, held multiple careers with broad interest: Benjamin Franklin, Leonardo da Vinci, Thomas Edison, Elon Musk, etc.
              </div>

              <div className="f1 lh-title near-black mt5">
                <Icon type="caret-right" className="mr3 aqua" />
                <span>Choice to Be a Multipotentialite</span>
              </div>
              <div className="f3 gray mt3" style={{ paddingLeft: '4.5rem' }}>
                Some of us are not built to do one thing forever. We believe in exploring many subjects and it can have
                big advantages if done well. No one should feel incomplete or insecure because they can't seem to stick
                to one calling. See <a target="_blank" href="https://youtu.be/QJORi5VO1F8">Emilie Wapnick's TEDx
                talk to learn more.</a>
              </div>

              <div className="f1 lh-title near-black mt5">
                <Icon type="caret-right" className="mr3 indiblue" />
                <span>Diversity</span>
              </div>
              <div className="f3 gray mt3" style={{ paddingLeft: '4.5rem' }}>
                We strongly believe in the power of diversity - not just in gender or race, but in intellect, culture, and
                personality. We believe that by becoming more inclusive of different perspectives, we not only make the
                world a more pleasant place to live, but become more productive.
              </div>
              {/* end: mission */}

              {/* my story */}
              <h1 className="f-subheadline f-headline-l fw7 lh-title lh-solid-ns near-black mt6">My story</h1>

              <div className="row mt3">
                <div className="col-xs-12 col-md-4">
                  <div className="overflow-hidden mt3" style={{ borderRadius: '15px', transform: 'rotate(-2deg) translateX(-20px)' }}>
                    <img src={`${IMG_URL}/photos/nami.jpg`} style={{ width: '100%' }} />
                  </div>
                </div>
                <div className="col-xs-12 col-md-8">
                  <div className="pl2" style={{ fontSize: '1.75rem', lineHeight: '1.6' }}>
                    <p className="fw5 mt4" style={{ fontSize: '2.3rem' }}>Hi, I’m Nami.</p>
                    <p>Welcome to Sidetrek! I want to share my personal story with you and what Sidetrek means to me.</p>

                    <p>For a long time, the thought that I don’t have one true calling bothered me. Many around me seemed to know exactly what they wanted, following that path no matter what. I had some big changes over the years both in my studies and in career as my interest expanded and my worldview broadened.</p>
                    <p className="fw6">What’s wrong with me? Am I always going to start from scratch while everyone else becomes successful in their chosen path?</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xs-12 col-md-8">
                  <div className="pr2 mt5" style={{ fontSize: '1.75rem', lineHeight: '1.6' }}>
                    <p>Then I stumbled upon a TEDx talk by Emilie Wapnick, “Why some of us don't have one true calling.” According to her, I am a multipotentialite, a person with insatiable curiosity pursuing diverse interests and paths. When the new interest emerges, I learn things quickly and absorb everything related to the subject. I disappear from the world for a while because this kind of intense immersion is so fun.</p>
                  </div>
                </div>
                <div className="col-xs-12 col-md-4">
                  <div className="mt5 overflow-hidden relative" style={{ borderRadius: '10px' }}>
                    <a target="_blank" href="https://youtu.be/QJORi5VO1F8">
                      <img src={`${IMG_URL}/photos/emilie_wapnick_tedx.jpg`} style={{ width: '100%' }} />
                      <Icon className="absolute absolute--fill" type="play-circle" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '60px', top: '30px' }} />
                    </a>
                  </div>
                  <div className="gray f5 i mt2">Emilie Wapnick: “Why some of us don't have one true calling.”</div>
                </div>
              </div>

              <div className="row">
                <div className="col-xs-12">
                  <div className="pr2 mt3" style={{ fontSize: '1.75rem', lineHeight: '1.6' }}>
                    <p>Looking back, being this way helped me achieve many things: </p>

                    <div className="ml3 flex items-start"><Icon type="caret-right" className="mt2 mr3 purple-blue" />I immigrated to Canada alone when I was 24, starting everything from scratch.</div>
                    <div className="ml3 flex items-start"><Icon type="caret-right" className="mt2 mr3 purple-blue" />I left my successful Finance career at Starbucks to explore a new path in tech and startups.</div>
                    <div className="ml3 flex items-start"><Icon type="caret-right" className="mt2 mr3 purple-blue" />I started to learn to code a year ago and built three production-ready apps including Sidetrek!</div>
                    <div className="ml3 flex items-start"><Icon type="caret-right" className="mt2 mr3 purple-blue" />I even lost 30 lbs in 100 days via healthy eating and exercise to gain my health back.</div>

                    <p className="mt4">And the list goes on.</p>
                    <p>In my life, I struggled a lot as an immigrant and a multipotentialite. When I first immigrated to Canada, I stumbled and failed many times adjusting to a completely new environment. As a multipontentialite, I often felt like a misfit in a society where specialization is considered the norm. When I changed my field of study or career, I felt anxious. But I also knew I was having so much fun, accumulating life experiences I would never have had otherwise.  I developed a deep empathy towards people around me because of these rich experiences and personal struggles.</p>
                    <p>I learnt to embrace who I am.</p>
                    <p>If my story resonates with you, Sidetrek is a perfect place for you - we value diversity, creativity, and authenticity here. Find your new passion, achieve new learning goals, and explore new paths.</p>
                    <p className="fw6">Being sidetracked (or sidetreked 😉) is not a distraction. It's the beginning of a new journey and a door to endless possibilities!</p>
                    <p>With <Icon type="heart" theme="twoTone" twoToneColor="#FF4136" />,</p>
                    <p>Nami, <i>Co-founder</i></p>
                    <div className="mt3"><img src={`${IMG_URL}/signatures/nami_signature.jpg`} style={{ width: '120px' }} /></div>
                  </div>
                </div>
              </div>
              {/* end: my story */}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage