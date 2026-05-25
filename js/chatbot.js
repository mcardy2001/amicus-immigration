/* ==========================================================================
   Amie — Amicus Immigration AI assistant
   Pure client-side intent-matching chatbot. No API keys, no backend.

   To upgrade to a real LLM-backed assistant later (Chatbase, Voiceflow,
   custom Anthropic/OpenAI integration via a serverless function), replace
   the `getReply()` function with an async fetch to your endpoint and keep
   the rest of the UI as-is.
   ========================================================================== */
(function () {
  'use strict';

  // ---- Knowledge base: intents, responses, follow-ups ---------------------

  const INTENTS = [
    {
      id: 'cost',
      patterns: [/\bcost/i, /\bfee/i, /\bprice/i, /\bhow much/i, /\bafford/i, /\bcharge/i, /\bquote/i, /\bcheap/i, /\bexpensive/i],
      reply: "Our fees are quoted up front for your whole file — no surprises and no drip pricing. The exact amount depends on your program, family size and document situation, but our pricing is deliberately among the most economical in the GTA. Government fees (IRCC, biometrics, language tests) are separate and we'll explain those clearly. Want a personalised quote?",
      followups: ['Get a personalised quote', 'How long does it take?', 'Do I need a job offer?']
    },
    {
      id: 'time',
      patterns: [/\bhow long/i, /\btimeline/i, /\bhow many.*month/i, /\bhow many.*year/i, /\bwait/i, /\bquick/i, /\bfast/i, /\bwhen.*can/i, /\bprocess.*take/i],
      reply: "Timelines vary a lot. A straightforward LMIA-supported work permit might be ready in 3–6 months from start to landing. PR pathways usually take 6 to 24 months depending on the program and your country of residence. We'll give you a realistic timeline on the first call.",
      followups: ["What's an LMIA?", 'How much does it cost?', 'Talk to a real person']
    },
    {
      id: 'job-offer',
      patterns: [/\bjob offer/i, /\bneed.*job/i, /\bno job/i, /\bwithout.*job/i, /\bexpress entry/i, /\boffer.*letter/i],
      reply: "Not always. Express Entry can succeed without a job offer if your CRS score is high enough. But for trades, hospitality and food service roles, the most reliable path is a Canadian employer's LMIA-supported job offer plus a closed work permit. We can help match you with employers in our network.",
      followups: ['What jobs are available?', 'How much does it cost?', 'Construction jobs']
    },
    {
      id: 'family',
      patterns: [/\bfamily/i, /\bspouse/i, /\bwife/i, /\bhusband/i, /\bchildren/i, /\bkids/i, /\bpartner/i, /\bbring.*with me/i, /\bdependant/i, /\bdependent/i],
      reply: "In most cases, yes — your family can come with you. Spouses and dependent children typically accompany the principal worker. Spouses of skilled workers and many international students are also eligible for open work permits, and your kids can attend public school. We help you put the whole family on the right paperwork.",
      followups: ['Can I sponsor my parents?', 'How much does it cost?', 'Speak to a consultant']
    },
    {
      id: 'sponsor',
      patterns: [/\bsponsor/i, /\bbring.*parent/i, /\bparent.*sponsor/i, /\bgrandparent/i, /\bfamily.*sponsorship/i],
      reply: "Yes — once you're a permanent resident, you can sponsor your spouse, dependent children, parents and grandparents. We handle the whole sponsorship application. Parent and grandparent sponsorship has annual intake limits, so timing matters.",
      followups: ['How long does it take?', 'How much does it cost?', 'Speak to a consultant']
    },
    {
      id: 'province',
      patterns: [/\bprovince/i, /\bwhich.*province/i, /\bwhere.*live/i, /\balberta/i, /\bontario/i, /\bquebec/i, /\bbc\b/i, /\bbritish columbia/i, /\bsaskatchewan/i, /\bmanitoba/i, /\batlantic/i, /\btoronto/i, /\bhalifax/i, /\bwinnipeg/i, /\bcalgary/i, /\bvancouver/i, /\bmontreal/i],
      reply: "Honest answer: the right province is the one where the right job, the right community and the right cost of living line up for your family. We work in all ten provinces and three territories. Atlantic Canada and the Prairies often have the friendliest PR pathways and lower cost of living. The GTA and Vancouver have the most jobs but the highest costs.",
      followups: ['Atlantic Immigration Program', 'What jobs are available?', 'Speak with someone']
    },
    {
      id: 'language',
      patterns: [/\blanguage/i, /\benglish/i, /\bfrench/i, /\bielts/i, /\bcelpip/i, /\btef\b/i, /\bspeak/i, /\blanguage test/i],
      reply: "For most economic immigration programs, you'll need to demonstrate language ability through an approved test (IELTS, CELPIP, or TEF for French). The minimum score depends on the program. We'll tell you exactly what to aim for and how to prepare.",
      followups: ['How much does it cost?', 'What jobs are available?', 'Book a consultation']
    },
    {
      id: 'credentials',
      patterns: [/\bcredential/i, /\bqualification/i, /\beca\b/i, /\bdegree/i, /\btrade.*certif/i, /\blicen/i, /\brecogn/i, /\bforeign.*qual/i, /\beducation.*assess/i],
      reply: "For many trades and licensed professions, foreign credentials are recognized — but the process varies by province and trade. We help you understand what credential assessment (ECA) or certification steps you'll need, ideally before you arrive so you can hit the ground running.",
      followups: ['What jobs are available?', 'Which province?', 'Talk to a consultant']
    },
    {
      id: 'jobs-construction',
      patterns: [/\bconstruction/i, /\btrade/i, /\bcarpenter/i, /\belectrician/i, /\bplumber/i, /\bwelder/i, /\bironworker/i, /\blabour/i, /\blabor/i, /\bheavy equip/i, /\bcrane/i, /\bmason/i],
      reply: "Canada is in a multi-decade construction boom. We place carpenters, framers, electricians, plumbers, welders, ironworkers, heavy equipment operators, masons and general construction labourers with reputable Canadian builders. Demand is especially strong in Ontario, Alberta and BC.",
      followups: ['How do I apply?', 'What does it cost?', 'Speak with someone']
    },
    {
      id: 'jobs-hospitality',
      patterns: [/\bhotel/i, /\bhospitality/i, /\bresort/i, /\bhousekeep/i, /\bfront desk/i, /\bbanquet/i, /\bbarten/i, /\bconcierge/i],
      reply: "We work with hotels and resorts across Canada — placing housekeepers, front desk agents, food & beverage staff, hotel cooks, banquet servers, maintenance crew and supervisors. Demand is strongest in mountain resorts (BC/AB), Atlantic Canada and city-centre hotels.",
      followups: ['What does it cost?', 'How do I apply?', 'Speak with a consultant']
    },
    {
      id: 'jobs-food',
      patterns: [/\brestaurant/i, /\bfast food/i, /\bfood service/i, /\bcook\b/i, /\bkitchen/i, /\bserver\b/i, /\bchef/i, /\bbaker/i, /\bdishwash/i, /\bline cook/i, /\bquick service/i],
      reply: "Quick-service chains, family restaurants and fine-dining kitchens across Canada all need international workers. We place line cooks, prep cooks, kitchen helpers, bakers, servers, hosts, shift supervisors and assistant managers.",
      followups: ['What does it cost?', 'How do I apply?', 'Construction jobs']
    },
    {
      id: 'jobs-other',
      patterns: [/\btruck/i, /\bdriver/i, /\bwarehouse/i, /\blogistic/i, /\bforklift/i, /\bcaregiv/i, /\bpsw/i, /\bpersonal support/i, /\bchild care/i, /\bnann/i],
      reply: "Beyond construction and hospitality, we also place long-haul drivers, warehouse associates, forklift operators, dispatch staff, personal support workers, and home child-care providers (through the Home Care Worker Immigration Pilots).",
      followups: ['What does it cost?', 'How do I apply?', 'Speak with someone']
    },
    {
      id: 'after-arrival',
      patterns: [/\bafter.*arriv/i, /\bsettle/i, /\bsin\b/i, /\bhealth card/i, /\bfirst day/i, /\bonce.*there/i, /\bonce.*arrived/i, /\bonce.*land/i, /\bsettle in/i],
      reply: "We don't disappear after the visa. We help you with practical things like SIN, health card, banking and connecting you with settlement organizations in your region. Many of our clients come back later to sponsor family — we're here for that too.",
      followups: ['How much does it cost?', 'Speak to a consultant', 'Sponsor family']
    },
    {
      id: 'licensed',
      patterns: [/\blicens/i, /\brcic/i, /\bcicc/i, /\bregul/i, /\btrustworthy/i, /\bscam/i, /\blegit/i, /\bauthori[sz]ed/i, /\baccredit/i, /\bcollege of immigration/i],
      reply: "Yes. Dan Engineer is a Registered Canadian Immigration Consultant (RCIC). Amicus is authorized to represent clients under Canadian immigration regulations through the College of Immigration and Citizenship Consultants (CICC). You can verify any consultant's license at college-ic.ca.",
      followups: ['How much does it cost?', 'Book a consultation', 'About Dan']
    },
    {
      id: 'employer',
      patterns: [/\bemployer/i, /\bhiring/i, /\bi.* hire/i, /\bwe.*hire/i, /\blmia\b/i, /\bworkforce/i, /\brecruit/i, /\bbusiness owner/i, /\bcompany/i, /\bstaffing/i],
      reply: "If you're a Canadian employer, we handle the full LMIA preparation, recruitment compliance and worker selection. We have a roster of pre-vetted candidates across construction, hospitality and food service ready for the right roles. Want to discuss your hiring needs?",
      followups: ['LMIA process', 'Speak to Dan', 'Costs for employers']
    },
    {
      id: 'lmia',
      patterns: [/\blmia\b/i, /\blabour market/i, /\blabor market/i, /\bwhat.*lmia/i],
      reply: "LMIA stands for Labour Market Impact Assessment. It's a document Canadian employers need from ESDC before they can hire most foreign workers. It proves no qualified Canadian was available to fill the role. We prepare the entire LMIA for the employer side, then handle the worker's permit application.",
      followups: ['How long does an LMIA take?', 'What does it cost?', 'Speak to a consultant']
    },
    {
      id: 'about-dan',
      patterns: [/\bwho.*dan/i, /\bwho.*dinshaw/i, /\babout.*founder/i, /\babout.*owner/i, /\bexperience/i, /\bhow long.*amicus/i, /\bsince when/i, /\bestablished/i, /\bfounded/i],
      reply: "Dan Engineer (also known as Dinshaw) founded Amicus in 2008. He's a Registered Canadian Immigration Consultant (RCIC) with deep experience helping foreign workers and families navigate the Canadian system. Clients describe him as patient, honest and reasonably priced. There's a public LinkedIn recommendation from Stephanie Duchesne on our home page.",
      followups: ["Read Stephanie's testimonial", 'Book a call with Dan', 'What does it cost?']
    },
    {
      id: 'free-consult',
      patterns: [/\bfree.*consult/i, /\bbook.*consult/i, /\bschedule.*call/i, /\bmeet.*you/i, /\bappointment/i, /\bspeak.*dan/i, /\btalk.*dan/i],
      reply: "Absolutely — the first consultation is free and there's no obligation. You can call (519) 476-0734, message us on WhatsApp, or use the contact form to book a video call. What works best for you?",
      followups: ['Call now', 'Open WhatsApp', 'Book a video call']
    },
    {
      id: 'human',
      patterns: [/\bhuman/i, /\breal person/i, /\bperson\b/i, /\btalk.*someone/i, /\bspeak.*someone/i, /\bagent\b/i, /\bconsultant\b/i, /\bwant.*talk/i, /\bcall.*me/i],
      reply: "Of course — here are three ways to reach a real person right now. Pick what works for your device:",
      followups: ['Call now', 'Open WhatsApp', 'Book a video call']
    },
    {
      id: 'greeting',
      patterns: [/^\s*hi\s*$/i, /^\s*hello\b/i, /^\s*hey\b/i, /\bgood morning/i, /\bgood afternoon/i, /\bgood evening/i, /^\s*thanks?/i, /^\s*thank you/i, /^\s*ok\b/i],
      reply: "Hi there! I'm Amie, Amicus's AI assistant. I can answer common questions about immigrating to Canada for work — costs, timelines, which jobs and pathways might fit you, and what to expect. What would you like to know?",
      followups: ['How much does it cost?', 'How long does it take?', 'What jobs are available?']
    }
  ];

  const GREETING = {
    reply: "Hi! I'm Amie, Amicus's AI assistant. I can answer common questions about immigrating to Canada — costs, timelines, which jobs and pathways might fit, what to expect. Ask me anything, or pick one of the suggestions below. For anything I can't answer, I'll connect you with a real consultant.",
    followups: ['How much does it cost?', 'How long does it take?', 'Do I need a job offer?', 'What jobs are available?']
  };

  const FALLBACK = {
    reply: "I want to make sure you get the right answer — could you rephrase that, or would you like to talk to one of our human consultants? They're available now.",
    followups: ['Call now', 'Open WhatsApp', 'Book a video call', 'Try a different question']
  };

  // Map suggested-chip labels to special actions (otherwise treated as user input)
  const CHIP_ACTIONS = {
    'Call now':              { type: 'href', value: 'tel:+15194760734' },
    'Open WhatsApp':         { type: 'href', value: 'https://wa.me/15194760734?text=Hi%20Amicus%2C%20I%27d%20like%20to%20talk%20about%20immigrating%20to%20Canada.', target: '_blank' },
    'Book a video call':     { type: 'href', value: 'contact.html' },
    'Book a call with Dan':  { type: 'href', value: 'contact.html' },
    'Book a consultation':   { type: 'href', value: 'contact.html' },
    'Speak to a consultant': { type: 'href', value: 'contact.html' },
    'Speak with a consultant': { type: 'href', value: 'contact.html' },
    'Speak with someone':    { type: 'href', value: 'contact.html' },
    'Speak to Dan':          { type: 'href', value: 'contact.html' },
    'Talk to a real person': { type: 'scroll', value: '.talk-options' },
    'Read Stephanie\'s testimonial': { type: 'scroll', value: '.quote--featured' },
    'Get a personalised quote': { type: 'href', value: 'contact.html' },
    'Costs for employers':   { type: 'href', value: 'contact.html' },
    'About Dan':             { type: 'href', value: 'about.html' },
    'Try a different question': { type: 'focus', value: null }
  };

  // ---- Intent matcher -----------------------------------------------------

  function getReply(userText) {
    const text = userText.trim();
    if (!text) return FALLBACK;
    let bestMatch = null;
    let bestScore = 0;
    for (const intent of INTENTS) {
      let score = 0;
      for (const pattern of intent.patterns) {
        if (pattern.test(text)) score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = intent;
      }
    }
    return bestMatch || FALLBACK;
  }

  // ---- UI -----------------------------------------------------------------

  function init() {
    const root = document.getElementById('ai-chat');
    if (!root) return;

    const startBtn = document.querySelector('[data-chat-start]');
    const closeBtn = root.querySelector('[data-chat-close]');
    const body = root.querySelector('.ai-chat-body');
    const suggestionsEl = root.querySelector('.ai-chat-suggestions');
    const form = root.querySelector('.ai-chat-form');
    const input = form.querySelector('input[type="text"]');

    let opened = false;

    startBtn.addEventListener('click', () => {
      openChat();
    });
    closeBtn.addEventListener('click', () => {
      root.hidden = true;
      startBtn.focus();
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      handleUserMessage(text);
    });

    function openChat() {
      root.hidden = false;
      root.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (!opened) {
        opened = true;
        // Initial greeting after a brief moment so it feels alive
        addBotMessage(GREETING.reply, GREETING.followups);
      }
      setTimeout(() => input.focus(), 350);
    }

    function handleUserMessage(text) {
      addUserMessage(text);
      showTyping();
      const reply = getReply(text);
      // Brief artificial delay so it doesn't feel jarringly instant
      setTimeout(() => {
        hideTyping();
        addBotMessage(reply.reply, reply.followups);
      }, 550 + Math.random() * 350);
    }

    function addUserMessage(text) {
      const el = document.createElement('div');
      el.className = 'ai-chat-msg ai-chat-msg--user';
      el.innerHTML = '<div class="ai-chat-bubble"></div>';
      el.querySelector('.ai-chat-bubble').textContent = text;
      body.appendChild(el);
      scrollBody();
      clearSuggestions();
    }

    function addBotMessage(text, followups) {
      const el = document.createElement('div');
      el.className = 'ai-chat-msg ai-chat-msg--bot';
      el.innerHTML = '<div class="ai-chat-avatar-sm" aria-hidden="true">A</div><div class="ai-chat-bubble"></div>';
      el.querySelector('.ai-chat-bubble').textContent = text;
      body.appendChild(el);
      scrollBody();
      if (followups && followups.length) {
        renderSuggestions(followups);
      } else {
        clearSuggestions();
      }
    }

    function showTyping() {
      hideTyping();
      const el = document.createElement('div');
      el.className = 'ai-chat-msg ai-chat-msg--bot ai-chat-typing';
      el.id = 'ai-chat-typing';
      el.innerHTML = '<div class="ai-chat-avatar-sm" aria-hidden="true">A</div><div class="ai-chat-bubble"><span></span><span></span><span></span></div>';
      body.appendChild(el);
      scrollBody();
    }
    function hideTyping() {
      const t = document.getElementById('ai-chat-typing');
      if (t) t.remove();
    }

    function renderSuggestions(chips) {
      suggestionsEl.innerHTML = '';
      chips.forEach((label) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ai-chat-chip';
        btn.textContent = label;
        btn.addEventListener('click', () => handleChip(label));
        suggestionsEl.appendChild(btn);
      });
    }
    function clearSuggestions() {
      suggestionsEl.innerHTML = '';
    }

    function handleChip(label) {
      const action = CHIP_ACTIONS[label];
      if (action) {
        if (action.type === 'href') {
          if (action.target === '_blank') {
            window.open(action.value, '_blank', 'noopener');
          } else {
            window.location.href = action.value;
          }
          return;
        }
        if (action.type === 'scroll') {
          const target = document.querySelector(action.value);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        if (action.type === 'focus') {
          input.focus();
          return;
        }
      }
      // Otherwise treat the chip as a typed question
      handleUserMessage(label);
    }

    function scrollBody() {
      requestAnimationFrame(() => {
        body.scrollTop = body.scrollHeight;
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
