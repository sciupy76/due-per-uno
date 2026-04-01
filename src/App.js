import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════
// CONFIGURAZIONE SUPABASE
// ═══════════════════════════════════════════════════
const SUPABASE_URL = "https://mjubkdvqhpdbjbcgjzcw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qdWJrZHZxaHBkYmpiY2dqemN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTIzNjMsImV4cCI6MjA5MDYyODM2M30.U4waGWzPx7zC0Z_ypukj5K7aXoK6pDf6SP-e6TcKJRc";
const BUZZ_TIMEOUT = 4; 

// ═══════════════════════════════════════════════════
// DATABASE PAROLE COMPLETO (VECCHIE + NUOVE)
// ═══════════════════════════════════════════════════
const DATABASE_BASE = [
  // ANIMALI (200+)
  "Aquila","Balena","Cammello","Delfino","Elefante","Falco","Gazzella","Ippopotamo",
  "Leone","Lupo","Medusa","Pantera","Rinoceronte","Serpente","Tigre","Volpe","Zebra",
  "Giraffa","Coccodrillo","Pinguino","Koala","Orso","Squalo","Tartaruga","Fenicottero",
  "Canguro","Ghepardo","Gorilla","Pavone","Pellicano","Cigno","Corvo","Gufo","Rondine",
  "Colomba","Gabbiano","Farfalla","Libellula","Formica","Ragno","Scorpione","Cavallo",
  "Asino","Mucca","Pecora","Capra","Coniglio","Gatto","Cane","Topo","Riccio","Istrice",
  "Castoro","Lontra","Foca","Pappagallo","Tucano","Struzzo","Canarino","Salmone","Trota",
  "Polpo","Granchio","Aragosta","Lumaca","Chiocciola","Lucertola","Camaleonte","Iguana",
  "Salamandra","Rospo","Rana","Pipistrello","Criceto","Furetto","Ermellino","Tasso",
  "Marmotta","Scoiattolo","Cinghiale","Cervo","Daino","Capriolo","Camoscio","Stambecco",
  "Lince","Donnola","Martora","Nutria","Procione","Armadillo","Bradipo","Formichiere",
  "Tapiro","Giaguaro","Puma","Leopardo","Bisonte","Bufalo","Alce","Renna",
  "Antilope","Impala","Mandrillo","Babbuino","Scimpanzé","Orangutan","Lemure","Suricato",
  "Mangusta","Licaone","Sciacallo","Iena","Avvoltoio","Condor","Airone","Cicogna",
  "Gru","Fagiano","Pernice","Quaglia","Allodola","Usignolo","Merlo","Pettirosso",
  "Fringuello","Cardellino","Colibrì","Picchio","Cuculo","Upupa","Barbagianni","Civetta",
  "Poiana","Sparviero","Piranha","Murena","Cernia","Orata","Spigola","Sogliola",
  "Tonno","Sardina","Acciuga","Aringa","Merluzzo","Anguilla","Storione","Carpa",
  "Luccio","Triglia","Scorfano","Calamaro","Seppia","Gambero","Scampo","Astice",
  "Coccinella","Scarabeo","Grillo","Cavalletta","Cicala","Mantide","Calabrone","Vespa",
  "Ape","Zanzara","Lucciola","Bruco","Millepiedi","Sanguisuga","Tricheco","Narvalo",
  "Beluga","Orca","Dugongo","Lamantino","Pangolino","Ocelot","Gibbone",
  "Chinchilla","Gerbillo","Alpaca","Vigogna","Lama","Dromedario","Fennec","Okapi",
  "Quetzal","Kiwi","Emù","Nandù","Casuario","Marabù","Ibis","Mignattaio",
  "Muflone","Visone","Opossum","Gnu","Kudu","Alcione","Gruccione",

  // CIBO E CUCINA (250+)
  "Lasagna","Risotto","Focaccia","Bruschetta","Polenta","Carbonara","Parmigiana",
  "Mozzarella","Prosciutto","Salame","Mortadella","Gorgonzola","Mascarpone","Ricotta",
  "Taleggio","Pecorino","Piadina","Grissino","Ciabatta","Pandoro","Panettone","Cannolo",
  "Biscotto","Brioche","Cornetto","Cioccolato","Marmellata","Zucchero","Cannella",
  "Basilico","Origano","Rosmarino","Prezzemolo","Aglio","Cipolla","Pomodoro","Melanzana",
  "Zucchina","Peperone","Carciofo","Asparago","Finocchio","Sedano","Radicchio","Rucola",
  "Spinaci","Cavolfiore","Broccolo","Patata","Carota","Pisello","Fagiolo","Lenticchia",
  "Arancia","Limone","Fragola","Ciliegia","Pesca","Albicocca","Prugna","Melograno",
  "Mandarino","Pompelmo","Anguria","Melone","Banana","Mango","Ananas","Cocco","Fico",
  "Castagna","Noce","Mandorla","Nocciola","Pistacchio","Oliva","Cappero","Tartufo",
  "Zafferano","Peperoncino","Curcuma","Zenzero","Aceto","Senape","Maionese","Pesto",
  "Brodo","Minestrone","Zuppa","Vellutata","Crema","Budino","Mousse",
  "Crostata","Torta","Semifreddo","Sorbetto","Gelato","Granita","Zabaione",
  "Amaretto","Bignè","Profiterole","Meringata","Millefoglie","Strudel",
  "Raviolo","Tortellino","Gnocco","Orecchietta","Pappardella","Tagliatella",
  "Fettuccina","Bucatino","Rigatone","Penne","Fusillo","Conchiglia",
  "Linguina","Spaghetto","Vermicello","Pacchero","Maccherone","Cannellone",
  "Bresaola","Coppa","Guanciale","Pancetta","Speck","Lardo","Soppressa",
  "Burrata","Provola","Scamorza","Caciotta","Fontina","Asiago","Provolone",
  "Pane","Farina","Lievito","Uovo","Burro","Miele",
  "Cappuccino","Espresso","Macchiato","Affogato","Sambuca","Limoncello",
  "Grappa","Prosecco","Lambrusco","Chianti","Barolo","Amarone","Brunello",
  "Nebbiolo","Sangiovese","Barbera","Primitivo","Vermentino","Trebbiano",
  "Moscato","Passito","Spumante","Birra","Sidro","Amaro","Vermouth",
  "Ragù","Besciamella","Sugo","Soffritto","Battuto","Fumetto",

  // CORPO UMANO E MEDICINA (150+)
  "Cervello","Polmone","Stomaco","Fegato","Ginocchio","Caviglia","Gomito","Spalla",
  "Sopracciglio","Mento","Guancia","Fronte","Tempia","Nuca","Vertebra","Costola",
  "Muscolo","Tendine","Arteria","Capillare","Femore","Tibia","Perone","Omero",
  "Clavicola","Scapola","Sterno","Bacino","Cranio","Mandibola",
  "Trachea","Esofago","Intestino","Pancreas","Milza","Rene","Vescica","Tiroide",
  "Retina","Cornea","Pupilla","Timpano","Laringe","Faringe","Bronchi",
  "Diaframma","Menisco","Cartilagine","Legamento","Midollo","Sinapsi","Neurone",
  "Globulo","Piastrina","Emoglobina","Anticorpo","Vaccino","Siringa","Bisturi",
  "Stetoscopio","Termometro","Radiografia","Ecografia","Risonanza","Diagnosi",
  "Terapia","Prognosi","Sintomo","Febbre","Frattura","Distorsione","Contusione",
  "Ematoma","Cicatrice","Sutura","Anestesia","Protesi","Trapianto","Biopsia",
  "Epidemia","Pandemia","Contagio","Immunità","Metabolismo","Ormone","Enzima",
  "Proteina","Vitamina","Caloria","Colesterolo","Glicemia","Pressione","Pulsazione",

  // OGGETTI QUOTIDIANI (200+)
  "Ombrello","Portafoglio","Chiave","Orologio","Occhiali","Telefono","Zaino","Valigia",
  "Bottiglia","Bicchiere","Forchetta","Coltello","Cucchiaio","Piatto","Pentola","Padella",
  "Sedia","Tavolo","Divano","Letto","Armadio","Cassetto","Specchio","Lampada","Candela",
  "Tappeto","Cuscino","Coperta","Lenzuolo","Asciugamano","Sapone","Spazzolino","Pettine",
  "Forbici","Matita","Penna","Gomma","Righello","Quaderno","Libro","Giornale","Rivista",
  "Busta","Francobollo","Moneta","Banconota","Sacchetto","Scatola","Corda","Catena",
  "Serratura","Martello","Cacciavite","Pinza","Chiodo","Vite","Scala","Secchio",
  "Cavatappi","Apribottiglie","Mestolo","Scolapasta","Grattugia","Mattarello",
  "Tagliere","Teglia","Caraffa","Thermos","Portachiavi","Accendino","Fiammifero",
  "Spilla","Spazzola","Rasoio","Phon","Appendiabiti","Gruccia",
  "Molletta","Scopa","Paletta","Aspirapolvere","Straccio",
  "Spugna","Detersivo","Secchiello","Annaffiatoio","Cesoie","Rastrello","Vanga",
  "Zappa","Carriola","Trapano","Sega","Pialla","Morsa",
  "Pennello","Spatola","Stucco","Cazzuola","Livella","Metro","Squadra",
  "Compasso","Goniometro","Calcolatrice","Lente","Microscopio","Telescopio",
  "Binocolo","Bussola","Cronometro","Sveglia","Clessidra","Pendolo","Bilancia",
  "Termostato","Interruttore","Torcia","Lanterna","Candelabro","Lampadario",
  "Tenda","Persiana","Tapparella","Zanzariera","Materasso",
  "Comodino","Cassettiera","Credenza","Scaffale","Libreria",
  "Scrivania","Poltrona","Sgabello","Amaca","Dondolo",
  "Timbro","Cucitrice","Graffetta","Elastico","Colla",

  // PROFESSIONI (120+)
  "Architetto","Avvocato","Barbiere","Calzolaio","Dentista","Farmacista","Giornalista",
  "Idraulico","Ingegnere","Libraio","Medico","Notaio","Oculista","Pediatra","Regista",
  "Sarto","Veterinario","Chirurgo","Pompiere","Poliziotto","Astronauta","Pilota",
  "Marinaio","Pescatore","Contadino","Panettiere","Pasticciere","Cuoco","Cameriere",
  "Maestro","Professore","Scienziato","Ricercatore","Musicista","Pittore","Scultore",
  "Attore","Cantante","Ballerino","Fotografo","Scrittore","Poeta","Filosofo","Archeologo",
  "Psicologo","Sociologo","Economista","Diplomatico","Ambasciatore","Magistrato",
  "Geometra","Commercialista","Consulente","Analista","Programmatore",
  "Infermiere","Ostetrica","Fisioterapista","Logopedista","Nutrizionista","Biologo",
  "Chimico","Fisico","Matematico","Geologo","Astronomo","Meteorologo",
  "Agronomo","Enologo","Erborista","Antiquario","Restauratore","Liutaio",
  "Orafo","Ceramista","Vetraio","Fabbro","Falegname","Muratore","Elettricista",
  "Imbianchino","Giardiniere","Fioraio","Tassista","Camionista",
  "Ferroviere","Macchinista","Postino","Fattorino","Portiere","Guardiano",
  "Bagnino","Gondoliere","Apicoltore","Casaro","Pastore",
  "Minatore","Boscaiolo","Guida","Interprete","Traduttore",
  "Editore","Bibliotecario","Archivista","Speleologo","Vulcanologo",
  "Paleontologo","Antropologo","Cartografo","Topografo",

  // GEOGRAFIA E NATURA (200+)
  "Montagna","Collina","Pianura","Valle","Deserto","Foresta","Giungla","Prateria",
  "Vulcano","Ghiacciaio","Cascata","Sorgente","Torrente","Fiume","Lago","Stagno",
  "Palude","Oceano","Scogliera","Spiaggia","Penisola","Arcipelago","Continente",
  "Orizzonte","Tramonto","Arcobaleno","Tempesta","Fulmine","Tuono","Grandine","Nebbia",
  "Rugiada","Brina","Valanga","Terremoto","Maremoto","Uragano","Tornado","Ciclone",
  "Tundra","Savana","Steppa","Taiga","Atollo","Geyser",
  "Caldera","Faglia","Cratere","Altopiano","Canyon","Gola","Fiordo","Baia",
  "Insenatura","Promontorio","Istmo","Golfo","Stretto","Canale","Delta","Estuario",
  "Meandro","Affluente","Confluenza","Foce","Diga","Argine","Bacino",
  "Falda","Grotta","Caverna","Stalattite","Stalagmite","Geode",
  "Fossile","Minerale","Quarzo","Granito","Basalto","Ardesia","Arenaria","Calcare",
  "Marmo","Ossidiana","Pomice","Tufo","Argilla","Torba",
  "Muschio","Lichene","Felce","Edera","Liana","Bambù","Sequoia","Baobab",
  "Palma","Cipresso","Pino","Abete","Larice","Quercia","Faggio","Betulla",
  "Salice","Pioppo","Olmo","Platano","Acero","Tiglio","Castagno",
  "Olivo","Mandorlo","Ciliegio","Melo","Pero","Pesco",
  "Vigneto","Frutteto","Bosco","Pineta","Macchia",
  "Radura","Sentiero","Crinale","Vetta","Passo","Valico","Pendio",
  "Dirupo","Burrone","Precipizio","Duna","Oasi",
  "Monsone","Maestrale","Tramontana","Scirocco","Libeccio","Grecale",
  "Burrasca","Tifone","Blizzard","Acquazzone","Diluvio","Pioggia","Nevicata",
  "Aurora","Eclissi","Foschia","Banchisa","Iceberg","Permafrost",
  "Calanchi","Frana","Smottamento","Morena",

  // SPORT (150+)
  "Pallone","Canestro","Racchetta","Bicicletta","Skateboard","Paracadute","Trampolino",
  "Maratona","Staffetta","Scherma","Pugilato","Pallavolo","Pallanuoto","Tuffo",
  "Slalom","Snowboard","Pattinaggio","Vela","Canottaggio","Equitazione","Arrampicata",
  "Bersaglio","Podio","Medaglia","Cronometro","Arbitro","Portiere","Difensore",
  "Centrocampista","Attaccante","Rigore","Punizione","Fuorigioco","Dribbling",
  "Rovesciata","Traversa","Palo","Rete","Tribuna","Spalti","Spogliatoio",
  "Fischietto","Cartellino","Classifica","Spareggio","Retrocessione","Promozione",
  "Scudetto","Coppa","Trofeo","Torneo","Campionato","Semifinale","Finale",
  "Supplementari","Girone","Tabellone","Qualificazione","Batteria","Corsia",
  "Ostacolo","Disco","Giavellotto","Martello","Decathlon","Pentathlon","Triathlon",
  "Discesa","Gigante","Fondo","Freestyle","Halfpipe","Curling","Bob","Skeleton",
  "Volteggio","Parallele","Sbarra","Anelli","Trave",
  "Surfing","Windsurf","Kitesurf","Immersione","Rafting","Kayak",
  "Canoa","Regata","Bolina","Virata",
  "Scacchi","Dama","Backgammon","Biliardo","Freccette","Bocce",
  "Cricket","Rugby","Baseball","Hockey","Polo","Badminton",
  "Deltaplano","Parapendio","Pattini","Snowboard",

  // MUSICA E ARTE (150+)
  "Pianoforte","Violino","Chitarra","Batteria","Tromba","Flauto","Sassofono","Fisarmonica",
  "Clarinetto","Violoncello","Contrabbasso","Arpa","Tamburo","Xilofono","Mandolino",
  "Melodia","Sinfonia","Concerto","Orchestra","Spartito","Direttore","Palcoscenico",
  "Sipario","Platea","Galleria","Affresco","Mosaico","Acquerello","Scultura","Cornice",
  "Ukulele","Banjo","Corno","Fagotto","Oboe","Tuba","Trombone","Ottavino",
  "Clavicembalo","Organo","Celesta","Vibrafono","Marimba","Gong",
  "Nacchere","Tamburello","Bongo","Maracas","Triangolo",
  "Sonata","Fuga","Preludio","Ballata","Serenata","Notturno",
  "Requiem","Cantata","Madrigale","Aria","Libretto","Coro","Solista",
  "Tenore","Baritono","Basso","Soprano","Contralto",
  "Diapason","Metronomo","Leggio","Bacchetta","Archetto","Plettro",
  "Arpeggio","Trillo","Glissando","Crescendo","Diminuendo",
  "Tempera","Acquaforte","Litografia","Serigrafia","Incisione",
  "Bassorilievo","Altorilievo","Installazione","Performance",
  "Cavalletto","Tavolozza","Pennello","Tela","Carboncino","Pastello",
  "Prospettiva","Chiaroscuro","Velatura","Patina",

  // SCIENZA E TECNOLOGIA (200+)
  "Telescopio","Microscopio","Laboratorio","Provetta","Molecola","Atomo","Elettrone",
  "Protone","Galassia","Asteroide","Cometa","Satellite","Orbita","Gravità","Magnetismo",
  "Algoritmo","Database","Processore","Tastiera","Stampante","Antenna",
  "Circuito","Transistor","Frequenza","Turbina","Reattore","Propulsore",
  "Neutrone","Fotone","Quark","Bosone","Plasma","Isotopo","Fusione","Fissione",
  "Supernova","Pulsar","Quasar","Nebulosa","Costellazione",
  "Latitudine","Longitudine","Meridiano","Parallelo","Equatore","Tropico","Emisfero",
  "Cromosoma","Genoma","Enzima","Proteina","Mitocondrio","Ribosoma","Citoplasma",
  "Membrana","Nucleo","Cellula","Tessuto","Organo",
  "Fotosintesi","Osmosi","Mitosi","Simbiosi","Mutazione","Evoluzione",
  "Selezione","Adattamento","Estinzione","Biodiversità","Ecosistema","Biosfera",
  "Atmosfera","Stratosfera","Ionosfera","Litosfera","Idrosfera",
  "Resistenza","Condensatore","Diodo","Semiconduttore","Superconduttore",
  "Microchip","Silicio","Laser","Radar","Sonar",
  "Scanner","Router","Server","Firewall","Pixel",
  "Blockchain","Interfaccia","Simulazione","Prototipo","Brevetto",
  "Ingranaggio","Pistone","Biella","Volano","Frizione",
  "Ossigeno","Azoto","Carbonio","Idrogeno","Ferro","Rame","Zinco","Argento",
  "Oro","Platino","Titanio","Tungsteno","Mercurio","Piombo","Alluminio",
  "Cromo","Nichel","Cobalto","Manganese","Magnesio","Calcio","Sodio","Potassio",
  "Polimero","Grafene","Neon","Argon","Elio",

  // ABBIGLIAMENTO (120+)
  "Cappello","Sciarpa","Guanto","Cintura","Cravatta","Giacca","Cappotto","Impermeabile",
  "Maglione","Camicia","Pantaloni","Gonna","Vestito","Costume","Pigiama","Accappatoio",
  "Stivale","Sandalo","Pantofola","Ciabatta","Calzino","Bottone","Cerniera","Bretella",
  "Papillon","Foulard","Bandana","Turbante","Basco","Bombetta","Cilindro",
  "Berretto","Visiera","Cuffia","Gilet","Blazer","Cardigan","Felpa",
  "Canottiera","Polo","Tunica","Kimono","Poncho","Mantello","Pelliccia","Piumino",
  "Trench","Salopette","Tuta","Bermuda","Pantaloncini","Minigonna",
  "Corsetto","Moccasino","Ballerina","Zoccolo","Anfibio",
  "Ciondolo","Bracciale","Orecchino","Anello","Collana","Spilla",
  "Diadema","Tiara","Fermaglio","Fibbia","Laccio",
  "Velluto","Seta","Raso","Organza","Tulle","Pizzo","Merletto",
  "Taffetà","Chiffon","Tweed","Denim","Lino","Cotone",
  "Cashmere","Mohair","Pelle","Camoscio","Vernice",

  // CASA E ARCHITETTURA (150+)
  "Balcone","Terrazza","Soffitta","Cantina","Garage","Camino","Comignolo","Grondaia",
  "Persiana","Ringhiera","Pavimento","Soffitto","Colonna","Arco","Cupola","Campanile",
  "Cattedrale","Fortezza","Castello","Torre","Ponte","Fontana","Acquedotto","Faro",
  "Molo","Porto","Stazione","Aeroporto","Rotonda","Semaforo","Marciapiede",
  "Navata","Cripta","Sagrestia","Chiostro","Portico","Loggia",
  "Pinnacolo","Guglia","Architrave","Timpano","Capitello",
  "Cornicione","Pilastro","Basamento","Piedistallo",
  "Volta","Lucernario","Rosone","Bifora","Trifora",
  "Feritoia","Merlatura","Gargoyle","Mascherone",
  "Cortile","Atrio","Vestibolo","Corridoio","Tinello",
  "Soggiorno","Cucina","Bagno","Ripostiglio","Guardaroba","Studio","Veranda",
  "Pergolato","Gazebo","Serra","Capanno","Rimessa","Granaio","Fienile","Stalla",
  "Piscina","Sauna","Mansarda","Soppalco","Bovindo",
  "Grattacielo","Palazzo","Villetta","Casale","Masseria","Trullo",
  "Baita","Chalet","Bungalow","Igloo","Pagoda","Minareto",
  "Obelisco","Piramide","Anfiteatro","Acquario","Planetario","Osservatorio",
  "Pinacoteca","Biblioteca","Municipio","Tribunale",
  "Caserma","Ospedale","Farmacia","Mercato","Bottega",

  // TRASPORTI (100+)
  "Locomotiva","Mongolfiera","Dirigibile","Sottomarino","Transatlantico",
  "Motocicletta","Fuoristrada","Ambulanza","Elicottero","Funivia","Teleferica",
  "Gondola","Traghetto","Catamarano","Monopattino","Automobile",
  "Furgone","Camion","Betoniera","Ruspa","Escavatore","Bulldozer","Trattore",
  "Motoscafo","Peschereccio","Rimorchiatore","Veliero","Brigantino","Galeone",
  "Caravella","Fregata","Sommergibile","Portaerei","Hovercraft","Aliscafo",
  "Aeroplano","Aliante","Biplano","Idrovolante","Ultraleggero",
  "Razzo","Sonda","Metropolitana","Filobus","Autobus","Pullman",
  "Seggiovia","Telecabina","Funicolare","Slitta","Canoa","Piroga",
  "Gommone","Zattera","Motoslitta","Motorino","Scooter","Vespa",

  // EMOZIONI E ASTRATTO (120+)
  "Coraggio","Paura","Felicità","Tristezza","Rabbia","Sorpresa","Nostalgia","Speranza",
  "Orgoglio","Vergogna","Gelosia","Invidia","Gratitudine","Pazienza","Saggezza",
  "Intelligenza","Fantasia","Creatività","Curiosità","Avventura","Mistero","Segreto",
  "Libertà","Giustizia","Armonia","Equilibrio","Silenzio","Solitudine","Amicizia",
  "Amore","Rancore","Rimorso","Pentimento","Redenzione","Perdono","Vendetta",
  "Compassione","Empatia","Simpatia","Antipatia","Indifferenza","Rassegnazione",
  "Determinazione","Ambizione","Presunzione","Umiltà","Modestia","Vanità",
  "Generosità","Prudenza","Perseveranza","Tenacia","Resilienza",
  "Tolleranza","Rispetto","Dignità","Onore","Lealtà","Fiducia","Tradimento",
  "Sincerità","Ipocrisia","Verità","Illusione","Delusione","Aspettativa",
  "Malinconia","Euforia","Angoscia","Ansia","Panico","Terrore","Stupore",
  "Meraviglia","Incanto","Fascino","Carisma","Attrazione",
  "Tenerezza","Dolcezza","Amarezza","Rimpianto",
  "Desiderio","Passione","Entusiasmo","Apatia","Noia",

  // DANZA E BALLI
  "Valzer","Tango","Samba","Rumba","Salsa","Merengue","Bachata","Flamenco",
  "Tarantella","Polka","Mazurka","Minuetto","Bolero","Fandango",
  "Charleston","Foxtrot","Quickstep",

  // TEMPO E CALENDARIO
  "Calendario","Anniversario","Compleanno","Carnevale","Capodanno","Epifania",
  "Quaresima","Ferragosto","Vendemmia","Semestre","Trimestre","Biennio","Decennio",
  "Millennio","Equinozio","Solstizio","Crepuscolo","Mezzanotte","Mezzogiorno",
  "Lustro","Secolo","Epoca","Istante","Attimo","Momento","Intervallo",

  // MITOLOGIA
  "Drago","Fenice","Unicorno","Centauro","Minotauro","Sirena","Ciclope","Grifone",
  "Chimera","Sfinge","Pegaso","Idra","Titano","Ninfa","Oracolo","Labirinto",
  "Troll","Elfo","Gnomo","Goblin","Orco","Strega","Mago","Folletto",
  "Fata","Vampiro","Licantropo","Fantasma","Spettro","Demone","Angelo",
  "Basilisco","Cerbero","Kraken","Leviatano","Golem","Banshee",

  // GIOCHI
  "Scacchiera","Dama","Domino","Roulette","Puzzle","Caleidoscopio",
  "Marionetta","Burattino","Giocoliere","Acrobata","Trapezista","Prestigiatore",
  "Altalena","Scivolo","Trottola","Aquilone","Boomerang",
  "Rompicapo","Solitario","Tangram","Origami",
  "Flipper","Jukebox","Karaoke","Tombola",

  // MATERIALI
  "Diamante","Smeraldo","Rubino","Zaffiro","Ambra","Corallo","Alabastro",
  "Porcellana","Terracotta","Pergamena","Papiro","Turchese","Topazio","Ametista",
  "Opale","Giada","Onice","Lapislazzuli","Agata","Malachite","Diaspro",
  "Bronzo","Ottone","Peltro","Ghisa","Acciaio","Cristallo",
  "Gomma","Ebano","Palissandro","Mogano","Teak","Sughero",
  "Canapa","Cotto","Gres","Grafite","Ardesia",

  // LETTERATURA
  "Romanzo","Racconto","Novella","Fiaba","Favola","Leggenda","Mito","Epopea",
  "Poesia","Sonetto","Ode","Elegia","Epigramma","Filastrocca",
  "Metafora","Similitudine","Allegoria","Ironia","Sarcasmo","Iperbole","Paradosso",
  "Ossimoro","Antitesi","Onomatopea","Allitterazione","Anafora",
  "Prologo","Epilogo","Capitolo","Strofa","Verso","Rima",
  "Trama","Protagonista","Antagonista","Narratore",
  "Dialogo","Monologo","Aforisma","Proverbio",
  "Vocabolario","Dizionario","Enciclopedia","Glossario","Almanacco",

  // ECONOMIA
  "Bilancio","Fattura","Ricevuta","Scontrino","Bolletta","Mutuo","Prestito",
  "Interesse","Dividendo","Azione","Obbligazione","Rendita","Patrimonio","Capitale",
  "Investimento","Inflazione","Deflazione","Recessione",
  "Monopolio","Concorrenza","Quotazione","Fallimento",
  "Dogana","Dazio","Sussidio","Incentivo","Detrazione",
  "Imposta","Aliquota","Catasto","Ipoteca","Garanzia",

  // DIRITTO
  "Costituzione","Parlamento","Senato","Decreto","Ordinanza","Statuto",
  "Regolamento","Articolo","Emendamento","Referendum",
  "Amnistia","Indulto","Arresto","Perquisizione","Sequestro","Confisca",
  "Processo","Udienza","Sentenza","Appello","Ricorso","Prescrizione",
  "Testimone","Imputato","Difensore","Giuria",

  // COMUNICAZIONE
  "Trasmissione","Antenna","Canale","Palinsesto","Sigla",
  "Telegiornale","Documentario","Reportage","Intervista","Dibattito","Sondaggio",
  "Redazione","Corrispondente","Inviato","Cronista",
  "Titolo","Sottotitolo","Didascalia","Corsivo","Grassetto",
  "Impaginazione","Tiratura","Edizione","Supplemento","Inserto",

  // EXTRA VARIE
  "Bussola","Lanterna","Fischietto","Barometro","Abaco",
  "Fionda","Balestra","Scudo","Armatura","Elmo","Stemma","Blasone",
  "Stendardo","Bandiera","Coccarda","Medaglione","Amuleto","Talismano",
  "Prisma","Cristallo","Perla","Conchiglia","Vortice","Spirale",
  "Onda","Marea","Corrente","Mulinello","Risacca","Brezza",
  "Falò","Braciere","Fornace","Fucina","Incudine","Mantice",
  "Alambicco","Mortaio","Setaccio","Imbuto","Puleggia","Argano",
  "Trincea","Fortino","Bastione","Sentinella","Vedetta","Avamposto",
  "Convoglio","Carovana","Pellegrinaggio","Processione","Corteo","Parata",
  "Cerimonia","Inaugurazione","Battesimo","Diploma","Laurea","Cattedra",
  "Maschera","Costume","Parrucca","Coreografia","Scenografia","Copione",
  "Doppiaggio","Botteghino","Premiere",
  "Cabina","Pennone","Chiglia","Stiva","Oblò","Passerella",
  "Bambino","Donna","Uomo","Ragazzo","Ragazza","Neonato","Anziano",
  "Famiglia","Parente","Cugino","Nipote","Padrino","Madrina",
  "Scuola","Università","Accademia","Lezione","Esame","Compito","Vacanza",
  "Chiesa","Tempio","Santuario","Basilica","Cappella","Abbazia",
  "Monastero","Convento","Oratorio",
  "Bivio","Incrocio","Svincolo","Cavalcavia","Sottopassaggio","Galleria",
  "Tunnel","Viadotto","Casello","Semaforo","Segnale"
  
  // --- I NUOVI VERBI ALL'INFINITO (DATABASE ESPANSO) ---
  "Abbandonare","Abbagliare","Abbinare","Abitare","Abituare","Accadere","Accarezzare","Accendere","Accettare","Accogliere","Accompagnare","Acconsentire","Accorgersi","Accumulare","Accusare","Acquistare","Adattare","Addolcire","Addormentare","Adempiere","Aderire","Adoperare","Adorare","Adornare","Adottare","Affacciarsi","Affamare","Affascinare","Affermare","Afferrare","Affidare","Affilare","Affittare","Affliggere","Affogare","Affondare","Affrontare","Agevolare","Agganciare","Aggiornare","Aggirare","Aggiungere","Aggiustare","Aggredire","Aggregare","Agitare","Aiutare","Alimentare","Allargare","Allarmare","Allenare","Allevare","Allontanare","Alludere","Alzare","Amare","Ammettere","Amministrare","Ammirare","Ammonire","Ammorbidire","Analizzare","Andare","Annotare","Annunciare","Annullare","Anticipare","Apparire","Appartenere","Appassionare","Appellare","Appendere","Applaudire","Applicare","Appoggiare","Apprezzare","Approfondire","Approvare","Aprire","Arredare","Arrestare","Arrivare","Arrossire","Arrostire","Ascoltare","Aspettare","Aspirare","Assaggiare","Assalire","Assecondare","Assicurare","Assistere","Associare","Assolvere","Assorbire","Assumere","Attaccare","Attendere","Atterrare","Attingere","Attirare","Attivare","Attraversare","Attribuire","Aumentare","Avanzare","Avere","Avvertire","Avvicinare","Avvolgere","Azzardare","Baciare","Bagnare","Ballare","Barattare","Bastare","Battere","Beffare","Benedire","Bere","Biasimare","Bighellonare","Bloccare","Bollire","Brillare","Bruciare","Brontolare","Buffare","Buttare","Cadere","Calare","Calcolare","Calmare","Calpestare","Cambiare","Camminare","Cancellare","Cantare","Capire","Capovolgere","Caricare","Carpire","Cavalcare","Cedere","Celebrare","Cercare","Certificare","Cestinare","Chiamare","Chiedere","Chiudere","Circondare","Citare","Classificare","Cucinare","Cucire","Curare","Custodire","Danzare","Dare","Decidere","Decifrare","Declinare","Decollare","Dedurre","Definire","Delegare","Deliberare","Deludere","Denunciare","Deporre","Descrivere","Desiderare","Destinare","Determinare","Dettare","Deviare","Dialogare","Dichiarare","Difendere","Diffondere","Digerire","Digitare","Dimenticare","Dimostrare","Dipingere","Dire","Dirigere","Discutere","Disegnare","Disfare","Disporre","Distruggere","Divertire","Dividere","Divulgare","Documentare","Domandare","Dormire","Dovere","Dubitare","Durare","Eccellere","Eclissare","Educare","Effettuare","Elaborare","Eleggere","Elevare","Eliminare","Elogiare","Emanare","Emergere","Emettere","Emozionare","Entrare","Esagerare","Esaltare","Esaminare","Esasperare","Escludere","Eseguire","Esercitare","Esigere","Esistere","Esitare","Espandere","Esperire","Esplodere","Esplorare","Esporre","Esprimere","Essere","Estrarre","Evaporare","Evidenziare","Evitare","Evocare","Fabbricare","Fallire","Falsificare","Faticare","Favorire","Fermare","Festeggiare","Fidarsi","Figurare","Filtrare","Finire","Fissare","Fluttuare","Fondare","Formare","Forzare","Fotografare","Frenare","Frequentare","Friggere","Fuggire","Fumare","Funzionare","Garantire","Gareggiare","Gattonare","Gelare","Generare","Gestire","Gettare","Giocare","Girare","Giudicare","Giungere","Giurare","Godere","Governare","Graffiare","Gratificare","Gridare","Guadagnare","Guardare","Guarire","Guidare","Gustare","Illudere","Illuminare","Immaginare","Imparare","Impedire","Impiegare","Imporre","Imprimere","Inaugurare","Incanalare","Incantare","Incapricciarsi","Incedere","Incentivare","Inchiudere","Inciampare","Incidere","Incoraggiare","Incrementare","Incuriosire","Indicare","Indovinare","Indurre","Infilare","Infliggere","Informare","Ingannare","Ingrandire","Iniziare","Innaffiare","Innamorarsi","Innalzare","Innestare","Inoltrare","Inquadrare","Inquietare","Inseguire","Inserire","Insegnare","Insistere","Ispirare","Installare","Intuire","Inveire","Inventare","Invertire","Investire","Inviare","Invitare","Invocare","Ipotizzare","Irrorare","Iscriversi","Istruire","Lanciare","Lasciare","Lavorare","Legare","Leggere","Lievitare","Limitare","Litigare","Lodare","Lottare","Luccicare","Lucidare","Lusingare","Macinare","Mandare","Mangiare","Manifestare","Mantenere","Maturare","Mediare","Meditare","Menzionare","Meritare","Mescolare","Mettere","Migliorare","Minacciare","Misurare","Modificare","Mordere","Morire","Mostrare","Muovere","Mutilare","Narrare","Nascere","Nascondere","Navigare","Negare","Negoziare","Nominare","Notare","Nuotare","Nutrire","Obbedire","Obiettare","Obbligare","Occupare","Odiare","Offrire","Oltrepassare","Omaggiare","Ommettere","Onorare","Operare","Opinare","Opporsi","Ordinare","Organizzare","Orientare","Ornare","Osservare","Ottenere","Ottimizzare","Ovviare","Pagare","Paragonare","Parare","Parlare","Partecipare","Partire","Passare","Pattinare","Peculiarizzare","Pedalare","Penare","Pensare","Percepire","Perdere","Perdonare","Perfezionare","Perforare","Permanere","Permettere","Perseguire","Persistere","Personalizzare","Persuadere","Pescare","Piacere","Piangere","Pianificare","Piazzare","Picchiettare","Piegare","Piovere","Pitturare","Pizzicare","Placare","Pianificare","Ponderare","Porre","Portare","Possedere","Posticipare","Potere","Pranzare","Praticare","Precedere","Precipitare","Precisare","Predire","Preferire","Pregare","Prelevare","Premere","Prenotare","Preoccuparsi","Preparare","Presentare","Preservare","Prestare","Presumere","Pretendere","Prevalere","Prevedere","Prevenire","Privare","Procedere","Proclamare","Procurare","Produrre","Progettare","Programmare","Progredire","Proibire","Prolungare","Promettere","Promuovere","Pronunciare","Proporre","Prorogare","Proseguire","Provare","Provocare","Provvedere","Pubblicare","Pulire","Pungere","Punire","Puntare","Puntualizzare","Qualificare","Quagliare","Questionare","Quietare","Quotare","Raccogliere","Raccomandare","Raccontare","Raddoppiare","Rafforzare","Raggiungere","Ragionare","Rallegrarsi","Rallentare","Rappresentare","Rassicurare","Reagire","Realizzare","Recuperare","Redigere","Regalare","Registrare","Regnare","Relazionare","Remare","Rende","Resistere","Respirare","Restare","Restituire","Rialzare","Riassumere","Ribadire","Ricamare","Ricercare","Ricevere","Richiedere","Riciclare","Ricordare","Riconoscere","Ricostruire","Ridurre","Riflettere","Rifiutare","Rigenerare","Riguardare","Rilasciare","Rilevare","Rimanere","Rimediare","Rimettere","Rimodernare","Rimuovere","Rinascere","Rincontrare","Rinfrescare","Ringraziare","Rinnovare","Rinunciare","Riparare","Ripartire","Ripetere","Riporre","Riportare","Riposare","Ripristinare","Riprodurre","Ripulire","Rischiare","Risolvere","Risparmiare","Rispettare","Rispondere","Ristorare","Risultare","Ritardare","Ritenere","Ritirare","Ritornare","Ritrovare","Riuscire","Rivelare","Rivedere","Rivivere","Rivolgere","Rovinare","Rubare","Ruminare","Ruotare","Ruzzolare","Sabbiare","Sacrificare","Salire","Saltare","Salutare","Salvare","Sanare","Sapere","Sbagliare","Sbalordire","Sbandare","Sbarcare","Sbarrare","Sbattere","Sbiancare","Sbloccare","Sbocciare","Sbottonare","Sbranare","Sbrigare","Scadere","Scagliare","Scalare","Scaldare","Scambiare","Scappare","Scaricare","Scartare","Scatenare","Scavare","Scegliere","Scendere","Scherzare","Schiacciare","Schierare","Schivare","Scivolare","Scollegare","Scommettere","Sconfortare","Scontare","Sconvolgere","Scoprire","Scorgere","Scorrere","Scovare","Scrivere","Scrutare","Scuotere","Scurire","Sdebitarsi","Sdoganare","Sdraiarsi","Sedare","Sedurre","Segnare","Seguire","Selezionare","Seminare","Sembrare","Sentire","Separare","Seppellire","Serbare","Serrare","Servire","Sfidare","Sfilare","Sfogliare","Sforzare","Sfruttare","Sfumare","Sganciare","Sgomberare","Sgridare","Sguinzagliare","Sigillare","Silenziare","Simulare","Sincronizzare","Sistemare","Slegare","Slittare","Sloggiare","Smaltire","Smarrire","Smentire","Smettere","Smontare","Smussare","Snellire","Snodare","Soffiare","Soffocare","Soffrire","Sognare","Solcare","Sollecitare","Sollevare","Sommare","Sondare","Sopportare","Sopravvivere","Sorgere","Sorprendere","Sorridere","Sorvegliare","Sospendere","Sospirare","Sostenere","Sostituire","Sottrarre","Spalancare","Spalmare","Sparare","Sparire","Spartire","Spaventare","Spaziare","Spedire","Spegnere","Sperare","Sperimentare","Spezzare","Spiegare","Spingere","Spirare","Splendere","Spogliare","Spostare","Sprecare","Spremere","Spuntare","Sputare","Stabilire","Staccare","Stancare","Stappare","Stare","Stendere","Sterzare","Stimare","Stimolare","Stipulare","Stirare","Stordire","Stravolgere","Strepitare","Stringere","Strizzare","Studiare","Stupire","Suonare","Superare","Supporre","Sussurrare","Svalutare","Svegliare","Svelare","Sventolare","Sviluppare","Svolgere","Svuotare","Tacere","Tagliare","Tardare","Tatuare","Teletrasportare","Temere","Temperare","Tendere","Tenere","Tentare","Terminare","Terzare","Testimoniare","Tifare","Tingere","Tirare","Toccare","Togliere","Tollerare","Tornare","Tostare","Tramandare","Tramite","Tranciare","Tranquillizzare","Trarre","Trascendere","Trascinare","Trascrivere","Trasferire","Trasformare","Trasmettere","Trasportare","Trattare","Trattenere","Traversare","Tremare","Trepidare","Trionfare","Trisciare","Tritare","Trovare","Tuffarsi","Tutelare","Uccidere","Udire","Uguagliare","Ululare","Umanizzare","Umettare","Umiliare","Unificare","Unire","Urgonare","Urlare","Urtare","Usare","Uscire","Usufruire","Usurpare","Utilizzare","Vacillare","Vagare","Vagliare","Valere","Validare","Valutare","Vandallizzare","Vantare","Varare","Variare","Vedere","Vegliare","Venerare","Venire","Ventilare","Verificare","Versare","Vestire","Viaggiare","Vietare","Vigilare","Vincere","Vincolare","Visitare","Vivere","Viziarsi","Vociare","Vogare","Volare","Volere","Volgere","Voltare","Vuotare","Zampillare","Zappare","Zittire","Zoppicare"
];

// ═══════════════════════════════════════════════════
// PAROLE COMPOSTE — 1000+ espressioni
// ═══════════════════════════════════════════════════
const PAROLE_COMPOSTE = [
  // ═══ PERSONAGGI ITALIANI ═══
  "Sophia Loren","Alberto Sordi","Anna Magnani","Marcello Mastroianni",
  "Federico Fellini","Roberto Benigni","Monica Bellucci","Andrea Bocelli",
  "Luciano Pavarotti","Adriano Celentano","Raffaella Carrà","Gigi Proietti",
  "Massimo Troisi","Carlo Verdone","Luca Zingaretti","Fabio Fazio",
  "Pippo Baudo","Mike Bongiorno","Renzo Arbore","Corrado Guzzanti",
  "Checco Zalone","Paolo Villaggio","Nino Manfredi","Vittorio Gassman",
  "Ugo Tognazzi","Gianni Morandi","Renato Zero","Vasco Rossi","Lucio Dalla",
  "Fabrizio De André","Franco Battiato","Patty Pravo","Ornella Vanoni",
  "Zucchero Fornaciari","Eros Ramazzotti","Laura Pausini","Tiziano Ferro",
  "Gianna Nannini","Alessandra Amoroso","Marco Mengoni",
  "Valentino Rossi","Gianluigi Buffon","Francesco Totti","Alessandro Del Piero",
  "Roberto Baggio","Paolo Maldini","Jannik Sinner","Samantha Cristoforetti",
  "Rita Levi-Montalcini","Maria Montessori","Leonardo da Vinci",
  "Michelangelo Buonarroti","Galileo Galilei","Giuseppe Garibaldi",
  "Giuseppe Mazzini","Dante Alighieri","Alessandro Manzoni","Giovanni Verga",
  "Luigi Pirandello","Italo Calvino","Umberto Eco","Primo Levi","Eugenio Montale",
  "Giorgio Armani","Gianni Versace","Miuccia Prada","Valentino Garavani",
  "Enzo Ferrari","Giovanni Agnelli","Enrico Fermi","Guglielmo Marconi",
  "Antonio Vivaldi","Giacomo Puccini","Giuseppe Verdi","Gioachino Rossini",
  "Arturo Toscanini","Enrico Caruso","Domenico Modugno","Mina Mazzini",
  "Bud Spencer","Terence Hill","Alberto Angela","Piero Angela","Bruno Vespa",
  "Mara Venier","Maria De Filippi","Gerry Scotti","Carlo Conti",
  "Fiorello","Luciana Littizzetto","Maurizio Costanzo","Enzo Biagi",
  "Indro Montanelli","Oriana Fallaci","Pier Paolo Pasolini","Alberto Moravia",
  "Cesare Pavese","Italo Svevo","Grazia Deledda","Giosuè Carducci",
  "Giovanni Pascoli","Giacomo Leopardi","Ludovico Ariosto","Torquato Tasso",
  "Niccolò Machiavelli","Francesco Petrarca","Giovanni Boccaccio",
  "Cristoforo Colombo","Marco Polo","Amerigo Vespucci",
  "Lorenzo de' Medici","Francesco d'Assisi","Padre Pio","Don Bosco",
  "Alex Zanardi","Federica Pellegrini","Alberto Tomba","Reinhold Messner",
  "Sara Simeoni","Deborah Compagnoni","Pietro Mennea",

  // ═══ PERSONAGGI INTERNAZIONALI ═══
  "Albert Einstein","Isaac Newton","Charles Darwin","Marie Curie",
  "Nelson Mandela","Mahatma Gandhi","Martin Luther King","Madre Teresa",
  "Winston Churchill","John Kennedy","Barack Obama","Napoleone Bonaparte",
  "Neil Armstrong","Yuri Gagarin","Buzz Aldrin",
  "Wolfgang Amadeus Mozart","Ludwig van Beethoven","Johann Sebastian Bach",
  "Elvis Presley","Michael Jackson","Freddie Mercury","John Lennon",
  "Bob Marley","David Bowie","Frank Sinatra","Louis Armstrong",
  "Charlie Chaplin","Marilyn Monroe","Audrey Hepburn","Alfred Hitchcock",
  "Steven Spielberg","Stanley Kubrick","Walt Disney",
  "Pablo Picasso","Vincent van Gogh","Salvador Dalí","Andy Warhol",
  "William Shakespeare","Oscar Wilde","Mark Twain","Ernest Hemingway",
  "Agatha Christie","Arthur Conan Doyle","Jules Verne",
  "Lionel Messi","Cristiano Ronaldo","Diego Maradona","Pelé",
  "Muhammad Ali","Michael Jordan","Roger Federer","Usain Bolt",
  "Frida Kahlo","Coco Chanel","Steve Jobs","Bill Gates",
  "Nikola Tesla","Thomas Edison","Sigmund Freud","Karl Marx",
  "Cleopatra","Alessandro Magno","Gengis Khan","Tutankhamon",
  "Giovanna d'Arco","Guglielmo Tell",
  "Wolfgang Goethe","Franz Kafka","Victor Hugo","Molière","Voltaire",
  "Charles Dickens","Jane Austen","George Orwell",
  "Edgar Allan Poe","Pablo Neruda",
  "Frédéric Chopin","Claude Debussy","Maria Callas",
  "Bob Dylan","Bruce Springsteen","Mick Jagger","Paul McCartney",
  "Jimi Hendrix","Kurt Cobain","Madonna","Whitney Houston",
  "Aretha Franklin","Tina Turner","Beyoncé","Adele",
  "Meryl Streep","Robert De Niro","Al Pacino","Jack Nicholson",
  "Marlon Brando","James Dean","Humphrey Bogart",
  "Clint Eastwood","Harrison Ford","Tom Hanks","Leonardo DiCaprio",
  "Morgan Freeman","Brad Pitt",
  "Quentin Tarantino","Martin Scorsese","Francis Ford Coppola",
  "Tim Burton","Ridley Scott","James Cameron","Christopher Nolan",
  "Zinédine Zidane","David Beckham","Kylian Mbappé","Erling Haaland",
  "Rafael Nadal","Novak Đoković","Serena Williams",
  "Tiger Woods","Michael Phelps","Carl Lewis","Nadia Comăneci",
  "Ayrton Senna","Michael Schumacher","Lewis Hamilton","Niki Lauda",
  "Stephen Hawking","Alan Turing","Mark Zuckerberg","Jeff Bezos",
  "Lev Tolstoj","Fëdor Dostoevskij",
  "Antoine de Saint-Exupéry","Hans Christian Andersen",

  // ═══ LUOGHI FAMOSI ═══
  "Torre Eiffel","Grande Muraglia","Machu Picchu","Taj Mahal",
  "Cristo Redentore","Torre di Pisa","Piazza San Marco","Ponte Vecchio",
  "Fontana di Trevi","Cappella Sistina","Piazza del Campo","Palazzo Ducale",
  "Reggia di Caserta","Trulli di Alberobello","Sassi di Matera",
  "Valle dei Templi","Costa Smeralda","Cinque Terre","Monte Cervino",
  "Monte Rosa","Gran Paradiso","Lago di Garda","Lago di Como",
  "Lago Maggiore","Stretto di Messina","Canal Grande",
  "Central Park","Times Square","Wall Street","Silicon Valley",
  "Grand Canyon","Cascate del Niagara","Big Ben","Tower Bridge",
  "Buckingham Palace","Stonehenge","Notre Dame","Moulin Rouge",
  "Mont Blanc","Sagrada Familia","Porta di Brandeburgo","Muro di Berlino",
  "Piazza Rossa","Bocca della Verità","Castel Sant'Angelo",
  "Palazzo Pitti","Ponte di Rialto","Arena di Verona",
  "Basilica di San Pietro","Piazza Navona","Villa Borghese",
  "Fori Imperiali","Piazza di Spagna","Trinità dei Monti",
  "Galleria Vittorio Emanuele","Piazza del Duomo",
  "Ponte dei Sospiri","Mole Antonelliana",
  "Costiera Amalfitana","Isola di Capri",
  "Tre Cime di Lavaredo","Isole Eolie","Isola d'Elba",
  "Abbazia di Montecassino","San Gimignano",
  "Isole Borromee","Porto Cervo",
  "Abu Dhabi","Mar Morto","Petra","Angkor Wat",
  "Monte Fuji","Grande Barriera Corallina","Isola di Pasqua",
  "Chichén Itzá","Yellowstone","Galápagos","Serengeti","Kilimanjaro",
  "Victoria Falls","Monte Sinai","Capo di Buona Speranza",

  // ═══ ISTITUZIONI ═══
  "Nazioni Unite","Croce Rossa","Guardia di Finanza","Vigili del Fuoco",
  "Polizia Stradale","Guardia Costiera","Protezione Civile",
  "Corte Costituzionale","Corte dei Conti","Consiglio di Stato",
  "Camera dei Deputati","Palazzo Chigi","Palazzo Madama",
  "Banca d'Italia","Borsa Italiana","Fondo Monetario",
  "Giochi Olimpici","Coppa del Mondo","Champions League","Serie A",
  "Formula Uno","Giro d'Italia","Tour de France","Super Bowl",
  "Roland Garros","Coppa Davis","Ryder Cup",
  "Premio Nobel","Festival di Sanremo","Mostra del Cinema","Biennale di Venezia",
  "Scala di Milano","Palio di Siena","Carnevale di Venezia",
  "Accademia della Crusca",

  // ═══ ESPRESSIONI E LOCUZIONI ═══
  "Carta d'identità","Colpo di scena","Punto di vista","Senso unico",
  "Acqua e sapone","Stella cadente","Luna piena","Mezza luna",
  "Alta velocità","Prima classe","Anno bisestile",
  "Doppio gioco","Sesto senso","Settimo cielo",
  "Pane e burro","Sale e pepe","Bianco e nero","Pro e contro",
  "Botta e risposta","Tira e molla","Andata e ritorno","Alti e bassi",
  "Luci e ombre","Notte fonda","Ora di punta","Tempo pieno",
  "Parola d'onore","Colpo di stato","Stato d'animo","Giro di boa",
  "Colpo di fulmine","Colpo di sole","Colpo di testa","Colpo di grazia",
  "Passo falso","Falso allarme","Doppio senso","Senso vietato",
  "Carta bianca","Punto fermo","Due punti","Punto e virgola",
  "Filo rosso","Filo spinato","Pietra angolare","Pietra miliare",
  "Chiave inglese","Chiave di volta","Nota dolente","Nota stonata",
  "Fuori programma","Fuori gioco","Fuori luogo","Fuori orario",
  "Fuori stagione","Fuori serie","Tempo libero","Tempo reale",
  "Tempo supplementare","Tempo morto","Primo piano","Piano terra",
  "Terra ferma","Terra promessa","Terra di nessuno","Terra bruciata",
  "Mare aperto","Alta marea","Bassa marea","Vento forte","Vento contrario",
  "Acqua dolce","Acqua salata","Acqua minerale","Acqua corrente",
  "Fuoco sacro","Fuoco amico","Fuoco incrociato",
  "Luce verde","Luce rossa","Zona grigia","Zona franca",
  "Linea retta","Linea d'ombra","Linea di confine",
  "Campo minato","Campo base","Campo magnetico",
  "Circolo vizioso","Circolo virtuoso","Circolo polare",
  "Angolo retto","Angolo morto","Peso piuma","Peso massimo",
  "Via crucis","Via maestra","Via di fuga",
  "Mano libera","Mano tesa","Occhio nudo","Occhio clinico",
  "Testa calda","Testa dura","Testa di serie",
  "Braccio destro","Braccio di ferro","Bocca aperta","Bocca cucita",
  "Lingua madre","Lingua morta","Dente del giudizio","Dente di latte",
  "Cuore d'oro","Cuore di pietra","Cuore infranto",
  "Sangue freddo","Sangue blu","Nervi saldi","Pugno di ferro",
  "Mano di velluto","Parola chiave","Scelta di campo",

  // ═══ TITOLI DI FILM / OPERE (con articolo se parte del titolo) ═══
  "Il Padrino","Il Gladiatore","Il Postino","Il Gattopardo",
  "La Dolce Vita","La Vita è Bella","La Grande Bellezza",
  "Il Sorpasso","Il Conformista","Il Decameron",
  "Amici Miei","Cinema Paradiso","Benvenuti al Sud",
  "Perfetti Sconosciuti","Quo Vado",
  "Il Nome della Rosa","Il Piccolo Principe","Il Signore degli Anelli",
  "Il Codice Da Vinci","Il Vecchio e il Mare",
  "Guerra e Pace","Delitto e Castigo","Orgoglio e Pregiudizio",
  "Romeo e Giulietta","Alice nel Paese delle Meraviglie",
  "Cappuccetto Rosso","Pinocchio","Hansel e Gretel",

  // ═══ PIATTI E SPECIALITÀ ═══
  "Panna cotta","Torta della nonna","Pasta al forno","Bistecca fiorentina",
  "Ossobuco alla milanese","Vitello tonnato","Bagna cauda","Pesto genovese",
  "Ragù bolognese","Cacio e pepe","Aglio e olio","Frutti di mare",
  "Insalata caprese","Carpaccio di manzo","Aceto balsamico","Olio extravergine",
  "Caffè espresso","Caffè macchiato","Latte macchiato","Cioccolata calda",
  "Granita siciliana","Risotto alla milanese","Risotto ai funghi",
  "Pasta alla norma","Spaghetti alle vongole","Gnocchi al pesto",
  "Fettuccine al ragù","Penne all'arrabbiata","Lasagne al forno",
  "Tortellini in brodo","Pizza margherita","Pizza marinara","Calzone ripieno",
  "Focaccia di Recco","Panzanella","Ribollita","Cacciucco","Caponata",
  "Fritto misto","Cotoletta alla milanese","Saltimbocca alla romana",
  "Polpette al sugo","Arancini siciliani","Supplì al telefono",
  "Crostini toscani","Bruschetta al pomodoro","Olive ascolane",
  "Cassata siciliana","Pastiera napoletana","Babà al rum","Sfogliatella",
  "Torta caprese","Delizia al limone","Cannolo siciliano",
  "Crema pasticcera","Zabaione al marsala",

  // ═══ FESTIVITÀ ═══
  "San Valentino","San Patrizio","San Silvestro","San Gennaro",
  "Sant'Ambrogio","Festa della Repubblica","Festa della Liberazione",
  "Festa della Mamma","Festa del Papà","Albero di Natale",
  "Babbo Natale","Presepe vivente","Fuochi d'artificio",
  "Stella cometa","Re Magi","Mercoledì delle Ceneri",
  "Domenica delle Palme","Via Crucis","Uovo di Pasqua",
  "Giovedì grasso","Martedì grasso","Notte di San Lorenzo",
  "Primo maggio","Vigilia di Natale","Santo Stefano",
  "Lunedì dell'Angelo","San Nicola",

  // ═══ MODI DI DIRE ═══
  "Tallone d'Achille","Cavallo di Troia","Spada di Damocle",
  "Filo d'Arianna","Pomo della discordia","Nodo gordiano",
  "Torre d'avorio","Castello di carte","Scatola nera",
  "Anello mancante","Ago nel pagliaio","Ciliegina sulla torta",
  "Goccia nel mare","Punta dell'iceberg","Memoria di elefante",
  "Lacrime di coccodrillo","Pelle d'oca","Nodo alla gola",
  "Pesce d'aprile","Luna di miele","Viaggio di nozze",
  "Colpo di coda","Canto del cigno","Vaso di Pandora",
  "Giardino dell'Eden","Arca di Noè","Sacro Graal",
  "Pietra filosofale","Macchina del tempo","Fontana della giovinezza",
  "Ferro di cavallo","Quadrifoglio","Gatto nero",

  // ═══ SCIENZA E TECNICA ═══
  "Buco nero","Via Lattea","Sistema Solare","Big Bang",
  "Effetto serra","Energia rinnovabile","Pannello solare",
  "Pala eolica","Macchina a vapore","Motore a scoppio",
  "Corrente alternata","Corrente continua","Fibra ottica",
  "Realtà virtuale","Realtà aumentata","Intelligenza artificiale",
  "Stampa 3D","Onde gravitazionali","Materia oscura","Energia oscura",
  "Bosone di Higgs","Tavola periodica","Zero assoluto",
  "Velocità della luce","Velocità del suono","Barriera del suono",
  "Fissione nucleare","Fusione nucleare","Reazione a catena",
  "Effetto farfalla","Effetto domino","Effetto placebo",
  "Selezione naturale","Codice genetico","Doppia elica",
  "Campo magnetico","Punto di ebollizione","Punto di fusione",

  // ═══ COPPIE E PERSONAGGI FICTION ═══
  "Bonnie e Clyde","Tom e Jerry","Stanlio e Ollio",
  "Tristano e Isotta","Adamo ed Eva","Caino e Abele","Romolo e Remo",
  "Davide e Golia","Sansone e Dalila","Sherlock Holmes e Watson",
  "Asterix e Obelix","Thelma e Louise","Simon e Garfunkel",
  "Mario e Luigi","Qui Quo Qua","Tic e Tac",
  "Don Chisciotte","Robin Hood","Re Artù","Peter Pan",

  // ═══ GIOCHI E INTRATTENIMENTO ═══
  "Gioco dell'oca","Mosca cieca","Guardie e ladri",
  "Caccia al tesoro","Ruba bandiera","Tiro alla fune",
  "Carte da gioco","Gioco di ruolo","Parole crociate",
  "Gioco di società","Gioco da tavolo","Gioco di carte",
  "Sette e mezzo","Scala quaranta","Testa o croce",
  "Uno due tre stella","Strega comanda colore",

  // ═══ EXTRA VARIE ═══
  "Vita quotidiana","Senso comune","Buon senso","Buona fede",
  "Mal di testa","Mal di stomaco","Mal di schiena","Mal di gola",
  "Mal di mare","Mal di montagna","Primo soccorso","Pronto soccorso",
  "Codice rosso","Codice giallo","Codice verde","Numero verde",
  "Numero primo","Numero civico","Anno luce","Era glaciale",
  "Età del bronzo","Età del ferro","Età dell'oro",
  "Rivoluzione francese","Rivoluzione industriale",
  "Guerra fredda","Cortina di ferro","Piano Marshall","Ponte aereo",
  "Tappeto rosso","Guanti bianchi","Colletto bianco","Cintura nera",
  "Maglia rosa","Asso nella manica","Scala reale","Poker d'assi",
  "Calcio d'angolo","Calcio di rigore","Tiro libero",
  "Fuori campo","Fuori onda","Prima donna","Prima visione",
  "Seconda mano","Terzo tempo","Quarto potere",
  "Forza maggiore","Opera prima","Capolavoro",
  "Gran premio","Medaglia d'oro","Medaglia d'argento","Medaglia di bronzo",
  "Tempesta perfetta","Occhio del ciclone","Calma piatta",
  "Rosa dei venti","Stella polare","Croce del sud",
  "Onda d'urto","Raggio di sole","Aria condizionata",
  "Acqua potabile","Acqua piovana","Catena montuosa",
  "Catena alimentare","Catena di montaggio",
  "Rete stradale","Rete ferroviaria","Torre di controllo",
  "Pista ciclabile","Pista di atterraggio","Gioco di squadra",
  "Gioco di prestigio","Gioco di parole",
  "Città eterna","Città fantasma","Porto sicuro","Porto franco",
  "Carta vincente","Vento in poppa","Sabbie mobili","Castelli di sabbia",
  "Pioggia acida","Pioggia di stelle","Neve fresca","Bufera di neve",
  "Alba dorata","Tramonto rosso","Notte stellata","Cielo sereno",
  "Doppio mento","Doppio fondo","Doppia faccia","Doppia vita",
  "Punto debole","Punto forte","Punto morto","Punto critico",
  "Vicolo cieco","Strada maestra","Sentiero battuto","Percorso obbligato",
  "Terra di mezzo","Via di mezzo","Giusto mezzo",
  "Bella addormentata","Principe azzurro","Cavaliere errante",
  "Anima gemella","Alter ego","Braccio destro",
  "Bersaglio mobile","Obiettivo sensibile","Zona calda","Zona rossa",
  "Rosso fuoco","Bianco candido","Nero pece","Verde smeraldo",
  "Blu cobalto","Giallo ocra","Grigio perla","Rosa antico",
  "Oro zecchino","Argento vivo","Bronzo antico",
  "Alto mare","Basso profilo","Lungo termine","Breve termine",
  "Grande slam","Piccolo schermo","Vecchia scuola","Nuovo mondo",
  "Vecchio continente","Nuovo testamento","Bella stagione","Brutta copia",
  "Buona uscita","Cattivo gusto","Cattiva coscienza","Buona volontà",
  "Santa pace","Sacro fuoco","Spirito libero","Animo gentile",
];

// ═══════════════════════════════════════════════════
// LOGICA SHUFFLE (MAZZO DI CARTE)
// ═══════════════════════════════════════════════════
function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// ═══════════════════════════════════════════════════
// COMPONENTE BUZZER (GIOCATORE)
// ═══════════════════════════════════════════════════
function PlayerBuzzer({ roomCode, onExit }) {
  const [supabase, setSupabase] = useState(null);
  const [status, setStatus] = useState("connecting");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.async = true;
    script.onload = () => {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      setSupabase(client);
      
      const channel = client.channel(`room_${roomCode.toUpperCase()}`)
        .on("broadcast", { event: "result" }, ({ payload }) => {
          setFeedback(payload.type);
          setTimeout(() => setFeedback(null), 2000);
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") setStatus("ready");
          else setStatus("error");
        });

      return () => client.removeChannel(channel);
    };
    document.body.appendChild(script);
  }, [roomCode]);

  const handleBuzz = () => {
    if (status !== "ready" || feedback) return;
    if (navigator.vibrate) navigator.vibrate(100);
    supabase.channel(`room_${roomCode.toUpperCase()}`).send({
      type: "broadcast",
      event: "buzz",
      payload: { timestamp: Date.now() }
    });
  };

  const bgColor = feedback === "correct" ? "#34C759" : feedback === "error" ? "#FF3B30" : "#121212";

  return (
    <div style={{
      height: "100vh", width: "100vw", backgroundColor: bgColor,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      transition: "background-color 0.3s"
    }}>
      <div style={{ position: "absolute", top: 20, left: 20, color: "#fff", opacity: 0.5 }}>
        Stanza: {roomCode.toUpperCase()}
      </div>
      <button onClick={onExit} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "#fff", fontSize: 14 }}>ESCI</button>
      
      <button 
        onClick={handleBuzz}
        disabled={status !== "ready" || !!feedback}
        style={{
          width: "80vw", height: "80vw", borderRadius: "50%",
          background: "radial-gradient(circle, #FF3B30 0%, #8B0000 100%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          color: "#fff", fontSize: 32, fontWeight: 900,
          border: "10px solid rgba(255,255,255,0.1)",
          cursor: "pointer", WebkitTapHighlightColor: "transparent"
        }}
      >
        {status === "connecting" ? "..." : "PREMI!"}
      </button>
      <div style={{ marginTop: 40, color: "#fff", fontWeight: 700 }}>
        {status === "ready" ? "BUZZER ATTIVO" : "CONNESSIONE..."}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// COMPONENTE GIOCO (CONDUTTORE)
// ═══════════════════════════════════════════════════
function IntesaVincente({ useRemoteBuzzer, roomCode, onExit }) {
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [word, setWord] = useState("");
  const [isDouble, setIsDouble] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [deck, setDeck] = useState(() => shuffleArray(DATABASE_BASE));
  const [supabase, setSupabase] = useState(null);
  const [buzzState, setBuzzState] = useState(null);

  useEffect(() => {
    if (useRemoteBuzzer) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.async = true;
      script.onload = () => {
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        setSupabase(client);
        const channel = client.channel(`room_${roomCode.toUpperCase()}`)
          .on("broadcast", { event: "buzz" }, () => {
            if (isActive && !isPaused && !buzzState) handleBuzzEvent();
          })
          .subscribe();
        return () => client.removeChannel(channel);
      };
      document.body.appendChild(script);
    }
  }, [useRemoteBuzzer, roomCode, isActive, isPaused, buzzState]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0 && !isPaused && !buzzState) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isPaused, buzzState]);

  useEffect(() => {
    let t;
    if (buzzState === "buzzed") {
      t = setTimeout(() => handleResolution("error"), BUZZ_TIMEOUT * 1000);
    }
    return () => clearTimeout(t);
  }, [buzzState]);

  const handleBuzzEvent = () => {
    setBuzzState("buzzed");
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  };

  const getNewWord = () => {
    let currentDeck = [...deck];
    if (currentDeck.length === 0) currentDeck = shuffleArray(DATABASE_BASE);
    const nextWord = currentDeck.pop();
    setDeck(currentDeck);
    return nextWord;
  };

  const startGame = () => {
    setCorrectCount(0);
    setErrorCount(0);
    setTimeLeft(60);
    setWord(getNewWord());
    setIsActive(true);
    setIsPaused(false);
    setBuzzState(null);
  };

  const handleResolution = (type) => {
    if (type === "correct") {
      setCorrectCount(c => c + (isDouble ? 2 : 1));
      if (supabase) supabase.channel(`room_${roomCode}`).send({ type:"broadcast", event:"result", payload:{type:"correct"} });
      setWord(getNewWord());
      setIsDouble(false);
      setBuzzState(null);
      setIsPaused(false);
    } else if (type === "error") {
      setErrorCount(e => e + 1);
      setCorrectCount(c => Math.max(0, c - 1));
      if (supabase) supabase.channel(`room_${roomCode}`).send({ type:"broadcast", event:"result", payload:{type:"error"} });
      setWord(getNewWord());
      setIsDouble(false);
      setBuzzState(null);
      setIsPaused(false);
    } else if (type === "pass") {
      setIsPaused(true);
      setBuzzState(null);
      setIsDouble(false);
    }
  };

  const handleNextWord = (double = false) => {
    setWord(getNewWord());
    setIsDouble(double);
    setIsPaused(false);
    setBuzzState(null);
    if (!isActive) setIsActive(true);
  };

  const timerColor = buzzState ? "#FFA500" : timeLeft <= 10 ? "#FF3B30" : "#fff";

  return (
    <div style={{ height: "100vh", backgroundColor: "#000", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", padding: 20 }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
        <button onClick={onExit} style={{ background: "#333", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 8 }}>Esci</button>
        <div style={{ fontWeight: 800 }}>{roomCode}</div>
      </div>

      <div style={{ fontSize: 100, fontWeight: 900, margin: "10px 0" }}>{correctCount}</div>

      <div style={{ width: 100, height: 100, borderRadius: "50%", border: `6px solid ${timerColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: timerColor }}>
        {timeLeft}
      </div>

      <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", borderRadius: 20, margin: "20px 0" }}>
        {isActive ? (
          <>
            {isDouble && <div style={{ color: "#FFD700", fontWeight: 800 }}>RADDOPPIO</div>}
            <div style={{ fontSize: 45, fontWeight: 900, textTransform: "uppercase" }}>{word}</div>
            {isPaused && <div style={{ color: "#666", marginTop: 10 }}>PAUSA</div>}
          </>
        ) : (
          <button onClick={startGame} style={{ padding: "15px 30px", fontSize: 20, fontWeight: 800, borderRadius: 50 }}>INIZIA</button>
        )}
      </div>

      <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {buzzState || isPaused ? (
          <>
            <button onClick={() => handleResolution("correct")} style={{ gridColumn: "span 2", padding: 20, backgroundColor: "#34C759", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800 }}>CORRETTA</button>
            <button onClick={() => handleResolution("error")} style={{ padding: 20, backgroundColor: "#FF3B30", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800 }}>SBAGLIATA</button>
            <button onClick={() => handleResolution("pass")} style={{ padding: 20, backgroundColor: "#444", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800 }}>PASSO</button>
          </>
        ) : (
          <>
            <button onClick={() => handleNextWord(false)} style={{ gridColumn: "span 2", padding: 20, backgroundColor: "#007AFF", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800 }}>NUOVA PAROLA</button>
            <button disabled={correctCount < 2} onClick={() => handleNextWord(true)} style={{ padding: 15, backgroundColor: correctCount >= 2 ? "#FFD700" : "#222", borderRadius: 12, fontWeight: 800, opacity: correctCount >= 2 ? 1 : 0.3 }}>RADDOPPIO</button>
            <button onClick={() => setIsPaused(true)} style={{ padding: 15, backgroundColor: "#333", borderRadius: 12, color: "#fff", fontWeight: 800 }}>PASSO</button>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// APP PRINCIPALE
// ═══════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("home");
  const [roomCode, setRoomCode] = useState(() => localStorage.getItem("intesa_room") || Math.random().toString(36).substring(2, 6).toUpperCase());
  const [useRemote, setUseRemote] = useState(true);

  useEffect(() => { localStorage.setItem("intesa_room", roomCode); }, [roomCode]);

  if (view === "home") {
    return (
      <div style={{ height:"100vh", backgroundColor:"#000", color:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:30, textAlign:"center" }}>
        <h1 style={{ fontSize:32, fontWeight:900, marginBottom:40 }}>INTESA VINCENTE</h1>
        <button onClick={() => setView("conduttore_setup")} style={{ width:"100%", padding:20, borderRadius:15, border:"none", backgroundColor:"#fff", color:"#000", fontWeight:800, marginBottom:15 }}>FACCIAMO LE DOMANDE</button>
        <button onClick={() => setView("giocatore_setup")} style={{ width:"100%", padding:20, borderRadius:15, border:"2px solid #fff", backgroundColor:"transparent", color:"#fff", fontWeight:800 }}>RISPONDO</button>
      </div>
    );
  }

  if (view === "giocatore_setup") {
    return (
      <div style={{ height:"100vh", backgroundColor:"#000", color:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:30 }}>
        <h2>Codice Stanza</h2>
        <input value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} maxLength={4} style={{ width:120, padding:10, fontSize:24, textAlign:"center", margin:"20px 0" }} />
        <button onClick={() => setView("giocatore_game")} style={{ width:"100%", padding:15, backgroundColor:"#34C759", border:"none", borderRadius:10, color:"#fff", fontWeight:800 }}>APRI IL BUZZER</button>
        <button onClick={() => setView("home")} style={{ marginTop:20, color:"#666", border:"none", background:"none" }}>Indietro</button>
      </div>
    );
  }

  if (view === "giocatore_game") return <PlayerBuzzer roomCode={roomCode} onExit={() => setView("home")} />;

  if (view === "conduttore_setup") {
    return (
      <div style={{ height:"100vh", backgroundColor:"#000", color:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:30 }}>
        <div style={{ backgroundColor:"#111", padding:20, borderRadius:15, textAlign:"center", width:"100%" }}>
          <div style={{ fontSize:12, opacity:0.5 }}>CODICE STANZA</div>
          <div style={{ fontSize:36, fontWeight:900, color:"#007AFF" }}>{roomCode}</div>
          <button onClick={() => setRoomCode(Math.random().toString(36).substring(2, 6).toUpperCase())} style={{ background:"none", border:"none", color:"#444", fontSize:10 }}>CAMBIA</button>
        </div>
        <div style={{ marginTop:20, display:"flex", gap:10 }}>
          <input type="checkbox" checked={useRemote} onChange={e => setUseRemote(e.target.checked)} />
          <span>Usa Buzzer Remoto</span>
        </div>
        <button onClick={() => setView("conduttore_game")} style={{ width:"100%", marginTop:30, padding:20, backgroundColor:"#007AFF", border:"none", borderRadius:15, color:"#fff", fontWeight:800 }}>INIZIA GIOCO</button>
        <button onClick={() => setView("giocatore_setup")} style={{ marginTop:20, color:"#007AFF", background:"none", border:"none", fontWeight:700 }}>Rispondi tu? Clicca qui</button>
      </div>
    );
  }

  if (view === "conduttore_game") return <IntesaVincente useRemoteBuzzer={useRemote} roomCode={roomCode} onExit={() => setView("home")} />;

  return null;
}