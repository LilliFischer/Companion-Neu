document.addEventListener("DOMContentLoaded", () => {
    
    const mainElement = document.querySelector('main');
    const explanationBox = document.getElementById('explanation-box');
    const vitrineGrid = document.querySelector('.vitrine-grid');
    const vitrineCards = document.querySelectorAll('.vitrine-card');

    // Die Höhe des Viewports (Scroll-Container)
    const mainHeight = mainElement.clientHeight; 
    
    // Triggerpunkte basierend auf Viewporthöhe
    const EXPLANATION_TRIGGER = 0.5; // Trigger bei 50% der Stage 1
    const VITRINE_TRIGGER = 0.9;     // Trigger kurz vor Ende von Stage 1
    
    const maxScale = 1.2;
    const minScale = 0.8;

    /* --- HAUPT-SCROLL-LOGIK (Stages einblenden) --- */

    function checkVisibility() {
        const scrollPosition = mainElement.scrollTop; 
        
        // 1. EINBLENDUNG DER ERKLÄRUNG (innerhalb Stage 1)
        if (scrollPosition > mainHeight * EXPLANATION_TRIGGER) { 
            explanationBox.classList.add('scroll-visible');
        } else {
            explanationBox.classList.remove('scroll-visible');
        }

        // 2. EINBLENDUNG DER VITRINEN (Übergang zu Stage 2)
        if (scrollPosition >= mainHeight * VITRINE_TRIGGER) { 
            vitrineGrid.classList.add('scroll-visible');
        } else {
            vitrineGrid.classList.remove('scroll-visible');
        }
    }

    /* --- ZENTRIERTE KARTE HERVORHEBEN (innerhalb Grid) --- */

    function highlightCenterCard() {
        // Die Mitte des sichtbaren Grid-Bereichs
        const gridCenterY = vitrineGrid.scrollTop + vitrineGrid.clientHeight / 2;

        vitrineCards.forEach(card => {
            // Die Mitte der einzelnen Karte (relativ zum Scroll-Container)
            const cardCenterY = card.offsetTop + card.clientHeight / 2;
            const distance = Math.abs(gridCenterY - cardCenterY);

            // Schwellenwert: 1.5-fache Höhe der Karte, um den Skalierungsbereich zu definieren
            const threshold = card.clientHeight * 1.5; 

            if (distance < threshold) {
                // Berechnet Skalierungsfaktor: 1.2 in der Mitte, fällt auf 1.0 am Rand
                const scaleFactor = maxScale - (distance / threshold) * (maxScale - minScale);
                
                 // Skalierung anwenden (stellt sicher, dass es nicht unter 1.0 fällt)
            card.style.transform = `scale(${Math.max(minScale, scaleFactor)})`;
            card.style.zIndex = 10; // Höhere Ebene für die mittlere Karte
        } else {
            // Standardgröße für nicht-zentrierte Karten
            card.style.transform = `scale(0.8)`; // Kleinere Standardgröße
            card.style.zIndex = 1; // Zurücksetzen der Ebene
        }
        });
    }

    // Event Listener für die Stages (auf dem MAIN-Element)
    mainElement.addEventListener('scroll', checkVisibility);

    // Event Listener für die Zentrierung (auf dem GRID-Element selbst)
    vitrineGrid.addEventListener('scroll', highlightCenterCard);
    
    // Initialer Check beim Laden
    checkVisibility();
    // Ein kleiner Delay, um die Höhe des Grids nach dem Laden zu sichern
    setTimeout(highlightCenterCard, 100); 
});
