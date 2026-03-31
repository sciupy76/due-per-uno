import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════
// PAROLE SINGOLE — 3000+ parole italiane
// ═══════════════════════════════════════════════════
const PAROLE_SINGOLE = [
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
// UTILITY
// ═══════════════════════════════════════════════════
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ═══════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════
export default function IntesaVincente() {
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
  const [passiRimanenti, setPassiRimanenti] = useState(3); // ⚡ NUOVO STATO PER IL "PASSO"

  const singleQueueRef = useRef([]);
  const composteQueueRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const remainingAtStartRef = useRef(0);

  const initQueues = useCallback(() => {
    singleQueueRef.current = shuffle(PAROLE_SINGOLE);
    composteQueueRef.current = shuffle(PAROLE_COMPOSTE);
  }, []);

  const getNextWord = useCallback(() => {
    const queue = isRaddoppio ? composteQueueRef.current : singleQueueRef.current;
    if (queue.length === 0) {
      if (isRaddoppio) composteQueueRef.current = shuffle(PAROLE_COMPOSTE);
      else singleQueueRef.current = shuffle(PAROLE_SINGOLE);
      return (isRaddoppio ? composteQueueRef.current : singleQueueRef.current).pop();
    }
    return queue.pop();
  }, [isRaddoppio]);

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

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const startGame = () => {
    initQueues();
    setTimeLeft(timeLimit);
    setScore(0);
    setCorrectCount(0);
    setErrorCount(0);
    setPassiRimanenti(3); // ⚡ RESET DEI PASSI
    setHistory([]);
    setCurrentWord(null);
    setLastWord(null);
    setLastResult(null);
    setWaitingForExtract(true);
    setTimerRunning(false);
    setIsRaddoppio(false);
    setGameState("playing");
  };

  const extractWord = () => {
    if (timeLeft <= 0 || !waitingForExtract) return;
    const word = getNextWord();
    setCurrentWord(word);
    setLastWord(word);
    setLastResult(null);
    setWaitingForExtract(false);
    setTimerRunning(true);
  };

  const handleCorrect = () => {
    if (waitingForExtract || !currentWord) return;
    setTimerRunning(false);
    const pts = isRaddoppio ? 2 : 1;
    setScore(p => p + pts);
    setCorrectCount(p => p + 1);
    setHistory(p => [...p, { word: currentWord, correct: true }]);
    setLastResult("correct");
    setCurrentWord(null);
    setWaitingForExtract(true);
  };

  const handleError = () => {
    if (waitingForExtract || !currentWord) return;
    setTimerRunning(false);
    const pts = isRaddoppio ? 2 : 1;
    setScore(p => Math.max(0, p - pts));
    setErrorCount(p => p + 1);
    setHistory(p => [...p, { word: currentWord, correct: false }]);
    setLastResult("error");
    setCurrentWord(null);
    setWaitingForExtract(true);
  };

  // ⚡ GESTIONE "PASSO"
  const handlePasso = () => {
    if (waitingForExtract || !currentWord || passiRimanenti <= 0) return;
    setPassiRimanenti(p => p - 1);
    // Estrae subito la nuova parola senza fermare il timer
    const word = getNextWord();
    setCurrentWord(word);
    setLastWord(word);
    setLastResult(null);
  };

  const toggleRaddoppio = () => {
    if (!waitingForExtract) return;
    setIsRaddoppio(p => !p);
  };

  const displayTime = Math.ceil(timeLeft);
  const timerPercent = (timeLeft / timeLimit) * 100;
  const timerColor = timeLeft <= 10 ? "#FF3B30" : timeLeft <= 20 ? "#FF9500" : "#34C759";
  const F = "'Outfit', system-ui, -apple-system, sans-serif";

  // ─── SETUP ───
  if (gameState === "setup") {
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0e27,#1a1040 40%,#0d1b3e)", color:"#fff", fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 20px", userSelect:"none", WebkitUserSelect:"none", WebkitTapHighlightColor:"transparent" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontSize:64, marginBottom:8 }}>⛓️</div>
          <h1 style={{ fontSize:38, fontWeight:900, margin:0, letterSpacing:"-1px", background:"linear-gradient(135deg,#fff,#a0c4ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Intesa Vincente</h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.4)", margin:"8px 0 0", letterSpacing:4, textTransform:"uppercase", fontWeight:600 }}>Reazione a Catena</p>
        </div>
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:24, padding:"32px 28px", width:"100%", maxWidth:380, textAlign:"center", border:"1px solid rgba(255,255,255,0.08)", marginBottom:32 }}>
          <p style={{ fontSize:13, letterSpacing:3, color:"rgba(255,255,255,0.45)", margin:"0 0 20px", fontWeight:700 }}>TEMPO (SECONDI)</p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:28 }}>
            {/* ⚡ LOGICA CAMBIATA QUI (Minimo 55) */}
            <button onClick={() => setTimeLimit(p => Math.max(55, p - 5))} style={{ width:64, height:64, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.08)", color:"#fff", fontSize:28, fontWeight:800, cursor:"pointer", fontFamily:F }}>−5</button>
            <span style={{ fontSize:64, fontWeight:900, minWidth:90, textAlign:"center", fontVariantNumeric:"tabular-nums" }}>{timeLimit}</span>
            {/* ⚡ LOGICA CAMBIATA QUI (Massimo 65) */}
            <button onClick={() => setTimeLimit(p => Math.min(65, p + 5))} style={{ width:64, height:64, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.08)", color:"#fff", fontSize:28, fontWeight:800, cursor:"pointer", fontFamily:F }}>+5</button>
          </div>
        </div>
        <button onClick={startGame} style={{ width:"100%", maxWidth:380, padding:"22px 20px", borderRadius:18, border:"none", background:"linear-gradient(135deg,#4A90D9,#357ABD)", color:"#fff", fontSize:22, fontWeight:900, letterSpacing:2, cursor:"pointer", boxShadow:"0 8px 32px rgba(74,144,217,0.35)", fontFamily:F }}>INIZIA IL GIOCO</button>
        <p style={{ marginTop:24, fontSize:13, color:"rgba(255,255,255,0.25)", textAlign:"center" }}>{PAROLE_SINGOLE.length} parole · {PAROLE_COMPOSTE.length} espressioni</p>
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
                  <span style={{ fontSize:15, fontWeight:600 }}>{h.word}</span>
                  <span style={{ fontSize:16, fontWeight:800, padding:"2px 10px", borderRadius:8, background:h.correct?"rgba(52,199,89,0.2)":"rgba(255,59,48,0.2)", color:h.correct?"#34C759":"#FF3B30" }}>{h.correct?"✓":"✗"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={()=>{setGameState("setup");setIsRaddoppio(false);}} style={{ width:"100%", maxWidth:380, padding:"22px 20px", borderRadius:18, border:"none", background:"linear-gradient(135deg,#4A90D9,#357ABD)", color:"#fff", fontSize:22, fontWeight:900, letterSpacing:2, cursor:"pointer", boxShadow:"0 8px 32px rgba(74,144,217,0.35)", fontFamily:F }}>GIOCA ANCORA</button>
      </div>
    );
  }

  // ─── PLAYING ───
  const showWord = lastWord !== null;

  // Dynamic font size based on word length for maximum readability
  const getWordFontSize = (word) => {
    if (!word) return 48;
    const len = word.length;
    if (len <= 7) return 56;
    if (len <= 10) return 48;
    if (len <= 14) return 40;
    if (len <= 18) return 34;
    if (len <= 24) return 28;
    return 24;
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0e27,#1a1040 40%,#0d1b3e)", color:"#fff", fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", userSelect:"none", WebkitUserSelect:"none", WebkitTapHighlightColor:"transparent", WebkitTouchCallout:"none" }}>
      
      {/* Timer Bar */}
      <div style={{ width:"100%", height:8, background:"rgba(255,255,255,0.08)", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ height:"100%", borderRadius:"0 4px 4px 0", width:`${timerPercent}%`, background:timerColor, transition:timerRunning?"width 0.1s linear":"none" }} />
      </div>

      {/* Top: Timer + Score */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", maxWidth:420, padding:"12px 20px 6px" }}>
        <div style={{ width:90, height:90, borderRadius:"50%", border:`4px solid ${timerColor}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.35)", color:timerColor }}>
          <span style={{ fontSize:40, fontWeight:900, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{displayTime}</span>
          <span style={{ fontSize:11, fontWeight:700, opacity:0.7, letterSpacing:1, textTransform:"uppercase" }}>sec</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", background:"rgba(255,255,255,0.06)", borderRadius:20, padding:"14px 30px", border:"1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize:44, fontWeight:900, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{score}</span>
          <span style={{ fontSize:12, textTransform:"uppercase", letterSpacing:3, opacity:0.45, fontWeight:700, marginTop:4 }}>punti</span>
        </div>
      </div>

      {/* Raddoppio */}
      <button onClick={toggleRaddoppio} disabled={!waitingForExtract} style={{
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

      {/* ═══ EXTRACT BUTTON — ABOVE word, always accessible ═══ */}
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

      {/* ═══ WORD DISPLAY — BIG, stays visible, readable from distance ═══ */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", width:"100%", maxWidth:420, padding:"10px 16px", minHeight:140 }}>
        {showWord ? (
          <div style={{
            width:"100%", textAlign:"center", position:"relative", padding:"28px 16px",
            background: lastResult==="correct"?"rgba(52,199,89,0.1)" : lastResult==="error"?"rgba(255,59,48,0.1)" : "rgba(255,255,255,0.05)",
            borderRadius:28,
            border: lastResult==="correct"?"3px solid rgba(52,199,89,0.35)" : lastResult==="error"?"3px solid rgba(255,59,48,0.35)" : "2px solid rgba(255,255,255,0.1)",
            transition:"all 0.25s ease"
          }}>
            <div style={{
              fontSize: getWordFontSize(lastWord),
              fontWeight:900, lineHeight:1.15, textTransform:"uppercase", letterSpacing:2,
              wordBreak:"break-word",
              color: lastResult==="correct"?"#34C759" : lastResult==="error"?"#FF3B30" : "#fff",
              textShadow: lastResult ? "none" : "0 2px 12px rgba(255,255,255,0.1)"
            }}>{lastWord}</div>
            {isRaddoppio && (
              <div style={{ position:"absolute", top:-14, right:-6, background:"#FF9500", color:"#fff", fontSize:16, fontWeight:900, padding:"5px 14px", borderRadius:14, boxShadow:"0 2px 8px rgba(255,149,0,0.4)" }}>×2</div>
            )}
            {lastResult && (
              <div style={{ marginTop:12, fontSize:16, fontWeight:800, letterSpacing:2, color:lastResult==="correct"?"#34C759":"#FF3B30" }}>
                {/* ⚡ LOGICA CAMBIATA QUI ("CORRETTA" e "SBAGLIATA") */}
                {lastResult==="correct"?"✓ CORRETTA":"✗ SBAGLIATA"}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign:"center", color:"rgba(255,255,255,0.12)", fontSize:18, fontWeight:600, letterSpacing:1 }}>
            Premi ESTRAI per iniziare
          </div>
        )}
      </div>

      {/* ⚡ NUOVO: PULSANTE PASSO */}
      <div style={{ width:"100%", maxWidth:420, padding:"0 20px 10px" }}>
        <button
          onClick={handlePasso}
          disabled={waitingForExtract || passiRimanenti <= 0}
          style={{
            width:"100%", padding:"12px", borderRadius:20, border:"none",
            background: (waitingForExtract || passiRimanenti <= 0) ? "rgba(255,215,0,0.2)" : "#FFD700",
            color: (waitingForExtract || passiRimanenti <= 0) ? "rgba(255,255,255,0.3)" : "#000",
            fontSize: 20, fontWeight: 900, letterSpacing: 2, 
            cursor: (waitingForExtract || passiRimanenti <= 0) ? "default" : "pointer",
            fontFamily: F, textTransform: "uppercase",
            display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
            boxShadow: (waitingForExtract || passiRimanenti <= 0) ? "none" : "0 4px 15px rgba(255,215,0,0.3)",
            transition: "all 0.2s"
          }}
        >
          PASSO ({passiRimanenti})
        </button>
      </div>

      {/* ═══ ACTION BUTTONS — HUGE touch targets for frantic play ═══ */}
      <div style={{ display:"flex", gap:16, width:"100%", maxWidth:420, padding:"0 20px 6px" }}>
        <button onClick={handleCorrect} disabled={waitingForExtract} style={{
          flex:1, padding:"34px 12px", borderRadius:24, border:"none", cursor:"pointer",
          background:"linear-gradient(160deg,#2ECC71,#27AE60)",
          boxShadow: waitingForExtract ? "none" : "0 6px 28px rgba(46,204,113,0.35)",
          opacity:waitingForExtract?0.2:1, transition:"opacity 0.15s",
          display:"flex", flexDirection:"column", alignItems:"center", gap:4, fontFamily:F,
          WebkitTapHighlightColor:"transparent"
        }}>
          <span style={{ fontSize:50, fontWeight:900, color:"#fff", lineHeight:1 }}>✓</span>
          {/* ⚡ LOGICA CAMBIATA QUI */}
          <span style={{ fontSize:18, fontWeight:900, color:"rgba(255,255,255,0.9)", letterSpacing:3 }}>CORRETTA</span>
        </button>
        <button onClick={handleError} disabled={waitingForExtract} style={{
          flex:1, padding:"34px 12px", borderRadius:24, border:"none", cursor:"pointer",
          background:"linear-gradient(160deg,#E74C3C,#C0392B)",
          boxShadow: waitingForExtract ? "none" : "0 6px 28px rgba(231,76,60,0.35)",
          opacity:waitingForExtract?0.2:1, transition:"opacity 0.15s",
          display:"flex", flexDirection:"column", alignItems:"center", gap:4, fontFamily:F,
          WebkitTapHighlightColor:"transparent"
        }}>
          <span style={{ fontSize:50, fontWeight:900, color:"#fff", lineHeight:1 }}>✗</span>
          {/* ⚡ LOGICA CAMBIATA QUI */}
          <span style={{ fontSize:18, fontWeight:900, color:"rgba(255,255,255,0.9)", letterSpacing:3 }}>SBAGLIATA</span>
        </button>
      </div>

      {/* Mini stats */}
      <div style={{ display:"flex", gap:16, padding:"8px 0 28px", fontSize:16, fontWeight:800, letterSpacing:1 }}>
        <span style={{ color:"#34C759" }}>✓ {correctCount}</span>
        <span style={{ color:"rgba(255,255,255,0.2)" }}>|</span>
        <span style={{ color:"#FF3B30" }}>✗ {errorCount}</span>
      </div>
    </div>
  );
}