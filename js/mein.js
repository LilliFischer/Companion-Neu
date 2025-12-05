document.addEventListener("DOMContentLoaded", () => {
    

    const mainElement = document.querySelector('main');
    const hiddenElements = document.querySelectorAll('.scroll-hidden');
    
    const stage1Element = document.getElementById('stage1');
    const explanationBox = document.getElementById('explanation-box');

    const subtitleElement = document.querySelector('.delayed-appearance');
 

    function checkVisibility() {
        const scrollPosition = mainElement.scrollTop; 
        const mainHeight = mainElement.clientHeight; 
        
        // --- LOGIK FÜR DAS EINBLENDEN DER ERKLÄRUNG (STAGE 2 INHALT) ---
        
        // Der Trigger-Punkt soll nach ca. 50% der ersten 100vh erreicht werden.
        const explanationTriggerPoint = stage1Element.offsetTop + mainHeight * 0.7;

        // Prüfen, ob der Haupt-Scroll-Punkt den Trigger-Punkt erreicht hat
        if (scrollPosition > explanationTriggerPoint) { 
            // Nur hinzufügen, wenn es sichtbar werden soll.
            // Die CSS-Transition in .scroll-hidden sorgt für die "soft"-Einblendung.
            explanationBox.classList.add('scroll-visible');
        } else {
            // Wenn man zurückscrollt, die Klasse entfernen, damit es sanft zurückgleitet.
            explanationBox.classList.remove('scroll-visible');
        }


       
    }

    // Event Listener auf das <main> Element anwenden
    mainElement.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Initialer Check beim Laden

});