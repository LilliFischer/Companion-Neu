document.addEventListener("DOMContentLoaded", () => {
    
    const mainElement = document.querySelector('main');
    const vitrineGrid = document.querySelector('.vitrine-grid');
    
    // --- Initialisierung und Klonen ---
    
    // Originale Karten vor dem Klonen sammeln
    let vitrineCards = Array.from(document.querySelectorAll('.vitrine-card'));
    const originalCardCount = vitrineCards.length; // WICHTIG: Anzahl der Originalkarten

    // Speichert den Originalinhalt jeder Karte (für Inhaltsaustausch)
    const originalCardContents = {}; 
    vitrineCards.forEach(card => {
        originalCardContents[card.getAttribute('data-index')] = card.innerHTML;
    });

    // Konstanten für Skalierung und Trigger
    const mainHeight = mainElement.clientHeight; 
    const VITRINE_TRIGGER = 0.9;
    const maxScale = 1.0;
    const minScale = 0.8;
    const maxDepth = -50; // Für den 3D-Effekt
    
    let lastCenterIndex = null;

    // LOOP CAROUSEL: Dupliziere Karten (Set 1 und Set 3 sind Kopien)
    const cloneTop = vitrineCards.map(c => c.cloneNode(true));
    const cloneBottom = vitrineCards.map(c => c.cloneNode(true));

    cloneTop.forEach(c => vitrineGrid.insertBefore(c, vitrineGrid.firstChild));
    cloneBottom.forEach(c => vitrineGrid.appendChild(c));

    // Liste ALLER Karten aktualisieren (Original + 2 Kopien)
    vitrineCards = Array.from(document.querySelectorAll('.vitrine-card'));

    // --- Berechnung der Einzelhöhe (für Looping und Zufallsstart) ---
    
    const cardHeight = vitrineCards[0].clientHeight;
    const gap = 30; // Aus landing.css
    
    const cardHeightWithGap = cardHeight + gap; 
    const singleSetHeight = originalCardCount * cardHeightWithGap; 
    
    
    // ==========================================================
    // --- FUNKTION: ZUFÄLLIGER STARTPUNKT BERECHNEN ---
    // ==========================================================
    
    // 1. Zufälligen Index auswählen
    const randomStartIndex = Math.floor(Math.random() * originalCardCount);

    // 2. Berechnung der Scroll-Position: 
    // Starte beim Beginn der originalen Reihe (singleSetHeight)
    const scrollOffsetToRandomCard = randomStartIndex * cardHeightWithGap;
    
    // Offset, um die zufällige Karte VISUELL zu zentrieren
    // (Container-Mitte - halbe Kartenhöhe)
    const gridCenterOffset = (vitrineGrid.clientHeight / 2) - (cardHeight / 2);
    
    // Die finale Scroll-Position
    const initialScrollPosition = singleSetHeight + scrollOffsetToRandomCard - gridCenterOffset;

    // Setze die Scroll-Position
    vitrineGrid.scrollTop = initialScrollPosition;


    // --- FUNKTION: LOOP WARTUNG ---

    function maintainLoop() {
        const scroll = vitrineGrid.scrollTop;
        
        // Wenn man in den oberen geklonten Bereich scrollt (unterhalb des Originalsets)
        if (scroll < singleSetHeight) {
            // Springe zum Beginn des zweiten Kopie-Sets (dem unteren Klon-Satz)
            vitrineGrid.scrollTop = scroll + singleSetHeight; 
            
        // Wenn man in den unteren geklonten Bereich scrollt (ab Beginn des zweiten Originalsets)
        } else if (scroll >= singleSetHeight * 2) {
            // Springe zurück zum Beginn des Original-Sets
            vitrineGrid.scrollTop = scroll - singleSetHeight;
        }
        
        // Führe die Highlight-Funktion nach der Positionierung aus
        highlightCenterCard(); 
    }

    // --- FUNKTION: STAGE SICHTBARKEIT ---

    function checkVisibility() {
        const scrollPosition = mainElement.scrollTop; 
    
        if (scrollPosition >= mainHeight * VITRINE_TRIGGER) { 
            vitrineGrid.classList.add('scroll-visible');
        } else {
            vitrineGrid.classList.remove('scroll-visible');
        }
    }

    // --- FUNKTION: ZENTRIERUNG UND INHALT ---

    function highlightCenterCard() {
        const gridCenterY = vitrineGrid.scrollTop + vitrineGrid.clientHeight / 2;
        let currentCenterCard = null; // Karte, die am nächsten zur Mitte ist

        vitrineCards.forEach(card => {
            const cardCenterY = card.offsetTop + card.clientHeight / 2;
            const distance = Math.abs(gridCenterY - cardCenterY);
            const threshold = card.clientHeight * 1.5;

            let scale = minScale;

            if (distance < threshold) {
                const scaleDiff = maxScale - minScale;
                scale = maxScale - (distance / threshold) * scaleDiff;

                // Tiefe basierend auf Abstand zur Mitte
                const depth = (distance / threshold) * maxDepth;

                // Anwendung von Skalierung und 3D-Tiefe
                card.style.transform = `scale(${scale}) translateZ(${depth}px)`;
                card.style.zIndex = 10;

                if (!currentCenterCard || distance < currentCenterCard.distance) {
                    currentCenterCard = { card, distance };
                }
            } else {
                // Karten außerhalb des Schwellenwerts
                card.style.transform = `scale(${minScale}) translateZ(0px)`;
                card.style.zIndex = 1;
            }
            
            // --- INHALT WIEDERHERSTELLEN ---
            if (!currentCenterCard || card !== currentCenterCard.card) {
                if (card.classList.contains("active")) {
                    const cardIndex = card.getAttribute('data-index');
                    card.classList.remove("active");
                    card.innerHTML = originalCardContents[cardIndex];
                }
            }
        });

        // --- INHALT AUSTAUSCHEN (für die zentrierte Karte) ---
        if (currentCenterCard) {
            const card = currentCenterCard.card;
            const index = card.getAttribute('data-index');

            if (index !== lastCenterIndex || !card.classList.contains("active")) {
                const txt = card.getAttribute("data-detail-text");
                
                // Setze den Detailtext in die aktive Karte
                card.innerHTML = `<p class="detail-card">${txt}</p>`;
                card.classList.add("active");
                lastCenterIndex = index;
            }
        }
    }

    // Event Listener für die Stages (auf dem MAIN-Element)
    mainElement.addEventListener('scroll', checkVisibility);

    // Event Listener für die Zentrierung und INHALT (auf dem GRID-Element)
    vitrineGrid.addEventListener('scroll', highlightCenterCard);
    
    // Event Listener für die Loop-Wartung
    vitrineGrid.addEventListener('scroll', maintainLoop);

    // Initialer Start beim Laden der Seite
    checkVisibility();
    setTimeout(() => {
        highlightCenterCard();
    }, 100); 
});