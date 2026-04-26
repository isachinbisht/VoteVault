import { AppDataSource } from "./data-source";
import { Election } from "./entity/Election";
import { Candidate } from "./entity/Candidate";
import { Policy } from "./entity/Policy";

const seed = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Data Source initialized. Starting seed...");

        const electionRepo = AppDataSource.getRepository(Election);
        const candidateRepo = AppDataSource.getRepository(Candidate);
        const policyRepo = AppDataSource.getRepository(Policy);

        // ─────────────────────────────────────────────
        // ELECTION 1: Lok Sabha 2024 (18th General Election)
        // ─────────────────────────────────────────────
        const e2024 = electionRepo.create({
            name: "Lok Sabha General Election 2024",
            region: "Republic of India",
            election_date: new Date("2024-06-04"),
            description: "The 18th Lok Sabha election held in 7 phases from April 19 to June 1, 2024. NDA won with 293 seats, INDIA bloc secured 234 seats. Narendra Modi sworn in as PM for a third term.",
            candidate_count: 8439,
            total_seats: 543,
            year: 2024,
            election_type: "Lok Sabha",
            winning_party: "Bharatiya Janata Party (BJP) / NDA",
            winning_seats: 293,
            winning_pm: "Narendra Modi (3rd term)"
        });
        await electionRepo.save(e2024);

        const c2024_bjp = candidateRepo.create({
            election: e2024, name: "Narendra Modi / BJP-NDA", party: "Bharatiya Janata Party (BJP)",
            bio: "Incumbent PM since 2014. Led NDA to a third consecutive term though with a reduced majority, now relying on coalition partners TDP and JDU.",
            color_hex: "#FF6B00", manifesto_text: "Viksit Bharat 2047 vision — making India a developed nation by its centenary. Focus on infrastructure (PM GatiShakti), digital India, semiconductor manufacturing, and welfare via DBT.",
            seats_won: 240, vote_share: 36.6, symbol_emoji: "🪷", alliance: "NDA"
        });

        const c2024_inc = candidateRepo.create({
            election: e2024, name: "Rahul Gandhi / INC-INDIA", party: "Indian National Congress (INC)",
            bio: "Led the INDIA alliance opposition. INC bounced back from 2019 lows, winning 99 seats — its best since 2009.",
            color_hex: "#19AADE", manifesto_text: "Nyay Patra manifesto — 25 guarantees including legal right to apprenticeship, caste census, restoring OBC reservations, farm loan waiver, and 50% reservation cap removal.",
            seats_won: 99, vote_share: 21.2, symbol_emoji: "✋", alliance: "INDIA"
        });

        const c2024_sp = candidateRepo.create({
            election: e2024, name: "Akhilesh Yadav / SP", party: "Samajwadi Party (SP)",
            bio: "Won 37 seats in UP, making SP the biggest winner in Uttar Pradesh. Key INDIA bloc partner.",
            color_hex: "#E31E24", manifesto_text: "PDA (Pichda, Dalit, Alpsankhyak) coalition — OBC reservations, caste census, restoration of constitution, relief for farmers and youth employment.",
            seats_won: 37, vote_share: 6.2, symbol_emoji: "🚲", alliance: "INDIA"
        });

        const c2024_tmc = candidateRepo.create({
            election: e2024, name: "Mamata Banerjee / TMC", party: "All India Trinamool Congress (TMC)",
            bio: "TMC swept West Bengal, winning 29 of 42 seats. Stayed independent of the INDIA alliance formally.",
            color_hex: "#45A29E", manifesto_text: "Maa Mati Manush agenda — welfare schemes for women (Lakshmir Bhandar), farmers, and rural development in Bengal.",
            seats_won: 29, vote_share: 5.5, symbol_emoji: "🌸", alliance: "INDIA"
        });

        const c2024_nota = candidateRepo.create({
            election: e2024, name: "NOTA", party: "None of the Above",
            bio: "Press this button if you do not wish to vote for any of the listed candidates.",
            color_hex: "#6B7280", manifesto_text: "",
            seats_won: 0, vote_share: 0.99, symbol_emoji: "🚫", alliance: ""
        });

        await candidateRepo.save([c2024_bjp, c2024_inc, c2024_sp, c2024_tmc, c2024_nota]);

        // Policies for 2024
        const policies2024 = [
            { candidate: c2024_bjp, category: "Economy", title: "Viksit Bharat 2047", description: "Blueprint to make India a developed, $35 trillion economy by the 100th year of Independence through manufacturing, exports and digital services.", impact_score: 9 },
            { candidate: c2024_bjp, category: "Infrastructure", title: "PM GatiShakti 2.0", description: "Multi-modal connectivity master plan — 100 new airports, 25,000 km highways, 50,000 km optical fiber. Reduce logistics costs from 14% to 8% of GDP.", impact_score: 9 },
            { candidate: c2024_bjp, category: "Technology", title: "Semiconductor Mission", description: "₹76,000 crore incentive to build three semiconductor fabs in India by 2027, reducing chip import dependence.", impact_score: 8 },
            { candidate: c2024_inc, category: "Welfare", title: "Right to Apprenticeship", description: "Legally guarantee one-year apprenticeship to every diploma/degree holder with ₹1 lakh stipend from companies, backed by government.", impact_score: 9 },
            { candidate: c2024_inc, category: "Social Justice", title: "Caste Census", description: "Conduct a comprehensive caste census and use data to revise OBC reservation quotas, including removing the 50% cap via constitutional amendment.", impact_score: 8 },
            { candidate: c2024_sp, category: "Employment", title: "PDA Youth Fund", description: "Create 2 million government jobs for OBC, Dalit and minority youth annually with priority in police and administrative services.", impact_score: 8 },
        ];
        for (const p of policies2024) {
            await policyRepo.save(policyRepo.create(p));
        }

        // ─────────────────────────────────────────────
        // ELECTION 2: Lok Sabha 2019 (17th General Election)
        // ─────────────────────────────────────────────
        const e2019 = electionRepo.create({
            name: "Lok Sabha General Election 2019",
            region: "Republic of India",
            election_date: new Date("2019-05-23"),
            description: "The 17th Lok Sabha election — a landmark victory for BJP with 303 seats, the largest mandate since Rajiv Gandhi's 1984 win. NDA won 353 total seats. INC reduced to 52 seats.",
            candidate_count: 8054,
            total_seats: 543,
            year: 2019,
            election_type: "Lok Sabha",
            winning_party: "Bharatiya Janata Party (BJP) / NDA",
            winning_seats: 353,
            winning_pm: "Narendra Modi (2nd term)"
        });
        await electionRepo.save(e2019);

        const c2019_bjp = candidateRepo.create({
            election: e2019, name: "Narendra Modi / BJP-NDA", party: "Bharatiya Janata Party (BJP)",
            bio: "Campaigned on national security (Balakot airstrikes), Pulwama response, and welfare schemes. Won historic second majority.",
            color_hex: "#FF6B00", manifesto_text: "Sankalp Patra: Article 370 abrogation, NRC implementation, Ayushman Bharat health scheme, PM-KISAN, Ujjwala Yojana, and Make in India 2.0.",
            seats_won: 303, vote_share: 37.4, symbol_emoji: "🪷", alliance: "NDA"
        });

        const c2019_inc = candidateRepo.create({
            election: e2019, name: "Rahul Gandhi / INC-UPA", party: "Indian National Congress (INC)",
            bio: "Led Congress in its worst-ever performance — reduced to 52 seats. Rahul Gandhi lost from Amethi, retained Wayanad.",
            color_hex: "#19AADE", manifesto_text: "NYAY scheme — ₹72,000/year minimum income to 5 crore families. Farm loan waiver within 10 days, separate Kisan Budget, MGNREGS expansion.",
            seats_won: 52, vote_share: 19.5, symbol_emoji: "✋", alliance: "UPA"
        });

        const c2019_bsp_sp = candidateRepo.create({
            election: e2019, name: "Mayawati-Akhilesh / SP-BSP-RLD", party: "SP-BSP Gathbandhan",
            bio: "Historic Yadav-Dalit alliance in UP. Won only 15 seats combined despite 43% UP vote share — victim of FPTP system.",
            color_hex: "#1A6BC1", manifesto_text: "Reservation protection, caste census, repeal of demonetization damage, loan waiver for farmers, minimum support price guarantee.",
            seats_won: 15, vote_share: 7.4, symbol_emoji: "🐘", alliance: "Gathbandhan"
        });

        const c2019_tmc = candidateRepo.create({
            election: e2019, name: "Mamata Banerjee / TMC", party: "All India Trinamool Congress (TMC)",
            bio: "Won 22 seats in Bengal despite losing ground to BJP. Refused to join any national opposition alliance.",
            color_hex: "#45A29E", manifesto_text: "Ma-Mati-Manush: Kanyashree scholarship, Sabuj Sathi cycle scheme, Swasthya Sathi health insurance for all Bengali families.",
            seats_won: 22, vote_share: 4.1, symbol_emoji: "🌸", alliance: ""
        });

        const c2019_nota = candidateRepo.create({
            election: e2019, name: "NOTA", party: "None of the Above",
            bio: "Press this button if you do not wish to vote for any of the listed candidates.",
            color_hex: "#6B7280", manifesto_text: "",
            seats_won: 0, vote_share: 1.06, symbol_emoji: "🚫", alliance: ""
        });

        await candidateRepo.save([c2019_bjp, c2019_inc, c2019_bsp_sp, c2019_tmc, c2019_nota]);

        // ─────────────────────────────────────────────
        // ELECTION 3: Lok Sabha 2014 (16th General Election)
        // ─────────────────────────────────────────────
        const e2014 = electionRepo.create({
            name: "Lok Sabha General Election 2014",
            region: "Republic of India",
            election_date: new Date("2014-05-16"),
            description: "The 16th Lok Sabha election that swept Modi to power. BJP won its first-ever outright majority (282 seats). UPA suffered crushing defeat amid corruption scandals. AAP made its Lok Sabha debut.",
            candidate_count: 8251,
            total_seats: 543,
            year: 2014,
            election_type: "Lok Sabha",
            winning_party: "Bharatiya Janata Party (BJP) / NDA",
            winning_seats: 336,
            winning_pm: "Narendra Modi (1st term)"
        });
        await electionRepo.save(e2014);

        const c2014_bjp = candidateRepo.create({
            election: e2014, name: "Narendra Modi / BJP-NDA", party: "Bharatiya Janata Party (BJP)",
            bio: "Rode anti-incumbency wave against UPA's corruption and inflation. 'Gujarat model of development' campaign. First PM to win outright majority since 1984.",
            color_hex: "#FF6B00", manifesto_text: "Make in India, Swachh Bharat, Smart Cities, JAM Trinity (Jan Dhan-Aadhaar-Mobile), OROP for veterans, scrapping Planning Commission for NITI Aayog.",
            seats_won: 282, vote_share: 31.0, symbol_emoji: "🪷", alliance: "NDA"
        });

        const c2014_inc = candidateRepo.create({
            election: e2014, name: "Rahul Gandhi / INC-UPA", party: "Indian National Congress (INC)",
            bio: "Led UPA to historic defeat — INC won only 44 seats, lowest ever. Anti-incumbency from 2G, Coal, Commonwealth scams decimated Congress.",
            color_hex: "#19AADE", manifesto_text: "Food Security Act implementation, MGNREGS expansion, Right to Education, Right to Fair Compensation (Land Acquisition Act), women safety.",
            seats_won: 44, vote_share: 19.3, symbol_emoji: "✋", alliance: "UPA"
        });

        const c2014_aap = candidateRepo.create({
            election: e2014, name: "Arvind Kejriwal / AAP", party: "Aam Aadmi Party (AAP)",
            bio: "AAP's Lok Sabha debut — won only 4 seats (all in Punjab). Kejriwal lost from Varanasi to Modi. Refocused on Delhi thereafter.",
            color_hex: "#00B4D8", manifesto_text: "Jan Lokpal Bill, end to corruption, anti-dynastic politics, pro-aam aadmi governance, free water and electricity for common people.",
            seats_won: 4, vote_share: 2.1, symbol_emoji: "🧹", alliance: ""
        });

        const c2014_sp = candidateRepo.create({
            election: e2014, name: "Mulayam Singh Yadav / SP", party: "Samajwadi Party (SP)",
            bio: "Won 5 seats despite being ruling party of UP. UP voters largely shifted to BJP in wave election.",
            color_hex: "#E31E24", manifesto_text: "OBC reservation protection, Kisan-friendly policies, free laptops for students, Lohia-inspired socialism, secularism.",
            seats_won: 5, vote_share: 3.4, symbol_emoji: "🚲", alliance: ""
        });

        const c2014_nota = candidateRepo.create({
            election: e2014, name: "NOTA", party: "None of the Above",
            bio: "NOTA was introduced for the first time in India in the 2014 Lok Sabha election by the Supreme Court's order.",
            color_hex: "#6B7280", manifesto_text: "First year NOTA was available on Indian EVMs.",
            seats_won: 0, vote_share: 1.1, symbol_emoji: "🚫", alliance: ""
        });

        await candidateRepo.save([c2014_bjp, c2014_inc, c2014_aap, c2014_sp, c2014_nota]);

        // ─────────────────────────────────────────────
        // ELECTION 4: Lok Sabha 2009 (15th General Election)
        // ─────────────────────────────────────────────
        const e2009 = electionRepo.create({
            name: "Lok Sabha General Election 2009",
            region: "Republic of India",
            election_date: new Date("2009-05-16"),
            description: "The 15th Lok Sabha election. INC-led UPA won 262 seats, its best since 1991. Manmohan Singh became the first PM since Nehru to be re-elected to a second consecutive term. BJP won 116 seats.",
            candidate_count: 7810,
            total_seats: 543,
            year: 2009,
            election_type: "Lok Sabha",
            winning_party: "Indian National Congress (INC) / UPA",
            winning_seats: 262,
            winning_pm: "Manmohan Singh (2nd term)"
        });
        await electionRepo.save(e2009);

        const c2009_inc = candidateRepo.create({
            election: e2009, name: "Manmohan Singh / INC-UPA", party: "Indian National Congress (INC)",
            bio: "Swept to second term on economic stability, MGNREGS welfare, nuclear deal success, and rural programmes. INC won 206 seats on its own.",
            color_hex: "#19AADE", manifesto_text: "MGNREGS — 100 days guaranteed rural employment. RTI Act, Right to Education, Aadhaar launch, nuclear deal, inclusive growth and minorities welfare.",
            seats_won: 206, vote_share: 28.6, symbol_emoji: "✋", alliance: "UPA"
        });

        const c2009_bjp = candidateRepo.create({
            election: e2009, name: "L.K. Advani / BJP-NDA", party: "Bharatiya Janata Party (BJP)",
            bio: "Led BJP as PM candidate but lost to Manmohan Singh. BJP won 116 seats — poor performance after Vajpayee era.",
            color_hex: "#FF6B00", manifesto_text: "Ram Mandir, strong anti-terrorism stance (26/11 happened during campaign), economic reforms, Uniform Civil Code, strong defence policy.",
            seats_won: 116, vote_share: 18.8, symbol_emoji: "🪷", alliance: "NDA"
        });

        const c2009_sp = candidateRepo.create({
            election: e2009, name: "Mulayam Singh Yadav / SP", party: "Samajwadi Party (SP)",
            bio: "Won 23 seats in UP. Provided outside support to UPA-2 government.",
            color_hex: "#E31E24", manifesto_text: "OBC empowerment, minority welfare, anti-communalism, farmer debt waiver, opposition to nuclear deal.",
            seats_won: 23, vote_share: 3.2, symbol_emoji: "🚲", alliance: ""
        });

        const c2009_bsp = candidateRepo.create({
            election: e2009, name: "Mayawati / BSP", party: "Bahujan Samaj Party (BSP)",
            bio: "Won 21 seats nationally. Mayawati was aspirational 'PM candidate' — first Dalit woman to seriously contest for PM.",
            color_hex: "#1A6BC1", manifesto_text: "Dalit-Bahujan empowerment, strict implementation of SC/ST Atrocities Act, land redistribution, education for OBC and SC communities.",
            seats_won: 21, vote_share: 6.2, symbol_emoji: "🐘", alliance: ""
        });

        const c2009_cpim = candidateRepo.create({
            election: e2009, name: "Prakash Karat / Left Front", party: "Communist Party of India (Marxist)",
            bio: "Left Front fell from 59 to 24 seats, losing Kerala and Bengal ground. Had withdrawn support from UPA-1 over nuclear deal.",
            color_hex: "#CC0000", manifesto_text: "Anti-nuclear deal, pro-farmer land reform, workers rights, nationalization of natural resources, free public healthcare and education.",
            seats_won: 24, vote_share: 7.4, symbol_emoji: "☭", alliance: "Left"
        });

        await candidateRepo.save([c2009_inc, c2009_bjp, c2009_sp, c2009_bsp, c2009_cpim]);

        // ─────────────────────────────────────────────
        // ELECTION 5: Simulated 2026 Lok Sabha (Practice)
        // ─────────────────────────────────────────────
        const e2026 = electionRepo.create({
            name: "Lok Sabha Practice Election 2026",
            region: "Republic of India",
            election_date: new Date("2026-05-15"),
            description: "Simulated practice election for VoteVault. Practice casting your vote before the real thing — choose from India's major political parties.",
            candidate_count: 3,
            total_seats: 543,
            year: 2026,
            election_type: "Lok Sabha",
            winning_party: "",
            winning_seats: 0,
            winning_pm: "TBD"
        });
        await electionRepo.save(e2026);

        const c2026_bjp = candidateRepo.create({
            election: e2026, name: "Narendra Modi", party: "Bharatiya Janata Party (BJP)",
            bio: "Current Prime Minister. Third-term incumbent, leading the NDA coalition government.",
            color_hex: "#FF6B00", manifesto_text: "Viksit Bharat 2047, semiconductor self-reliance, clean energy transition, defence indigenisation, and social welfare for 80 crore beneficiaries.",
            seats_won: 0, vote_share: 0, symbol_emoji: "🪷", alliance: "NDA"
        });

        const c2026_inc = candidateRepo.create({
            election: e2026, name: "Rahul Gandhi", party: "Indian National Congress (INC)",
            bio: "Leader of Opposition in Lok Sabha. Leading INDIA alliance for 2026 elections.",
            color_hex: "#19AADE", manifesto_text: "Caste census, legal right to employment, rolling back privatisation, restoring jobs in railways and defence, 50% women reservation.",
            seats_won: 0, vote_share: 0, symbol_emoji: "✋", alliance: "INDIA"
        });

        const c2026_aap = candidateRepo.create({
            election: e2026, name: "Arvind Kejriwal", party: "Aam Aadmi Party (AAP)",
            bio: "National convenor of AAP. Promising to expand Delhi's free electricity and education models nationally.",
            color_hex: "#00B4D8", manifesto_text: "Free 300 units electricity, Mohalla Clinics across India, complete school fee waiver in government schools, robust anti-corruption ombudsman.",
            seats_won: 0, vote_share: 0, symbol_emoji: "🧹", alliance: "INDIA"
        });

        const c2026_nota = candidateRepo.create({
            election: e2026, name: "NOTA", party: "None of the Above",
            bio: "Press this button if you do not wish to vote for any of the listed candidates. NOTA votes are counted but do not contribute to any party's seat count.",
            color_hex: "#6B7280", manifesto_text: "",
            seats_won: 0, vote_share: 0, symbol_emoji: "🚫", alliance: ""
        });

        await candidateRepo.save([c2026_bjp, c2026_inc, c2026_aap, c2026_nota]);

        // Policies for 2026 practice election
        const policies2026 = [
            { candidate: c2026_bjp, category: "Infrastructure", title: "Gati Shakti Master Plan", description: "Integrate all modes of transport to reduce logistics costs from 14% to 8% of GDP and boost manufacturing exports.", impact_score: 9 },
            { candidate: c2026_bjp, category: "Economy", title: "Atmanirbhar Bharat 3.0", description: "Promote local semiconductor, green energy, and defence manufacturing with ₹2 lakh crore PLI schemes.", impact_score: 8 },
            { candidate: c2026_inc, category: "Welfare", title: "NYAY 2.0 — Right to Income", description: "Guaranteed minimum income of ₹1 lakh per year for bottom 20% households, delivered through DBT.", impact_score: 9 },
            { candidate: c2026_inc, category: "Education", title: "Education for All", description: "Increase public education spending to 6% of GDP, free college for all SC/ST/OBC, 2 crore new teacher appointments.", impact_score: 8 },
            { candidate: c2026_aap, category: "Healthcare", title: "Mohalla Clinics Nationally", description: "Establish 10,000 local clinics across India for free primary healthcare, diagnostics, and medicines.", impact_score: 9 },
            { candidate: c2026_aap, category: "Corruption", title: "National Jan Lokpal", description: "Independent, powerful anti-corruption ombudsman with power to investigate PM, CJI, and all MPs.", impact_score: 9 },
        ];
        for (const p of policies2026) {
            await policyRepo.save(policyRepo.create(p));
        }

        console.log("✅ Seeding complete!");
        console.log("  Elections added: 2024, 2019, 2014, 2009, 2026 (practice)");
        console.log("  Candidates: 22 total across all elections");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error during seeding:", error);
        process.exit(1);
    }
};

seed();
