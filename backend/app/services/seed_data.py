import json
from sqlalchemy.orm import Session
from app.models.models import (
    Archive, ArchiveFile, ExtractedText, HeritageLocation,
    Category, Tag, CulturalStory, ArchiveSource, User
)

SAMPLE_HERITAGE_ARCHIVES = [
    {
        "title": "Rani ki Vav: Seven-Tiered Subterranean Water Sanctum",
        "description": "Architectural documentation of Rani ki Vav (The Queen's Stepwell) in Patan, built by Queen Udayamati of the Chaulukya/Solanki dynasty. The stepwell is designed as an inverted temple highlighting the sanctity of water, descending through seven levels of sculpted sandstone terraced galleries.",
        "original_filename": "rani_ki_vav_solanki_survey_1063ce.pdf",
        "file_path": "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80",
        "file_type": "pdf",
        "language": "English & Sanskrit",
        "historical_period": "11th Century CE (Solanki Dynasty)",
        "category": "Stepwells & Water Architecture",
        "state": "Gujarat",
        "city": "Patan",
        "latitude": 23.8589,
        "longitude": 72.1018,
        "keywords": "Stepwell, Solanki, Inverted Temple, Vishnu Dashavatara, Subterranean Architecture, Patan",
        "architectural_features": "Seven terraces of stepped corridors, over 500 principal sculptures, 1,000 minor religious sculptures, carved pillared pavilions (mandapas), cantilevered stone beams.",
        "cultural_significance": "UNESCO World Heritage Site; supreme masterpiece of subterranean stepwell architecture celebrating both engineering prowess and sacred water iconography.",
        "source_reference": "Archaeological Survey of India (ASI) Western Circle, Report Vol. IX",
        "extracted_text": (
            "ARCHAEOLOGICAL REPORT: RANI KI VAV (PATAN, GUJARAT)\n"
            "Period: Solanki Dynasty, circa 1063 CE. Patron: Rani Udayamati in memory of King Bhima I.\n"
            "Architectural Type: Maru-Gurjara style inverted subterranean temple.\n"
            "Orientation: East-west axis, measuring approximately 64 meters long, 20 meters wide, and 27 meters deep.\n"
            "Sculptural Iconography: Devoted predominantly to Lord Vishnu, including supreme representations of the Dashavatara (Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Rama, Balarama, Buddha, and Kalki).\n"
            "Epigraphy: Inscriptions confirm the patronage of Udayamati, praising the spiritual sanctity of water reservoirs in arid Gujarat."
        ),
        "tags": ["Stepwells", "Solanki Dynasty", "UNESCO", "Sandstone", "Gujarat", "Hydrology"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Adalaj Stepwell: Five-Story Indo-Islamic Subterranean Pavilion",
        "description": "Comprehensive survey of the 1498 CE Adalaj Vav built by Queen Rudabai. Features unique octagonal subterranean openings, three entrance staircases meeting at the first platform underground, and delicate amalgamation of Solanki carvings with Islamic floral arabesques.",
        "original_filename": "adalaj_stepwell_rudabai_survey.jpg",
        "file_path": "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80",
        "file_type": "jpg",
        "language": "English & Sanskrit Inscriptions",
        "historical_period": "15th Century CE (Vaghela / Gujarat Sultanate Era)",
        "category": "Stepwells & Water Architecture",
        "state": "Gujarat",
        "city": "Gandhinagar",
        "latitude": 23.1667,
        "longitude": 72.5800,
        "keywords": "Stepwell, Adalaj, Rudabai, Indo-Islamic Architecture, Sandstone, Gandhinagar",
        "architectural_features": "Octagonal central shafts, 5 tiered stories, intricate carved lintels, friezes of elephants, horses, dancers and Kalpavriksha (tree of life) motifs.",
        "cultural_significance": "A rare cultural bridge of Solanki Hindu craft guilds working under Sultanate rule, serving as a social caravan sanctuary for travellers along ancient trade routes.",
        "source_reference": "Gujarat State Archives & Epigraphia Indo-Moslemica",
        "extracted_text": (
            "HISTORICAL RECORD: ADALAJ NI VAV\n"
            "Constructed in 1498 CE by Queen Rudabai, consort of Vaghela chieftain Rana Veer Singh.\n"
            "Design: 5 levels underground. Air temperature within the subterranean pavilion remains 5 to 6 degrees Celsius cooler than the ground surface.\n"
            "Sanskrit Foundation Inscription: Located on the first underground tier in marble: 'In Samvat 1555, Queen Rudabai caused this holy well to be constructed for the welfare of all living beings.'\n"
            "Carvings include Navagrahas, dancing musicians, churning of the cosmic ocean, and protective serpent motifs (Nagas)."
        ),
        "tags": ["Stepwells", "Indo-Islamic", "Gandhinagar", "Vaghela", "Trade Routes"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Modhera Sun Temple: Solanki Astronomy & The Surya Kunda",
        "description": "Architectural and archaeo-astronomical documentation of the 1026 CE Sun Temple at Modhera, built by King Bhimadeva I on the banks of the Pushpavati river. The temple sanctum was calibrated such that the first rays of the equinox sun illuminated the golden crown of Surya.",
        "original_filename": "modhera_sun_temple_solanki_plan.pdf",
        "file_path": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        "file_type": "pdf",
        "language": "English & Gujarati",
        "historical_period": "11th Century CE (Solanki Dynasty)",
        "category": "Temple Architecture",
        "state": "Gujarat",
        "city": "Mehsana",
        "latitude": 23.5835,
        "longitude": 72.1331,
        "keywords": "Modhera, Sun Temple, Surya, Solanki, Archaeoastronomy, Sabha Mandapa, Surya Kunda",
        "architectural_features": "Comprises three axially aligned components: Gudhamandapa (shrine hall), Sabhamandapa (assembly hall with 52 intricately carved torana pillars representing weeks of the year), and Kunda (stepped reservoir with 108 miniature shrines).",
        "cultural_significance": "Paramount monument of Maru-Gurjara classical temple design and an ancient observatory of celestial mechanics.",
        "source_reference": "Archaeological Survey of India Memoir No. 71",
        "extracted_text": (
            "ARCHAEOLOGICAL REPORT: SURYA MANDIR, MODHERA\n"
            "Date of Inscription: Vikrama Samvat 1083 (1026–1027 CE).\n"
            "Architecture: Built entirely of golden-yellow sandstone without lime mortar, employing interlocking dry-stone mortise and tenon joints.\n"
            "Astronomical Alignment: Positioned near the Tropic of Cancer. On the solar equinoxes (March 21 & September 23), morning sunbeams pierced the central doorway to cast light upon the sanctum deity.\n"
            "The stepped water tank (Surya Kunda / Rama Kunda) features 108 subsidiary stone shrines dedicated to Ganesha, Shiva, and Shitala Devi."
        ),
        "tags": ["Temples", "Sun Temple", "Solanki", "Astronomy", "Mehsana"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Konark Sun Temple: The Colossal Chariot of the Sun God",
        "description": "Structural engineering and sculptural archival survey of the 13th-century Konark Sun Temple in Odisha, constructed by King Narasimhadeva I of the Eastern Ganga Dynasty. Sculpted in the form of a gigantic chariot with 24 carved stone wheels pulled by seven horses.",
        "original_filename": "konark_chariot_structural_survey.jpg",
        "file_path": "https://images.unsplash.com/photo-1600100397608-f010f4439c27?auto=format&fit=crop&w=1200&q=80",
        "file_type": "jpg",
        "language": "English & Odia",
        "historical_period": "13th Century CE (Eastern Ganga Dynasty)",
        "category": "Temple Architecture",
        "state": "Odisha",
        "city": "Puri",
        "latitude": 19.8876,
        "longitude": 86.0945,
        "keywords": "Konark, Sun Temple, Kalinga Architecture, Sundial Wheels, Jagamohana, Odisha",
        "architectural_features": "Kalinga architectural order with Jagamohana (assembly hall), 24 monumental wheels functioning as precise astronomical sundials, chlorite stone sculptures of Natya Mandapa.",
        "cultural_significance": "UNESCO World Heritage site, hailed as the 'Black Pagoda' by European navigators, representing the summit of Orissan stone sculpture.",
        "source_reference": "Epigraphia Indica Vol. XXVIII & ASI Monument Monograph",
        "extracted_text": (
            "EPIGRAPHIC & STRUCTURAL SURVEY: KONARK SUN TEMPLE\n"
            "Date: 1250 CE. Chief Architect: Bisu Maharana and 1,200 master sculptors over 12 years.\n"
            "Material: Khondalite stone with chlorite ornamental sculptures.\n"
            "Sundial Wheels: The 24 stone wheels are 9 feet 9 inches in diameter, each with 8 primary spokes and 8 secondary spokes, functioning as solar chronometers measuring time to the exact minute by shadow projection.\n"
            "Iron Beams: Unprecedented medieval metallurgy utilizing forged wrought iron beams measuring up to 35 feet long to span sanctum roofs."
        ),
        "tags": ["Temples", "Kalinga Style", "UNESCO", "Sundial", "Odisha", "Metallurgy"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Hampi Stone Chariot & Vitthala Temple Complex Epigraphy",
        "description": "Archival documentation of the 16th-century Vijayanagara capital ruins at Hampi. Detailed epigraphic notes on the iconic Garuda Stone Chariot, the musical granite pillars of the Mahamandapa, and the UNESCO protected ruins on the Tungabhadra riverbanks.",
        "original_filename": "hampi_vitthala_stone_chariot.jpg",
        "file_path": "https://images.unsplash.com/photo-1599818816949-858a74e5033c?auto=format&fit=crop&w=1200&q=80",
        "file_type": "jpg",
        "language": "English & Kannada",
        "historical_period": "14th–16th Century CE (Vijayanagara Empire)",
        "category": "Forts & Palaces",
        "state": "Karnataka",
        "city": "Vijayanagara",
        "latitude": 15.3350,
        "longitude": 76.4600,
        "keywords": "Hampi, Vijayanagara, Stone Chariot, Musical Pillars, Tungabhadra, Vitthala",
        "architectural_features": "Dravidian Vijayanagara style; monolithic stone chariot carved with revolving stone wheels, musical sa-re-ga-ma pillars carved from single acoustic granite blocks, sprawling pillared bazaars.",
        "cultural_significance": "Capital of the greatest medieval empire in South India, celebrated by Persian ambassador Abdur Razzaq and Portuguese travelers as one of the world's grandest metropolises.",
        "source_reference": "Vijayanagara Metropolitan Survey, Dept of Archaeology Karnataka",
        "extracted_text": (
            "FIELD SURVEY ARCHIVE: HAMPI VITTHALA COMPLEX\n"
            "Reign: King Krishnadevaraya (1509–1529 CE).\n"
            "Monument: Garuda Shrine (Stone Chariot). Replicating wooden temple chariots (rathas) with chlorite stone joints.\n"
            "Acoustic Columns: 56 musical columns resonant with distinct frequencies when gently tapped, crafted from solid dolerite/granite.\n"
            "Granite Urbanism: The Tungabhadra boulder-strewn landscape integrated naturally into fortification walls, aqueducts, and terraced agricultural channels."
        ),
        "tags": ["Forts & Palaces", "Vijayanagara", "Hampi", "Granite", "UNESCO", "Karnataka"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Mehrangarh Fort: Impregnable Rajput Citadel of Marwar",
        "description": "Architectural documentation of Mehrangarh Fort rising 410 feet above Jodhpur's skyline. Built by Rao Jodha in 1459 CE, featuring massive 120-foot ramparts, seven grand victory gates (Pols), and exquisite filigreed red sandstone jharokhas.",
        "original_filename": "mehrangarh_fort_jodhpur_architecture.jpg",
        "file_path": "https://images.unsplash.com/photo-1597044141240-20e36395b263?auto=format&fit=crop&w=1200&q=80",
        "file_type": "jpg",
        "language": "English & Marwari / Hindi",
        "historical_period": "15th–18th Century CE (Rathore Dynasty)",
        "category": "Forts & Palaces",
        "state": "Rajasthan",
        "city": "Jodhpur",
        "latitude": 26.2980,
        "longitude": 73.0189,
        "keywords": "Mehrangarh, Jodhpur, Rajput Architecture, Jharokha, Fortification, Marwar",
        "architectural_features": "Perched on Malani igneous cliff; defensive cannon ramparts, delicate latticework screens (jaali), Sheesh Mahal (Mirror Palace), Phool Mahal (Flower Palace), and deep stepwells (Ranisar & Padamsar).",
        "cultural_significance": "Described by Rudyard Kipling as 'a palace that might have been built by Titans and colored by the morning sun'; epicenter of Marwari chivalry, art, and music archives.",
        "source_reference": "Mehrangarh Museum Trust Research Archives",
        "extracted_text": (
            "MILITARY ARCHITECTURE SURVEY: MEHRANGARH (FORT OF THE SUN)\n"
            "Foundation: May 12, 1459 by Rao Jodha.\n"
            "Engineering: Outer defensive walls range from 12 to 21 meters in height and up to 9 meters in thickness, constructed directly out of the living basaltic cliff.\n"
            "Water Security: Incorporates subterranean rainwater harvesting aqueducts feeding the ancient reservoirs Padamsar and Ranisar located beneath the eastern bastions."
        ),
        "tags": ["Forts & Palaces", "Rajput", "Jodhpur", "Rajasthan", "Sandstone"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Kailasa Temple (Cave 16): Monolithic Basalt Rock-Cut Engineering",
        "description": "Survey of the monolithic Kailasa Temple at Ellora Caves. Carved top-down from a single cliff of basalt volcanic rock under Rashtrakuta King Krishna I. Over 200,000 tonnes of solid rock were excavated without scaffolding.",
        "original_filename": "ellora_kailasa_monolith_survey.pdf",
        "file_path": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
        "file_type": "pdf",
        "language": "English & Sanskrit Epigraphs",
        "historical_period": "8th Century CE (Rashtrakuta Dynasty)",
        "category": "Temple Architecture",
        "state": "Maharashtra",
        "city": "Chhatrapati Sambhaji Nagar",
        "latitude": 20.0268,
        "longitude": 75.1780,
        "keywords": "Kailasa Temple, Ellora, Monolith, Rashtrakuta, Basalt Excavation, Shiva",
        "architectural_features": "Excavated vertically from the top down; multi-tiered vimana, life-size monolithic elephants, open courtyards, subterranean galleries, carved panels depicting Ravana shaking Mount Kailasa.",
        "cultural_significance": "Greatest monolithic rock-cut wonder in human history; testimony to master stone chiseling that left zero room for structural error.",
        "source_reference": "Cave Temples of India, Fergusson & Burgess; ASI Monograph",
        "extracted_text": (
            "MONOLITHIC EXCAVATION SURVEY: CAVE 16 (KAILASA)\n"
            "Patronage: Rashtrakuta King Krishna I (756–773 CE).\n"
            "Method: Downward vertical trenching through the Charanandri hills.\n"
            "Scale: 107 feet deep, 154 feet wide, 276 feet long. The sanctum shikhara reaches 98 feet in height.\n"
            "Inscription from Baroda Copper Plate: 'The architect himself was struck with wonder and said: Oh, how was it that I built it?'"
        ),
        "tags": ["Temple Architecture", "Rock-Cut", "Rashtrakuta", "UNESCO", "Maharashtra"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Brihadisvara Temple: Chola Granitic Engineering & Epigraphy",
        "description": "Architectural study of the Great Living Chola Temple of Thanjavur, consecrated in 1010 CE by Emperor Rajaraja I. Built entirely of interlocking granite blocks with a monolithic 80-tonne kumbam dome capstone atop a 216-foot vimana.",
        "original_filename": "thanjavur_brihadisvara_chola_granite.pdf",
        "file_path": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        "file_type": "pdf",
        "language": "Tamil & Sanskrit (Grantha Script)",
        "historical_period": "11th Century CE (Imperial Chola Dynasty)",
        "category": "Temple Architecture",
        "state": "Tamil Nadu",
        "city": "Thanjavur",
        "latitude": 10.7828,
        "longitude": 79.1318,
        "keywords": "Brihadisvara, Chola, Thanjavur, Granite, Vimana, Rajaraja Chola, Epigraphy",
        "architectural_features": "Dravidian pyramid tower rising 66 meters, interlocking granite masonry without mortar, 80-tonne octagonal stone cupola, massive monolithic Nandi bull, preserved 11th-century fresco paintings.",
        "cultural_significance": "Center of Chola statecraft, classical Bharatanatyam dance, bronze metallurgy, and ancient Tamil fiscal administration recorded in stone walls.",
        "source_reference": "South Indian Inscriptions Vol. II, Archaeological Survey of India",
        "extracted_text": (
            "CHOLA IMPERIAL EPIGRAPHY: RAJARAJESWARAM (BRIHADISVARA)\n"
            "Consecration Year: 275th day of the 25th regnal year of Rajaraja Chola I (1010 CE).\n"
            "Granite Transport: Granite was transported from quarries over 60 km away via river barges on the Kaveri.\n"
            "Wall Inscriptions: The stone base of the sanctum contains verbatim ledgers recording donations of gold, jewels, silver vessels, and 400 temple dancers with their house addresses and wages."
        ),
        "tags": ["Temple Architecture", "Chola", "Granite", "Tamil Nadu", "UNESCO"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Nalanda Mahavihara: Ancient Monastic University Manuscripts",
        "description": "Excavation and manuscript conservation report of the ancient Buddhist monastic university of Nalanda. Flourished from 427 CE to 1197 CE, housing over 10,000 international scholars and the legendary Dharmaganja library complex.",
        "original_filename": "nalanda_mahavihara_monastic_archive.pdf",
        "file_path": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        "file_type": "pdf",
        "language": "Sanskrit & Pali",
        "historical_period": "5th–12th Century CE (Gupta & Pala Empires)",
        "category": "Ancient Manuscripts",
        "state": "Bihar",
        "city": "Nalanda",
        "latitude": 25.1357,
        "longitude": 85.4439,
        "keywords": "Nalanda, Buddhist University, Dharma, Manuscripts, Xuanzang, Terracotta Seals",
        "architectural_features": "Red brick monastery cells (viharas), multi-tiered stupa temples, drainage aqueducts, communal study courtyards, burnt terracotta official seals of the university council.",
        "cultural_significance": "The world's first great residential international university; repository of ancient Asian philosophy, logic, astronomy, mathematics, and medicine.",
        "source_reference": "ASI Excavation Memoir No. 66 & Xuanzang's Great Tang Records",
        "extracted_text": (
            "HISTORICAL EXCAVATION RECORD: NALANDA MAHAVIHARA\n"
            "Patrons: Kumargupta I, Harsha of Kannauj, and Pala monarchs (Devapala, Dharmapala).\n"
            "The Three Great Library Towers: Ratnasagara (Sea of Jewels), Ratnodadhi (Ocean of Jewels), and Ratnaranjaka (Jewel Adorned).\n"
            "Curriculum: Logic (Hetuvidya), Grammar (Shabdavidya), Medicine (Chikitsavidya), and Metaphysics (Abhidharma).\n"
            "Seals: Inscribed terracotta seals bear the wheel flanked by two gazelles: 'Sri Nalanda Mahavihariya Arya Bhikshu Sanghasya'."
        ),
        "tags": ["Ancient Manuscripts", "Buddhist Heritage", "Nalanda", "Bihar", "Gupta Empire"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Great Stupa at Sanchi: Mauryan Stone Carvings & Torana Gateways",
        "description": "Architectural documentation of Stupa No. 1 at Sanchi, originally commissioned by Emperor Ashoka in the 3rd century BCE. Features four monumental carved sandstone Toranas (gateways) depicting Jataka tales with supreme early Buddhist relief carving.",
        "original_filename": "sanchi_stupa_mauryan_torana.jpg",
        "file_path": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
        "file_type": "jpg",
        "language": "Prakrit & Brahmi Inscriptions",
        "historical_period": "3rd Century BCE–1st Century CE (Mauryan & Satavahana)",
        "category": "Buddhist & Jain Heritage",
        "state": "Madhya Pradesh",
        "city": "Raisen",
        "latitude": 23.4793,
        "longitude": 77.7397,
        "keywords": "Sanchi, Stupa, Ashoka, Brahmi, Torana, Jataka Tales, Mauryan",
        "architectural_features": "Hemispherical stone dome (anda), square railing (harmika), three-tiered umbrella (chhatravali), circumambulatory path (pradakshina patha), four carved Torana gateways facing the cardinal directions.",
        "cultural_significance": "Oldest existing stone structure in India; genesis of Buddhist architectural grammar and early Indic figurative art.",
        "source_reference": "The Monuments of Sanchi by Sir John Marshall and Alfred Foucher",
        "extracted_text": (
            "EPIGRAPHIC CATALOG: SANCHI STUPA NO. 1\n"
            "Earliest Core: Brick stupa built by Ashoka the Great (circa 250 BCE).\n"
            "Toranas: Erected during the Satavahana era (circa 1st Century BCE).\n"
            "Brahmi Donative Inscriptions: Hundreds of short inscriptions on balustrade stones recording donations from merchants, monks, nuns, and the ivory carvers' guild of Vidisha."
        ),
        "tags": ["Buddhist & Jain Heritage", "Mauryan", "Brahmi", "UNESCO", "Madhya Pradesh"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Patan Patola Double Ikat: Geometric Silk Weaving Archives",
        "description": "Cultural documentation of the ancient 900-year-old craft of Patan Patola silk weaving in Gujarat. Mastered exclusively by the Salvi weavers under royal Solanki patronage, utilizing natural plant dyes and mathematical double-ikat warp and weft resist techniques.",
        "original_filename": "patan_patola_double_ikat_archive.pdf",
        "file_path": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80",
        "file_type": "pdf",
        "language": "English & Gujarati",
        "historical_period": "12th Century CE–Present (Solanki Era Origin)",
        "category": "Traditional Crafts",
        "state": "Gujarat",
        "city": "Patan",
        "latitude": 23.8500,
        "longitude": 72.1300,
        "keywords": "Patola, Double Ikat, Silk Weaving, Patan, Salvi Weavers, Natural Dyes",
        "architectural_features": "Traditional wooden handloom tilted at a 45-degree angle, bamboo reeds, silk yarn tied with cotton strings and dyed in pomegranate rind, turmeric, madder, and indigo.",
        "cultural_significance": "Celebrated in Gujarati folklore: 'Padi Patole Bhaat, Phate Pan Fitey Nahi' (The pattern of the Patola will never fade even if the silk cloth tears).",
        "source_reference": "Crafts Council of India & Patan Salvi Guild Archives",
        "extracted_text": (
            "HERITAGE TEXTILE STUDY: PATAN PATOLA DOUBLE-IKAT\n"
            "Origin: King Kumarpal (1143–1173 CE) invited 700 master weavers from Jalna to settle in Patan.\n"
            "Technique: Both warp and weft threads are individually tie-dyed before weaving so that colors interlock precisely in the loom.\n"
            "Motifs: Nari-Kunj (woman and parrot), Pan-Bhat (peepal leaf), Chhabdi-Bhat (basket motif), and geometric Navratna grids.\n"
            "Duration: Crafting a single authentic saree requires 6 to 9 months of mathematical calculation and weaving."
        ),
        "tags": ["Traditional Crafts", "Patola", "Patan", "Gujarat", "Textiles"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Bhandarkar Institute Rigveda Devanagari Manuscript Folio",
        "description": "High-resolution archival transcription of the UNESCO Memory of the World collection Rigveda manuscripts preserved at the Bhandarkar Oriental Research Institute (BORI). Inscribed on birch bark and handmade paper in Sanskrit Devanagari script.",
        "original_filename": "rigveda_manuscript_devanagari_folio_bori.pdf",
        "file_path": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
        "file_type": "pdf",
        "language": "Sanskrit (Devanagari Script)",
        "historical_period": "14th Century CE Manuscript Copy (Vedic Composition circa 1500 BCE)",
        "category": "Ancient Manuscripts",
        "state": "Maharashtra",
        "city": "Pune",
        "latitude": 18.5196,
        "longitude": 73.8553,
        "keywords": "Rigveda, Devanagari, Sanskrit, BORI, UNESCO Memory of the World, Manuscripts",
        "architectural_features": "Black lampblack carbon ink with red cinnabar accents for Vedic accents (Udatta, Anudatta, Svarita), preserved between carved wooden book covers (patis).",
        "cultural_significance": "UNESCO Memory of the World Register; oldest sacred literary heritage of India, preserving oral Vedic chanting traditions with millimeter textual accuracy.",
        "source_reference": "Bhandarkar Oriental Research Institute (BORI) Manuscript No. 5/1875-76",
        "extracted_text": (
            "ऋग्वेद संहिता - प्रथम मण्डल (RIGVEDA MANUSCRIPT TRANSCRIPTION)\n"
            "ॐ अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥ १.१ ॥\n"
            "Transliteration: Oṃ agnim īḷe purohitaṃ yajñasya devam ṛtvijam | hotāraṃ ratnadhātamam || 1.1 ||\n"
            "English Translation: 'I adore Agni, the household priest, the divine ministrant of the sacrifice, the invoker, bestower of treasure.'\n"
            "Catalog Notes: BORI Manuscript Collection Pune. Inscribed with wooden stylus and soot ink on handmade rag paper with red rubrication for svara accents."
        ),
        "tags": ["Ancient Manuscripts", "Sanskrit", "Devanagari", "UNESCO", "Vedic Heritage"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Kumbhalgarh Fort: The 36-Kilometer Perimeter Great Wall of India",
        "description": "Architectural documentation of Mewar's mountain fortress at Kumbhalgarh, built by Maharana Kumbha in the 15th century. Protected by a continuous 36-kilometer-long stone rampart, the second longest continuous defensive wall in the world.",
        "original_filename": "kumbhalgarh_great_wall_mewar.jpg",
        "file_path": "https://images.unsplash.com/photo-1597044141240-20e36395b263?auto=format&fit=crop&w=1200&q=80",
        "file_type": "jpg",
        "language": "English & Rajasthani",
        "historical_period": "15th Century CE (Mewar Dynasty)",
        "category": "Forts & Palaces",
        "state": "Rajasthan",
        "city": "Rajsamand",
        "latitude": 25.1528,
        "longitude": 73.5872,
        "keywords": "Kumbhalgarh, Mewar, Maharana Kumbha, Great Wall of India, Aravalli, Hill Forts",
        "architectural_features": "36-km defensive wall broad enough for eight horses to gallop abreast, 360 temples within the perimeter (300 ancient Jain and 60 Hindu), Badal Mahal (Palace of Clouds) at the apex.",
        "cultural_significance": "UNESCO World Heritage Hill Fort of Rajasthan; birthplace of legendary warrior Maharana Pratap and an impregnable refuge against Mughal assaults.",
        "source_reference": "Archaeological Survey of India Jaipur Circle & Mewar Trust",
        "extracted_text": (
            "FORTIFICATION SURVEY: KUMBHALGARH (MEWAR)\n"
            "Construction: 1443–1458 CE under the supervision of royal architect Mandan.\n"
            "Terrain: Situated at an elevation of 1,100 meters in the Aravalli mountain range.\n"
            "Defensive Engineering: Features 7 fortified gates (Aret Pol, Hanuman Pol, Ram Pol). Sandstone blocks laid with lime mortar and interlocking battlements designed for archery and musket defense."
        ),
        "tags": ["Forts & Palaces", "Mewar", "Rajasthan", "UNESCO", "Hill Forts"],
        "is_verified": True,
        "is_ai_generated": False
    },
    {
        "title": "Unlocated Field Observation: Terracotta Glaze Preservation Note",
        "description": "Archival field report documenting folk terracotta kiln heating formulas and herbal slip coatings recorded from itinerant rural potters. Awaiting georeferencing and GPS coordinates verification.",
        "original_filename": "terracotta_folk_kiln_formulas_field_note.pdf",
        "file_path": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
        "file_type": "pdf",
        "language": "English & Hindi",
        "historical_period": "20th Century Field Notes (Traditional Lore)",
        "category": "Traditional Crafts",
        "state": None,
        "city": None,
        "latitude": None,
        "longitude": None,
        "keywords": "Terracotta, Pottery, Slip Glaze, Kiln Technology, Folk Art, Field Notes",
        "architectural_features": "Updraft pit kiln designs, cow-dung and rice husk insulating layers, natural ochre and tamarind seed binder finishes.",
        "cultural_significance": "Folk technical knowledge preserving oral craft traditions of rural communities across northern and central India.",
        "source_reference": "National Crafts Museum Field Expedition Notebooks",
        "extracted_text": (
            "FIELD NOTE #44: RURAL POTTERY SLIP AND OCHRE FORMULATIONS\n"
            "Collected from generational craft community practitioners.\n"
            "Clay composition: River silt combined with 15% sifted paddy husk to prevent cracking during firing.\n"
            "Glaze Slip: Red clay suspension infused with catechu (katha) and wood ash fired at 850 degrees Celsius.\n"
            "Status: Field coordinates pending verification by survey team."
        ),
        "tags": ["Traditional Crafts", "Terracotta", "Field Notes", "Pottery"],
        "is_verified": False,
        "is_ai_generated": False
    }
]

SAMPLE_STORIES = [
    {
        "title": "Rani ki Vav: The Water Temple Descending to the Earth's Core",
        "slug": "rani-ki-vav-water-temple",
        "subtitle": "How an 11th-century queen immortalized her love through an inverted subterranean cathedral in Patan.",
        "hero_image": "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1400&q=80",
        "summary": "Stepwells in western India were far more than utilitarian water reservoirs. Rani ki Vav represents the spiritual pinnacle where hydrology, devotion, and monumental sculpture merged into an inverted temple descending seven stories underground.",
        "content": (
            "In the arid plains of Patan, Gujarat, water was treated not merely as a biological necessity, but as divinity incarnate. "
            "When King Bhima I of the Chaulukya dynasty passed away in 1064 CE, his widowed consort, Queen Udayamati, chose to commemorate his memory "
            "not with a towering monument to the sky, but with a magnificent inverted temple descending deep into the womb of the earth.\n\n"
            "Rani ki Vav measures over 64 meters long, 20 meters wide, and plunges 27 meters deep. Unlike normal temples whose shikharas reach toward the heavens, "
            "here the pilgrim descends through seven distinct pillared pavilions (mandapas), flanked by more than 500 major sculptures. "
            "The dominant deity is Lord Vishnu, reclining upon the thousand-headed serpent Sheshanaga at the water level, symbolizing the primordial cosmic ocean.\n\n"
            "For centuries, the monument was buried under silt from the shifting Saraswati river, protecting its delicate carvings from foreign invasions and weathering. "
            "When the Archaeological Survey of India excavated the site in the late 20th century, the carvings emerged in pristine condition, looking as fresh as the day "
            "Solanki stone masons set down their chisels 900 years ago."
        ),
        "heritage_location": "Patan, Gujarat",
        "state": "Gujarat",
        "city": "Patan",
        "latitude": 23.8589,
        "longitude": 72.1018,
        "historical_period": "11th Century CE (Solanki Dynasty)",
        "cultural_importance": "A testament to women patrons of monumental art, sacred hydrology, and UNESCO World Heritage designated craftsmanship.",
        "architectural_features": "Seven-tiered stepped galleries, 500+ master sculptures of Vishnu Dashavatara, cantilevered sandstone lintels, and an ornate well shaft.",
        "timeline_events": json.dumps([
            {"year": "1063 CE", "event": "Commissioned by Queen Udayamati in memory of King Bhima I."},
            {"year": "1304 CE", "event": "Documented in Merutunga's 'Prabandha-Chintamani' chronicling Gujarat's heritage."},
            {"year": "1940s", "event": "Re-discovered by Baroda State Department of Archaeology under silt deposits."},
            {"year": "1986", "event": "Comprehensive multi-year desilting and conservation by Archaeological Survey of India."},
            {"year": "2014", "event": "Inscribed on the UNESCO World Heritage List."}
        ]),
        "references": "Archaeological Survey of India Reports; Merutunga's Prabandha Chintamani; UNESCO World Heritage Evaluation Dossier No. 922."
    },
    {
        "title": "Adalaj Vav: Love, Sacrifice, and Indo-Islamic Harmony",
        "slug": "adalaj-vav-indo-islamic-harmony",
        "subtitle": "The tragic history and sublime confluence of Solanki stone craftsmanship and Islamic floral aesthetics.",
        "hero_image": "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1400&q=80",
        "summary": "Built in 1498 CE by Queen Rudabai, Adalaj Stepwell stands as an architectural wonder where three entrance staircases merge into an octagonal subterranean sanctuary.",
        "content": (
            "Just 18 kilometers from Gandhinagar lies Adalaj Vav, an architectural marvel born out of love, sorrow, and cultural synergy. "
            "According to local folklore and Sanskrit inscriptions, the Vaghela chieftain Rana Veer Singh was slain during the Sultanate wars. "
            "His grieving queen, Rudabai, agreed to marry Sultan Mahmud Begada only on the condition that he complete the grand stepwell her husband had begun.\n\n"
            "When the construction concluded in 1498 CE, revealing five stories of exquisite octagonal pavilions, Queen Rudabai circumambulated the waters and leaped into the well, "
            "choosing eternity over submission.\n\n"
            "Architecturally, Adalaj is unmatched. Three grand staircases lead down into a central octagonal shaft that permits sunlight to filter gently down to the water table. "
            "The carvings combine Hindu deities, churning oceans, dancing musicians, and Kalpavriksha (trees of life) with the geometric rigor and floral friezes of Islamic tradition."
        ),
        "heritage_location": "Adalaj, Gandhinagar, Gujarat",
        "state": "Gujarat",
        "city": "Gandhinagar",
        "latitude": 23.1667,
        "longitude": 72.5800,
        "historical_period": "15th Century CE (1498 CE)",
        "cultural_importance": "A social community hub for desert caravans, female congregation, and harmonious architectural fusion.",
        "architectural_features": "Three entrance stairs meeting underground, 5-tier octagonal shaft, cool microclimate, and Sanskrit dedication slab.",
        "timeline_events": json.dumps([
            {"year": "1496 CE", "event": "Initiated by Rana Veer Singh of Dandai Desh."},
            {"year": "1498 CE", "event": "Completed under the patronage of Queen Rudabai and Sultan Mahmud Begada."},
            {"year": "1910", "event": "Protected as a Monument of National Importance."}
        ]),
        "references": "Gujarat State Gazetteer; Epigraphia Indo-Moslemica; Historical Studies of Western India."
    },
    {
        "title": "Modhera Sun Temple: When the Equinox Dawn Touched Gold",
        "slug": "modhera-sun-temple-equinox",
        "subtitle": "The solar temple engineered so precisely that the equinox sunbeams illuminated the sacred deity.",
        "hero_image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=80",
        "summary": "Built in 1026 CE along the Tropic of Cancer, Modhera Sun Temple is a masterwork of Solanki temple architecture and archaeo-astronomy.",
        "content": (
            "Standing on the tranquil banks of the Pushpavati River in Mehsana, the Sun Temple at Modhera was conceived as an ode to Surya, the giver of cosmic life. "
            "Erected under King Bhimadeva I of the Chaulukya dynasty, the temple complex was designed without lime mortar, relying on the precision of interlocking sandstone blocks.\n\n"
            "The complex is divided into three harmonious segments: the Rama Kunda (a massive stepped water tank with 108 miniature shrines), the Sabhamandapa (assembly hall "
            "with 52 pillars representing the 52 weeks of the solar year), and the Guda Mandapa (sanctum sanctorum).\n\n"
            "On the spring and autumn equinoxes, the rising sun aligned directly with the temple doorway, penetrating through the pillared halls to bathe the central image of Surya in pure radiant morning light."
        ),
        "heritage_location": "Modhera, Mehsana, Gujarat",
        "state": "Gujarat",
        "city": "Mehsana",
        "latitude": 23.5835,
        "longitude": 72.1331,
        "historical_period": "11th Century CE (1026 CE)",
        "cultural_importance": "Celebration of solar worship, ancient astronomical mathematics, and venue for the world-renowned Modhera Dance Festival.",
        "architectural_features": "52 torana pillared sabhamandapa, stepped tank with 108 shrines, and mortarless mortise-tenon stone masonry.",
        "timeline_events": json.dumps([
            {"year": "1026 CE", "event": "Built by King Bhimadeva I following the defense of Gujarat."},
            {"year": "1960s", "event": "Extensive structural restoration by ASI Western Circle."},
            {"year": "2022", "event": "Modhera recognized as India's first 24x7 solar-powered heritage village."}
        ]),
        "references": "Archaeological Survey of India Memoir 71; Gujarat Tourism Cultural Compendium."
    },
    {
        "title": "Hampi: The Granite Wonder of the Vijayanagara Empire",
        "slug": "hampi-granite-wonder",
        "subtitle": "Exploring the sprawling boulders, acoustic columns, and imperial glory along the Tungabhadra.",
        "hero_image": "https://images.unsplash.com/photo-1599818816949-858a74e5033c?auto=format&fit=crop&w=1400&q=80",
        "summary": "In the 15th and 16th centuries, Hampi was one of the wealthiest cities in the world. Its monuments transformed rugged granite boulders into royal palaces, musical halls, and stone chariots.",
        "content": (
            "Sprawling across more than 4,100 hectares along the rugged banks of the Tungabhadra River, Hampi served as the vibrant capital of the Vijayanagara Empire. "
            "Portuguese chronicler Domingo Paes wrote that Hampi was as large as Rome, with gardens, lakes, diamonds traded openly in bazaars, and countless stone temples.\n\n"
            "The crowning jewel of Hampi is the Vitthala Temple complex. Here stands the famous monolithic Stone Chariot (Garuda shrine), whose stone wheels originally rotated on granite axles. "
            "Surrounding it is the Ranga Mandapa, supported by 56 musical pillars carved from single blocks of resonant dolerite granite that chime distinct notes when struck gently."
        ),
        "heritage_location": "Hampi, Karnataka",
        "state": "Karnataka",
        "city": "Vijayanagara",
        "latitude": 15.3350,
        "longitude": 76.4600,
        "historical_period": "14th–16th Century CE",
        "cultural_importance": "UNESCO World Heritage Site; the epicenter of South Indian literature, Carnatic music, and temple architecture.",
        "architectural_features": "Monolithic stone chariot, resonant musical columns, sprawling bazaars, and boulder-integrated fortification.",
        "timeline_events": json.dumps([
            {"year": "1336 CE", "event": "Founded by brothers Harihara and Bukka Raya."},
            {"year": "1509 CE", "event": "Golden age under Emperor Krishnadevaraya."},
            {"year": "1565 CE", "event": "Battle of Talikota and destruction of the city."},
            {"year": "1986", "event": "Inscribed as a UNESCO World Heritage Site."}
        ]),
        "references": "A Forgotten Empire by Robert Sewell; Archaeological Survey of India Monographs."
    }
]

def seed_database(db: Session):
    """Seed initial demonstration records if database is empty."""
    # Check if archives already exist
    existing_count = db.query(Archive).count()
    if existing_count > 0:
        return

    print("[SeedData] Seeding Indian Cultural Heritage archives...")

    # 1. Seed Categories
    categories = [
        ("Stepwells & Water Architecture", "stepwells", "Subterranean stepwells, cisterns, and water temples", "Droplets"),
        ("Temple Architecture", "temples", "Classical stone temples, mandapas, and vimanas", "Landmark"),
        ("Forts & Palaces", "forts", "Citadels, ramparts, royal residences, and bastions", "Shield"),
        ("Ancient Manuscripts", "manuscripts", "Palm-leaf, birch bark, and paper manuscripts in Devanagari and regional scripts", "Scroll"),
        ("Traditional Crafts", "crafts", "Textile weaving, pottery, metalwork, and folk lore", "Palette"),
        ("Buddhist & Jain Heritage", "buddhist-jain", "Stupas, chaityas, viharas, and rock-cut cave complexes", "Sun"),
        ("Sculptural Epigraphy", "epigraphy", "Inscriptions, copper plates, and commemorative steles", "Feather"),
    ]
    for name, slug, desc, icon in categories:
        cat = Category(name=name, slug=slug, description=desc, icon=icon)
        db.add(cat)
    db.commit()

    # 2. Seed Tags
    tag_map = {}
    for item in SAMPLE_HERITAGE_ARCHIVES:
        for tname in item.get("tags", []):
            if tname not in tag_map:
                t = db.query(Tag).filter(Tag.name == tname).first()
                if not t:
                    t = Tag(name=tname)
                    db.add(t)
                    db.commit()
                    db.refresh(t)
                tag_map[tname] = t

    # 3. Seed Archives, Files, ExtractedTexts, and Sources
    archive_objects = []
    for data in SAMPLE_HERITAGE_ARCHIVES:
        arc = Archive(
            title=data["title"],
            description=data["description"],
            original_filename=data["original_filename"],
            file_path=data["file_path"],
            file_type=data["file_type"],
            extracted_text=data["extracted_text"],
            language=data["language"],
            historical_period=data["historical_period"],
            category=data["category"],
            state=data["state"],
            city=data["city"],
            latitude=data["latitude"],
            longitude=data["longitude"],
            keywords=data["keywords"],
            processing_status="completed",
            source_reference=data["source_reference"],
            architectural_features=data["architectural_features"],
            cultural_significance=data["cultural_significance"],
            is_verified=data["is_verified"],
            is_ai_generated=data["is_ai_generated"]
        )
        
        # Link tags
        for tname in data.get("tags", []):
            if tname in tag_map:
                arc.tags.append(tag_map[tname])
                
        db.add(arc)
        db.commit()
        db.refresh(arc)
        archive_objects.append(arc)

        # Add ArchiveFile
        arc_file = ArchiveFile(
            archive_id=arc.id,
            file_path=data["file_path"],
            original_filename=data["original_filename"],
            file_type=data["file_type"],
            file_size=2048576,
            is_primary=True
        )
        db.add(arc_file)

        # Add ExtractedText
        ext_text = ExtractedText(
            archive_id=arc.id,
            page_number=1,
            raw_text=data["extracted_text"],
            cleaned_text=data["extracted_text"],
            confidence_score=0.96,
            ocr_engine="Tesseract OCR / PyPDF Native Engine"
        )
        db.add(ext_text)

        # Add ArchiveSource
        src = ArchiveSource(
            archive_id=arc.id,
            source_name=data["source_reference"],
            contributor="National Heritage Documentation Cell",
            institution="Archaeological Survey of India & State Archives",
            publication_year="2024",
            citation_url="https://heritageverse.ai/archive/" + str(arc.id)
        )
        db.add(src)
        db.commit()

        # Add HeritageLocation if verified
        if data["latitude"] and data["longitude"]:
            loc = HeritageLocation(
                name=data["title"].split(":")[0].strip(),
                city=data["city"],
                state=data["state"],
                country="India",
                latitude=data["latitude"],
                longitude=data["longitude"],
                monument_type=data["category"],
                is_verified=True
            )
            db.add(loc)
            db.commit()

    # 4. Seed Cultural Stories
    for s_data in SAMPLE_STORIES:
        story = CulturalStory(
            title=s_data["title"],
            slug=s_data["slug"],
            subtitle=s_data["subtitle"],
            summary=s_data["summary"],
            content=s_data["content"],
            hero_image=s_data["hero_image"],
            heritage_location=s_data["heritage_location"],
            state=s_data["state"],
            city=s_data["city"],
            latitude=s_data["latitude"],
            longitude=s_data["longitude"],
            historical_period=s_data["historical_period"],
            cultural_importance=s_data["cultural_importance"],
            architectural_features=s_data["architectural_features"],
            timeline_events=s_data["timeline_events"],
            references=s_data["references"]
        )
        # Link related archives by state or category
        for arc in archive_objects:
            if arc.state and arc.state == story.state:
                story.archives.append(arc)
                
        db.add(story)
        db.commit()

    print("[SeedData] Successfully seeded 14 archives and 4 cultural stories!")

