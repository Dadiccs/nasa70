¨SUPSI 2026  
Corso d’interaction design, CV429.01  
Docenti: A. Gysin, G. Profeta  

Progetto 2: Un piccolo passo per un uomo, un grande balzo per l'umanità

# Nasa70 
Autore: Daniele Falcone \
[Nasa70](dadiccs.github.io/nasa70/)


## Introduzione e tema
NASA 70 è un archivio curatoriale online concepito per celebrare il settantesimo anniversario della NASA attraverso il linguaggio del web design contemporaneo. Il sito raccoglie progetti digitali ispirati allo spazio, all’esplorazione e all’immaginario NASA, trasformando l’anniversario in un’occasione di riflessione culturale e visiva.


## Riferimenti progettuali
La direzione visiva si allontana dal minimalismo comune per adottare un’estetica strutturale e "heritage", legata all'immaginario storico della NASA. La palette cromatica usa il contrasto tra uno sfondo scuro profondo (#050505), il blu istituzionale (#0066f2) per evidenziare i link o i tag attivi, e il rosso (#fc3d21) per le titolazioni secondarie e le micro-informazioni.
La tipografia riflette questo rigore tecnico: il font Inter assicura la leggibilità dei testi curatoriali, mentre il carattere monospaziato JetBrains Mono definisce codici, tag e date.


## Design dell’interfaccia e modalità di interazione
L’interfaccia è pensata come uno spazio esplorabile, suddiviso tra una selezione curatoriale e un archivio navigabile. L’interazione principale avviene attraverso filtri dinamici e una calibrazione iniziale basata sugli interessi dell’utente, che guida l’esperienza senza renderla rigida.


[<img src="ReadMe_Nasa70_img.jpg" width="500" alt="Nasa70 pagina esplora">]()


## Tecnologia usata
Il sito è sviluppato con tecnologie web standard (HTML5, CSS3 e Vanilla JavaScript ES6), eliminando la dipendenza da framework esterni per garantire leggerezza e caricamenti immediati.
L'architettura logica gestisce in modo asincrono una base dati JSON (PRIMARY_URL), integrando un sistema di fallback su un proxy CORS per prevenire errori di rete. Il comportamento interattivo della piattaforma si basa su un algoritmo di filtraggio combinato in tempo reale che incrocia l'input testuale dell'utente con i tag selezionati, aggiornando dinamicamente il DOM senza richiedere il ricaricamento della pagina.

L'interazione è inoltre supportata da un sistema di calibrazione iniziale strutturato come un quiz in tre passaggi; il codice gestisce l'avanzamento incrementale delle schermate, registra le preferenze dell'utente all'interno di un array e aggiorna dinamicamente in tempo reale la percentuale di riempimento della barra di progresso visiva.


```JavaScript
function nextWizardStep(selectedTag) {
    if (selectedTag) {
        selectedAnswers.push(selectedTag.trim().toLowerCase());
    }

    currentStep++;
    
    // Aggiornamento della barra di avanzamento visiva
    const progressPercent = ((currentStep - 1) / 3) * 100;
    document.getElementById('quizProgressBar').style.width = `${progressPercent}%`;

    if (currentStep > 3) {
        // Fine del quiz: attiva la calibrazione e filtra i progetti
        isCalibrated = true;
        document.getElementById('archiveQuizOverlay').style.display = 'none';
        filterAndRenderArchive();
    } else {
        // Mostra la domanda successiva
        renderWizardQuestion();
    }
}
```

## Target e contesto d’uso
NASA 70 si rivolge a designer, sviluppatori, studenti e appassionati di cultura visiva e spaziale. Il sito è pensato per una fruizione esplorativa, sia rapida che approfondita, adattandosi a momenti di browsing informale o a ricerche più mirate. Il contesto ideale è quello della consultazione editoriale digitale, tra ispirazione, ricerca e scoperta.
