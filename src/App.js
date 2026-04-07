import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════════════════
const SUPABASE_URL = "https://mjubkdvqhpdbjbcgjzcw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qdWJrZHZxaHBkYmpiY2dqemN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTIzNjMsImV4cCI6MjA5MDYyODM2M30.U4waGWzPx7zC0Z_ypukj5K7aXoK6pDf6SP-e6TcKJRc";
const BUZZ_TIMEOUT = 4; // seconds to confirm after buzz

// ═══════════════════════════════════════════════════
// PAROLE SINGOLE — Oltre 4000 parole italiane
// ═══════════════════════════════════════════════════
const PAROLE_SINGOLE = [
  // ANIMALI
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
  "Beluga","Orca","Lamantino","Ocelot","Gibbone",
  "Chinchilla","Gerbillo","Alpaca","Vigogna","Lama","Dromedario","Fennec","Okapi",
  "Quetzal","Kiwi","Emù","Marabù","Ibis",
  "Muflone","Visone","Opossum","Gnu",
  // CIBO E CUCINA
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
  // CORPO UMANO E MEDICINA
  "Cervello","Polmone","Stomaco","Fegato","Ginocchio","Caviglia","Gomito","Spalla",
  "Sopracciglio","Mento","Guancia","Fronte","Tempia","Nuca","Vertebra","Costola",
  "Muscolo","Tendine","Arteria","Capillare","Femore","Tibia","Perone","Omero",
  "Clavicola","Scapola","Sterno","Bacino","Cranio","Mandibola",
  "Trachea","Esofago","Intestino","Pancreas","Milza","Rene","Vescica","Tiroide",
  "Retina","Cornea","Pupilla","Laringe","Faringe","Bronchi",
  "Diaframma","Menisco","Cartilagine","Legamento","Midollo","Sinapsi","Neurone",
  "Globulo","Piastrina","Emoglobina","Anticorpo","Vaccino","Siringa","Bisturi",
  "Stetoscopio","Termometro","Radiografia","Ecografia","Risonanza","Diagnosi",
  "Terapia","Prognosi","Sintomo","Febbre","Frattura","Distorsione","Contusione",
  "Ematoma","Cicatrice","Sutura","Anestesia","Protesi","Trapianto","Biopsia",
  "Epidemia","Pandemia","Contagio","Immunità","Metabolismo","Ormone","Enzima",
  "Proteina","Vitamina","Caloria","Colesterolo","Glicemia","Pressione","Pulsazione",
  // OGGETTI QUOTIDIANI
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
  // PROFESSIONI
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
  // GEOGRAFIA E NATURA
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
  // SPORT
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
  "Discesa","Gigante","Fondo","Freestyle","Curling","Bob","Skeleton",
  "Volteggio","Parallele","Sbarra","Anelli","Trave",
  "Surfing","Windsurf","Kitesurf","Immersione","Rafting","Kayak",
  "Canoa","Regata","Bolina","Virata",
  "Scacchi","Dama","Backgammon","Biliardo","Freccette","Bocce",
  "Cricket","Rugby","Baseball","Hockey","Polo","Badminton",
  "Deltaplano","Parapendio","Pattini",
  // MUSICA E ARTE
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
  // SCIENZA E TECNOLOGIA
  "Telescopio","Microscopio","Laboratorio","Provetta","Molecola","Atomo","Elettrone",
  "Protone","Galassia","Asteroide","Cometa","Satellite","Orbita","Gravità","Magnetismo",
  "Algoritmo","Database","Processore","Tastiera","Stampante","Antenna",
  "Circuito","Frequenza","Turbina","Reattore","Propulsore",
  "Plasma","Fusione","Fissione",
  "Supernova","Nebulosa","Costellazione",
  "Latitudine","Longitudine","Meridiano","Parallelo","Equatore","Tropico","Emisfero",
  "Enzima","Proteina",
  "Membrana","Nucleo","Cellula","Tessuto","Organo",
  "Simbiosi","Mutazione","Evoluzione",
  "Selezione","Adattamento","Estinzione","Biodiversità","Ecosistema",
  "Atmosfera",
  "Resistenza",
  "Microchip","Silicio","Laser","Radar","Sonar",
  "Scanner","Router","Server","Firewall","Pixel",
  "Blockchain","Interfaccia","Simulazione","Prototipo","Brevetto",
  "Ingranaggio","Pistone","Biella","Volano","Frizione",
  "Ossigeno","Azoto","Carbonio","Idrogeno","Ferro","Rame","Zinco","Argento",
  "Oro","Platino","Titanio","Tungsteno","Mercurio","Piombo","Alluminio",
  "Cromo","Nichel","Cobalto","Manganese","Magnesio","Calcio","Sodio","Potassio",
  "Polimero","Neon","Argon","Elio",
  // ABBIGLIAMENTO
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
  // CASA E ARCHITETTURA
  "Balcone","Terrazza","Soffitta","Cantina","Garage","Camino","Comignolo","Grondaia",
  "Persiana","Ringhiera","Pavimento","Soffitto","Colonna","Arco","Cupola","Campanile",
  "Cattedrale","Fortezza","Castello","Torre","Ponte","Fontana","Acquedotto","Faro",
  "Molo","Porto","Stazione","Aeroporto","Rotonda","Semaforo","Marciapiede",
  "Navata","Cripta","Sagrestia","Chiostro","Portico","Loggia",
  "Pinnacolo","Guglia",
  "Pilastro","Piedistallo",
  "Volta","Lucernario","Rosone",
  "Gargoyle","Mascherone",
  "Cortile","Atrio","Vestibolo","Corridoio","Tinello",
  "Soggiorno","Cucina","Bagno","Ripostiglio","Guardaroba","Studio","Veranda",
  "Pergolato","Gazebo","Serra","Capanno","Rimessa","Granaio","Fienile","Stalla",
  "Piscina","Sauna","Mansarda","Soppalco","Bovindo",
  "Grattacielo","Palazzo","Villetta","Casale","Masseria","Trullo",
  "Baita","Chalet","Bungalow","Igloo","Pagoda","Minareto",
  "Obelisco","Piramide","Anfiteatro","Acquario","Planetario","Osservatorio",
  "Pinacoteca","Biblioteca","Municipio","Tribunale",
  "Caserma","Ospedale","Farmacia","Mercato","Bottega",
  // TRASPORTI
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
  // EMOZIONI E ASTRATTO
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
  "Opale","Giada","Onice","Agata","Malachite",
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
  "Tunnel","Viadotto","Casello","Semaforo","Segnale",
  // ═══════════════════════════════════════════════════
  // AGGIUNTE DEL 02.04.2026
  // ═══════════════════════════════════════════════════
  // VERBI (infinito presente)
  "Abbracciare","Abitare","Accendere","Accogliere","Accompagnare","Accusare",
  "Accarezzare","Addormentare","Aggiungere","Agitare","Aiutare","Allargare",
  "Allenare","Allontanare","Alzare","Ammirare","Amare","Ammettere",
  "Andare","Annunciare","Apparire","Appendere","Applaudire","Aprire",
  "Arrampicare","Arrivare","Ascoltare","Aspettare","Assaggiare","Attraversare",
  "Avvolgere","Baciare","Ballare","Bagnare","Benedire","Bere",
  "Bisticciare","Bocciare","Bollire","Brillare","Bruciare","Buttare",
  "Cadere","Calcolare","Cambiare","Camminare","Cantare","Capire",
  "Caricare","Cavalcare","Cenare","Cercare","Chiamare","Chiedere",
  "Chiudere","Cogliere","Coinvolgere","Collaborare","Collegare","Colorare",
  "Coltivare","Combattere","Cominciare","Comporre","Comprare","Comunicare",
  "Concentrare","Concludere","Condividere","Confessare","Confondere","Conoscere",
  "Conquistare","Consegnare","Conservare","Consigliare","Contare","Continuare",
  "Convincere","Copiare","Coprire","Correggere","Correre","Costruire",
  "Creare","Credere","Crescere","Criticare","Cucinare","Cucire",
  "Curare","Custodire","Danneggiare","Decidere","Decorare","Dedicare",
  "Deludere","Demolire","Denunciare","Descrivere","Desiderare","Destare",
  "Difendere","Dimenticare","Dimostrare","Dipingere","Dire","Dirigere",
  "Discutere","Disegnare","Disobbedire","Disprezzare","Distinguere","Distribuire",
  "Distruggere","Diventare","Dividere","Divorare","Domandare","Dominare",
  "Donare","Dormire","Dubitare","Durare","Educare","Eleggere",
  "Eliminare","Emergere","Entrare","Esagerare","Esaminare","Eseguire",
  "Esibire","Esistere","Esitare","Esplorare","Esprimere","Essere",
  "Evitare","Fabbricare","Fallire","Fare","Fermare","Festeggiare",
  "Fidarsi","Filmare","Fingere","Finire","Firmare","Fischiare",
  "Fissare","Fondere","Formare","Fornire","Fotografare","Frantumare",
  "Frequentare","Friggere","Frugare","Fuggire","Fumare","Funzionare",
  "Galleggiare","Garantire","Gelare","Generare","Gestire","Gettare",
  "Giocare","Gioire","Girare","Giudicare","Giungere","Giurare",
  "Godere","Governare","Graffiare","Gridare","Guardare","Guarire",
  "Guidare","Gustare","Ignorare","Illuminare","Illustrare","Imbrogliare",
  "Immaginare","Immergersi","Impacchettare","Imparare","Impedire","Implorare",
  "Importare","Imprigionare","Improvvisare","Incantare","Inciampare","Incidere",
  "Incontrare","Incoraggiare","Indicare","Indossare","Indovinare","Ingannare",
  "Inghiottire","Innamorare","Insegnare","Inseguire","Inserire","Insistere",
  "Intendere","Interrompere","Inventare","Invitare","Lanciare","Lasciare",
  "Lavare","Lavorare","Legare","Leggere","Liberare","Litigare",
  "Lodare","Lottare","Lucidare","Macchiare","Macinare","Mancare",
  "Mandare","Mangiare","Mantenere","Marciare","Masticare","Meditare",
  "Mentire","Meritare","Mescolare","Mettere","Migliorare","Minacciare",
  "Mirare","Misurare","Moderare","Modificare","Mollare","Moltiplicare",
  "Montare","Mordere","Morire","Mormorare","Mostrare","Muovere",
  "Nascere","Nascondere","Navigare","Negare","Negoziare","Nevicare",
  "Noleggiare","Nominare","Notare","Nuotare","Nutrire","Obbedire",
  "Obbligare","Odiare","Offendere","Offrire","Operare","Opporre",
  "Ordinare","Organizzare","Orientare","Osare","Osservare","Ottenere",
  "Pagare","Paragonare","Parlare","Partecipare","Partire","Passare",
  "Passeggiare","Pedalare","Pensare","Percorrere","Perdere","Perdonare",
  "Permettere","Pescare","Pettinare","Piacere","Piangere","Piantare",
  "Piegare","Pizzicare","Poggiare","Portare","Posare","Possedere",
  "Potare","Potere","Pranzare","Pregare","Prendere","Prenotare",
  "Preparare","Presentare","Prestare","Pretendere","Prevedere","Proclamare",
  "Produrre","Progettare","Proibire","Promettere","Pronunciare","Proporre",
  "Proteggere","Protestare","Provare","Provocare","Pubblicare","Pulire",
  "Pungere","Punire","Raccogliere","Raccomandare","Raccontare","Raddoppiare",
  "Radere","Raggiungere","Ragionare","Rallentare","Rapire","Rappresentare",
  "Raschiare","Realizzare","Recitare","Regalare","Reggere","Registrare",
  "Regolare","Remare","Rendere","Replicare","Respirare","Restare",
  "Restituire","Ricamare","Ricevere","Richiedere","Riconoscere","Ricordare",
  "Ridere","Ridurre","Riempire","Rifiutare","Riflettere","Riguardare",
  "Rimanere","Rimbalzare","Rimediare","Rimpiangere","Rinascere","Ringraziare",
  "Rinunciare","Riparare","Ripassare","Ripetere","Riposare","Risalire",
  "Riscaldare","Rischiare","Riservare","Risolvere","Risparmiare","Rispettare",
  "Rispondere","Risultare","Ritardare","Ritenere","Ritornare","Riunire",
  "Riuscire","Rivelare","Rivestire","Rivolgere","Rotolare","Rovesciare",
  "Rovinare","Rubare","Russare","Sacrificare","Salire","Saltare",
  "Salutare","Salvare","Sapere","Sbagliare","Sbadigliare","Sbattere",
  "Sbloccare","Sbocciare","Sbrigarsi","Scaldare","Scambiare","Scappare",
  "Scaricare","Scartare","Scatenare","Scavare","Scegliere","Scendere",
  "Scherzare","Schiacciare","Sciare","Sciogliere","Scivolare","Scommettere",
  "Scomparire","Sconfiggere","Sconvolgere","Scoppiare","Scoprire","Scorrere",
  "Scrivere","Scuotere","Scusare","Sedersi","Segnalare","Segnare",
  "Seguire","Seminare","Sentire","Separare","Seppellire","Servire",
  "Sfidare","Sfiorare","Sfogliare","Sforzare","Sfruttare","Sgridare",
  "Significare","Sistemare","Slacciare","Slegare","Smettere","Smontare",
  "Soccorrere","Soffiare","Soffrire","Sognare","Sollevare","Somigliare",
  "Sopportare","Sorpassare","Sorprendere","Sorridere","Sospettare","Sospirare",
  "Sostenere","Sostituire","Sotterrare","Sottolineare","Spaccare","Spalancare",
  "Sparare","Sparecchiare","Sparire","Spaventare","Spazzare","Spedire",
  "Spegnere","Spendere","Sperare","Spettinare","Spezzare","Spiegare",
  "Spingere","Splendere","Spogliare","Sporcare","Spostare","Sprecare",
  "Spremere","Sprofondare","Spuntare","Sputare","Squillare","Stabilire",
  "Staccare","Stancare","Stappare","Stare","Starnutire","Stendere",
  "Stimare","Stirare","Storcere","Stringere","Strofinare","Studiare",
  "Stupire","Subire","Succedere","Sudare","Suggerire","Suonare",
  "Superare","Supplicare","Svegliare","Svenire","Sviluppare","Svitare",
  "Svolgere","Svuotare","Tacere","Tagliare","Tastare","Temere",
  "Tendere","Tentare","Tenere","Terminare","Tinteggiare","Tirare",
  "Toccare","Togliere","Tollerare","Torcere","Tornare","Tradire",
  "Tradurre","Tramandare","Tramontare","Trascinare","Trascorrere","Trasferire",
  "Trasformare","Trasportare","Trattare","Trattenere","Tremare","Truccare",
  "Tuffare","Tuonare","Ubbidire","Umiliare","Ungere","Unire",
  "Urlare","Usare","Uscire","Utilizzare","Vagare","Valere",
  "Valutare","Vantare","Varcare","Vendere","Vendicare","Venire",
  "Verificare","Versare","Vestire","Viaggiare","Vietare","Vincere",
  "Visitare","Vivere","Volare","Volere","Voltare","Zappare",
  "Zittire",
  // AGGETTIVI QUALIFICATIVI
  "Acuto","Adorabile","Affamato","Affascinante","Affettuoso","Agile",
  "Aggressivo","Allegro","Altruista","Amabile","Ambiguo",
  "Amichevole","Ampio","Annoiato","Ansioso","Antico","Appassionato",
  "Appetitoso","Ardente","Arido","Armonioso","Arrogante","Aspro",
  "Assonnato","Astuto","Attraente","Audace","Austero","Avaro",
  "Avido","Azzurro","Bagnato","Barbaro","Beato",
  "Bello","Benigno","Biondo","Bizzarro","Blando","Bonario",
  "Bravo","Breve","Brillante","Brutto","Bugiardo","Buono",
  "Burbero","Calmo","Calvo","Candido","Capace","Caparbio",
  "Capriccioso","Carico","Carnoso","Caro","Casalingo","Cattivo",
  "Cauto","Celebre","Certo","Chiaro","Cieco","Civile",
  "Classico","Clemente","Colossale","Comico","Comodo","Compatto",
  "Complesso","Completo","Comune","Concreto","Confuso","Conosciuto",
  "Contento","Contrario","Convinto","Copioso","Cordiale","Corretto",
  "Cortese","Costante","Cretino","Croccante","Crudele",
  "Crudo","Cupo","Curioso","Curvo","Debole","Deciso",
  "Delicato","Denso","Devoto","Diabolico","Difficile","Diffidente",
  "Diligente","Dinamico","Diretto","Discreto","Disperato","Disponibile",
  "Disposto","Distante","Distinto","Distratto","Diverso","Divertente",
  "Docile","Dolente","Dorato","Duro","Eccellente","Eccezionale",
  "Educato","Efficace","Egoista","Elegante","Elementare",
  "Enorme","Entusiasta","Equo","Eroico","Esatto","Esclusivo",
  "Esigente","Esotico","Esperto","Essenziale","Esterno","Estremo",
  "Eterno","Evidente","Evoluto","Famelico","Familiare","Famoso",
  "Fantastico","Faticoso","Fatuo","Favorevole","Fecondo","Fedele",
  "Felice","Feroce","Fertile","Fervido","Festivo","Fiacco",
  "Fiero","Finto","Fisso","Fitto","Flessibile","Florido",
  "Fluido","Folto","Fondamentale","Formidabile","Forte","Fortunato",
  "Fragile","Fresco","Frizzante","Furbo","Furioso","Futile",
  "Galantuomo","Gelido","Geloso","Generoso","Geniale","Gentile",
  "Genuino","Giovane","Giovanile","Giulivo","Giusto",
  "Globale","Goloso","Gonfio","Goffo","Gracile","Gradito",
  "Grasso","Grato","Grave","Grazioso","Gregario","Grigio",
  "Grosso","Grottesco","Illustre","Imbarazzante","Immenso","Immobile",
  "Imparziale","Impaziente","Impegnato","Impetuoso","Imponente","Impossibile",
  "Imprevisto","Impulsivo","Inaspettato","Incantevole","Incerto","Incredibile",
  "Indeciso","Indipendente","Indiscreto","Indulgente","Industrioso","Inedito",
  "Infantile","Infernale","Infinito","Ingenuo","Ingiusto","Ingrato",
  "Innocente","Innocuo","Inquieto","Insaziabile","Insensibile","Insignificante",
  "Insipido","Insolente","Insolito","Instabile","Intelligente","Intenso",
  "Intero","Intimo","Intraprendente","Intrepido","Invadente","Invisibile",
  "Ironico","Irresistibile","Irrequieto","Ispido","Istintivo","Laborioso",
  "Largo","Lento","Leale","Leggero","Lesto","Limpido",
  "Liscio","Logico","Longevo","Lucente","Lugubre","Luminoso",
  "Lungo","Lussuoso","Macabro","Maestoso","Magico","Magnifico",
  "Magro","Maledetto","Malfamato","Malizioso","Malinconico","Manesco",
  "Mansionario","Marcio","Materno","Maturo","Melodico","Memorabile",
  "Metodico","Microscopico","Mieloso","Minuscolo","Mirabolante","Misterioso",
  "Mite","Moderno","Modesto","Molle","Morbido","Mordace",
  "Mortale","Muto","Nascosto","Naturale","Nefasto","Negligente",
  "Nobile","Nocivo","Noioso","Normale","Nostalgico","Notevole",
  "Nudo","Numeroso","Nuovo","Nutriente","Obbediente",
  "Obiettivo","Odioso","Onnipotente","Onesto","Operoso","Opportuno",
  "Opposto","Opulento","Ordinato","Orgoglioso","Originale","Orribile",
  "Oscuro","Ospitale","Ostile","Ostinato","Ottimista","Ottuso",
  "Ovvio","Pacifico","Pallido","Patetico","Pauroso","Peculiare",
  "Pensieroso","Perfetto","Pericoloso","Perplesso","Pessimista","Pesante",
  "Piccolo","Pigro","Placido","Poetico","Polare","Polveroso",
  "Pomposo","Popolare","Possente","Potente","Povero","Pratico",
  "Prezioso","Profondo","Prolifico","Pronto","Prospero","Provocante",
  "Prudente","Puerile","Pulito","Pungente","Puntuale","Puro",
  "Quieto","Quotidiano","Radioso","Raffinato","Rapido","Raro",
  "Razionale","Reale","Recente","Regale","Remoto","Responsabile",
  "Ricco","Ridicolo","Rigido","Rigoroso","Rilassato","Riluttante",
  "Riservato","Rispettoso","Robusto","Romantico","Roseo","Rossastro",
  "Rotto","Rozzo","Rude","Rugoso","Rumoroso","Rustico",
  "Sacro","Saggio","Salato","Saldo","Sano","Sapiente",
  "Sapido","Saporito","Sarcastico","Sbadato","Scaltro","Scandaloso",
  "Scarso","Scettico","Schietto","Schivo","Sciocco","Scomodo",
  "Scontento","Scortese","Scuro","Sdegnoso","Secco","Selvaggio",
  "Semplice","Sensato","Sensibile","Sereno","Serio","Servile",
  "Severo","Sfacciato","Sfarzoso","Sfortunato","Sgarbato","Sicuro",
  "Silenzioso","Simpatico","Sincero","Singolare","Sinistro","Snello",
  "Sobrio","Soffice","Solenne","Solido","Sollecito",
  "Sonnolento","Sopraffino","Sordido","Sorpreso","Sottile","Sovrano",
  "Spazioso","Speciale","Spensierato","Spesso","Spettacolare","Spietato",
  "Splendido","Spontaneo","Sporco","Sprezzante","Stabile","Stanco",
  "Sterile","Stizzoso","Strano","Straordinario","Strepitoso",
  "Stupendo","Superbo","Supremo","Svelto","Svogliato","Taciturno",
  "Tenace","Tenero","Terribile","Tetro","Tiepido","Timido",
  "Tipico","Tollerante","Tondo","Torrido","Tossico","Tranquillo",
  "Trasparente","Tremendo","Triste","Turbolento","Ubriaco","Uguale",
  "Umano","Umido","Umile","Unico","Universale","Urgente",
  "Utile","Vacante","Vago","Valente","Valido","Valoroso",
  "Vano","Vario","Vasto","Vecchio","Veloce","Velenoso",
  "Verace","Vergognoso","Versatile","Vile","Violento","Virtuoso",
  "Viscido","Vispo","Vistoso","Vitale","Vivace","Viziato",
  "Vizioso","Vorace","Volgare","Vulnerabile","Zelante","Zitto",
  "Zoppo","Zuccheroso",

  // ANIMALI (aggiunte)
  "Allocco","Anemone","Barracuda","Beccaccino","Bertuccia",
  "Bocciolo","Boa","Bue","Capibara","Cefalo","Cerbiatto",
  "Chiurlo","Ciniglia","Coala","Colombaccio","Cormorano","Coyote",
  "Dingo","Faina","Gazza",
  "Geco","Ghiro","Gipeto","Guanaco","Ippocampo","Jackal",
  "Manta","Moffetta","Muggine","Ostriche",
  "Passero","Pescecane",
  "Scarafaggio","Taccola","Tacchino","Toporagno","Tortora",
  "Verdone","Vipera","Volpoca",
  // CIBO E CUCINA (aggiunte)
  "Antipasto","Arista","Baccalà","Bavarese","Bottarga","Caciucco",
  "Calzone","Capocollo","Carpaccio","Ceviche","Chutney","Composta",
  "Cous cous","Crème brûlée","Crespella","Crêpe","Croquette","Culatello",
  "Datterino","Empanada","Farfalle","Fiordilatte","Frisella","Frittata",
  "Frittella","Gassosa","Gazpacho","Ghiacciolo","Goulash","Guacamole",
  "Hamburger","Hummus","Involtino","Kebab","Ketchup","Lampone",
  "Maracuja","Maritozzo","Mirtillo","Nachos","Nocciolina","Pancake",
  "Panino","Papaya","Passata","Passatello","Pepita",
  "Polpetta","Porchetta","Pretzel","Pummarola","Ratatouille","Ravanello",
  "Risoni","Salatino","Sandwich","Scaloppina","Schiacciata","Sformato",
  "Smoothie","Soufflé","Sushi","Tacos","Tartare",
  "Tempura","Terrina","Wurstel","Yogurt",
  // CORPO UMANO E MEDICINA (aggiunte)
  "Aorta","Appendice","Bicipite","Canino","Capello","Cavità",
  "Coccige","Colon","Condilo","Cuoio capelluto","Deltoide",
  "Duodeno","Epiglottide","Falange","Gengiva","Ghiandola","Gluteo",
  "Incisivo","Iride","Lobo","Molare","Naso",
  "Nervo","Nocca","Ombelico","Palato","Pelvi",
  "Piede","Polpaccio","Polso","Poro","Quadricipite","Radio",
  "Rotula","Sciatica","Seno","Tallone",
  "Torace","Tricipite","Ugola","Unghia","Utero","Zigomo",
  // OGGETTI QUOTIDIANI (aggiunte)
  "Agendina","Album","Astuccio","Attaccapanni","Barattolo","Batuffolo",
  "Borsetta","Campanello","Caricabatterie","Catenaccio","Chiavistello",
  "Ciotola","Contenitore","Coprilettura","Dado",
  "Filo","Gancio","Guarnizione","Lampione","Lucchetto",
  "Manico","Mappamondo","Nastro","Ninnolo","Oliatore","Pacco",
  "Paletto","Pannello","Paravento","Passepartout","Piumone",
  "Portacandele","Portafoto","Portagioie","Portaombrelli","Portapenne","Posacenere",
  "Presina","Reggilibri","Rubinetto","Salvadanaio","Setola","Siparietto",
  "Soffione","Soprammobile","Spazzaneve","Spinterogeno","Tappo","Tovaglia",
  "Vassoio","Ventilatore","Ventaglio","Zerbino",
  // PROFESSIONI (aggiunte)
  "Agente","Allestitore","Arredatore","Artificiere","Balia",
  "Banconista","Becchino","Biscazziere","Bracconiere","Buttafuori","Cabarettista",
  "Cancelliere","Cappellano","Carpentiere","Carrozziere","Cassiere","Cecchino",
  "Ciabattino","Cicerone","Cineasta","Clown","Colono","Commesso",
  "Commissario","Comprimario","Conciatore","Contabile","Controllore","Copilota",
  "Corniciaio","Critico","Dattilografo","Decoratore","Detective","Direttrice",
  "Doganalista","Doganiere","Domatore","Droghiere","Esattore","Escursionista",
  "Esteta","Figurinista","Fonditore","Fornaio","Frantoiano","Funambolo",
  "Fumettista","Gelataio","Giocatore","Giudice","Grafico","Guaritore",
  "Illusionista","Illustratore","Intagliatore","Inventore","Investigatore","Istruttore",
  "Lattoniere","Lustrascarpe","Manovale","Massaggiatore","Meccanico","Mediatore",
  "Mercante","Militare","Modello","Mugnaio","Numismatico","Operaio",
  "Ottico","Paramedico","Pellettiere","Perito","Predicatore","Procuratore",
  "Ragioniere","Ricettatore","Rigattiere","Sagrestano","Scaricatore",
  "Scenografo","Segretario","Sommelier","Stagnino","Storiografo",
  "Stuntman","Tabaccaio","Tagliaboschi","Tatuatore","Tecnico","Teologo",
  "Tornitore","Tosatore","Ufficiale","Usuraio","Valletto","Veggente",
  "Vigile","Violinista","Viticoltore",
  // GEOGRAFIA E NATURA (aggiunte)
  "Ansa","Bassopiano","Brughiera","Calanco","Canalone",
  "Cascina","Colle","Conca",
  "Depressione","Dorsale","Falesia","Forra","Giara",
  "Gole","Laguna",
  "Landa","Litorale","Massiccio","Mulattiera",
  "Paesaggio","Pantano","Pascolo","Penisoletta","Pianoro","Pietraia",
  "Poggio","Pozza","Prato","Rapida","Ria",
  "Risorgiva","Riviera","Roccia","Rupe","Sabbione","Scarpata",
  "Selva","Solco","Spiaggetta","Spiazzo","Strapiombo",
  "Terrazzamento","Terraferma","Torrione","Torbiera","Vado","Vallone",
  "Versante",
  // SPORT (aggiunte)
  "Acrobazia","Agonismo","Allenamento","Ammonizione","Atletica","Avversario",
  "Calcetto","Capocannoniere","Capitano","Centravanti","Ciclismo","Combinata",
  "Contropiede","Corridore","Doping","Doppietta","Eliminazione","Espulsione",
  "Extratime","Fantino","Ginnasta","Goleador","Handicap","Hooligan",
  "Interbase","Jolly","Laterale","Libero","Lotta","Mezzofondista",
  "Mischia","Montante","Nuotatore","Ostacolista","Palleggio","Pallina",
  "Pareggio","Passaggio","Pedina","Penalizzazione","Pista",
  "Portabandiera","Primato","Raccattapalle","Rincorsa","Rinvio","Riserva",
  "Rivincita","Schieramento","Sciatore","Segnapunti","Sequenza","Smash",
  "Sorteggio","Sparring","Spettatore","Sprint","Stoccata","Stretching",
  "Tattica","Telecronista","Testata","Terzino","Tifoso","Traguardo",
  "Velocista","Volata","Warming up","Wrestling",
  // MUSICA E ARTE (aggiunte)
  "Acapella","Accordo","Barocco","Belcanto","Bemolle",
  "Bozzetto","Cadenza","Caricatura","Collage","Couplet",
  "Duetto","Falsetto","Figurativismo","Gouache","Graffito",
  "Impasto","Improvvisazione","Intarsio","Intermezzo","Minimalismo",
  "Monotono","Monocromo","Murale","Naturalismo","Ouverture",
  "Paesaggista","Pentagramma","Pittoresco","Puntinismo","Quartetto","Quintetto",
  "Recital","Repertorio","Restauro","Ritornello","Rondò",
  "Staccato","Stilista","Surrealismo",
  "Tocco","Tonalità","Trascrizione","Tratteggio","Trio",
  "Vernissage","Virtuosismo",
  // SCIENZA E TECNOLOGIA (aggiunte)
  "Acceleratore","Aereodinamica","Amplificatore","Antimateria","Applicazione","Architettura",
  "Biologia","Biometria","Calibrazione",
  "Climatologia","Clonazione","Compilatore","Compressione","Conduzione","Convezione",
  "Decodifica","Emissione","Equazione",
  "Esperimento","Estrazione","Filamento","Formula","Fotovoltaico","Generatore",
  "Geotermico","Idraulica","Inerzia","Innovazione",
  "Modulazione","Neutro","Nucleare",
  "Oscillazione","Ossidazione","Parametro","Particella","Pendenza",
  "Reazione","Riciclaggio","Rifrazione","Robotica","Sensore",
  
  "Velocimetro",
  // ABBIGLIAMENTO (aggiunte)
  "Abito","Babbuccia","Bavero","Borsa","Calzamaglia",
  "Camicetta","Cappuccio","Casacca","Cinta","Coppola","Corpetto",
  "Espadrilla","Farfallino","Gabbana","Ghetta","Grembiule","Infradito",
  "Kefiah","Leggings","Livrea","Maglietta","Mantella","Pantalone",
  "Parigina","Pashmina","Pettorina","Plaid","Polsino","Saio",
  "Sarong","Scialle","Smoking","Soprabito","Sottana","Stola",
  "Toga","Veste","Zucchetto",
  // CASA E ARCHITETTURA (aggiunte)
  "Abbaino","Alcova","Anticamera","Apiario","Belvedere",
  "Botola","Cancello","Colonnato","Controsoffitto","Corrimano",
  "Dormitorio","Facciata","Frangisole","Fumaiolo",
  "Giardino","Intercapedine","Interrato","Lastricato","Mattone",
  "Mezzanino","Monolocale","Muretto","Nicchia","Palaffitta","Parapetto",
  "Patio","Pensilina","Pianerottolo","Pluviale","Porticato","Rampante",
  "Salotto","Scala a chiocciola","Scantinato","Solaio","Terrazzino",
  "Tramezzo","Traversina","Velario",
  // TRASPORTI (aggiunte)
  "Ammiraglia","Autogiro","Battello","Berlina","Cabinovia",
  "Cargo","Carretta","Chiatta","Cisterna","Coupé","Darsena",
  "Draisina","Feluca","Fuoriserie","Gozzo","Incrociatore","Jet",
  "Limousina","Monovolume","Motovedetta","Navetta","Panfilo",
  "Pattuglia","Piroscafo","Quadriciclo","Rimorchio","Risciò","Roulotte",
  "Sambuco","Scafo","Shuttle","Siluro","Spider","Tandem",
  "Tartana","Torpedone","Tram","Utilitaria","Yacht",
  // ECONOMIA (aggiunte)
  "Acconto","Ammortamento","Assegno","Avanzo","Bancarotta","Benchmark",
  "Bonifico","Budget","Cambiale","Cauzione","Cessione","Commissione",
  "Compenso","Conguaglio","Contante","Credito","Debito","Deposito",
  "Fatturato","Fido","Finanziamento","Forfait","Franchigia","Giacenza",
  "Giroconto","Gravame","Indennizzo","Introito","Inventario","Listino",
  "Margine","Penale","Percentuale","Plusvalenza","Profitto","Provvigione",
  "Rateo","Recupero","Reddito","Rendiconto","Ricavo","Rimborso",
  "Risparmio","Scadenza","Sconto","Sovvenzione","Stipendio","Storno",
  "Surplus","Tangente","Versamento",
  // LETTERATURA (aggiunte)
  "Aedo","Antologia","Autobiografia","Bestseller","Bibliografia",
  "Biografia","Cantico","Carme",
  "Commedia","Compendio","Dedica","Diario","Dizione",
  "Dramma","Eufemismo","Farsa",
  "Glosse","Incunabolo","Intertestualità","Lirismo",
  "Manoscritto","Memorie","Miscellanea","Ottava","Pamphlet",
  "Parabola","Parodia","Pastiche","Poema","Postfazione",
  "Prefazione","Pseudonimo","Quartina","Retorica","Saggiare","Satira",
  "Sillaba","Sinossi","Terzina","Tragedia","Trattato",
  "Tropo","Vademecum","Vignetta",
  // DIRITTO (aggiunte)
  "Abrogazione","Adesione","Arbitrato","Citazione","Clausola",
  "Colpa","Conciliazione","Concessione","Contravvenzione","Controversia",
  "Convenzione","Corte","Delega","Delitto","Deposizione","Detenzione",
  "Diffamazione","Diritto","Divieto","Esclusione","Estradizione","Frode",
  "Giuramento","Giurisdizione","Giurisprudenza","Grazia","Imputazione","Incriminazione",
  "Ingiunzione","Istruttoria","Legalizzazione","Legge","Mandato","Mediazione",
  "Moratoria","Norma","Notifica","Obiezione","Omicidio","Patteggiamento",
  "Petizione","Procura","Querela","Ratifica","Reato","Recidiva",
  "Rito","Sanzione","Sopralluogo","Sospensione",
  "Tutela","Verdetto","Violazione",
  // COMUNICAZIONE E MEDIA (aggiunte)
  "Annuncio","Articolista","Banner","Blog","Bollettino","Broadcasting",
  "Censura","Cifrario","Comunicato","Conferenza","Contraddittorio","Cronaca",
  "Editoriale","Esclusiva","Flash","Gossip","Inchiesta","Informatore",
  "Lancio","Manchette","Manifesto","Mensile","Notiziario","Opuscolo",
  "Periodico","Podcast","Propaganda","Pubblicità",
  "Rassegna","Redattore","Rubrica","Scoop","Settimanale",
  "Slogan","Tabloid","Telegramma","Trailer","Volantino",
  // COLORI
  "Amaranto","Avorio","Beige","Bianco","Bordeaux",
  "Carminio","Celeste","Cenere","Ceruleo","Cipria",
  "Cremisi","Ecru","Fucsia",
  "Ghiaccio","Giallo","Granata","Indaco","Lavanda",
  "Lilla","Magenta","Malva","Marrone",
  "Nero","Ocra","Panna","Pervinca",
  "Porpora","Rosa","Rosso","Ruggine",
  "Sabbia","Turchino","Verde",
  "Vinaccia","Viola","Zolfo",
  // PIANTE E FIORI
  "Acacia","Agrifoglio","Aloe","Azalea","Begonia",
  "Bouganville","Bucaneve","Cactus","Calendula","Camelia","Campanula",
  "Caprifoglio","Cardo","Ciclamino","Clematide","Crisantemo","Dalia",
  "Eucalipto","Fiordaliso","Garofano","Gardenia","Gelsomino",
  "Geranio","Giglio","Ginestra","Girasole","Glicine","Ibisco",
  "Iris","Loto","Magnolia","Margherita","Mimosa","Mughetto",
  "Narciso","Ninfea","Oleandro","Orchidea","Ortensia","Papavero",
  "Peonia","Petunia","Primula","Ranuncolo","Rododendro",
  "Stella di Natale","Tulipano","Verbena","Violetta",
  "Zinnia",
  // METEO E FENOMENI ATMOSFERICI
  "Afa","Anticiclone","Bolla di calore","Bonaccia","Bruma","Canicola",
  "Condensa","Corrente a getto","Fronte caldo","Fronte freddo",
  "Gelo","Inversione termica",
  "Lampo","Mugugno","Nubifragio","Nuvolaglia","Perturbazione",
  "Pioviggine","Polverone","Precipitazione","Refolo","Rovescio","Sbalzo termico",
  "Siccità","Squarcio","Tormenta","Turbolenza",
  "Umidità","Ventata","Vortice polare",
  // SENTIMENTI E STATI D'ANIMO (aggiunte)
  "Abbattimento","Accidia","Afflizione","Agitazione","Alienazione","Appagamento",
  "Apprensione","Beatitudine","Benessere","Capriccio","Claustrofobia","Commozione",
  "Compiacimento","Cupidigia","Devozione","Disprezzo","Ebbrezza","Eccitazione",
  "Estasi","Estraneità","Fierezza","Frenesia","Frustrazione","Giubilo",
  "Imbarazzo","Impazienza","Impotenza","Incoerenza","Indignazione","Inquietudine",
  "Insicurezza","Irrequietezza","Irritazione","Languore","Letargia","Malessere",
  "Mansuetudine","Mestizia","Nervosismo","Ossessione","Perplessità",
  "Pietà","Preoccupazione","Rassicurazione","Ribrezzo","Riconoscenza",
  "Risentimento","Sbigottimento","Sconforto","Smarrimento","Sofferenza","Soggezione",
  "Sollievo","Spavento","Spossatezza","Stizza","Struggimento",
  "Supplizio","Tedio","Tensione","Tepore","Timore","Titubanza",
  "Torpore","Trasporto","Turbamento","Vigore",
  // MONDO DEL LAVORO
  "Apprendistato","Assunzione","Carriera","Colloquio","Contratto","Convocazione",
  "Curriculum","Dimissioni","Ferie","Indennità","Licenziamento","Mansione",
  "Mestiere","Occupazione","Orario","Pensione","Qualifica",
  "Retribuzione","Sindacato","Tirocinio","Trasferta","Turno","Vocazione",
  // MONDO MARINO
  "Abisso","Bassofondo","Batiscafo",
  "Braccio di mare",
  "Frangente","Mareggiata","Ormeggio","Pontile",
  "Prua","Rada","Rollio","Scoglio","Secca",
  "Scia","Traverso",
  // TESSUTI E MATERIALI (aggiunte)
  "Alcantara","Canvas",
  "Cretonne","Damasco","Feltro",
  "Flanella","Gabardine","Jersey","Juta",
  "Lycra","Maglina","Microfibra",
  "Neoprene","Nylon","Pile",
  "Spandex",
  "Viscosa",
  // MESTIERI ANTICHI E RARI
  "Alabardiere","Alchimista","Ammaestratore","Araldo","Armaiolo","Banditore",
  "Barcaiolo","Bottaio","Candeliere","Cantastorie","Carbonaio",
  "Carrettiere","Cestaio","Ciociaro","Ciarlatano",
  "Fuochista","Lattaio","Materassaio","Merciaio",
  "Ombrellaio","Orologiaio","Pentoliere","Sellaio",
  "Spadaio","Straccivendolo","Tessitore","Tintore","Vasaio","Venditore ambulante",
  // MONDO DELLO SPETTACOLO
  "Applauso","Auditorium","Backstage","Camerino","Ciak",
  "Comparsa","Controfigura","Critica","Debutto","Doppiatore",
  "Encore","Fotogramma","Generico","Impresario",
  "Loggione","Matinée","Monologhista","Ovazione","Palchetto","Poltronissima",
  "Replica","Riflettore","Scena",
  "Soggettista","Spettacolo","Trampoliere","Troupe",
  "Ultimo atto","Varietà",
];

// ═══════════════════════════════════════════════════
// PAROLE COMPOSTE — ~900 espressioni
// ═══════════════════════════════════════════════════
const PAROLE_COMPOSTE = [
  // PERSONAGGI ITALIANI
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
  // PERSONAGGI INTERNAZIONALI
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
  // LUOGHI FAMOSI
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
  // ISTITUZIONI
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
  // ESPRESSIONI E LOCUZIONI
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
  // TITOLI DI FILM / OPERE
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
  // PIATTI E SPECIALITÀ
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
  // FESTIVITÀ
  "San Valentino","San Patrizio","San Silvestro","San Gennaro",
  "Sant'Ambrogio","Festa della Repubblica","Festa della Liberazione",
  "Festa della Mamma","Festa del Papà","Albero di Natale",
  "Babbo Natale","Presepe vivente","Fuochi d'artificio",
  "Stella cometa","Re Magi","Mercoledì delle Ceneri",
  "Domenica delle Palme","Via Crucis","Uovo di Pasqua",
  "Giovedì grasso","Martedì grasso","Notte di San Lorenzo",
  "Primo maggio","Vigilia di Natale","Santo Stefano",
  "Lunedì dell'Angelo","San Nicola",
  // MODI DI DIRE
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
  // SCIENZA E TECNICA
  "Buco nero","Via Lattea","Sistema Solare","Big Bang",
  "Effetto serra","Energia rinnovabile","Pannello solare",
  "Pala eolica","Macchina a vapore","Motore a scoppio",
  "Corrente alternata","Corrente continua","Fibra ottica",
  "Realtà virtuale","Realtà aumentata","Intelligenza artificiale",
  "Stampa 3D","Onde gravitazionali","Materia oscura","Energia oscura",
  "Bosone di Higgs","Tavola periodica","Zero assoluto",
  "Velocità della luce","Velocità del suono","Barriera del suono",
  "Fissione nucleare","Fusione nucleare","Indovina la parola!",
  "Effetto farfalla","Effetto domino","Effetto placebo",
  "Selezione naturale","Codice genetico","Doppia elica",
  "Campo magnetico","Punto di ebollizione","Punto di fusione",
  // COPPIE E FICTION
  "Bonnie e Clyde","Tom e Jerry","Stanlio e Ollio",
  "Tristano e Isotta","Adamo ed Eva","Caino e Abele","Romolo e Remo",
  "Davide e Golia","Sansone e Dalila","Sherlock Holmes e Watson",
  "Asterix e Obelix","Thelma e Louise","Simon e Garfunkel",
  "Mario e Luigi","Qui Quo Qua","Tic e Tac",
  "Don Chisciotte","Robin Hood","Re Artù","Peter Pan",
  // GIOCHI
  "Gioco dell'oca","Mosca cieca","Guardie e ladri",
  "Caccia al tesoro","Ruba bandiera","Tiro alla fune",
  "Carte da gioco","Gioco di ruolo","Parole crociate",
  "Gioco di società","Gioco da tavolo","Gioco di carte",
  "Sette e mezzo","Scala quaranta","Testa o croce",
  "Uno due tre stella","Strega comanda colore",
  // EXTRA VARIE
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
  "Bersaglio mobile","Zona calda","Zona rossa",
  "Rosso fuoco","Bianco candido","Nero pece","Verde smeraldo",
  "Blu cobalto","Giallo ocra","Grigio perla","Rosa antico",
  "Oro zecchino","Argento vivo","Bronzo antico",
  "Alto mare","Basso profilo","Lungo termine","Breve termine",
  "Grande slam","Piccolo schermo","Vecchia scuola","Nuovo mondo",
  "Vecchio continente","Bella stagione","Brutta copia",
  "Buona uscita","Cattivo gusto","Buona volontà",
  "Santa pace","Sacro fuoco","Spirito libero","Animo gentile",
];

// ═══════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 4; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

// ═══════════════════════════════════════════════════
// SUPABASE REALTIME HOOK
// ═══════════════════════════════════════════════════
function useSupabase() {
  const clientRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window._supabase) {
      clientRef.current = window._supabase;
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
    script.onload = () => {
      try {
        const c = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        window._supabase = c;
        clientRef.current = c;
        setLoaded(true);
      } catch (e) { console.error("Supabase init error:", e); }
    };
    script.onerror = () => console.warn("Could not load Supabase (buzzer won't work, game still playable)");
    document.head.appendChild(script);
  }, []);

  return { client: clientRef, loaded };
}

// ═══════════════════════════════════════════════════
// FONT LOADER
// ═══════════════════════════════════════════════════
function useFontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
}

// ═══════════════════════════════════════════════════
// MATCHING VOCALE
// ═══════════════════════════════════════════════════
function normalizeWord(w) {
  return w.toLowerCase().trim()
    .replace(/^(il |lo |la |i |gli |le |un |una |uno |l'|l')/, "")
    .replace(/[àáâ]/g,"a").replace(/[èéê]/g,"e").replace(/[ìíî]/g,"i")
    .replace(/[òóô]/g,"o").replace(/[ùúû]/g,"u")
    .replace(/[^a-z0-9 ]/g,"").replace(/\s+/g," ").trim();
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({length: m+1}, (_, i) => [i]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1]+(a[i-1]!==b[j-1]?1:0));
  return d[m][n];
}

function matchWord(spoken, target) {
  const s = normalizeWord(spoken);
  const t = normalizeWord(target);
  if (s === t) return true;
  const maxDist = Math.min(2, Math.floor(t.length * 0.25));
  if (levenshtein(s, t) <= maxDist) return true;
  return false;
}

const F = "'Outfit', system-ui, -apple-system, sans-serif";

// Dynamic font size for word display
function getWordFontSize(word) {
  if (!word) return 48;
  const len = word.length;
  if (len <= 7) return 56;
  if (len <= 10) return 48;
  if (len <= 14) return 40;
  if (len <= 18) return 34;
  if (len <= 24) return 28;
  return 24;
}

// ═══════════════════════════════════════════════════
// BUZZER VIEW (separate page for the player)
// ═══════════════════════════════════════════════════
function BuzzerView({ initialRoomCode }) {
  useFontLoader();
  const { client, loaded } = useSupabase();
  const [roomCode, setRoomCode] = useState(initialRoomCode || "");
  const [joined, setJoined] = useState(false);
  const [connected, setConnected] = useState(false);
  const [buzzed, setBuzzed] = useState(false);
  const [result, setResult] = useState(null); // "correct"|"error"|"timeout"
  const [canBuzz, setCanBuzz] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const [micPermission, setMicPermission] = useState("unknown");
  const channelRef = useRef(null);
  const recognitionRef = useRef(null);

  // Join room
  const joinRoom = useCallback(() => {
    if (!client.current || !roomCode.trim()) return;
    const code = roomCode.trim().toUpperCase();
    const ch = client.current.channel(`room-${code}`, {
      config: { broadcast: { self: false } }
    });

    ch.on("broadcast", { event: "word_active" }, ({ payload }) => {
      setCanBuzz(payload.active);
      if (payload.speechEnabled !== undefined) setSpeechEnabled(payload.speechEnabled);
      if (payload.active) { setBuzzed(false); setResult(null); setListening(false); }
    });

    ch.on("broadcast", { event: "buzz_result" }, ({ payload }) => {
      setResult(payload.result);
      setBuzzed(false);
      setTimeout(() => setResult(null), 2000);
    });

    ch.subscribe((status) => {
      if (status === "SUBSCRIBED") { setConnected(true); setJoined(true); }
    });

    channelRef.current = ch;
  }, [client, roomCode]);

  // Start speech recognition
  const startListening = useCallback(() => {
    if (!speechEnabled || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "it-IT";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setListening(false);
      if (channelRef.current) {
        channelRef.current.send({ type: "broadcast", event: "speech_text", payload: { text } });
      }
    };
    recognition.onerror = () => {
      setListening(false);
      if (channelRef.current) {
        channelRef.current.send({ type: "broadcast", event: "speech_text", payload: { text: "" } });
      }
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  }, [speechEnabled]);

  // Request mic permission on join
  useEffect(() => {
    if (joined && speechEnabled) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => setMicPermission("granted"))
        .catch(() => setMicPermission("denied"));
    }
  }, [joined, speechEnabled]);

  // Send buzz
  const sendBuzz = useCallback(() => {
    if (!channelRef.current || buzzed || !canBuzz) return;
    setBuzzed(true);
    if (navigator.vibrate) navigator.vibrate(100);
    channelRef.current.send({ type: "broadcast", event: "buzz", payload: {} });
    if (speechEnabled) {
      setTimeout(() => startListening(), 100);
    }
  }, [buzzed, canBuzz, speechEnabled, startListening]);

  // Not joined yet - show room code entry
  if (!joined) {
    return (
      <div style={{ minHeight:"100vh", background:"#0a0e27", color:"#fff", fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, userSelect:"none" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🔔</div>
        <h1 style={{ fontSize:28, fontWeight:900, marginBottom:8 }}>Buzzer</h1>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:14, marginBottom:32, textAlign:"center" }}>
          Inserisci il codice stanza mostrato sullo schermo principale
        </p>
        {!loaded && <p style={{ color:"#FF9500", fontSize:13, marginBottom:16 }}>Caricamento connessione...</p>}
        <input
          type="text"
          value={roomCode}
          onChange={e => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,4))}
          placeholder="CODICE"
          maxLength={4}
          style={{
            width:200, textAlign:"center", fontSize:40, fontWeight:900, fontFamily:F,
            padding:"16px 20px", borderRadius:20, border:"2px solid rgba(255,255,255,0.2)",
            background:"rgba(255,255,255,0.08)", color:"#fff", letterSpacing:12,
            outline:"none"
          }}
        />
        <button
          onClick={joinRoom}
          disabled={!loaded || roomCode.length < 4}
          style={{
            marginTop:24, padding:"18px 48px", borderRadius:16, border:"none",
            background: loaded && roomCode.length === 4 ? "#4A90D9" : "rgba(255,255,255,0.1)",
            color:"#fff", fontSize:20, fontWeight:900, cursor:"pointer", fontFamily:F,
            opacity: loaded && roomCode.length === 4 ? 1 : 0.4
          }}
        >CONNETTI</button>
      </div>
    );
  }

  // Joined - show buzzer
  const bgColor = result === "correct" ? "#1a4a2a" : result === "error" ? "#4a1a1a" : result === "timeout" ? "#4a3a1a" : buzzed ? "#1a2a4a" : "#0a0e27";

  return (
    <div
      onClick={(!buzzed && canBuzz && !result) ? sendBuzz : undefined}
      style={{
        minHeight:"100vh", background:bgColor, color:"#fff", fontFamily:F,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding:32, userSelect:"none", WebkitUserSelect:"none",
        WebkitTapHighlightColor:"transparent", WebkitTouchCallout:"none",
        cursor: (!buzzed && canBuzz && !result) ? "pointer" : "default",
        transition:"background 0.3s ease"
      }}
    >
      {/* Status dot */}
      <div style={{ position:"fixed", top:16, right:16, display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:10, height:10, borderRadius:"50%", background: connected ? "#34C759" : "#FF3B30" }} />
        <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{roomCode}</span>
      </div>

      {result ? (
        // Show result
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:80 }}>{result === "correct" ? "✓" : "✗"}</div>
          <div style={{ fontSize:32, fontWeight:900, marginTop:16, color: result === "correct" ? "#34C759" : "#FF3B30" }}>
            {result === "correct" ? "CORRETTA!" : result === "timeout" ? "TEMPO SCADUTO!" : "SBAGLIATA!"}
          </div>
        </div>
      ) : buzzed ? (
        // Buzzed, waiting for result
        <div style={{ textAlign:"center" }}>
          {listening ? (
            <>
              <div style={{ fontSize:80, animation:"pulse 0.8s infinite" }}>🎤</div>
              <div style={{ fontSize:28, fontWeight:900, color:"#FF9500", marginTop:16 }}>PARLA ORA!</div>
              <div style={{ fontSize:14, color:"rgba(255,255,255,0.4)", marginTop:8 }}>Sto ascoltando...</div>
            </>
          ) : speechEnabled ? (
            <>
              <div style={{ fontSize:72, fontWeight:900, color:"#4A90D9", animation:"pulse 1s infinite" }}>BUZZ!</div>
              <div style={{ fontSize:16, color:"rgba(255,255,255,0.4)", marginTop:16 }}>Risposta inviata, in attesa...</div>
            </>
          ) : (
            <>
              <div style={{ fontSize:72, fontWeight:900, color:"#4A90D9", animation:"pulse 1s infinite" }}>BUZZ!</div>
              <div style={{ fontSize:16, color:"rgba(255,255,255,0.4)", marginTop:16 }}>In attesa del conduttore...</div>
            </>
          )}
        </div>
      ) : canBuzz ? (
        // Ready to buzz - entire screen is the button
        <div style={{ textAlign:"center" }}>
          <div style={{
            width:200, height:200, borderRadius:"50%", margin:"0 auto 24px",
            background:"radial-gradient(circle at 35% 35%, #FF4444, #CC0000 60%, #880000)",
            boxShadow:"0 8px 40px rgba(255,0,0,0.5), inset 0 -6px 12px rgba(0,0,0,0.3), inset 0 6px 12px rgba(255,255,255,0.15)",
            display:"flex", alignItems:"center", justifyContent:"center",
            border:"6px solid #660000"
          }}>
            <div style={{ fontSize:48, fontWeight:900, color:"#fff", textShadow:"0 2px 8px rgba(0,0,0,0.5)" }}>BUZZ</div>
          </div>
          <div style={{ fontSize:28, fontWeight:900, letterSpacing:4 }}>PREMI!</div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.3)", marginTop:12 }}>Tocca lo schermo per buzzare</div>
        </div>
      ) : (
        // Waiting for word
        <div style={{ textAlign:"center" }}>
          <div style={{
            width:160, height:160, borderRadius:"50%", margin:"0 auto 24px",
            background:"radial-gradient(circle at 35% 35%, #666, #444 60%, #222)",
            boxShadow:"inset 0 -4px 8px rgba(0,0,0,0.3)",
            display:"flex", alignItems:"center", justifyContent:"center",
            border:"6px solid #333", opacity:0.4
          }}>
            <div style={{ fontSize:36, fontWeight:900, color:"#999" }}>BUZZ</div>
          </div>
          <div style={{ fontSize:20, fontWeight:700, color:"rgba(255,255,255,0.3)" }}>In attesa della prossima parola...</div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN GAME (conduttore)
// ═══════════════════════════════════════════════════
function MainGame() {
  useFontLoader();
  const { client, loaded: supabaseLoaded } = useSupabase();

  // Game states
  const [gameState, setGameState] = useState("setup");
  const [timeLimit, setTimeLimit] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [isRaddoppio, setIsRaddoppio] = useState(false);
  const [currentWord, setCurrentWord] = useState(null);
  const [lastWord, setLastWord] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [waitingForExtract, setWaitingForExtract] = useState(true);
  const [history, setHistory] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [passiRimanenti, setPassiRimanenti] = useState(3);

  // Buzzer states
  const [buzzerEnabled, setBuzzerEnabled] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [speechText, setSpeechText] = useState(null);
  const [speechProcessed, setSpeechProcessed] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [inRevisione, setInRevisione] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [buzzerConnected, setBuzzerConnected] = useState(false);
  const [buzzed, setBuzzed] = useState(false);
  const [buzzCountdown, setBuzzCountdown] = useState(0);

  const singleQueueRef = useRef([]);
  const composteQueueRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const remainingAtStartRef = useRef(0);
  const channelRef = useRef(null);
  const buzzTimerRef = useRef(null);

  const initQueues = useCallback(() => {
    singleQueueRef.current = shuffle([...new Set(PAROLE_SINGOLE)]);
    composteQueueRef.current = shuffle([...new Set(PAROLE_COMPOSTE)]);
  }, []);

  const getNextWord = useCallback(() => {
    const queue = isRaddoppio ? composteQueueRef.current : singleQueueRef.current;
    if (queue.length === 0) {
      // Ricarica il sacco solo quando completamente esaurito
      if (isRaddoppio) composteQueueRef.current = shuffle([...new Set(PAROLE_COMPOSTE)]);
      else singleQueueRef.current = shuffle([...new Set(PAROLE_SINGOLE)]);
      return (isRaddoppio ? composteQueueRef.current : singleQueueRef.current).pop();
    }
    return queue.pop();
  }, [isRaddoppio]);

  // Game timer
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      startTimeRef.current = Date.now();
      remainingAtStartRef.current = timeLeft;
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const newTime = Math.max(0, remainingAtStartRef.current - elapsed);
        setTimeLeft(newTime);
        if (newTime <= 0) {
          clearInterval(timerRef.current);
          setTimerRunning(false);
          setGameState("gameover");
        }
      }, 50);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  // Buzz countdown timer
  useEffect(() => {
    if (buzzed && buzzCountdown > 0) {
      buzzTimerRef.current = setInterval(() => {
        setBuzzCountdown(p => {
          if (p <= 0.1) {
            clearInterval(buzzTimerRef.current);
            // Auto-sbagliata on timeout
            handleBuzzTimeout();
            return 0;
          }
          return p - 0.1;
        });
      }, 100);
    }
    return () => { if (buzzTimerRef.current) clearInterval(buzzTimerRef.current); };
  }, [buzzed]);

  // Setup Supabase channel
  const setupChannel = useCallback((code) => {
    if (!client.current) return;
    if (channelRef.current) channelRef.current.unsubscribe();

    const ch = client.current.channel(`room-${code}`, {
      config: { broadcast: { self: false } }
    });

    ch.on("broadcast", { event: "buzz" }, () => {
      // Only accept buzz if word is active and not already buzzed
      setBuzzed(prev => {
        if (prev) return prev; // already buzzed
        setTimerRunning(false);
        setBuzzCountdown(BUZZ_TIMEOUT);
        setSpeechText(null);
        setSpeechProcessed(false);
        setManualOverride(false);
        if (navigator.vibrate) navigator.vibrate(200);
        return true;
      });
    });

    ch.on("broadcast", { event: "speech_text" }, ({ payload }) => {
      setSpeechText(payload.text || "");
    });

    ch.subscribe((status) => {
      if (status === "SUBSCRIBED") setBuzzerConnected(true);
    });

    channelRef.current = ch;
  }, [client]);

  // Notify buzzer about word state
  const notifyBuzzer = useCallback((active) => {
    if (channelRef.current && buzzerEnabled) {
      channelRef.current.send({ type: "broadcast", event: "word_active", payload: { active, speechEnabled } });
    }
  }, [buzzerEnabled, speechEnabled]);

  // Send buzz result to buzzer
  const notifyBuzzResult = useCallback((result) => {
    if (channelRef.current && buzzerEnabled) {
      channelRef.current.send({ type: "broadcast", event: "buzz_result", payload: { result } });
    }
  }, [buzzerEnabled]);

  const handleBuzzTimeout = useCallback(() => {
    // Auto wrong answer on timeout
    if (!currentWord) return;
    const pts = isRaddoppio ? 2 : 1;
    setScore(p => Math.max(0, p - pts));
    setErrorCount(p => p + 1);
    setHistory(p => [...p, { word: currentWord, correct: false, buzzTimeout: true }]);
    setLastResult("error");
    setLastAction({ word: currentWord, correct: false, pts: isRaddoppio ? 2 : 1 });
    notifyBuzzResult("timeout");
    setCurrentWord(null);
    setWaitingForExtract(true);
    setBuzzed(false);
    setBuzzCountdown(0);
  }, [currentWord, isRaddoppio, notifyBuzzResult]);

  // Speech match logic
  useEffect(() => {
    if (!speechEnabled || !buzzed || speechText === null || speechProcessed || manualOverride) return;
    if (!currentWord) return;
    setSpeechProcessed(true);

    if (speechText && matchWord(speechText, currentWord)) {
      // MATCH! Auto-corretta
      clearInterval(buzzTimerRef.current);
      const pts = isRaddoppio ? 2 : 1;
      setScore(p => p + pts);
      setCorrectCount(p => p + 1);
      setHistory(p => [...p, { word: currentWord, correct: true, speechMatch: true }]);
      setLastResult("correct");
      setLastAction({ word: currentWord, correct: true, pts: isRaddoppio ? 2 : 1 });
      notifyBuzzResult("correct");
      notifyBuzzer(false);
      setCurrentWord(null);
      setWaitingForExtract(true);
      setBuzzed(false);
      setBuzzCountdown(0);
      setSpeechText(null);
    }
    // Se non matcha: il countdown continua, il conduttore vede il testo e decide
  }, [speechText, buzzed, speechEnabled, speechProcessed, manualOverride, currentWord]);

  // Start game
  const startGame = () => {
    initQueues();
    if (buzzerEnabled && supabaseLoaded) {
      const code = generateRoomCode();
      setRoomCode(code);
      setupChannel(code);
    }
    setTimeLeft(timeLimit);
    setScore(0);
    setCorrectCount(0);
    setErrorCount(0);
    setPassiRimanenti(3);
    setHistory([]);
    setCurrentWord(null);
    setLastWord(null);
    setLastResult(null);
    setWaitingForExtract(true);
    setTimerRunning(false);
    setIsRaddoppio(false);
    setBuzzed(false);
    setBuzzCountdown(0);
    setSpeechText(null);
    setSpeechProcessed(false);
    setManualOverride(false);
    setGameState(buzzerEnabled ? "lobby" : "playing");
  };

  // Start from lobby
  const startFromLobby = () => {
    setGameState("playing");
  };

  // Extract word
  const extractWord = () => {
    if (timeLeft <= 0 || !waitingForExtract) return;
    const word = getNextWord();
    setCurrentWord(word);
    setLastWord(word);
    setLastResult(null);
    setWaitingForExtract(false);
    setBuzzed(false);
    setBuzzCountdown(0);
    setSpeechText(null);
    setSpeechProcessed(false);
    setManualOverride(false);
    setLastAction(null);
    if (!buzzerEnabled) {
      setTimerRunning(true);
    } else {
      setTimerRunning(true);
      notifyBuzzer(true);
    }
  };

  // Handle correct
  const handleCorrect = () => {
    if (waitingForExtract || !currentWord) return;
    if (buzzerEnabled && !buzzed && !inRevisione) return; // must buzz first in buzzer mode
    clearInterval(buzzTimerRef.current);
    if (!buzzed) setTimerRunning(false); // already stopped if buzzed
    const pts = isRaddoppio ? 2 : 1;
    setScore(p => p + pts);
    setCorrectCount(p => p + 1);
    setHistory(p => [...p, { word: currentWord, correct: true }]);
    setLastResult("correct");
    setLastAction({ word: currentWord, correct: true, pts: isRaddoppio ? 2 : 1 });
    if (!inRevisione) { notifyBuzzResult("correct"); notifyBuzzer(false); }
    setCurrentWord(null);
    setWaitingForExtract(true);
    setBuzzed(false);
    setBuzzCountdown(0);
    setInRevisione(false);
  };

  // Handle error
  const handleError = () => {
    if (waitingForExtract || !currentWord) return;
    if (buzzerEnabled && !buzzed && !inRevisione) return;
    clearInterval(buzzTimerRef.current);
    if (!buzzed) setTimerRunning(false);
    const pts = isRaddoppio ? 2 : 1;
    setScore(p => Math.max(0, p - pts));
    setErrorCount(p => p + 1);
    setHistory(p => [...p, { word: currentWord, correct: false }]);
    setLastResult("error");
    setLastAction({ word: currentWord, correct: false, pts: isRaddoppio ? 2 : 1 });
    if (!inRevisione) { notifyBuzzResult("error"); notifyBuzzer(false); }
    setCurrentWord(null);
    setWaitingForExtract(true);
    setBuzzed(false);
    setBuzzCountdown(0);
    setInRevisione(false);
  };

  /// Handle passo — ferma il tempo, scala un passo, lascia la parola visibile
  const handlePasso = () => {
    if (waitingForExtract || !currentWord || passiRimanenti <= 0) return;
    if (buzzed) return;
    setTimerRunning(false);
    setPassiRimanenti(p => p - 1);
    setLastResult("passo");
    setCurrentWord(null);
    setWaitingForExtract(true);
    if (buzzerEnabled) notifyBuzzer(false);
  };

  // Handle revisione — annulla ultima risposta e permette di rigiudicare
  const handleRevisione = () => {
    if (!lastAction || !waitingForExtract) return;
    // Annulla punteggio
    if (lastAction.correct) {
      setScore(p => Math.max(0, p - lastAction.pts));
      setCorrectCount(p => Math.max(0, p - 1));
    } else {
      setScore(p => p + lastAction.pts);
      setErrorCount(p => Math.max(0, p - 1));
    }
    // Rimuovi ultima voce dalla cronologia
    setHistory(p => p.slice(0, -1));
    // Riporta la parola in stato attivo per rigiudicarla
    setCurrentWord(lastAction.word);
    setLastWord(lastAction.word);
    setLastResult(null);
    setWaitingForExtract(false);
    setInRevisione(true);
    // Timer NON riparte
    setLastAction(null);
  };

  const toggleRaddoppio = () => {
    if (!waitingForExtract) return;
    if (!isRaddoppio && score < 2) return; // serve almeno 2 punti per attivare
    setIsRaddoppio(p => !p);
  };

  const displayTime = Math.ceil(timeLeft);
  const timerPercent = (timeLeft / timeLimit) * 100;
  const timerColor = timeLeft <= 10 ? "#FF3B30" : timeLeft <= 20 ? "#FF9500" : "#34C759";
  const buzzPercent = buzzed ? (buzzCountdown / BUZZ_TIMEOUT) * 100 : 0;

  // Can press action buttons?
  const canAct = buzzerEnabled ? ((buzzed || inRevisione) && !waitingForExtract) : !waitingForExtract;

  // ─── SETUP ───
  if (gameState === "setup") {
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0e27,#1a1040 40%,#0d1b3e)", color:"#fff", fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 20px", userSelect:"none", WebkitUserSelect:"none", WebkitTapHighlightColor:"transparent" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:64, marginBottom:8 }}>🧠</div>
          <h1 style={{ fontSize:38, fontWeight:900, margin:0, letterSpacing:"-1px", background:"linear-gradient(135deg,#fff,#a0c4ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Due per Uno</h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.4)", margin:"8px 0 0", letterSpacing:4, textTransform:"uppercase", fontWeight:600 }}>Indovina la parola!</p>
        </div>

        {/* Time setting */}
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:24, padding:"28px 28px", width:"100%", maxWidth:380, textAlign:"center", border:"1px solid rgba(255,255,255,0.08)", marginBottom:20 }}>
          <p style={{ fontSize:13, letterSpacing:3, color:"rgba(255,255,255,0.45)", margin:"0 0 16px", fontWeight:700 }}>TEMPO (SECONDI)</p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:28 }}>
            <button onClick={() => setTimeLimit(p => Math.max(55, p - 5))} style={{ width:64, height:64, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.08)", color:"#fff", fontSize:28, fontWeight:800, cursor:"pointer", fontFamily:F }}>−5</button>
            <span style={{ fontSize:64, fontWeight:900, minWidth:90, textAlign:"center", fontVariantNumeric:"tabular-nums" }}>{timeLimit}</span>
            <button onClick={() => setTimeLimit(p => Math.min(65, p + 5))} style={{ width:64, height:64, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.08)", color:"#fff", fontSize:28, fontWeight:800, cursor:"pointer", fontFamily:F }}>+5</button>
          </div>
        </div>

        {/* Buzzer toggle */}
        <div
          onClick={() => setBuzzerEnabled(p => !p)}
          style={{
            background: buzzerEnabled ? "rgba(74,144,217,0.15)" : "rgba(255,255,255,0.04)",
            borderRadius:20, padding:"18px 24px", width:"100%", maxWidth:380,
            border: buzzerEnabled ? "2px solid rgba(74,144,217,0.4)" : "1px solid rgba(255,255,255,0.08)",
            marginBottom:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between",
            transition:"all 0.2s"
          }}
        >
          <div>
            <div style={{ fontSize:16, fontWeight:700 }}>🔔 Buzzer remoto</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>Un giocatore risponde dal suo telefono</div>
          </div>
          <div style={{
            width:52, height:30, borderRadius:15, padding:3,
            background: buzzerEnabled ? "#4A90D9" : "rgba(255,255,255,0.15)",
            transition:"background 0.2s", display:"flex", alignItems: "center",
            justifyContent: buzzerEnabled ? "flex-end" : "flex-start"
          }}>
            <div style={{ width:24, height:24, borderRadius:"50%", background:"#fff", transition:"all 0.2s" }} />
          </div>
        </div>

        {/* Speech toggle - solo se buzzer attivo */}
        {buzzerEnabled && (
          <div
            onClick={() => setSpeechEnabled(p => !p)}
            style={{
              background: speechEnabled ? "rgba(255,149,0,0.15)" : "rgba(255,255,255,0.04)",
              borderRadius:20, padding:"18px 24px", width:"100%", maxWidth:380,
              border: speechEnabled ? "2px solid rgba(255,149,0,0.4)" : "1px solid rgba(255,255,255,0.08)",
              marginBottom:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between",
              transition:"all 0.2s"
            }}
          >
            <div>
              <div style={{ fontSize:16, fontWeight:700 }}>🎤 Riconoscimento vocale</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>Il giocatore risponde a voce, il sistema verifica</div>
            </div>
            <div style={{
              width:52, height:30, borderRadius:15, padding:3,
              background: speechEnabled ? "#FF9500" : "rgba(255,255,255,0.15)",
              transition:"background 0.2s", display:"flex", alignItems:"center",
              justifyContent: speechEnabled ? "flex-end" : "flex-start"
            }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:"#fff", transition:"all 0.2s" }} />
            </div>
          </div>
        )}

        <button onClick={startGame} style={{ width:"100%", maxWidth:380, padding:"22px 20px", borderRadius:18, border:"none", background:"linear-gradient(135deg,#4A90D9,#357ABD)", color:"#fff", fontSize:22, fontWeight:900, letterSpacing:2, cursor:"pointer", boxShadow:"0 8px 32px rgba(74,144,217,0.35)", fontFamily:F }}>
          {buzzerEnabled ? "CONFIGURA BUZZER" : "INIZIA IL GIOCO"}
        </button>
        <p style={{ marginTop:20, fontSize:13, color:"rgba(255,255,255,0.2)", textAlign:"center" }}>{PAROLE_SINGOLE.length} parole · {PAROLE_COMPOSTE.length} espressioni</p>
      </div>
    );
  }

  // ─── LOBBY (buzzer connection) ───
  if (gameState === "lobby") {
    const buzzerUrl = `${window.location.origin}${window.location.pathname}#buzzer?room=${roomCode}`;
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0e27,#1a1040 40%,#0d1b3e)", color:"#fff", fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 20px", userSelect:"none" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🔔</div>
        <h2 style={{ fontSize:26, fontWeight:900, margin:"0 0 8px" }}>Connetti il Buzzer</h2>
        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14, textAlign:"center", marginBottom:32, maxWidth:340 }}>
          Sul telefono del giocatore, apri questo sito e clicca il link "BUZZER" oppure vai all'indirizzo e inserisci il codice:
        </p>

        {/* Room code display */}
        <div style={{
          background:"rgba(255,255,255,0.08)", borderRadius:24, padding:"24px 48px",
          border:"2px solid rgba(74,144,217,0.3)", marginBottom:24, textAlign:"center"
        }}>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.4)", letterSpacing:3, marginBottom:8, fontWeight:600 }}>CODICE STANZA</div>
          <div style={{ fontSize:56, fontWeight:900, letterSpacing:16, color:"#4A90D9" }}>{roomCode}</div>
        </div>

        {/* URL display */}
        <div style={{
          background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"12px 16px",
          fontSize:11, color:"rgba(255,255,255,0.35)", wordBreak:"break-all",
          maxWidth:380, textAlign:"center", marginBottom:16
        }}>
          {buzzerUrl}
        </div>

        {/* QR Code */}
        <div style={{ marginBottom:32, textAlign:"center" }}>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(buzzerUrl)}`}
            alt="QR Buzzer"
            style={{ width:180, height:180, borderRadius:16, border:"3px solid rgba(255,255,255,0.15)" }}
          />
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)", marginTop:8 }}>Inquadra con la fotocamera</div>
        </div>

        <button onClick={startFromLobby} style={{
          width:"100%", maxWidth:380, padding:"22px 20px", borderRadius:18, border:"none",
          background:"linear-gradient(135deg,#4A90D9,#357ABD)", color:"#fff",
          fontSize:22, fontWeight:900, letterSpacing:2, cursor:"pointer",
          boxShadow:"0 8px 32px rgba(74,144,217,0.35)", fontFamily:F
        }}>INIZIA IL GIOCO</button>

        {speechEnabled && (
          <div style={{ marginTop:16, padding:"12px 20px", borderRadius:12, background:"rgba(255,149,0,0.1)", border:"1px solid rgba(255,149,0,0.25)", maxWidth:380, textAlign:"center" }}>
            <div style={{ fontSize:13, color:"#FF9500", fontWeight:600 }}>🎤 Riconoscimento vocale attivo</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>Il giocatore dovrà concedere l'accesso al microfono dal suo telefono</div>
          </div>
        )}
        <p style={{ marginTop:16, fontSize:13, color:"rgba(255,255,255,0.25)" }}>
          Puoi iniziare anche senza che il buzzer sia connesso
        </p>
      </div>
    );
  }

  // ─── GAME OVER ───
  if (gameState === "gameover") {
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0e27,#1a1040 40%,#0d1b3e)", color:"#fff", fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", padding:"36px 20px", overflow:"auto", userSelect:"none", WebkitUserSelect:"none" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:52 }}>🏁</div>
          <h2 style={{ fontSize:32, fontWeight:900, margin:"8px 0 0" }}>Tempo Scaduto!</h2>
        </div>
        <div style={{ textAlign:"center", background:"rgba(255,255,255,0.06)", borderRadius:28, padding:"28px 56px", border:"1px solid rgba(255,255,255,0.08)", marginBottom:20 }}>
          <div style={{ fontSize:72, fontWeight:900, lineHeight:1, background:"linear-gradient(135deg,#FFD700,#FFA500)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{score}</div>
          <div style={{ fontSize:15, letterSpacing:4, color:"rgba(255,255,255,0.45)", fontWeight:700, marginTop:6 }}>PUNTI</div>
        </div>
        <div style={{ display:"flex", gap:12, width:"100%", maxWidth:380, marginBottom:20 }}>
          {[{n:correctCount,l:"Corrette",c:"#34C759"},{n:errorCount,l:"Errori",c:"#FF3B30"},{n:correctCount+errorCount,l:"Totale",c:"#FF9500"}].map((s,i)=>(
            <div key={i} style={{ flex:1, textAlign:"center", padding:"16px 8px", borderRadius:16, background:"rgba(255,255,255,0.04)", borderTop:`3px solid ${s.c}` }}>
              <div style={{ fontSize:30, fontWeight:900, color:s.c, lineHeight:1 }}>{s.n}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
        {history.length > 0 && (
          <div style={{ width:"100%", maxWidth:380, marginBottom:24 }}>
            <p style={{ fontSize:12, letterSpacing:3, color:"rgba(255,255,255,0.35)", margin:"0 0 12px", fontWeight:700 }}>RIEPILOGO PAROLE</p>
            <div style={{ maxHeight:260, overflowY:"auto", display:"flex", flexDirection:"column", gap:5 }}>
              {history.map((h,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"rgba(255,255,255,0.04)", borderRadius:12, borderLeft:`4px solid ${h.correct?"#34C759":"#FF3B30"}` }}>
                  <span style={{ fontSize:15, fontWeight:600 }}>{h.word}{h.buzzTimeout ? " ⏱" : ""}</span>
                  <span style={{ fontSize:16, fontWeight:800, padding:"2px 10px", borderRadius:8, background:h.correct?"rgba(52,199,89,0.2)":"rgba(255,59,48,0.2)", color:h.correct?"#34C759":"#FF3B30" }}>{h.correct?"✓":"✗"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={()=>{setGameState("setup");setIsRaddoppio(false);setBuzzerEnabled(false);if(channelRef.current)channelRef.current.unsubscribe();}} style={{ width:"100%", maxWidth:380, padding:"22px 20px", borderRadius:18, border:"none", background:"linear-gradient(135deg,#4A90D9,#357ABD)", color:"#fff", fontSize:22, fontWeight:900, letterSpacing:2, cursor:"pointer", boxShadow:"0 8px 32px rgba(74,144,217,0.35)", fontFamily:F }}>GIOCA ANCORA</button>
      </div>
    );
  }

  // ─── PLAYING ───
  const showWord = lastWord !== null;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0e27,#1a1040 40%,#0d1b3e)", color:"#fff", fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", userSelect:"none", WebkitUserSelect:"none", WebkitTapHighlightColor:"transparent", WebkitTouchCallout:"none" }}>

      {/* Timer Bar */}
      <div style={{ width:"100%", height:8, background:"rgba(255,255,255,0.08)", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ height:"100%", borderRadius:"0 4px 4px 0", width:`${timerPercent}%`, background:timerColor, transition:timerRunning?"width 0.1s linear":"none" }} />
      </div>

      {/* Buzz countdown bar (shows on top when buzzed) */}
      {buzzed && (
        <div style={{ width:"100%", height:6, background:"rgba(255,149,0,0.2)", position:"sticky", top:8, zIndex:10 }}>
          <div style={{ height:"100%", background:"#FF9500", width:`${buzzPercent}%`, transition:"width 0.1s linear", borderRadius:"0 3px 3px 0" }} />
        </div>
      )}

      {/* Top: Timer + Score + Buzzer indicator */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", maxWidth:420, padding:"12px 20px 6px" }}>
        <div style={{ width:90, height:90, borderRadius:"50%", border:`4px solid ${buzzed ? "#FF9500" : timerColor}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.35)", color: buzzed ? "#FF9500" : timerColor, transition:"all 0.3s" }}>
          {buzzed ? (
            <>
              <span style={{ fontSize:36, fontWeight:900, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{Math.ceil(buzzCountdown)}</span>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:1 }}>BUZZ</span>
            </>
          ) : (
            <>
              <span style={{ fontSize:40, fontWeight:900, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{displayTime}</span>
              <span style={{ fontSize:11, fontWeight:700, opacity:0.7, letterSpacing:1, textTransform:"uppercase" }}>sec</span>
            </>
          )}
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", background:"rgba(255,255,255,0.06)", borderRadius:20, padding:"14px 30px", border:"1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ fontSize:44, fontWeight:900, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{score}</span>
            <span style={{ fontSize:12, textTransform:"uppercase", letterSpacing:3, opacity:0.45, fontWeight:700, marginTop:4 }}>punti</span>
          </div>
          {buzzerEnabled && (
            <div style={{ fontSize:10, color: buzzed ? "#FF9500" : "rgba(255,255,255,0.25)", marginTop:6, fontWeight:700, letterSpacing:1 }}>
              {buzzed ? "🔔 BUZZATO!" : `🔔 ${roomCode}`}
            </div>
          )}
        </div>
      </div>

      {/* Raddoppio */}
      <button onClick={toggleRaddoppio} disabled={!waitingForExtract || (!isRaddoppio && score < 2)} style={{
        margin:"6px 0 2px", padding:"10px 24px", borderRadius:28,
        border:`2px solid ${isRaddoppio?"#FF9500":"rgba(255,255,255,0.12)"}`,
        background:isRaddoppio?"rgba(255,149,0,0.2)":"rgba(255,255,255,0.05)",
        color:isRaddoppio?"#FF9500":"rgba(255,255,255,0.4)",
        fontSize:14, fontWeight:800, letterSpacing:1.5, cursor:"pointer",
        textTransform:"uppercase", fontFamily:F,
        opacity:waitingForExtract?1:0.35, transition:"all 0.2s"
      }}>
        {isRaddoppio ? "⚡ RADDOPPIO ×2" : "Raddoppio"}
      </button>

      {/* EXTRACT BUTTON */}
      <div style={{ width:"100%", maxWidth:420, padding:"10px 20px 0" }}>
        <button onClick={extractWord} disabled={!waitingForExtract || timeLeft <= 0} style={{
          width:"100%", padding:"22px 16px", borderRadius:20,
          border:waitingForExtract?"2.5px solid rgba(74,144,217,0.6)":"2px solid rgba(255,255,255,0.06)",
          background:waitingForExtract?"linear-gradient(135deg,rgba(74,144,217,0.3),rgba(53,122,189,0.15))":"rgba(255,255,255,0.02)",
          color:waitingForExtract?"#fff":"rgba(255,255,255,0.15)",
          cursor:waitingForExtract?"pointer":"default",
          display:"flex", alignItems:"center", justifyContent:"center", gap:14,
          fontFamily:F, transition:"all 0.2s",
          opacity:waitingForExtract?1:0.3,
          boxShadow:waitingForExtract?"0 4px 20px rgba(74,144,217,0.2)":"none"
        }}>
          <span style={{ fontSize:30 }}>🎲</span>
          <span style={{ fontSize:26, fontWeight:900, letterSpacing:5 }}>ESTRAI</span>
        </button>
      </div>

      {/* WORD DISPLAY */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", width:"100%", maxWidth:420, padding:"10px 16px", minHeight:140 }}>
        {showWord ? (
          <div style={{
            width:"100%", textAlign:"center", position:"relative", padding:"28px 16px",
            background: buzzed ? "rgba(255,149,0,0.1)" : lastResult==="correct"?"rgba(52,199,89,0.1)" : lastResult==="error"?"rgba(255,59,48,0.1)" : "rgba(255,255,255,0.05)",
            borderRadius:28,
            border: buzzed ? "3px solid rgba(255,149,0,0.4)" : lastResult==="correct"?"3px solid rgba(52,199,89,0.35)" : lastResult==="error"?"3px solid rgba(255,59,48,0.35)" : "2px solid rgba(255,255,255,0.1)",
            transition:"all 0.25s ease"
          }}>
            <div style={{
              fontSize: getWordFontSize(lastWord),
              fontWeight:900, lineHeight:1.15, textTransform:"uppercase", letterSpacing:2,
              wordBreak:"break-word",
              color: buzzed ? "#FF9500" : lastResult==="correct"?"#34C759" : lastResult==="error"?"#FF3B30" : "#fff",
              textShadow: lastResult ? "none" : "0 2px 12px rgba(255,255,255,0.1)"
            }}>{lastWord}</div>
            {isRaddoppio && (
              <div style={{ position:"absolute", top:-14, right:-6, background:"#FF9500", color:"#fff", fontSize:16, fontWeight:900, padding:"5px 14px", borderRadius:14, boxShadow:"0 2px 8px rgba(255,149,0,0.4)" }}>×2</div>
            )}
           {lastResult && !buzzed && (
              <div style={{ marginTop:12, fontSize:16, fontWeight:800, letterSpacing:2, color:lastResult==="correct"?"#34C759":lastResult==="passo"?"#FFD700":"#FF3B30" }}>
                {lastResult==="correct"?"✓ CORRETTA":lastResult==="passo"?"⏭ PASSO":"✗ SBAGLIATA"}
              </div>
            )}
            {buzzed && !speechText && !speechProcessed && (
              <div style={{ marginTop:12, fontSize:16, fontWeight:800, letterSpacing:2, color:"#FF9500" }}>
                {speechEnabled && !manualOverride ? "🎤 In ascolto..." : `🔔 BUZZATO! Conferma entro ${Math.ceil(buzzCountdown)}s`}
              </div>
            )}
            {buzzed && speechText !== null && speechProcessed && !speechText && (
              <div style={{ marginTop:12, fontSize:14, fontWeight:800, letterSpacing:1, color:"#FF9500" }}>
                🎤 Non riconosciuto — Conferma manualmente ({Math.ceil(buzzCountdown)}s)
              </div>
            )}
            {buzzed && speechText && speechProcessed && currentWord && (
              <div style={{ marginTop:12, fontSize:14, fontWeight:800, letterSpacing:1, color:"#FF9500" }}>
                🎤 Ha detto: "{speechText}" — Confermi? ({Math.ceil(buzzCountdown)}s)
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign:"center", color:"rgba(255,255,255,0.12)", fontSize:18, fontWeight:600, letterSpacing:1 }}>
            Premi ESTRAI per iniziare
          </div>
        )}
      </div>

      {/* REVISIONE button - solo con speech attivo, dopo aver giudicato */}
      {speechEnabled && waitingForExtract && lastAction && (
        <div style={{ width:"100%", maxWidth:420, padding:"0 20px 6px" }}>
          <button onClick={handleRevisione} style={{
            width:"100%", padding:"10px", borderRadius:14,
            border:"1px solid rgba(255,149,0,0.3)",
            background:"rgba(255,149,0,0.1)",
            color:"#FF9500",
            fontSize:14, fontWeight:700, letterSpacing:1, cursor:"pointer",
            fontFamily:F, textTransform:"uppercase", transition:"all 0.2s",
            display:"flex", justifyContent:"center", alignItems:"center", gap:8
          }}>↩ REVISIONE</button>
        </div>
      )}

      {/* PASSO button */}
      <div style={{ width:"100%", maxWidth:420, padding:"0 20px 10px" }}>
        <button onClick={handlePasso} disabled={waitingForExtract || passiRimanenti <= 0 || buzzed} style={{
          width:"100%", padding:"12px", borderRadius:20, border:"none",
          background: (waitingForExtract || passiRimanenti <= 0 || buzzed) ? "rgba(255,215,0,0.2)" : "#FFD700",
          color: (waitingForExtract || passiRimanenti <= 0 || buzzed) ? "rgba(255,255,255,0.3)" : "#000",
          fontSize:20, fontWeight:900, letterSpacing:2,
          cursor: (waitingForExtract || passiRimanenti <= 0 || buzzed) ? "default" : "pointer",
          fontFamily:F, textTransform:"uppercase",
          display:"flex", justifyContent:"center", alignItems:"center", gap:8,
          boxShadow: (waitingForExtract || passiRimanenti <= 0 || buzzed) ? "none" : "0 4px 15px rgba(255,215,0,0.3)",
          transition:"all 0.2s"
        }}>PASSO ({passiRimanenti})</button>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display:"flex", gap:16, width:"100%", maxWidth:420, padding:"0 20px 6px" }}>
        <button onClick={handleCorrect} disabled={!canAct} style={{
          flex:1, padding:"34px 12px", borderRadius:24, border:"none", cursor:"pointer",
          background:"linear-gradient(160deg,#2ECC71,#27AE60)",
          boxShadow: canAct ? "0 6px 28px rgba(46,204,113,0.35)" : "none",
          opacity:canAct?1:0.2, transition:"opacity 0.15s",
          display:"flex", flexDirection:"column", alignItems:"center", gap:4, fontFamily:F,
          WebkitTapHighlightColor:"transparent"
        }}>
          <span style={{ fontSize:50, fontWeight:900, color:"#fff", lineHeight:1 }}>✓</span>
          <span style={{ fontSize:18, fontWeight:900, color:"rgba(255,255,255,0.9)", letterSpacing:3 }}>CORRETTA</span>
        </button>
        <button onClick={handleError} disabled={!canAct} style={{
          flex:1, padding:"34px 12px", borderRadius:24, border:"none", cursor:"pointer",
          background:"linear-gradient(160deg,#E74C3C,#C0392B)",
          boxShadow: canAct ? "0 6px 28px rgba(231,76,60,0.35)" : "none",
          opacity:canAct?1:0.2, transition:"opacity 0.15s",
          display:"flex", flexDirection:"column", alignItems:"center", gap:4, fontFamily:F,
          WebkitTapHighlightColor:"transparent"
        }}>
          <span style={{ fontSize:50, fontWeight:900, color:"#fff", lineHeight:1 }}>✗</span>
          <span style={{ fontSize:18, fontWeight:900, color:"rgba(255,255,255,0.9)", letterSpacing:3 }}>SBAGLIATA</span>
        </button>
      </div>

      {/* Pulsante MANUALE - solo con speech attivo */}
      {speechEnabled && buzzerEnabled && buzzed && !waitingForExtract && !manualOverride && (
        <div style={{ width:"100%", maxWidth:420, padding:"0 20px 8px" }}>
          <button onClick={() => { setManualOverride(true); setSpeechProcessed(false); setSpeechText(null); }} style={{
            width:"100%", padding:"10px", borderRadius:14, border:"1px solid rgba(255,255,255,0.12)",
            background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.5)",
            fontSize:14, fontWeight:700, letterSpacing:1, cursor:"pointer",
            fontFamily:F, textTransform:"uppercase", transition:"all 0.2s"
          }}>🔇 MANUALE (ignora voce)</button>
        </div>
      )}

      {/* Mini stats */}
      <div style={{ display:"flex", gap:16, padding:"8px 0 28px", fontSize:16, fontWeight:800, letterSpacing:1 }}>
        <span style={{ color:"#34C759" }}>✓ {correctCount}</span>
        <span style={{ color:"rgba(255,255,255,0.2)" }}>|</span>
        <span style={{ color:"#FF3B30" }}>✗ {errorCount}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// APP ROUTER
// ═══════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState(() => {
    const h = window.location.hash;
    return h.includes("buzzer") ? "buzzer" : "main";
  });

  // Listen for hash changes
  useEffect(() => {
    const onHash = () => {
      setView(window.location.hash.includes("buzzer") ? "buzzer" : "main");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const roomFromUrl = useMemo(() => {
    const m = window.location.hash.match(/room=([A-Z0-9]+)/i);
    return m ? m[1].toUpperCase() : null;
  }, [view]);

  if (view === "buzzer") {
    return <BuzzerView initialRoomCode={roomFromUrl} />;
  }
  return <MainGame />;
}
